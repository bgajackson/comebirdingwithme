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

## Live site

- **Site:** https://comebirdingwithme.com
- **Content editor:** https://comebirdingwithme.com/admin/
- **GitHub repo:** https://github.com/bgajackson/comebirdingwithme
- **Domain registrar:** Porkbun (DNS points to Cloudflare — this is
  intentional, keeps the domain independent of the hosting provider)
- **Hosting/build:** Cloudflare Workers (with static assets)

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

**Once the site is live**, the same `/admin/` page uses real GitHub login
instead, so you can edit content from anywhere, not just your own laptop.
This is already set up for the live site — GitHub OAuth App created, secrets
added to the Worker's Variables and Secrets in Cloudflare, and
`src/admin/config.yml` pointed at the real repo and live URL. If this ever
needs to be redone from scratch (e.g. a fresh clone, new OAuth app), the
pieces are:

1. GitHub OAuth App: GitHub → Settings → Developer settings → OAuth Apps
   - Homepage URL: `https://comebirdingwithme.com`
   - Authorization callback URL: `https://comebirdingwithme.com/api/auth/callback`
2. Cloudflare Worker → Settings → Variables and Secrets:
   - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (from the OAuth App)
3. `src/admin/config.yml` → `repo:` and `base_url:` already point at the
   live values above

## Important: syncing git with CMS edits

The CMS writes directly to GitHub, not to your laptop. So if you ever edit
a post through `/admin/` (especially from your phone or a different
device), your local project folder won't know about it.

**Before making any local edits, always run `git pull` first**, or you may
hit a rejected push later:

```powershell
git pull
```

If it opens a text editor asking for a merge commit message, just press
`Esc`, type `:wq`, and hit Enter to accept the default.

## Pinning posts to the homepage

Any blog post can be pinned to always show first on the homepage,
regardless of publish date — useful for featuring favorites. In the CMS,
edit a post and toggle **"Pin to homepage."** If you pin more than one,
use **"Pin order"** (lower number = shows first) to control the order
between them. Unpinned posts still fill the remaining homepage slots,
newest first.

## Troubleshooting

**"Port already in use" (EADDRINUSE) when starting `decap-server` or
`eleventy --serve`:** usually means an old terminal window is still
running one of these in the background, even if you closed the window.
Force-close everything and start fresh:
```powershell
taskkill /F /IM node.exe
```

**CMS changes not showing up on the site:** check the Cloudflare dashboard
→ Workers & Pages → comebirdingwithme → Deployments tab to see if a build
is running, still in progress, or failed. Most "it didn't update" issues
are either this, or a plain browser cache — try a hard refresh
(`Ctrl+Shift+R`) before assuming something's actually broken.

**`git push` rejected:** almost always means GitHub has commits your
laptop doesn't (see the CMS sync note above). Run `git pull` first, then
push again.

## Adding content manually (without the CMS)

Copy any existing file in `src/blog/posts/` or `src/photos/entries/` as a
template — front matter fields are: `title`, `date`, `location`, `species`,
`image`, plus `pinned`/`pinOrder` for blog posts (see Pinning section above).

## Subscribe box

The homepage doesn't currently have an email signup — dropped intentionally.
Can add one later if wanted (Buttondown, ConvertKit, and Mailchimp all have
free tiers).

## Project status

Fully built and live: custom design, CMS, GitHub + Cloudflare deploy, full
content migrated from Squarespace, real domain connected. Ongoing
maintenance from here is just adding content through the CMS and any
future design tweaks.
