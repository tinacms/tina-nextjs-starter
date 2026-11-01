'use client';
import React from 'react';

import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { components } from '../mdx-components';
import { PageBlocksContent } from '../../tina/__generated__/types';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { Mermaid } from './mermaid';
import { ScriptCopyBtn } from '../magicui/script-copy-btn';

export const Content = ({ data }: { data: PageBlocksContent }) => {
  return (
    <Section background={data.background!} className='prose prose-lg' data-tina-field={tinaField(data, 'body')}>
      <TinaMarkdown
        content={data.body}
        components={{
          ...components,
          mermaid: (props: any) => <Mermaid {...props} />,
          scriptCopyBlock: (props: any) => <ScriptCopyBtn {...props} />,
        }}
      />
    </Section>
  );
};
