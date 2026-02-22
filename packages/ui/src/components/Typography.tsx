import * as React from "react";

export type TypographyVariant = "default" | "muted" | "witchcraft" | "vampire" | "ectoplasm" | "toxic" | "pip";
export type TypographySize = "xs" | "sm" | "md" | "lg" | "xl";

const variantClasses: Record<TypographyVariant, string> = {
  default: "text-text-body",
  muted: "text-text-muted",
  witchcraft: "text-witchcraft glow-witchcraft",
  vampire: "text-vampire glow-vampire",
  ectoplasm: "text-ectoplasm glow-ectoplasm",
  toxic: "text-toxic glow-toxic",
  pip: "text-pip glow-pip",
};

const sizeClasses: Record<TypographySize, string> = {
  xs: "text-[12px]", // Minimum legible size for VT323/Space Mono
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export interface TypographyProps {
  variant?: TypographyVariant;
  size?: TypographySize;
  className?: string;
  children?: React.ReactNode;
}

export const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps & React.ComponentPropsWithoutRef<'h1'>>(
  ({ children, className, variant = "default", ...props }, ref) => {
    const isString = typeof children === 'string';
    return (
      <h1
        ref={ref}
        className={`text-4xl md:text-6xl font-header pixel-shadow mb-4 ${variantClasses[variant]} ${isString ? 'glitch-hover' : ''} ${className || ""}`}
        data-text={isString ? children : undefined}
        {...props}
      >
        {children}
      </h1>
    );
  }
);

export const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps & React.ComponentPropsWithoutRef<'h2'>>(
  ({ children, className, variant = "default", ...props }, ref) => (
    <h2 ref={ref} className={`text-2xl md:text-4xl font-header mb-3 ${variantClasses[variant]} ${className || ""}`} {...props}>{children}</h2>
  )
);

export const H3 = React.forwardRef<HTMLHeadingElement, TypographyProps & React.ComponentPropsWithoutRef<'h3'>>(
  ({ children, className, variant = "default", ...props }, ref) => (
    <h3 ref={ref} className={`text-xl md:text-2xl font-header mb-2 ${variantClasses[variant]} ${className || ""}`} {...props}>{children}</h3>
  )
);

export const Body = React.forwardRef<HTMLParagraphElement, TypographyProps & React.ComponentPropsWithoutRef<'p'>>(
  ({ children, className, variant = "default", size = "md", ...props }, ref) => (
    <p ref={ref} className={`font-body ${variantClasses[variant]} ${sizeClasses[size]} mb-2 ${className || ""}`} {...props}>{children}</p>
  )
);

export const Code = React.forwardRef<HTMLElement, TypographyProps & React.ComponentPropsWithoutRef<'code'>>(
  ({ children, className, variant = "ectoplasm", size = "sm", ...props }, ref) => (
    <code ref={ref} className={`font-body ${variantClasses[variant]} ${sizeClasses[size]} bg-void/50 px-1 rounded ${className || ""}`} {...props}>{children}</code>
  )
);

export const Typography = {
  H1,
  H2,
  H3,
  Body,
  Code,
} as const;



