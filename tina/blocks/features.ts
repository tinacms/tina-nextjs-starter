import type { Template } from 'tinacms';
import { iconSchema } from '../fields/icon';
import { sectionBlockSchemaField } from '../fields/section';

const defaultFeature = {
  title: "Here's Another Feature",
  text: "This is where you might talk about the feature, if this wasn't just filler text.",
  icon: {
    name: "Tina",
    color: "white",
    style: "float",
  }
};

export const featureBlockSchema: Template = {
  name: "features",
  label: "Features",
  ui: {
    previewSrc: "/blocks/features.png",
    defaultItem: {
      title: 'Built to cover your needs',
      description: 'We have a lot of features to cover your needs',
      items: [defaultFeature, defaultFeature, defaultFeature],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: "string",
      label: "Title",
      name: "title",
    },
    {
      type: "string",
      label: "Description",
      name: "description",
    },
    {
      type: "object",
      label: "Feature Items",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.title,
          };
        },
        defaultItem: {
          ...defaultFeature,
        },
      },
      fields: [
        iconSchema as any,
        {
          type: "string",
          label: "Title",
          name: "title",
        },
        {
          type: "rich-text",
          label: "Text",
          name: "text",
        },
      ],
    },
  ],
};
