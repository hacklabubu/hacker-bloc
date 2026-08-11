import type { ReactNode } from "react";

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-10 font-heading text-3xl leading-tight uppercase text-beige sm:text-4xl">
      {children}
    </h2>
  );
}
