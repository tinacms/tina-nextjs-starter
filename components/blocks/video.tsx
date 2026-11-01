'use client';
import * as React from 'react';
import dynamic from 'next/dynamic';
import { PageBlocksVideo } from '@/tina/__generated__/types';
import { Section } from '../layout/section';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export const Video = ({ data }: { data: PageBlocksVideo }) => {
  if (!data.url) {
    return null;
  }
  return (
    <Section background={data.background!} className={`aspect-video ${data.color}`}>
      <ReactPlayer width='100%' height='100%' style={{ margin: 'auto' }} playing={!!data.autoPlay} loop={!!data.loop} controls={true} url={data.url} />
    </Section>
  );
};
