# Synnera Mattress LLP — Brand Website

This is a lightweight, non-e-commerce, CMS-editable website for Synnera Mattress LLP.

## Stack
- Static HTML/CSS/JavaScript
- Netlify hosting
- Decap CMS at `/admin/`
- Netlify Identity + Git Gateway for CMS authentication
- Content stored in `content/site.json`
- CMS-uploaded media stored in `assets/uploads/`

## Deploy
1. Create a GitHub repository and upload all files in this folder.
2. In Netlify, create a new site from that GitHub repository.
3. Use the repository's `main` branch. No build command is required.
4. In Netlify, enable Identity.
5. In Netlify Identity, enable Git Gateway.
6. Open `https://YOUR-SITE.netlify.app/admin/` and create the CMS user/invite.
7. After login, edit "Website Content" to change text, products and images.
8. Add `synnera.com` under Netlify Domain Management and follow the DNS instructions shown by Netlify.

## Important
The hero, product and factory images are temporary remote stock-image placeholders. Replace them from the CMS when your own product/factory photographs are ready.

The website content is based on the information supplied by Synnera and the uploaded brochure. Older brochure marketing claims were not carried into the new site as current claims.

## CMS
The current CMS uses Decap CMS with the Netlify Git Gateway backend. Editors do not need to edit the source code; changes made in `/admin/` are committed to the connected Git repository and trigger a new Netlify deploy.

## Form
The contact form uses Netlify Forms. Submissions appear in the Netlify dashboard after deployment.
