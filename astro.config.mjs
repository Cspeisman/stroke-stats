// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

import db from '@astrojs/db';

import auth from 'auth-astro';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [react(), db(), auth()],
  adapter: vercel()
});