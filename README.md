# Come Birding With Me

Static site built with Eleventy (11ty). Monochrome design where the
photography supplies the color — modeled after the current Squarespace site.
Content is managed with Decap CMS.

## Local development

```bash
npm install
npx @11ty/eleventy --serve
```

Then open http://localhost:8080

## Adding your hero photo

Drop a photo in as `src/images/hero.webp` (that exact filename). The homepage
hero will automatically use it as the full-bleed background. Until you add
one, a warm gradient placeholder shows instead so the layout still looks
intentional.

## Structure

- `src/blog/posts/*.md` — blog posts
- `src/photos/entries/*.md` — gallery entries
- `src/images/` — images referenced by posts/entries/hero
- `src/css/style.css` — all styling / design tokens (see `:root` at the top)
- `src/admin/` — Decap CMS (the content editor, at `/admin/`)
- `functions/api/auth*` — GitHub login handling for Decap CMS once deployed
  to Cloudflare Pages (not used in local testing)
- `.eleventy.js` — Eleventy config (collections, passthrough copy)

## Using the content editor (Decap CMS)

**Right now, for local testing** — this works today, no accounts needed:

1. In one terminal: `npx decap-server`
2. In another terminal: `npx @11ty/eleventy --serve`
3. Visit http://localhost:8080/admin/
4. Add/edit blog posts and gallery entries through the form — changes save
   directly to the markdown files in `src/blog/posts/` and
   `src/photos/entries/`

**Once the site is live** (weekend 3, after deploying to Cloudflare Pages),
the same `/admin/` page will use real GitHub login instead, so you can edit
content from anywhere, not just your own laptop. To set that up:

1. Push this project to a GitHub repository
2. Edit `src/admin/config.yml`:
   - Set `repo:` to `your-github-username/comebirdingwithme`
   - Set `base_url:` to your live Cloudflare Pages URL
3. Create a GitHub OAuth App: GitHub → Settings → Developer settings →
   OAuth Apps → New OAuth App
   - Homepage URL: your live site URL
   - Authorization callback URL: `https://your-site.pages.dev/api/auth/callback`
4. In Cloudflare Pages project settings → Environment variables, add:
   - `GITHUB_CLIENT_ID` (from the OAuth App)
   - `GITHUB_CLIENT_SECRET` (from the OAuth App)
5. Redeploy — `functions/api/auth.js` and `functions/api/auth/callback.js`
   handle the rest automatically (Cloudflare Pages Functions run these
   without any extra setup)

## Adding content manually (without the CMS)

Copy `src/blog/posts/first-entry.md` or `src/photos/entries/first-sighting.md`
as a template. Front matter fields: `title`, `date`, `location`, `species`,
`image`.

## Subscribe box

The homepage doesn't currently have an email signup — dropped intentionally.
Can add one later if wanted (Buttondown, ConvertKit, and Mailchimp all have
free tiers).

## Next steps (weekend 3+)

- Push to GitHub, deploy to Cloudflare Pages
- Set up the GitHub OAuth App + Cloudflare env vars (see above) so the CMS
  works on the live site
- Migrate real content from the Squarespace export
- Once the new site is fully tested: transfer the domain from Squarespace to
  Porkbun, and point DNS to Cloudflare, in the same session (see prior
  conversation for the reasoning on doing this last, not first)
