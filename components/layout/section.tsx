import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionProps extends React.HTMLProps<HTMLElement> {
  background?: string;
  children: ReactNode;
}

export const Section: React.FC<SectionProps> = ({ className, children, background, ...props }) => {
  return (
    <div className={background || "bg-default"}>
      <section
        className={cn("py-12 mx-auto max-w-7xl px-6", className)}
        {...props}
      >
        {children}
      </section>
    </div>
  );
};
