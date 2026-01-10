import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "info";
}

export const Badge = ({ children, className, variant = "info", ...props }: BadgeProps) => {
  const variants = {
    success: "bg-ectoplasm text-void border-ectoplasm",
    warning: "bg-gold text-void border-gold",
    error: "bg-vampire text-void border-vampire",
    info: "bg-witchcraft text-void border-witchcraft",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-2 py-0.5
        font-header text-xs uppercase tracking-wider
        border-2
        ${variants[variant]}
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </span>
  );
};
