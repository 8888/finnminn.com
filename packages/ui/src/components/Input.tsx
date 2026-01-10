import * as React from "react";

export const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`
        bg-surface text-text-body font-body
        border-2 border-text-muted
        px-4 py-2
        focus:outline-none focus:border-vampire focus:shadow-pixel-vampire
        placeholder:text-text-muted/50
        transition-all duration-75
        w-full
        ${className || ""}
      `}
      {...props}
    />
  );
};
