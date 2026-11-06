import type { Collection } from 'tinacms';
import { heroBlockSchema } from '../blocks/hero';
import { contentBlockSchema } from '../blocks/content';
import { testimonialBlockSchema } from '../blocks/testimonial';
import { featureBlockSchema } from '../blocks/features';
import { videoBlockSchema } from '../blocks/video';
import { calloutBlockSchema } from '../blocks/callout';
import { statsBlockSchema } from '../blocks/stats';
import { ctaBlockSchema } from '../blocks/call-to-action';

const Page: Collection = {
  label: 'Pages',
  name: 'page',
  path: 'content/pages',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      const filepath = document._sys.breadcrumbs.join('/');
      if (filepath === 'home') {
        return '/';
      }
      return `/${filepath}`;
    },
  },
  fields: [
    {
      type: 'object',
      list: true,
      name: 'blocks',
      label: 'Sections',
      ui: {
        visualSelector: true,
      },
      templates: [
        heroBlockSchema,
        calloutBlockSchema,
        featureBlockSchema,
        statsBlockSchema,
        ctaBlockSchema,
        contentBlockSchema,
        testimonialBlockSchema,
        videoBlockSchema,
      ],
    },
  ],
};

export default Page;
