"use client";
import {
  PageBlocksFeatures,
  PageBlocksFeaturesItems,
} from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { components } from "../mdx-components";
import { Icon } from "../icon";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Section } from "../layout/section";

export const Features = ({ data }: { data: PageBlocksFeatures }) => {
  return (
    <Section background={data.background!}>
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 data-tina-field={tinaField(data, 'title')} className="text-balance text-4xl font-semibold lg:text-5xl">{data.title}</h2>
          <p data-tina-field={tinaField(data, 'description')} className="mt-4">{data.description}</p>
        </div>
        <Card className="@min-4xl:max-w-full @min-4xl:grid-cols-3 @min-4xl:divide-x @min-4xl:divide-y-0 mx-auto mt-8 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 *:text-center md:mt-16">
          {data.items &&
            data.items.map(function (block, i) {
              return <Feature key={i} {...block!} />;
            })}
        </Card>
      </div>
    </Section>
  )
}

const CardDecorator = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]" />
    <div aria-hidden className="bg-radial to-background absolute inset-0 from-transparent to-75%" />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
  </div>
)

export const Feature: React.FC<PageBlocksFeaturesItems> = (data) => {
  return (
    <div className="group shadow-zinc-950/5">
      <CardHeader className="pb-3">
        <CardDecorator>
          {data.icon && (
            <Icon
              tinaField={tinaField(data, "icon")}
              data={{ size: "large", ...data.icon }}
            />
          )}
        </CardDecorator>

        <h3
          data-tina-field={tinaField(data, "title")}
          className="mt-6 font-medium"
        >
          {data.title}
        </h3>
      </CardHeader>

      <CardContent className="text-sm pb-8">
        <TinaMarkdown
          data-tina-field={tinaField(data, "text")}
          content={data.text}
          components={components}
        />
      </CardContent>
    </div>
  );
};
