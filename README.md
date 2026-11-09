# Tina Starter 🦙

![tina-nextjs-starter-demo](https://user-images.githubusercontent.com/103008/130587027-995ccc45-a852-4f90-b658-13e8e0517339.gif)

This Next.js starter is powered by [TinaCMS](https://app.tina.io) for you and your team to visually live edit the structured content of your website. ✨

The content is managed through Markdown and JSON files stored in your GitHub repository, and queried through Tina GraphQL API.

### Features

- [Tina Headless CMS](https://app.tina.io) for authentication, content modeling, visual editing and team management.
- [Vercel](https://vercel.com) deployment to visually edit your site from the `/admin` route.
- Local development workflow from the filesystem with a local GraqhQL server.

## Requirements

- Git, [Node.js Active LTS](https://nodejs.org/en/about/releases/), pnpm installed for local development.
- A [TinaCMS](https://app.tina.io) account for live editing.

## Local Development

Install the project's dependencies:

> [!NOTE]  
> [Do you know the best package manager for Node.js?](https://www.ssw.com.au/rules/best-package-manager-for-node/) Using the right package manager can greatly enhance your development workflow. We recommend using pnpm for its speed and efficient handling of dependencies. Learn more about why pnpm might be the best choice for your projects by checking out this rule from SSW.


```
pnpm install
```

Run the project locally:

```
pnpm dev
```

### Local URLs

- http://localhost:3000 : browse the website
- http://localhost:3000/admin : connect to Tina Cloud and go in edit mode
- http://localhost:3000/exit-admin : log out of Tina Cloud
- http://localhost:4001/altair/ : GraphQL playground to test queries and browse the API documentation

## Deployment

### GitHub Pages

This starter can be deployed to GitHub Pages. A GitHub Actions workflow is included that handles the build and deployment process. 

To deploy to GitHub Pages:

1. In your repository settings, open **Pages** and set **Source** to **GitHub Actions**
2. Push changes to your main branch - the workflow will automatically build and deploy the site

> [!NOTE]
> When deploying to GitHub Pages, you'll need to update your secrets in Settings | Secrets and variables | Actions to include:
> - `NEXT_PUBLIC_TINA_CLIENT_ID`
> - `TINA_TOKEN`
>
> You get these from your TinaCloud project - [read the docs](https://tina.io/docs/tina-cloud/deployment-options/github-pages)

> [!IMPORTANT]
> GitHub Pages does not support server side code, so this will run as a static site. If you don't want to deploy to GitHub pages, just delete `.github/workflows/build-and-deploy.yml`

### Cloudflare Workers

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/tinacms/tina-nextjs-starter)

The button copies this repository to your GitHub account and creates a Cloudflare Worker that builds with [OpenNext](https://opennext.js.org/cloudflare) on every push.

#### Before your first build succeeds

The first build fails on purpose with `Missing TinaCloud build variables`. `tinacms build` needs your TinaCloud keys while the site builds, and Worker runtime "Variables and Secrets" are not visible to the build.

1. In the Cloudflare dashboard, open your Worker > **Settings** > **Build** > **Variables and secrets**
2. Add `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` as **build** variables, with values from your project at [app.tina.io](https://app.tina.io)
3. Retry the build

You don't need to set `NEXT_PUBLIC_TINA_BRANCH`. Workers Builds sets `WORKERS_CI_BRANCH`, and the starter uses it as the Tina branch.

#### Build settings

If you set up the Worker yourself (not with the button), use these commands on the setup page:

- Build command: `pnpm run build`
- Deploy command: `pnpm run deploy`
- Non-production branch deploy command: `pnpm run upload`

#### Run the Worker locally

With your keys in `.env`:

```bash
pnpm preview
```

To deploy from your machine:

```bash
pnpm exec opennextjs-cloudflare build && pnpm exec opennextjs-cloudflare deploy
```

`pnpm build` only builds for Cloudflare when `WORKERS_CI` (set by Workers Builds) or `DEPLOY_ADAPTER=cloudflare` is set. Vercel and GitHub Pages builds are unchanged.

#### Limits

- The Worker uploads at about 1.1 MiB gzip (5.0 MiB uncompressed), measured with `wrangler deploy --dry-run`. This fits the Workers Free plan.
- Pages are prerendered at build time. Each content change in TinaCloud is a git commit, which starts a new build, so there is no time-based revalidation. See [OpenNext caching](https://opennext.js.org/cloudflare/caching) if you need it.
- Images are served unoptimized. To turn on optimization, add an `IMAGES` binding as described in the [OpenNext image docs](https://opennext.js.org/cloudflare/howtos/image) and remove `isCloudflare` from `images.unoptimized` in `next.config.ts`.
- Next.js can't be served from Cloudflare Pages. This deploys to Cloudflare Workers.

### Building the Starter Locally (Using the hosted content API)

Copy `.env.example` to `.env` and uncomment the lines you use:

```
NEXT_PUBLIC_TINA_CLIENT_ID=<get this from the project you create at app.tina.io>
TINA_TOKEN=<get this from the project you create at app.tina.io>
NEXT_PUBLIC_TINA_BRANCH=<Specify the branch with Tina configured>
```

Build the project:

```bash
pnpm build
```

## Getting Help

To get help with any TinaCMS challenges you may have:

- Visit the [documentation](https://tina.io/docs/) to learn about Tina.
- [Join our Discord](https://discord.gg/zumN63Ybpf) to share feedback.
- Visit the [community forum](https://community.tinacms.org/) to ask questions.
- Get support through the chat widget on the TinaCMS Dashboard
- [Email us](mailto:support@tina.io) to schedule a call with our team and share more about your context and what you're trying to achieve.
- [Search or open an issue](https://github.com/tinacms/tinacms/issues) if something is not working.
- Reach out on Twitter at [@tina_cms](https://twitter.com/tina_cms).

## Development tips

### Visual Studio Code GraphQL extension

[Install the GraphQL extension](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) to benefit from type auto-completion.

### Typescript

A good way to ensure your components match the shape of your data is to leverage the auto-generated TypeScript types.
These are rebuilt when your `tina` config changes.

## LICENSE

Licensed under the [Apache 2.0 license](./LICENSE).


# Repository cleaned of LFS content
# Repository cleaned of LFS content - Wed Sep 17 15:00:42 AEST 2025

