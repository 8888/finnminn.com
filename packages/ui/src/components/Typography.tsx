import * as React from "react";

export const Typography = {
  H1: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <h1 className={`text-4xl md:text-6xl pixel-shadow glow-vampire mb-4 ${className || ""}`}>{children}</h1>
  ),
  H2: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <h2 className={`text-2xl md:text-4xl mb-3 ${className || ""}`}>{children}</h2>
  ),
  Body: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <p className={`font-body text-text-body mb-2 ${className || ""}`}>{children}</p>
  ),
};
