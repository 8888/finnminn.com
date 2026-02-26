import * as React from "react";

export interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text";
  size?: "sm" | "md" | "lg" | "full";
}

export const Skeleton = ({ className, variant = "rect", size = "md" }: SkeletonProps) => {
  const baseClasses = "animate-pulse bg-overlay/20 border border-text-muted/10 shadow-inner-pixel relative overflow-hidden";

  const variants = {
    rect: "rounded-none",
    circle: "rounded-full",
    text: "rounded-sm h-[1em] mb-2 last:mb-0",
  };

  const sizes = {
    sm: "h-4 w-24",
    md: "h-8 w-48",
    lg: "h-12 w-64",
    full: "h-full w-full",
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${variant !== "text" ? sizes[size] : ""}
        ${className || ""}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-witchcraft/5 to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
};

export const Spinner = ({ className }: { className?: string }) => (
  <div
    className={`inline-block border-4 border-current border-t-transparent animate-spin ${className || "h-6 w-6"}`}
    style={{ borderRadius: '0', clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 20% 20%, 20% 80%, 80% 80%, 80% 20%, 20% 20%)' }}
    role="status"
  >
    <span className="sr-only">Loading...</span>
  </div>
);
