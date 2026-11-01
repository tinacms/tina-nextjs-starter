import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// Pages are prerendered at build time and served from Workers static assets.
// Each TinaCloud edit is a git commit, which starts a new Workers Build, so
// nothing needs revalidating between deploys. The stock cache marks entries
// stale after `revalidate` (300 s). Each request would then re-render the
// page and fail to write the read-only cache. Report entries as fresh instead.
export default defineCloudflareConfig({
  incrementalCache: {
    // Keep the stock name: `opennextjs-cloudflare deploy/preview` copies the
    // prerendered cache into the assets only for this name.
    name: staticAssetsCache.name,
    get: async (key, cacheType) => {
      const entry = await staticAssetsCache.get(key, cacheType);
      return entry && { ...entry, lastModified: Date.now() };
    },
    set: async () => {},
    delete: async () => {},
  },
  enableCacheInterception: true,
});
