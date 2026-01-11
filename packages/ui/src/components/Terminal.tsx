import * as React from "react";

export const Terminal = ({ title = "TERMINAL_V1.0", children, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { title?: string }) => {
  return (
    <div className={`relative bg-void border-2 border-text-muted/20 shadow-pixel overflow-hidden ${className || ""}`} {...props}>
      <div className="bg-text-muted/20 px-4 py-1 flex items-center justify-between border-b-2 border-text-muted/20">
        <span className="font-header text-sm text-text-muted tracking-widest">{title}</span>
        <div className="flex gap-2">
           <div className="w-3 h-3 bg-vampire rounded-none"></div>
           <div className="w-3 h-3 bg-ectoplasm rounded-none"></div>
        </div>
      </div>
      <div className="p-4 font-body text-ectoplasm scanlines relative min-h-[150px]">
        {children}
      </div>
    </div>
  );
};
