import * as React from "react";

export const Typography = {
  H1: ({ children, className, ...props }: React.ComponentPropsWithoutRef<'h1'>) => {
    // Only apply glitch effect if children is a string (needed for data-text)
    const isString = typeof children === 'string';
    return (
      <h1 
        className={`text-4xl md:text-6xl pixel-shadow glow-vampire mb-4 ${isString ? 'glitch-hover' : ''} ${className || ""}`}
        data-text={isString ? children : undefined}
        {...props}
      >
        {children}
      </h1>
    );
  },
  H2: ({ children, className, ...props }: React.ComponentPropsWithoutRef<'h2'>) => (
    <h2 className={`text-2xl md:text-4xl mb-3 ${className || ""}`} {...props}>{children}</h2>
  ),
  H3: ({ children, className, ...props }: React.ComponentPropsWithoutRef<'h3'>) => (
    <h3 className={`text-xl md:text-2xl mb-2 ${className || ""}`} {...props}>{children}</h3>
  ),
  Body: ({ children, className, ...props }: React.ComponentPropsWithoutRef<'p'>) => (
    <p className={`font-body text-text-body mb-2 ${className || ""}`} {...props}>{children}</p>
  ),
  Code: ({ children, className, ...props }: React.ComponentPropsWithoutRef<'code'>) => (
    <code className={`font-body text-sm ${className || ""}`} {...props}>{children}</code>
  ),
};
