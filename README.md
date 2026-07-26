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
- `worker/index.js` — GitHub login handling for Decap CMS once deployed
  to Cloudflare (not used in local testing)
- `wrangler.jsonc` — tells Cloudflare where the built site lives and which
  Worker script handles requests
- `.eleventy.js` — Eleventy config (collections, passthrough copy)

## Deploying to Cloudflare

This project deploys to Cloudflare's current recommended model: **Workers
with static assets** (the modern successor to classic Pages — same idea,
different config). The site's build output (`_site`) is served as static
assets, and a small Worker script (`worker/index.js`) handles GitHub login
for the CMS; everything else falls through to the static files.

**In the Cloudflare dashboard, when connecting the GitHub repo:**
- Build command: `npx @11ty/eleventy`
- Deploy command: leave as the default (`npx wrangler deploy`)
- No "build output directory" field is needed here — `wrangler.jsonc` at
  the project root already tells Cloudflare where the built site lives

## Using the content editor (Decap CMS)

**Right now, for local testing** — this works today, no accounts needed:

1. In one terminal: `npx decap-server`
2. In another terminal: `npx @11ty/eleventy --serve`
3. Visit http://localhost:8080/admin/
4. Add/edit blog posts and gallery entries through the form — changes save
   directly to the markdown files in `src/blog/posts/` and
   `src/photos/entries/`

**Once the site is live** (after the Cloudflare deploy above), the same
`/admin/` page will use real GitHub login instead, so you can edit content
from anywhere, not just your own laptop. To set that up:

1. Create a GitHub OAuth App: GitHub → Settings → Developer settings →
   OAuth Apps → New OAuth App
   - Homepage URL: your live site URL
   - Authorization callback URL: `https://your-site.workers.dev/api/auth/callback`
     (or your custom domain, once that's set up)
2. In Cloudflare, go to your Worker's Settings → Variables and Secrets,
   and add two secrets:
   - `GITHUB_CLIENT_ID` (from the OAuth App)
   - `GITHUB_CLIENT_SECRET` (from the OAuth App)
3. Edit `src/admin/config.yml`:
   - Set `repo:` to `your-github-username/comebirdingwithme`
   - Set `base_url:` to your live site URL
4. Redeploy (push a commit, or trigger a redeploy in the Cloudflare
   dashboard) — `worker/index.js` handles the OAuth exchange automatically

## Adding content manually (without the CMS)

Copy `src/blog/posts/first-entry.md` or `src/photos/entries/first-sighting.md`
as a template. Front matter fields: `title`, `date`, `location`, `species`,
`image`.

## Subscribe box

The homepage doesn't currently have an email signup — dropped intentionally.
Can add one later if wanted (Buttondown, ConvertKit, and Mailchimp all have
free tiers).

## Next steps (weekend 3+)

- Push to GitHub, deploy to Cloudflare (done)
- Set up the GitHub OAuth App + Cloudflare env vars (see above) so the CMS
  works on the live site
- Migrate real content from the Squarespace export
- Once the new site is fully tested: transfer the domain from Squarespace to
  Porkbun, and point DNS to Cloudflare, in the same session (see prior
  conversation for the reasoning on doing this last, not first)
