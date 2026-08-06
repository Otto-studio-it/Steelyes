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
 *   5. If SITE_INGEST_URL/SITE_INGEST_SECRET below are filled in, also logs
 *      the thread to the site's /admin/inbox panel via a POST to
 *      apps/web/src/app/api/inbox/ingest/route.ts — so Marius sees direct
 *      emails and site leads in one place. Safe to leave blank: the script
 *      still auto-acks and labels in Gmail either way, it just skips logging.
 *
 * SETUP (one-time, ~5 min):
 *   1. Log into script.google.com AS info@steelyes.co.uk (the Workspace
 *      account that owns the mailbox), not a personal account.
 *   2. New project → paste this whole file in → save.
 *   3. Fill in SITE_INGEST_URL and SITE_INGEST_SECRET below (ask Ruben for
 *      the value of INBOX_INGEST_SECRET from Coolify env vars) — or leave
 *      both blank to skip admin-panel logging entirely.
 *   4. Run the `installTrigger` function once from the editor toolbar.
 *      Google will prompt for Gmail authorization — accept (it only needs
 *      access to this account's own mailbox).
 *   5. Done. `autoAckInbox` now runs automatically every 10 minutes.
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

// Fill these in to also log inbound emails to /admin/inbox on the site.
// Leave both blank ('') to skip that step — Gmail auto-ack/labelling still works.
const SITE_INGEST_URL = '' // e.g. 'https://steelyes.co.uk/api/inbox/ingest'
const SITE_INGEST_SECRET = '' // value of INBOX_INGEST_SECRET (Coolify env var)

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
    key: 'reclamo',
    keywords: ['complaint', 'reclamo', 'refund', 'broken', 'damaged', 'problem', 'issue', 'not happy', 'unhappy'],
  },
  { key: 'fattura', keywords: ['invoice', 'fattura', 'payment', 'receipt', 'vat'] },
  { key: 'garanzia', keywords: ['warranty', 'garanzia', 'guarantee'] },
  { key: 'preventivo', keywords: ['quote', 'preventivo', 'price', 'cost', 'estimate'] },
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

    const plainBody = firstMessage.getPlainBody() || ''
    const haystack = `${subject} ${plainBody}`.toLowerCase()
    const matchedRule = KEYWORD_RULES.find((rule) => rule.keywords.some((kw) => haystack.indexOf(kw) !== -1))
    const categoryKey = matchedRule ? matchedRule.key : 'generico'

    thread.addLabel(getOrCreateLabel_(LABELS[categoryKey]))
    thread.addLabel(ackedLabel)

    postToIngest_(thread, firstMessage, fromHeader, subject, plainBody, categoryKey)
  })
}

function postToIngest_(thread, firstMessage, fromHeader, subject, plainBody, categoryKey) {
  if (!SITE_INGEST_URL || !SITE_INGEST_SECRET) return

  const emailMatch = /<([^>]+)>/.exec(fromHeader || '')
  const fromEmail = emailMatch ? emailMatch[1] : fromHeader

  const payload = {
    gmailThreadId: thread.getId(),
    fromEmail: fromEmail,
    subject: subject,
    snippet: plainBody.slice(0, 200),
    category: categoryKey,
    receivedAt: new Date(firstMessage.getDate()).toISOString(),
  }

  try {
    const response = UrlFetchApp.fetch(SITE_INGEST_URL, {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: `Bearer ${SITE_INGEST_SECRET}` },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    })
    const status = response.getResponseCode()
    if (status < 200 || status >= 300) {
      console.error(`inbox ingest returned HTTP ${status}`)
    }
  } catch (err) {
    // Never let a logging failure block the Gmail-side ack/label, which already happened.
    console.error('inbox ingest failed', err)
  }
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
