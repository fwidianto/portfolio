# Analytics and Search Setup

Repository: `fwidianto/portofolio`  
Branch: `portfolio-refresh-plan`

## Purpose

This site is prepared for analytics and search verification, but all tracking snippets remain disabled until real IDs are available.

Use analytics only for aggregate portfolio traffic and UX improvement.
Do not use these tools to collect private data, form submissions, internal ERP records, credentials, application tracker details, or personal notes.

## Where to Add Real IDs

### Google Analytics 4

Location:

- [index.html](../../index.html)

Replace:

- `G-XXXXXXXXXX`

Enable by:

- Uncommenting the GA4 snippet in the `<head>` of `index.html`
- Replacing the placeholder with the real GA4 Measurement ID
- Copying the same activated snippet into each public HTML page if sitewide tracking is wanted

### Microsoft Clarity

Location:

- [index.html](../../index.html)

Replace:

- `CLARITY_PROJECT_ID`

Enable by:

- Uncommenting the Clarity snippet in the `<head>` of `index.html`
- Replacing the placeholder with the real Clarity Project ID
- Copying the same activated snippet into each public HTML page if sitewide tracking is wanted

### Google Search Console Verification

Location:

- [index.html](../../index.html)

Replace:

- `GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE`

Enable by:

- Uncommenting the meta tag in the `<head>` of `index.html`
- Replacing the placeholder with the real verification code

### Bing Webmaster Tools Verification

Location:

- [index.html](../../index.html)

Replace:

- `BING_WEBMASTER_VERIFICATION_CODE`

Enable by:

- Uncommenting the meta tag in the `<head>` of `index.html`
- Replacing the placeholder with the real verification code

## Current Status

- All placeholders are commented out.
- No active analytics or verification scripts run with fake IDs.
- Tracking is intentionally disabled until real IDs are supplied.

## Verification Later

After real IDs are added, verify the setup with:

- Google Analytics 4 Realtime report
- Microsoft Clarity dashboard
- Google Search Console ownership verification
- Bing Webmaster Tools ownership verification

## Notes

- Keep analytics limited to public portfolio usage.
- Do not add form collection or personal-data collection unless that is explicitly planned and documented.
- If sitewide GA4 or Clarity is desired later, add the activated snippet to every public HTML page, not just `index.html`.
