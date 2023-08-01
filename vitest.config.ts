import { fileURLToPath } from 'url';
import { configDefaults, defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

/**
 * Currently loading necessary env vars required by src/server/env.js
 * loadEnv has an optional third parameter to load all env vars
 *   not just those prefixed wiht VITE_
 * @see https://vitejs.dev/config/#envdir
 * @see https://vitest.dev/guide/
 * @see https://vitest.dev/config/#setupfiles
 */
const env = loadEnv('', process.cwd(), 'DATABASE_URL');
Object.assign(process.env, env);

export default defineConfig({
  test: {
    globals: true,
    exclude: [...configDefaults.exclude, '**/playwright/**'],
    alias: {
      '~/': fileURLToPath(new URL('./src/', import.meta.url)),
    },
  },
});
