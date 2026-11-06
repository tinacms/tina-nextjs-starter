import type { Template } from 'tinacms';
import { sectionBlockSchemaField } from '../fields/section';

export const videoBlockSchema: Template = {
  name: 'video',
  label: 'Video',
  ui: {
    previewSrc: '/blocks/video.png',
    defaultItem: {
      url: 'https://www.youtube.com/watch?v=j8egYW7Jpgk',
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Color',
      name: 'color',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Tint', value: 'tint' },
        { label: 'Primary', value: 'primary' },
      ],
    },
    {
      type: 'string',
      label: 'Url',
      name: 'url',
    },
    {
      type: 'boolean',
      label: 'Auto Play',
      name: 'autoPlay',
    },
    {
      type: 'boolean',
      label: 'Loop',
      name: 'loop',
    },
  ],
};
