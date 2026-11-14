# Vedha Links

Standalone link-in-bio page for Vedha Technologies, styled to match the
[vedha.ae](https://vedha.ae) hero. Plain HTML/CSS/JS — no build step.

```
index.html          page markup and all links
assets/styles.css   brand tokens, buttons and hero slideshow (mirrored from vedha.ae)
assets/main.js      lazy slides, share button, save-contact hints
vedha.vcf           contact card behind "Save contact"
_headers            content-type / caching for Netlify & Cloudflare Pages
Dockerfile          Caddy image used by Railway
Caddyfile           Caddy config (port, headers) for Railway
```

## Run locally

```sh
python3 -m http.server 4321
# open http://localhost:4321
```

## Deploy

- **Railway** (connect.vedha.ae): Railway builds the `Dockerfile` — Caddy
  serving the site on `$PORT`, with the headers from `Caddyfile`. Add the repo
  as a new service, then add `connect.vedha.ae` under Settings → Networking.

Or any static host — point it at the repo root with no build command:

- **Cloudflare Pages / Netlify**: build command empty, output directory `/`. `_headers` is picked up automatically.
- **GitHub Pages**: Settings → Pages → deploy from branch `main`, folder `/`. Add a `CNAME` file with the custom domain.
- **Vercel**: framework preset "Other", no build command.

## Editing

- **Links**: edit the `<a>` tags in `index.html`. Links to vedha.ae carry
  `utm_source=links&utm_medium=bio&utm_campaign=vedha-links` so visits show up in GA.
- **Contact card**: edit `vedha.vcf` (vCard 3.0, CRLF line endings). The
  `PHOTO` line is the base64 app icon; keep long lines folded at 75 chars
  with a leading space on continuation lines.
- **Brand styles**: tokens, `.btn` and `.hero-slideshow*` in `assets/styles.css`
  are copies of `src/styles/typography.css` and `src/styles/global.css` in the
  main site — update both together.
