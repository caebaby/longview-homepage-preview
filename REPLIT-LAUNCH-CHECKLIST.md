# LongView Replit launch checklist

## 1. Import and structural verification

- [ ] Import `https://github.com/caebaby/longview-homepage-preview` into a new Replit App.
- [ ] Confirm `.replit`, `index.html`, `assets/`, `images/`, `scripts/`, and `package.json` are at the App root.
- [ ] Click **Run** and confirm the homepage opens in the Replit preview.
- [ ] Run `npm run check` in the Replit Shell and resolve every `FAIL` before publishing.
- [ ] In **Publishing**, select **Static** and set the public directory to `.`.
- [ ] Publish first to the Replit review URL; do not connect the production domain yet.

## 2. Content and compliance release blockers

- [ ] Replace the homepage's placeholder testimonial with an approved, attributable quote and complete SEC Marketing Rule review.
- [ ] Replace every `CRN____________` marker with the approved current CRN.
- [ ] Resolve all `COMPLIANCE PLACEHOLDER` and full-disclosure markers.
- [ ] Approve or revise the whole-life article's product-mechanics and illustration language.
- [ ] Confirm the self-managing/DIY offer fee and replace its fee placeholder.
- [ ] Confirm that all statistics, credentials, advisor titles, biographies, photos, and household claims are approved.
- [ ] Regenerate the compliance-review PDF after the final site content is approved.

## 3. Production connections

- [ ] Connect the approved scheduling URL/widget on `longview_book.html` and `longview_post-assessment.html`.
- [ ] Add approved video media to the homepage, VSL, post-assessment page, PSLF landing page, and advisor-profile placeholders.
- [ ] Connect the homepage clarity form, assessment result form, newsletter form, and lead-magnet form to the approved CRM/form handler.
- [ ] Test successful form submission, validation errors, thank-you behavior, notification delivery, attribution fields, and privacy disclosure.
- [ ] Add approved analytics only after consent/privacy requirements are confirmed.

Do not place credentials, API keys, or private tokens in frontend files. Use Replit Secrets for any future server-side integration.

## 4. Visual and interaction QA

- [ ] At 390px, verify the navigation, homepage hero, assessment, accordions, forms, team cards, footer, and every CTA.
- [ ] At 820px, verify the collapsed navigation and all tablet layouts.
- [ ] At 1440px, verify the hero portrait rotation, team carousel, process wheel, assessment, and contact section.
- [ ] Complete every career-stage assessment path and verify every result band.
- [ ] Verify Will Holmes appears on the team page, homepage team carousel, and homepage hero rotation.
- [ ] Verify Lauren Clarke's team-page crop.
- [ ] Test keyboard navigation, visible focus states, reduced motion, and form labels.
- [ ] Open every public route and confirm there are no broken images, missing fonts, console errors, or dead internal links.

## 5. Production domain and search release

- [ ] Connect the approved custom domain in Replit Publishing and complete the DNS verification Replit provides.
- [ ] Add final absolute canonical URLs, Open Graph URLs/images, and structured data using the approved domain.
- [ ] Create the production `sitemap.xml` with only approved, indexable pages.
- [ ] Replace the review `robots.txt` with the approved production crawler policy.
- [ ] Remove the `X-Robots-Tag: noindex, nofollow` response-header block from `.replit` only after compliance approval.
- [ ] Republish, verify the live response headers, and submit the sitemap to the approved search-console accounts.
- [ ] Run `npm run check` again and complete phone/tablet/desktop QA on the custom domain.

## 6. Handoff record

- [ ] Record the Replit App owner and editor access.
- [ ] Record the custom-domain and DNS owner.
- [ ] Record the CRM, scheduling, analytics, and video-platform owners.
- [ ] Record the approved launch date and exact Git commit deployed.
