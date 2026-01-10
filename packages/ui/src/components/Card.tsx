import * as React from "react";

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
