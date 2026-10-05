# LongView Planning Partners — Replit handoff

Static, Replit-ready review build of the redesigned LongView Planning Partners website. The site uses plain HTML, CSS, and JavaScript; there is no framework, build step, database, or application server.

## Import and run

1. In Replit, create a new App by importing `https://github.com/caebaby/longview-homepage-preview`.
2. Confirm the App root contains `.replit`, `index.html`, `assets/`, `images/`, and `scripts/`.
3. Click **Run**. The workspace preview uses Python on port `3000`.
4. Run `npm run check` in the Replit Shell.
5. In **Publishing**, select **Static** and confirm the public directory is `.`.

The root `index.html` is the production homepage. `longview_homepage_v8.html` is retained as an identical compatibility alias for existing review links.

## Deployment mode

The `.replit` file configures a Static Deployment. That is the correct Replit target for this site because every public route is an HTML file and all site assets are static.

The first Replit URL is intentionally protected from search indexing through both `robots.txt` and an `X-Robots-Tag` response header. Keep those protections enabled while the launch items in [`REPLIT-LAUNCH-CHECKLIST.md`](REPLIT-LAUNCH-CHECKLIST.md) remain unresolved.

## Verification

```bash
npm run check
```

The checker verifies:

- every production HTML page and local asset reference;
- URL fragment targets;
- titles, viewport metadata, and one H1 per page;
- homepage/compatibility-alias parity;
- Will Holmes and Lauren Clarke team updates;
- Replit Static Deployment and review-mode crawler protection.

It also reports the remaining compliance, CRN, video, and scheduling markers as launch notices.

## Important hosting notes

- Lead and assessment forms are frontend-only until their approved CRM/form endpoint is connected.
- Scheduling and video placeholders require their final production URLs or embeds.
- Do not remove review-mode indexing protection until testimonials, compliance language, CRNs, disclosures, and the final domain are approved.
- Never place API keys or private credentials in HTML or JavaScript. Use Replit Secrets if a future server-side integration is added.

See [`REPLIT-LAUNCH-CHECKLIST.md`](REPLIT-LAUNCH-CHECKLIST.md) for the exact publication and custom-domain sequence.
