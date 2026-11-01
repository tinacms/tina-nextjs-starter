// Stops a Cloudflare build early, with a clear message, when the TinaCloud keys
// that `tinacms build` needs are missing. Does nothing on other hosts.
import { existsSync } from 'node:fs';

const onCloudflare = Boolean(process.env.WORKERS_CI) || process.env.DEPLOY_ADAPTER === 'cloudflare';
if (!onCloudflare) process.exit(0);

// Local runs keep the keys in .env. tinacms reads .env itself, but this check runs first.
if (existsSync('.env')) process.loadEnvFile('.env');

const missing = ['NEXT_PUBLIC_TINA_CLIENT_ID', 'TINA_TOKEN'].filter((name) => !process.env[name]);
if (missing.length === 0) process.exit(0);

console.error(`
Missing TinaCloud build variables: ${missing.join(', ')}

tinacms build needs these while the site builds. Worker runtime
"Variables and Secrets" are not visible to the build.

Fix: in the Cloudflare dashboard, open your Worker > Settings > Build >
Variables and secrets. Add the missing names, with values from your project
at https://app.tina.io, then retry the build.
`);
process.exit(1);
