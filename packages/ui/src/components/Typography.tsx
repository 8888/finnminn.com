import * as React from "react";

export type TypographyVariant = "default" | "muted" | "witchcraft" | "vampire" | "ectoplasm" | "toxic" | "pip";
export type TypographySize = "xs" | "sm" | "md" | "lg" | "xl";

const colorClasses: Record<TypographyVariant, string> = {
  default: "text-text-body",
  muted: "text-text-muted",
  witchcraft: "text-witchcraft",
  vampire: "text-vampire",
  ectoplasm: "text-ectoplasm",
  toxic: "text-toxic",
  pip: "text-pip",
};

const glowClasses: Partial<Record<TypographyVariant, string>> = {
  witchcraft: "glow-witchcraft",
  vampire: "glow-vampire",
  ectoplasm: "glow-ectoplasm",
  toxic: "glow-toxic",
  pip: "glow-pip",
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
  glow?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export type H1Component = React.ForwardRefExoticComponent<TypographyProps & React.ComponentPropsWithoutRef<'h1'> & React.RefAttributes<HTMLHeadingElement>>;
export type H2Component = React.ForwardRefExoticComponent<TypographyProps & React.ComponentPropsWithoutRef<'h2'> & React.RefAttributes<HTMLHeadingElement>>;
export type H3Component = React.ForwardRefExoticComponent<TypographyProps & React.ComponentPropsWithoutRef<'h3'> & React.RefAttributes<HTMLHeadingElement>>;
export type BodyComponent = React.ForwardRefExoticComponent<TypographyProps & React.ComponentPropsWithoutRef<'p'> & React.RefAttributes<HTMLParagraphElement>>;
export type CodeComponent = React.ForwardRefExoticComponent<TypographyProps & React.ComponentPropsWithoutRef<'code'> & React.RefAttributes<HTMLElement>>;

export const H1: H1Component = React.forwardRef<HTMLHeadingElement, TypographyProps & React.ComponentPropsWithoutRef<'h1'>>(
  ({ children, className, variant = "default", glow = true, ...props }, ref) => {
    const isString = typeof children === 'string';
    const classes = [
      "text-4xl md:text-6xl font-header pixel-shadow mb-4",
      colorClasses[variant],
      glow && glowClasses[variant],
      isString ? 'glitch-hover' : '',
      className
    ].filter(Boolean).join(" ");

    return (
      <h1
        ref={ref}
        className={classes}
        data-text={isString ? children : undefined}
        {...props}
      >
        {children}
      </h1>
    );
  }
);

export const H2: H2Component = React.forwardRef<HTMLHeadingElement, TypographyProps & React.ComponentPropsWithoutRef<'h2'>>(
  ({ children, className, variant = "default", glow = true, ...props }, ref) => (
    <h2
      ref={ref}
      className={`text-2xl md:text-4xl font-header mb-3 ${colorClasses[variant]} ${glow ? (glowClasses[variant] || "") : ""} ${className || ""}`}
      {...props}
    >
      {children}
    </h2>
  )
);

export const H3: H3Component = React.forwardRef<HTMLHeadingElement, TypographyProps & React.ComponentPropsWithoutRef<'h3'>>(
  ({ children, className, variant = "default", glow = true, ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-xl md:text-2xl font-header mb-2 ${colorClasses[variant]} ${glow ? (glowClasses[variant] || "") : ""} ${className || ""}`}
      {...props}
    >
      {children}
    </h3>
  )
);

export const Body: BodyComponent = React.forwardRef<HTMLParagraphElement, TypographyProps & React.ComponentPropsWithoutRef<'p'>>(
  ({ children, className, variant = "default", size = "md", glow = false, ...props }, ref) => (
    <p
      ref={ref}
      className={`font-body ${colorClasses[variant]} ${glow ? (glowClasses[variant] || "") : ""} ${sizeClasses[size]} mb-2 ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  )
);

export const Code: CodeComponent = React.forwardRef<HTMLElement, TypographyProps & React.ComponentPropsWithoutRef<'code'>>(
  ({ children, className, variant = "ectoplasm", size = "sm", glow = true, ...props }, ref) => (
    <code
      ref={ref}
      className={`font-body ${colorClasses[variant]} ${glow ? (glowClasses[variant] || "") : ""} ${sizeClasses[size]} bg-void/50 px-1 rounded ${className || ""}`}
      {...props}
    >
      {children}
    </code>
  )
);

export interface TypographyNamespace {
  H1: H1Component;
  H2: H2Component;
  H3: H3Component;
  Body: BodyComponent;
  Code: CodeComponent;
}

export const Typography: TypographyNamespace = {
  H1,
  H2,
  H3,
  Body,
  Code,
};




