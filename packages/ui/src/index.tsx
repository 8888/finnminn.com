import * as React from "react";
import "./styles.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
}

export const Button = ({ children, className, variant = "primary", ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-vampire text-void hover:shadow-pixel-vampire active:shadow-none",
    secondary: "bg-ectoplasm text-void hover:shadow-pixel-ectoplasm active:shadow-none",
    accent: "bg-witchcraft text-void hover:shadow-pixel-witchcraft active:shadow-none",
    ghost: "bg-transparent text-vampire border-vampire hover:bg-vampire hover:text-void hover:shadow-pixel-vampire active:shadow-none",
  };

  return (
    <button
      className={`
        px-6 py-2 
        font-header text-lg uppercase tracking-widest 
        border-2 border-void
        transition-all duration-75
        hover:-translate-x-0.5 hover:-translate-y-0.5
        active:translate-x-0.5 active:translate-y-0.5
        ${variants[variant]} 
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`bg-surface border-2 border-void shadow-pixel p-6 ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

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
