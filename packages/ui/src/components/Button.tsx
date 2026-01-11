import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
}

export const Button = ({ children, className, variant = "primary", ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-witchcraft text-void hover:shadow-pixel-witchcraft active:shadow-none",
    secondary: "bg-ectoplasm text-void hover:shadow-pixel-ectoplasm active:shadow-none",
    destructive: "bg-vampire text-void hover:shadow-pixel-vampire active:shadow-none",
    ghost: "bg-transparent text-text-body border-text-muted hover:bg-text-muted hover:text-void hover:shadow-pixel active:shadow-none",
  };

  return (
    <button
      className={`
        px-6 py-2 
        font-header text-lg tracking-widest 
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
