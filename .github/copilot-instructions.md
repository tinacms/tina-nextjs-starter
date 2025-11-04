# GitHub Copilot Instructions

## Project Overview

This project uses **TinaCMS** as a headless CMS with **React** for the frontend. It features a server/client split architecture for efficient data fetching and real-time visual editing capabilities.

### Key Concepts
- **useTina hook**: Client-side visual editing; wraps queries and provides edit mode
- **tinaField helper**: Connects DOM elements to CMS fields for click-to-edit
- **TinaClient**: Queries collections and items; used on server side
- **Server/Client split**: Fetch data on server, render with editing on client

## Technology Stack

- **Language**: TypeScript
- **CMS**: TinaCMS (headless)
- **UI Framework**: React
- **File Format**: `.tsx` | `.ts`

### Framework Notes
- **Next.js (App Router)**: Native server/client component split 
- **Next.js (Pages Router)**: Native server/client component split
- **Astro**: Use server components and client islands
- **Other frameworks**: Adapt the pattern to your framework's conventions

## Architecture

### Core Pattern: Server/Client Split

All pages follow this structure:

```
page/
├── page.tsx           # Server component; fetches data
└── client-page.tsx    # Client component; renders with useTina
```

#### Data Flow
1. **Server (`page.tsx`)**
   - Calls `client.queries.xxx()` to fetch content
   - Returns `{ query, data, variables }` automatically
   - Passes all three to client component
   - No visual editing; pure data fetching

2. **Client (`client-page.tsx`)**
   - Uses `useTina()` hook with server-fetched data
   - Enables visual editing mode
   - Renders UI with `data-tina-field` attributes for click-to-edit

## TinaCMS Client Usage

### Querying Collections

#### Query Multiple Items (Paginated)
```typescript
const { query, data, variables } = await client.queries.postConnection({
  first: 10, // optional
  after: "cursor", // optional; pagination
});
```

#### Query Single Item
```typescript
const { query, data, variables } = await client.queries.post({
  relativePath: "my-post.md",
});
```

#### Query with Filters (Schema-Dependent)
```typescript
const { query, data, variables } = await client.queries.postConnection({
  first: 20,
  sort: "title", // depends on schema
});
```

### Return Object Structure

All `client.queries.xxx()` calls return:
```typescript
{
  query: string;      // GraphQL query string (pass to useTina)
  data: <collectionNameQuery>;          // Query result (pass to useTina). Type from tinacms generated types file
  variables?: <collectionNameQueryVariables>; // Query variables (pass to useTina).  Type from tinacms generated types file

}
```

- This types import looks like: `import { PostConnectionQuery, PostConnectionQueryVariables } from '@/tina/__generated__/types';`


**Always pass all three to the client component.**

## Framework-Specific Patterns

### Next.js (App Router)

#### Server Component (page.tsx)

```typescript
// app/blog/[slug]/page.tsx
import { client } from "@/tina/client";
import ClientPage from "./client-page";

interface PageProps {
  params: { slug: string };
}

export default async function Page({ params }: PageProps) {
  try {
    const { query, data, variables } = await client.queries.post({
      relativePath: `${params.slug}.md`,
    });

    if (!data.post) {
      notFound();
    }

    return <ClientPage query={query} data={data} variables={variables} />;
  } catch (error) {
    console.error("Failed to fetch post:", error);
    notFound();
  }
}
```

#### Client Component (client-page.tsx)

```typescript
// app/blog/[slug]/client-page.tsx
"use client";

import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PostQuery, PostQueryVariables } from "@/tina/__generated__/types";
import { components } from '@/components/mdx-components';

interface ClientPageProps {
  query: string;
  data: PostQuery;
  variables: PostQueryVariables;
}

export default function ClientPage({
  query,
  data,
  variables,
}: ClientPageProps) {
  const { data: tinaData } = useTina({
    query,
    data,
    variables,
  });

  const post = tinaData.post;

  return (
    <article>
      <h1 data-tina-field={tinaField(post, 'title')}>
        {post.title}
      </h1>
      <p data-tina-field={tinaField(post, 'description')}>
        {post.description}
      </p>
      <div data-tina-field={tinaField(post, 'body')}>
        <TinaMarkdown content={post.body} components={components} />
      </div>
    </article>
  );
}
```

### Index/Archive Pages

#### Server Component (page.tsx)

```typescript
// app/blog/page.tsx
import { client } from "@/tina/client";
import ClientPage from "./client-page";

export default async function BlogPage() {
  const { query, data, variables } = await client.queries.postConnection({
    first: 20,
  });

  return <ClientPage query={query} data={data} variables={variables} />;
}
```

#### Client Component (client-page.tsx)

```typescript
// app/blog/client-page.tsx
"use client";

import { tinaField, useTina } from 'tinacms/dist/react';
import Link from "next/link";
import { PostConnectionQuery, PostConnectionQueryVariables } from "@/tina/__generated__/types";

interface ClientPageProps {
  query: string;
  data: PostConnectionQuery;
  variables: PostConnectionQueryVariables;
}

export default function ClientPage({
  query,
  data,
  variables,
}: ClientPageProps) {
  const { data: tinaData } = useTina({ query, data, variables });

  const edges = tinaData.postConnection.edges || [];

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {edges.map((edge: any) => (
          <li key={edge.node.sys.relativePath}>
            <Link href={`/blog/${edge.node._sys.filename}`}>
              <h2 data-tina-field={tinaField(edge.node, 'title')}>
                {edge.node.title}
              </h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## data-tina-field Attribute

### Purpose
Connects DOM elements to CMS fields; enables click-to-edit in visual mode using the `tinaField()` helper.

### Format

Using the `tinaField()` helper from TinaCMS:

```typescript
import { tinaField } from 'tinacms/dist/react';

data-tina-field={tinaField(object, 'fieldName')}
```

### Examples

```typescript
import { tinaField } from 'tinacms/dist/react';

// Top-level field
<h1 data-tina-field={tinaField(post, 'title')}>
  {post.title}
</h1>

// Nested field
<p data-tina-field={tinaField(post.author, 'name')}>
  {post.author.name}
</p>

// Array element (if supported)
<li data-tina-field={tinaField(post.tags, '0')}>
  {post.tags[0]}
</li>

// Rich text / body (with TinaMarkdown)
<div data-tina-field={tinaField(post, 'body')}>
  <TinaMarkdown content={post.body} />
</div>

// Optional field with fallback
<p data-tina-field={tinaField(post, 'subtitle')}>
  {post.subtitle || "No subtitle"}
</p>
```

### Guidelines

- ✅ Use `tinaField(object, 'fieldName')` for proper field tracking
- ✅ Add `data-tina-field` to every user-editable element
- ✅ Must match schema path exactly
- ✅ Enable visual editing; users click to edit inline
- ✅ Pass parent object to `tinaField()`, not computed values
- ❌ Don't add to metadata or non-visible elements
- ❌ Don't add to computed/derived content
- ❌ Don't use string literals like `` `post.title` ``

## useTina Hook

### Signature

```typescript
const { data } = useTina({
  query: string;
  data: <CollectionName>Query;
  variables: <CollectionName>QueryVariables;
});
```

### Usage

```typescript
import { PostQuery, PostQueryVariables } from "@/tina/__generated__/types";

interface ClientPageProps {
  query: string;
  data: PostQuery;
  variables: PostQueryVariables;
}

export default function ClientPage({
  query,
  data,
  variables,
}: ClientPageProps) {
  const { data: tinaData } = useTina({
    query,   // GraphQL string from server
    data,    // Server-fetched data (typed as PostQuery)
    variables, // Query variables (typed as PostQueryVariables)
  });

  // tinaData is live-editable in visual mode
  const content = tinaData.post;
}
```

### Typing Pattern

For any collection (e.g., `post`, `page`, `article`):

- **Single item query**: Use `<CollectionName>Query` and `<CollectionName>QueryVariables`
  - Example: `PostQuery`, `PostQueryVariables`
  - Example: `PageQuery`, `PageQueryVariables`

- **Connection query**: Use `<CollectionName>ConnectionQuery` and `<CollectionName>ConnectionQueryVariables`
  - Example: `PostConnectionQuery`, `PostConnectionQueryVariables`
  - Example: `PageConnectionQuery`, `PageConnectionQueryVariables`

### Behavior

- Receives server-fetched `data`, `query`, and `variables`
- Enables real-time visual editing on client
- Handles subscription to CMS updates
- Returns `data` (editable content)
- **Note**: Does not return `isLoading` or `error` states

### Guidelines

- ✅ Always use with server-fetched `data`
- ✅ Pass all three: `query`, `data`, `variables`
- ✅ Use proper TypeScript types: `<CollectionName>Query` and `<CollectionName>QueryVariables`
- ✅ Handle loading/error states on server side
- ❌ Don't call `client.queries()` in component
- ❌ Don't use in server components

## TinaMarkdown with Click-to-Edit

### Basic Usage

```typescript
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PostQuery, PostQueryVariables } from "@/tina/__generated__/types";

interface ClientPageProps {
  query: string;
  data: PostQuery;
  variables: PostQueryVariables;
}

export default function ClientPage({
  query,
  data,
  variables,
}: ClientPageProps) {
  const { data: tinaData } = useTina({
    query,
    data,
    variables,
  });

  const post = tinaData.post;

  return (
    <article>
      <h1 data-tina-field={tinaField(post, 'title')}>
        {post.title}
      </h1>
      <p data-tina-field={tinaField(post, 'description')}>
        {post.description}
      </p>
      <div data-tina-field={tinaField(post, 'body')}>
        <TinaMarkdown content={post.body} />
      </div>
    </article>
  );
}
```

### Determining Field Type

Check your TinaCMS schema:

- **String fields** (`type: 'string'`): Use direct text rendering
- **Rich text fields** (`type: 'rich-text'`): Use `TinaMarkdown`
- **Object fields**: Render nested properties individually
- **Array fields**: Map over items with `array.map()`

**Example:**
```typescript
const post = tinaData.post;

return (
  <article>
    {/* Simple string */}
    <h1 data-tina-field={tinaField(post, 'title')}>
      {post.title}
    </h1>

    {/* Rich text */}
    <div data-tina-field={tinaField(post, 'body')}>
      <TinaMarkdown content={post.body} />
    </div>

    {/* Array of items */}
    <ul data-tina-field={tinaField(post, 'tags')}>
      {post.tags?.map((tag, i) => (
        <li key={i}>{tag}</li>
      ))}
    </ul>

    {/* Nested object */}
    <div data-tina-field={tinaField(post.author, 'name')}>
      By {post.author?.name}
    </div>
  </article>
);
```

### Passing Props to TinaMarkdown

TinaMarkdown accepts custom components for consistent rendering:

```typescript
import { tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { components } from '@/components/mdx-components';

export default function ClientPage({...}: ClientPageProps) {
  const { data: tinaData } = useTina({...});
  const post = tinaData.post;

  return (
    <article>
      <div data-tina-field={tinaField(post, 'body')}>
        <TinaMarkdown content={post.body} components={components} />
      </div>
    </article>
  );
}
```

## Custom MDX Components

### Create `components/mdx-components.tsx`

**Centralized component definitions for consistent rendering across all TinaMarkdown instances.**

```typescript
import { format } from 'date-fns';
import React from 'react';
import { Components, TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text';
import Image from 'next/image';
import { Prism } from 'tinacms/dist/rich-text/prism';
import { Video } from './blocks/video';
import { PageBlocksVideo } from '@/tina/__generated__/types';
import { Mermaid } from './blocks/mermaid';

export const components: Components<{
  BlockQuote: {
    children: TinaMarkdownContent;
    authorName: string;
  };
  DateTime: {
    format?: string;
  };
  NewsletterSignup: {
    placeholder: string;
    buttonText: string;
    children: TinaMarkdownContent;
    disclaimer?: TinaMarkdownContent;
  };
  video: PageBlocksVideo;
}> = {
  code_block: (props) => {
    if (!props) {
      return <></>;
    }

    if (props.lang === 'mermaid') {
      return <Mermaid value={props.value} />;
    }

    return <Prism lang={props.lang} value={props.value} />;
  },

  BlockQuote: (props: {
    children: TinaMarkdownContent;
    authorName: string;
  }) => {
    return (
      <div className="my-8 pl-4 border-l-4 border-gray-300">
        <blockquote className="italic text-gray-700">
          <TinaMarkdown content={props.children} />
          <footer className="mt-2 text-sm font-semibold">
            — {props.authorName}
          </footer>
        </blockquote>
      </div>
    );
  },

  DateTime: (props) => {
    const dt = React.useMemo(() => {
      return new Date();
    }, []);

    switch (props.format) {
      case 'iso':
        return <span>{format(dt, 'yyyy-MM-dd')}</span>;
      case 'utc':
        return <span>{format(dt, 'eee, dd MMM yyyy HH:mm:ss OOOO')}</span>;
      case 'local':
        return <span>{format(dt, 'P')}</span>;
      default:
        return <span>{format(dt, 'P')}</span>;
    }
  },

  NewsletterSignup: (props) => {
    return (
      <div className="bg-white my-8">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <TinaMarkdown content={props.children} />
          </div>
          <div className="mt-8">
            <form className="sm:flex">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email-address"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 border border-gray-300 shadow-xs placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:max-w-xs rounded-md"
                placeholder={props.placeholder}
              />
              <div className="mt-3 rounded-md shadow-sm sm:mt-0 sm:ml-3 sm:shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center py-3 px-5 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  {props.buttonText}
                </button>
              </div>
            </form>
            {props.disclaimer && (
              <div className="mt-3 text-sm text-gray-500">
                <TinaMarkdown content={props.disclaimer} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },

  img: (props) => {
    if (!props) {
      return <></>;
    }
    return (
      <span className="flex items-center justify-center my-4">
        <Image
          src={props.url}
          alt={props.alt || 'Image'}
          width={500}
          height={500}
          className="rounded-lg"
        />
      </span>
    );
  },

  mermaid: (props: any) => <Mermaid {...props} />,

  video: (props: PageBlocksVideo) => {
    return <Video data={props} />;
  },
};
```

### Using Custom Components

```typescript
import { tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { components } from '@/components/mdx-components';

export default function ClientPage({...}: ClientPageProps) {
  const { data: tinaData } = useTina({...});
  const post = tinaData.post;

  return (
    <article>
      <h1 data-tina-field={tinaField(post, 'title')}>
        {post.title}
      </h1>
      <div data-tina-field={tinaField(post, 'body')}>
        <TinaMarkdown content={post.body} components={components} />
      </div>
    </article>
  );
}
```

### Benefits of Centralized Components

- ✅ **Consistency**: Same styling across all markdown content
- ✅ **Reusability**: Import `components` in any page
- ✅ **Maintainability**: Update all markdown rendering from one file
- ✅ **Type Safety**: TypeScript definitions for custom templates
- ✅ **Scalability**: Easy to add new custom components

### Adding New Custom Components

```typescript
// components/mdx-components.tsx

export const components: Components<{
  // ... existing types
  Alert: {
    type: 'info' | 'warning' | 'error';
    children: TinaMarkdownContent;
  };
}> = {
  // ... existing components

  Alert: (props: {
    type: 'info' | 'warning' | 'error';
    children: TinaMarkdownContent;
  }) => {
    const styles = {
      info: 'bg-blue-100 text-blue-800 border-blue-300',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      error: 'bg-red-100 text-red-800 border-red-300',
    };

    return (
      <div className={`border-l-4 p-4 my-4 rounded ${styles[props.type]}`}>
        <TinaMarkdown content={props.children} />
      </div>
    );
  },
};
```

Then use in your schema:

```typescript
// tina/config.ts
{
  type: 'rich-text',
  name: 'body',
  templates: [
    {
      name: 'Alert',
      ui: {
        defaultItem: {
          type: 'info',
        },
      },
      fields: [
        {
          name: 'type',
          type: 'string',
          options: ['info', 'warning', 'error'],
        },
      ],
    },
  ],
}
```

## TypeScript Best Practices

### Generate Types

Use TinaCMS code generation to auto-generate types:

```bash
tinacms codegen
```

### Import Generated Types

```typescript
import { Post, PostQuery, PostQueryVariables } from "@/tina/__generated__/types";

interface ClientPageProps {
  query: string;
  data: PostQuery;
  variables: PostQueryVariables;
}
```

### Type useTina Hook

```typescript
import { PostQuery, PostQueryVariables } from "@/tina/__generated__/types";

interface ClientPageProps {
  query: string;
  data: PostQuery;
  variables: PostQueryVariables;
}

export default function ClientPage({
  query,
  data,
  variables,
}: ClientPageProps) {
  const { data: tinaData } = useTina({
    query,
    data,
    variables,
  });

  // tinaData.post is fully typed based on PostQuery
  const post = tinaData.post;
}
```

## Code Style and Patterns

### File Organization

```
src/
├── app/                    # Next.js App Router routes
│   ├── blog/
│   │   ├── [slug]/
│   │   │   ├── page.tsx           # Server component
│   │   │   └── client-page.tsx    # Client component
│   │   ├── page.tsx               # Index server
│   │   └── client-page.tsx        # Index client
├── components/
│   ├── ClientPage.tsx      # Reusable client component
│   └── mdx-components.tsx  # TinaMarkdown custom components
├── tina/
│   ├── config.ts           # TinaCMS config
│   └── __generated__/      # Auto-generated (don't edit)
└── utils/
    └── tina-client.ts      # TinaClient setup
```

### Naming Conventions

- **Files**: kebab-case (e.g., `client-page.tsx`, `mdx-components.tsx`)
- **Components**: PascalCase (e.g., `ClientPage`)
- **Fields**: camelCase (e.g., `postTitle`)
- **Queries**: camelCase (e.g., `postConnection`)
- **Types**: PascalCase (e.g., `Post`, `PostQuery`, `PostQueryVariables`)

### Component Structure

```typescript
"use client";

import { tinaField, useTina } from 'tinacms/dist/react';
import { PostQuery, PostQueryVariables } from "@/tina/__generated__/types";

interface ClientPageProps {
  query: string;
  data: PostQuery;
  variables: PostQueryVariables;
}

export default function ClientPage({
  query,
  data,
  variables,
}: ClientPageProps) {
  const { data: tinaData } = useTina({
    query,
    data,
    variables,
  });

  // Render content
  return <article>{/* render tinaData */}</article>;
}
```

## Error Handling

### Server-Side (page.tsx)

```typescript
import { notFound } from "next/navigation";

export default async function Page({ params }: PageProps) {
  try {
    const { query, data, variables } = await client.queries.post({
      relativePath: `${params.slug}.md`,
    });

    if (!data.post) {
      notFound();
    }

    return <ClientPage query={query} data={data} variables={variables} />;
  } catch (error) {
    console.error("Failed to fetch post:", error);
    notFound();
  }
}
```

### Client-Side

Since `useTina` only returns `data`, handle errors on the server side before passing to the client component.

```typescript
export default function ClientPage(props: ClientPageProps) {
  const { data: tinaData } = useTina({
    query: props.query,
    data: props.data,
    variables: props.variables,
  });

  // Data is guaranteed to be valid if passed from server
  return <article>{/* render tinaData */}</article>;
}
```

## Development Workflow

### Before Making Changes

1. Check existing patterns in the codebase
2. Review `/docs` for architecture and guidelines
3. Ensure changes align with project goals

### Making Changes

1. Make minimal, surgical changes - change only what's necessary
2. Follow existing code patterns and conventions
3. Update documentation if making structural changes
4. Test changes locally before committing

### After Making Changes

1. ✅ Verify TypeScript compiles: `tsc --noEmit`
2. ✅ Test TinaCMS locally in visual editing mode
3. ✅ Verify `tinaField()` attributes are correct
4. ✅ Test server and client components separately
5. ✅ Document significant changes
6. ✅ Commit with clear messages

### Commit Guidelines

```bash
# Small, focused commits
git add .
git commit -m "feat: Add blog post page with TinaCMS integration

- Create page.tsx for server-side data fetching
- Create client-page.tsx with useTina integration
- Add tinaField attributes for visual editing

Co-authored-by: Name <email@example.com>"
```

## Testing and Quality

### Before Committing

- ✅ TypeScript compiles without errors
- ✅ Components render correctly
- ✅ TinaCMS visual editing works
- ✅ All `tinaField()` calls match schema
- ✅ Error states handled on server
- ✅ No console errors or warnings

### Edge Cases to Consider

- Missing or null data from TinaCMS
- Network failures when fetching data
- Schema mismatches in tinaField
- Nested/optional fields with fallbacks
- Different data types (strings, arrays, objects)

## Patterns to Avoid

### ❌ Don't Do This

```typescript
// ❌ Calling client.queries in client component
"use client";
const data = await client.queries.post(); // Can't await here!

// ❌ Forgetting "use client" in client component
export default function ClientPage() {
  const { data } = useTina(); // useTina needs "use client"
}

// ❌ Using string literals for data-tina-field
<h1 data-tina-field="post.title">{post.title}</h1> // Use tinaField()!

// ❌ Omitting tinaField attributes
<h1>{post.title}</h1> // Can't click to edit!

// ❌ Rendering all UI in server component
export default async function Page() {
  return <h1>{data.post.title}</h1>; // No editing!
}

// ❌ Using any types for TinaCMS data
const tinaData: any = useData(); // Loses type safety

// ❌ Hardcoding relative paths
const data = await client.queries.post({
  relativePath: "fixed-post.md", // Not dynamic!
});

// ❌ Not destructuring variables from query response
const { query, data } = await client.queries.post({...});
// Missing: variables
```

### ✅ Do This Instead

```typescript
// ✅ Fetch in server, render in client
// page.tsx (server)
const { query, data, variables } = await client.queries.post({...});
return <ClientPage query={query} data={data} variables={variables} />;

// client-page.tsx (client)
const { data: tinaData } = useTina({ query, data, variables });

// ✅ Use "use client" in client components
"use client";
const { data } = useTina({...});

// ✅ Use tinaField() helper for data-tina-field
<h1 data-tina-field={tinaField(post, 'title')}>{post.title}</h1>

// ✅ Pass dynamic paths
const { query, data, variables } = await client.queries.post({
  relativePath: `${params.slug}.md`,
});

// ✅ Use generated types
import { PostQuery, PostQueryVariables } from "@/tina/__generated__/types";

interface ClientPageProps {
  query: string;
  data: PostQuery;
  variables: PostQueryVariables;
}
```

## Examples

### ✅ Good: Single Post Page

**page.tsx (Server)**
```typescript
import { client } from "@/tina/client";
import ClientPage from "./client-page";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    const { query, data, variables } = await client.queries.post({
      relativePath: `${params.slug}.md`,
    });

    if (!data.post) {
      notFound();
    }

    return <ClientPage query={query} data={data} variables={variables} />;
  } catch (error) {
    console.error("Failed to fetch post:", error);
    notFound();
  }
}
```

**client-page.tsx (Client)**
```typescript
"use client";

import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PostQuery, PostQueryVariables } from "@/tina/__generated__/types";
import { components } from '@/components/mdx-components';

interface ClientPageProps {
  query: string;
  data: PostQuery;
  variables: PostQueryVariables;
}

export default function ClientPage({ query, data, variables }: ClientPageProps) {
  const { data: tinaData } = useTina({
    query,
    data,
    variables,
  });

  const post = tinaData.post;

  return (
    <article>
      <h1 data-tina-field={tinaField(post, 'title')}>
        {post.title}
      </h1>
      <p data-tina-field={tinaField(post, 'description')}>
        {post.description}
      </p>
      <div data-tina-field={tinaField(post, 'body')}>
        <TinaMarkdown content={post.body} components={components} />
      </div>
    </article>
  );
}
```

### ✅ Good: Index Page

**page.tsx (Server)**
```typescript
import { client } from "@/tina/client";
import ClientPage from "./client-page";

export default async function BlogPage() {
  const { query, data, variables } = await client.queries.postConnection({
    first: 20,
  });

  return <ClientPage query={query} data={data} variables={variables} />;
}
```

**client-page.tsx (Client)**
```typescript
"use client";

import { tinaField, useTina } from 'tinacms/dist/react';
import Link from "next/link";
import { PostConnectionQuery, PostConnectionQueryVariables } from "@/tina/__generated__/types";

interface ClientPageProps {
  query: string;
  data: PostConnectionQuery;
  variables: PostConnectionQueryVariables;
}

export default function ClientPage({ query, data, variables }: ClientPageProps) {
  const { data: tinaData } = useTina({ query, data, variables });

  const edges = tinaData.postConnection.edges || [];

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {edges.map((edge: any) => (
          <li key={edge.node._sys.filename}>
            <Link href={`/blog/${edge.node._sys.filename}`}>
              <h2 data-tina-field={tinaField(edge.node, 'title')}>
                {edge.node.title}
              </h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Checklist

Before completing a feature:

- [ ] Server component fetches data with `await client.queries.xxx()`
- [ ] Server component destructures `{ query, data, variables }` from query response
- [ ] Server component passes `{ query, data, variables }` to client
- [ ] Client component has `"use client"` directive
- [ ] Client component uses `useTina()` hook
- [ ] Props typed as `<CollectionName>Query` and `<CollectionName>QueryVariables`
- [ ] All editable elements use `tinaField()` helper
- [ ] `tinaField()` paths match schema exactly
- [ ] TypeScript types imported from `@/tina/__generated__/types`
- [ ] Error handling implemented on server side
- [ ] Dynamic data passed (not hardcoded paths)
- [ ] TinaMarkdown used for rich text fields
- [ ] Custom components defined in `mdx-components.tsx`
- [ ] Tested in visual editing mode
- [ ] No console errors or TypeScript issues
- [ ] Documented if architectural changes made

## Questions?

- **TinaCMS Docs**: https://tina.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev/docs

Check existing pages in this repo for patterns and examples.

---

**Last Updated**: 2025-01-28
**Language**: TypeScript
**CMS**: TinaCMS
**UI**: React