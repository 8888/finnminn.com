import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
  isCircle?: boolean;
}

export const Button = ({ children, className, variant = "primary", size = "md", isCircle = false, ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-witchcraft text-void hover:shadow-pixel-witchcraft active:shadow-none",
    secondary: "bg-ectoplasm text-void hover:shadow-pixel-ectoplasm active:shadow-none",
    destructive: "bg-vampire text-void hover:shadow-pixel-vampire active:shadow-none",
    ghost: "bg-transparent text-text-body border-text-muted hover:bg-text-muted hover:text-void hover:shadow-pixel active:shadow-none",
  };

  const sizes = {
    sm: isCircle ? "w-10 h-10 p-0" : "px-3 py-1 text-sm",
    md: isCircle ? "w-14 h-14 p-0" : "px-6 py-2 text-lg",
    lg: isCircle ? "w-24 h-24 p-0" : "px-10 py-4 text-2xl tracking-[0.2em]",
  };

  return (
    <button
      className={`
        font-header
        border-2 border-void
        ${isCircle ? "rounded-full flex items-center justify-center p-0" : "rounded-none"}
        transition-all duration-75
        hover:-translate-x-0.5 hover:-translate-y-0.5
        active:translate-x-0.5 active:translate-y-0.5
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none
        ${variants[variant]}
        ${sizes[size]}
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
