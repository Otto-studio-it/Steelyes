# PR #29 Review: Workshop Quote PDF Attachment

**Branch:** `cursor/workshop-quote-pdf-attachment-ef1c`  
**PR:** https://github.com/Otto-studio-it/Steelyes/pull/29  
**Status:** MERGED  
**Review Date:** 2026-09-19

## Executive Summary

**Verdict:** ✅ **Implementation is sound, but PR was merged with pre-existing CI failure**

The PDF attachment feature is correctly implemented with proper error handling and reuses existing infrastructure. The branch includes the comprehensive resvg build fix that prevents Coolify/Nixpacks deployment issues. However, the PR was merged despite a CI typecheck failure unrelated to this feature.

---

## Verification Checklist

### 1. ✅ PDF Generation Reuse & Resend API Usage

**Status:** CORRECT

- **Reuses existing route:** `buildIndicativeQuotePdf()` from `/lib/configurator/quote-pdf.ts` (same function used by `/api/quote/[shareToken]/pdf/route.ts`)
- **Attachment filename:** Uses `buildQuotePdfFilename(shareToken)` → `steelyes-gate-quote-{token}.pdf`
- **Resend API usage:** Properly structured as `WorkshopPdfAttachment` with:
  ```typescript
  {
    filename: string
    content: Buffer
    contentType: 'application/pdf'
  }
  ```
- **Attachment size:** PDFs typically 8-68KB (well below Resend's 40MB limit)
- **Validation:** Helper rejects non-PDF files and PDFs < 100 bytes

**Code:**
- `apps/web/src/lib/email/workshop-pdf-attachment.ts` - Type-safe attachment wrapper
- `apps/web/src/lib/email/workshop-pdf-attachment.test.ts` - Unit tests passing

---

### 2. ✅ Failure Mode: Graceful Degradation

**Status:** CORRECT

When PDF generation fails, the email **still sends with links** as claimed:

```typescript
async function buildWorkshopQuotePdfAttachment(...): Promise<WorkshopPdfAttachment | null> {
  try {
    const pdfBytes = await buildIndicativeQuotePdf(input)
    return workshopPdfAttachment({ filename: ..., bytes: pdfBytes })
  } catch (error) {
    console.error('Workshop quote PDF build failed:', error)
    return null  // ← Graceful fallback
  }
}
```

Email rendering logic in `sendWorkshopLeadEmail()`:
```typescript
input.pdfAttachment
  ? '<br>Prototype PDF attached (design drawing + estimate).'
  : input.pdfUrl
    ? '<br><a href="${input.pdfUrl}">Download estimate PDF</a>'
    : ''
```

The `sendEmail()` function only includes attachments if the array has items:
```typescript
...(options.attachments?.length ? { attachments: options.attachments } : {})
```

**Verification:**
- PDF generation wrapped in try-catch
- Returns `null` on failure (not throwing)
- Email template conditionally shows "PDF attached" vs. link
- Attachment only added to Resend payload when non-null

---

### 3. ✅ No Secrets Leaked

**Status:** SECURE

All sensitive environment variables are properly handled:

- `RESEND_API_KEY`: Only accessed via `env.RESEND_API_KEY` (validated by Zod schema)
- `WORKSHOP_EMAIL`: Only accessed via `process.env.WORKSHOP_EMAIL` with fallback to `BUSINESS.email`
- `RESEND_FROM`: Only accessed via `process.env.RESEND_FROM` with fallback

**No console.log of secrets:**
```typescript
// Only logs error messages, never keys
console.error(`Resend skipped (${options.subject}): RESEND_API_KEY is not configured`)
```

**Environment variables respected:**
- `WORKSHOP_EMAIL` → Line 16 of `send.ts`
- `RESEND_API_KEY` → Line 59 of `send.ts`
- `RESEND_FROM` → Line 14 of `send.ts`

---

### 4. ✅ Customer Confirmation Still Link-Only

**Status:** UNCHANGED

Customer confirmation emails (`sendCustomerConfirmationEmail`) do **not** receive PDF attachments:

```typescript
// Line 251-287 of send.ts
export async function sendCustomerConfirmationEmail(
  input: CustomerConfirmationEmailInput,
): Promise<boolean> {
  // ... no pdfAttachment parameter
  // Line 270: only PDF link included
  ${input.pdfUrl ? ` · <a href="${input.pdfUrl}">Download estimate PDF</a>` : ''}
```

Only `sendWorkshopLeadEmail()` accepts and uses `pdfAttachment`.

---

### 5. ✅ Email My Design Does NOT Notify Workshop

**Status:** INTENTIONAL GAP (as noted)

The `emailMyDesign` action (Line 365-442 of `actions.ts`) only calls `sendDesignSaveEmail()`, which is a customer-only email:

```typescript
const sent = await sendDesignSaveEmail({
  email,
  shareUrl: context.shareUrl,
  pdfUrl: context.pdfUrl,
  configurationSummary: context.configurationSummary,
})
// No call to sendWorkshopLeadEmail()
```

**Implication:** When customers save their design via "Email my design", the workshop is **not notified**. This is intentional per the user's note but may be a business gap.

---

### 6. ✅ Build Impact: resvg Fix Included

**Status:** DEPLOY-SAFE

The branch **includes the comprehensive resvg build fix**. The merge base (`330f42e`) already contains all Coolify/Nixpacks fixes:

**Comparison with `cursor/fix-production-build-resvg-f487`:**

| Fix Component | f487 Branch | PDF Attachment Branch (330f42e+) |
|--------------|-------------|----------------------------------|
| `serverComponentsExternalPackages` | ❌ Simple webpack externals only | ✅ Full config |
| `outputFileTracingIncludes` | ❌ Not present | ✅ Full paths |
| Webpack externals function | ❌ Basic object | ✅ Advanced callback |
| Client-side aliasing | ❌ Not present | ✅ `@resvg/resvg-js: false` |

**`next.config.mjs` on this branch includes:**
```javascript
experimental: {
  serverComponentsExternalPackages: ['@resvg/resvg-js', 'sharp'],
  outputFileTracingIncludes: {
    '/api/**/*': [
      './node_modules/@resvg/resvg-js/**/*',
      './node_modules/@resvg/resvg-js-linux-x64-gnu/**/*',
      // ... full trace
    ],
  },
},
webpack: (config, { isServer }) => {
  // Advanced externals with callback
  config.externals = [
    ...(Array.isArray(previous) ? previous : previous ? [previous] : []),
    ({ request }, callback) => {
      if (externals.some((pkg) => request === pkg || request.startsWith(`${pkg}/`))) {
        return callback(null, `commonjs ${request}`)
      }
      callback()
    },
  ]
  
  if (!isServer) {
    config.resolve.alias = {
      '@resvg/resvg-js': false,
      sharp: false,
    }
  }
}
```

**Commit history verification:**
- `b964dc6`: "unblock Coolify build" (before merge base)
- `609dd71`: "keep resvg off the client bundle" (before merge base)

✅ **No deployment risk from resvg/sharp native binaries**

---

### 7. ⚠️ Missing Tests & Edge Cases

#### Edge Cases Handled:

✅ **No shareToken:** `loadConfigurationContext()` returns empty context with `pdfAttachment: null`
```typescript
if (!shareToken || !isValidShareToken(shareToken)) {
  return { ...empty, shareUrl: '', pdfUrl: '', pdfAttachment: null }
}
```

✅ **Contact without config:** Regular contact form doesn't call `attachPdf: true`, so no PDF generation attempted

✅ **PDF generation throws:** Caught in `buildWorkshopQuotePdfAttachment()`, returns `null`

#### Missing Coverage:

⚠️ **No integration test** for the full email-with-attachment flow
- Unit test exists: `workshop-pdf-attachment.test.ts`
- E2E test exists for PDF route: `configurator.spec.ts` (line 342)
- **Gap:** No test that verifies email sends with attachment when PDF succeeds

⚠️ **No test for Resend attachment size rejection**
- Resend has 40MB limit per attachment
- Current PDFs are 8-68KB, so no immediate risk
- But no validation prevents uploading huge PDFs if design master changes

⚠️ **No test for PDF generation timeout**
- If `buildIndicativeQuotePdf()` hangs, the entire quote submission hangs
- No timeout wrapper around PDF generation

#### Suggested Follow-ups (Non-blocking):

1. **Add integration test:**
   ```typescript
   it('attaches PDF to workshop email when generation succeeds', async () => {
     // Mock buildIndicativeQuotePdf to return sample bytes
     // Call processQuoteSubmission
     // Verify sendWorkshopLeadEmail called with non-null pdfAttachment
   })
   ```

2. **Add PDF size check** in `workshopPdfAttachment()`:
   ```typescript
   const MAX_RESEND_ATTACHMENT_SIZE = 40 * 1024 * 1024 // 40MB
   if (input.bytes.byteLength > MAX_RESEND_ATTACHMENT_SIZE) {
     console.warn(`PDF too large (${input.bytes.byteLength} bytes), will use link fallback`)
     return null
   }
   ```

3. **Add timeout to PDF generation:**
   ```typescript
   const PDF_GENERATION_TIMEOUT_MS = 10_000
   const pdfBytes = await Promise.race([
     buildIndicativeQuotePdf(input),
     new Promise((_, reject) => 
       setTimeout(() => reject(new Error('PDF generation timeout')), PDF_GENERATION_TIMEOUT_MS)
     )
   ])
   ```

---

## Pre-existing Issues

### ❌ CI Failure (Unrelated to PR)

**Status:** PR was merged despite failing typecheck

```
ERROR  src/lib/configurator/railhead-photos.test.ts(16,23): 
  error TS2802: Type 'Set<string>' can only be iterated through when using 
  the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.
```

**Root cause:** Pre-existing TypeScript configuration issue in `railhead-photos.test.ts`

**Impact:** Does not affect PDF attachment feature, but indicates CI may not be blocking merges

**Recommendation:** Fix `railhead-photos.test.ts` or update tsconfig to enable `downlevelIteration`

---

## Code Quality Assessment

### Strengths:
- ✅ Single Responsibility: `workshopPdfAttachment()` helper is focused and testable
- ✅ Type Safety: `WorkshopPdfAttachment` type prevents malformed attachments
- ✅ Error Handling: Try-catch with console.error, graceful fallback
- ✅ Existing Infrastructure: Reuses proven PDF generation code
- ✅ Minimal Changes: Only 4 files changed (+101 lines)

### Weaknesses:
- ⚠️ No timeout on potentially slow PDF generation
- ⚠️ No size limit check before attachment (though PDFs are currently tiny)
- ⚠️ No integration test for the full flow

---

## Concrete Risks (Ranked)

### 1. 🟢 **LOW: Deployment Risk**
- **Risk:** Native binaries break Coolify build
- **Mitigation:** Full resvg fix already in branch
- **Likelihood:** Very Low

### 2. 🟡 **MEDIUM: PDF Generation Hangs Quote Submission**
- **Risk:** If PDF generation hangs, customer waits indefinitely
- **Current Impact:** No timeout on `buildIndicativeQuotePdf()`
- **Mitigation:** Graceful degradation if it throws, but not if it hangs
- **Likelihood:** Low (PDF generation has been stable)
- **Recommendation:** Add 10s timeout

### 3. 🟢 **LOW: Resend Attachment Rejection**
- **Risk:** Future design masters could produce PDFs > 40MB
- **Current Impact:** PDFs are 8-68KB
- **Mitigation:** None currently
- **Likelihood:** Very Low (PDFs are compressed)
- **Recommendation:** Add size check and log warning

### 4. 🟢 **LOW: Email Without Attachment Misunderstood as Failure**
- **Risk:** Workshop expects PDF but sees link (when generation fails silently)
- **Mitigation:** Email body correctly shows "Download estimate PDF" link as fallback
- **Likelihood:** Very Low (PDF generation is stable)

---

## Final Verdict

### ✅ Ready for Production (Already Merged)

**Rationale:**
1. Core functionality is correct and well-tested at unit level
2. Error handling ensures email always sends (with link fallback)
3. No secrets leaked
4. Build configuration includes full resvg fix
5. Customer confirmation behavior unchanged
6. Intentional gap (Email My Design) is documented

**Blocking Issues:** None

**Recommended Follow-ups (Non-blocking):**
1. Fix `railhead-photos.test.ts` typecheck error (unrelated to PR)
2. Add integration test for email-with-attachment flow
3. Add timeout wrapper (10s) to PDF generation
4. Add size check (40MB limit) to attachment helper
5. Consider notifying workshop on "Email My Design" (business decision)

---

## Summary for Stakeholders

The workshop inbox now receives an attached PDF when customers request a quote from the configurator. The implementation:

- ✅ Reuses proven PDF generation code (same as customer download)
- ✅ Fails gracefully: if PDF generation breaks, email still sends with links
- ✅ Is deploy-safe: includes all required build fixes for Coolify
- ✅ Respects existing environment configuration (WORKSHOP_EMAIL, RESEND_*)

The PR was merged with a pre-existing CI failure unrelated to this feature. Recommended next steps are to fix that typecheck error and add integration tests for the attachment flow.

**No deployment blocker identified.** The feature is production-ready.
