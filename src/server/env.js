// @ts-check
/**
 * This file is included in `/next.config.js` which ensures the app isn't built with invalid env vars.
 * It has to be a `.js`-file to be imported there.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const { z } = require('zod');

/*eslint sort-keys: "error"*/
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
});

const env = envSchema.safeParse(process.env);
// console.log('parsed env vars', env);

if (!env.success) {
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(env.error.format(), null, 2),
  );
  // timeout necessary to see error in console
  setTimeout(() => {
    process.exit(1);
  }, 0);
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore this is incorrect, but it's fine for now
module.exports.env = env.data;
