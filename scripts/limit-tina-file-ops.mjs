// Cloudflare Workers Builds caps open files at 1024, and the Tina admin build
// (Rollup) reads up to 1000 files at once, so it fails with EMFILE (often
// shown as "failed to resolve import"). This caps Rollup's parallel file reads
// at 100 in the installed @tinacms/cli. Does nothing on other hosts.
// Remove once @tinacms/cli sets maxParallelFileOps itself: https://github.com/tinacms/tinacms/issues/8012
import { readFileSync, realpathSync, writeFileSync } from 'node:fs';

const onCloudflare = Boolean(process.env.WORKERS_CI) || process.env.DEPLOY_ADAPTER === 'cloudflare';
if (!onCloudflare) process.exit(0);

const cliFile = realpathSync('node_modules/@tinacms/cli/dist/index.js');
const source = readFileSync(cliFile, 'utf8');
if (source.includes('maxParallelFileOps')) process.exit(0);

const anchor = /(noWatch: true,\s*rollupOptions: \{)/;
if (!anchor.test(source)) {
  console.warn('limit-tina-file-ops: @tinacms/cli changed shape, skipping. If the build fails with EMFILE, see https://github.com/tinacms/tinacms/issues/8012');
  process.exit(0);
}
writeFileSync(cliFile, source.replace(anchor, '$1 maxParallelFileOps: 100,'));
console.log('limit-tina-file-ops: capped Rollup file reads at 100 for Workers Builds');
