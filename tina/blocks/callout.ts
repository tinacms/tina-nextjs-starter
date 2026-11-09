import type { Template } from 'tinacms';
import { sectionBlockSchemaField } from '../fields/section';

export const calloutBlockSchema: Template = {
    name: 'callout',
    label: 'Callout',
    ui: {
        previewSrc: '/blocks/callout.png',
        defaultItem: {
            url: 'https://tina.io/editorial-workflow',
            text: 'Support for live editing and editorial workflow',
        },
    },
    fields: [
        sectionBlockSchemaField as any,
        {
            type: 'string',
            label: 'Text',
            name: 'text',
        },
        {
            type: 'string',
            label: 'Url',
            name: 'url',
        },
    ],
};
