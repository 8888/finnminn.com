import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "magic";
}

export const Card = ({ children, className, variant = "default", ...props }: CardProps) => {
  const variants = {
    default: "bg-surface/90 backdrop-blur-sm border-void shadow-pixel",
    magic: "bg-surface/90 backdrop-blur-sm border-witchcraft shadow-[4px_4px_0px_0px_#7D5FFF,8px_8px_0px_0px_rgba(125,95,255,0.3)] relative overflow-hidden",
  };

  return (
    <div 
      className={`border-2 p-6 ${variants[variant]} ${className || ""}`}
      {...props}
    >
       {variant === 'magic' && (
         <>
            <div className="absolute top-0 right-0 p-1">
                <div className="w-2 h-2 bg-witchcraft animate-pulse"/>
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-witchcraft to-transparent opacity-50" />
         </>
       )}
      {children}
    </div>
  );
};
