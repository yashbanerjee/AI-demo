// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://vedha.ae',
  trailingSlash: 'always',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: {
    ssr: {
      // Bundle nodemailer into the server build so Railway/runtime
      // does not depend on resolving it from node_modules at request time.
      noExternal: ['nodemailer'],
    },
  },
});
