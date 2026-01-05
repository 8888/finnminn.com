import * as React from "react";
import "./styles.css";

export const Button = ({ children, className, ...props }: any) => {
  return (
    <button
      className={`px-6 py-2 uppercase font-bold tracking-wider bg-radical text-void hover:bg-void hover:text-radical hover:shadow-hard-pink border-2 border-transparent transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
