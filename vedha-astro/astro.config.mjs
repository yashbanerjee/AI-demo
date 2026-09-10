// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://vedha.ae',
  trailingSlash: 'always',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  // Trust Cloudflare/Railway forwarded host so form POSTs pass CSRF.
  // Without this, Origin is https://vedha.ae but the Node request looks like localhost.
  security: {
    allowedDomains: [
      { hostname: 'vedha.ae', protocol: 'https' },
      { hostname: 'www.vedha.ae', protocol: 'https' },
    ],
  },
  vite: {
    ssr: {
      external: ['nodemailer'],
    },
  },
});
