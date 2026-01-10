import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
}

export const Button = ({ children, className, variant = "primary", ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-vampire text-void hover:shadow-pixel-vampire active:shadow-none",
    secondary: "bg-ectoplasm text-void hover:shadow-pixel-ectoplasm active:shadow-none",
    accent: "bg-witchcraft text-void hover:shadow-pixel-witchcraft active:shadow-none animate-float group", // Added group for hover effects on children
    ghost: "bg-transparent text-vampire border-vampire hover:bg-vampire hover:text-void hover:shadow-pixel-vampire active:shadow-none",
  };

  return (
    <button
      className={`
        relative overflow-visible
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
      {variant === 'accent' && (
        <span className="absolute inset-0 w-full h-full bg-sparkles opacity-20 pointer-events-none mix-blend-screen" />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
