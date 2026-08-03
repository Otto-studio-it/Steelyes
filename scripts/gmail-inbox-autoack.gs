/**
 * Steelyes — inbox auto-ack + classification for info@steelyes.co.uk
 *
 * Not part of the Next.js app build. This is a Google Apps Script bound to
 * the Workspace Gmail account — no DNS/MX changes, no dependency on Resend
 * (Resend only sends; it does not receive mail for this inbox).
 *
 * What it does, every run:
 *   1. Finds inbox threads not yet labelled "Steelyes/Acked".
 *   2. Skips the site's own automated notifications that land in this same
 *      inbox (WORKSHOP_EMAIL = info@steelyes.co.uk) — otherwise an auto-reply
 *      to our own outbound mail would create a self-reply loop. Skipped if:
 *        - sender is info@steelyes.co.uk itself
 *        - subject carries an internal tag: [LEAD] / [PREVENTIVO] / [INTAKE]
 *        - sender looks like a no-reply/automated address
 *   3. For everything else (a genuine customer writing in): sends one reply
 *      confirming receipt, then applies a colour-codable label based on
 *      keyword match (Preventivo / Reclamo / Fattura / Garanzia / Generico).
 *   4. Marks the thread "Steelyes/Acked" so it is never re-processed.
 *
 * SETUP (one-time, ~5 min):
 *   1. Log into script.google.com AS info@steelyes.co.uk (the Workspace
 *      account that owns the mailbox), not a personal account.
 *   2. New project → paste this whole file in → save.
 *   3. Run the `installTrigger` function once from the editor toolbar.
 *      Google will prompt for Gmail authorization — accept (it only needs
 *      access to this account's own mailbox).
 *   4. Done. `autoAckInbox` now runs automatically every 10 minutes.
 *
 * TUNING:
 *   - Edit ACK_BODY to change the auto-reply wording.
 *   - Edit KEYWORD_RULES to change/add classification keywords or labels.
 *   - Color the labels in Gmail settings (gear → See all settings → Labels)
 *     for at-a-glance triage — that's the point of this script.
 *
 * PAUSE / ROLLBACK:
 *   - Apps Script editor → Triggers (clock icon) → delete the autoAckInbox
 *     trigger. No mail routing was ever changed, so the inbox behaves
 *     exactly as before the moment the trigger is removed.
 */

const ACKED_LABEL = 'Steelyes/Acked'

const LABELS = {
  preventivo: 'Steelyes/Preventivo',
  reclamo: 'Steelyes/Reclamo',
  fattura: 'Steelyes/Fattura',
  garanzia: 'Steelyes/Garanzia',
  generico: 'Steelyes/Generico',
}

// Our own site notifications (sendWorkshopLeadEmail / sendClientIntakeUpdateEmail
// in apps/web/src/lib/email/send.ts) land in this same inbox — never auto-ack those.
const SELF_SENDER = 'info@steelyes.co.uk'
const INTERNAL_SUBJECT_TAGS = ['[LEAD]', '[PREVENTIVO]', '[INTAKE]']

const KEYWORD_RULES = [
  {
    label: LABELS.reclamo,
    keywords: ['complaint', 'reclamo', 'refund', 'broken', 'damaged', 'problem', 'issue', 'not happy', 'unhappy'],
  },
  { label: LABELS.fattura, keywords: ['invoice', 'fattura', 'payment', 'receipt', 'vat'] },
  { label: LABELS.garanzia, keywords: ['warranty', 'garanzia', 'guarantee'] },
  { label: LABELS.preventivo, keywords: ['quote', 'preventivo', 'price', 'cost', 'estimate'] },
]

const ACK_BODY = [
  'Thank you for contacting Steelyes.',
  '',
  'We have received your email and one of our team will review it shortly. We aim to reply within one working day.',
  '',
  'If your enquiry is urgent, you can also call us on +44 7803 002145.',
  '',
  '— Steelyes',
].join('\n')

function autoAckInbox() {
  const ackedLabel = getOrCreateLabel_(ACKED_LABEL)
  const threads = GmailApp.search(`in:inbox -label:"${ACKED_LABEL}"`, 0, 50)

  threads.forEach((thread) => {
    const firstMessage = thread.getMessages()[0]
    const fromHeader = firstMessage.getFrom()
    const subject = thread.getFirstMessageSubject() || ''

    if (shouldSkip_(fromHeader, subject)) {
      thread.addLabel(ackedLabel)
      return
    }

    thread.reply(ACK_BODY)

    const bodySnippet = (firstMessage.getPlainBody() || '').toLowerCase()
    const haystack = `${subject} ${bodySnippet}`.toLowerCase()
    const matchedRule = KEYWORD_RULES.find((rule) => rule.keywords.some((kw) => haystack.indexOf(kw) !== -1))

    thread.addLabel(getOrCreateLabel_(matchedRule ? matchedRule.label : LABELS.generico))
    thread.addLabel(ackedLabel)
  })
}

function shouldSkip_(fromHeader, subject) {
  const from = (fromHeader || '').toLowerCase()
  if (from.indexOf(SELF_SENDER) !== -1) return true
  if (INTERNAL_SUBJECT_TAGS.some((tag) => subject.indexOf(tag) !== -1)) return true
  if (from.indexOf('no-reply') !== -1 || from.indexOf('noreply') !== -1) return true
  return false
}

function getOrCreateLabel_(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name)
}

function installTrigger() {
  ScriptApp.getProjectTriggers().forEach((trigger) => {
    if (trigger.getHandlerFunction() === 'autoAckInbox') ScriptApp.deleteTrigger(trigger)
  })
  ScriptApp.newTrigger('autoAckInbox').timeBased().everyMinutes(10).create()
}
