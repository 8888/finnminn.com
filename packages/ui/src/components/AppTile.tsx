import * as React from "react";
import { Card } from "./Card";
import { Typography } from "./Typography";
import { Badge } from "./Badge";

export interface AppTileProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
  status?: "online" | "offline" | "beta" | "maintenance";
  variant?: "default" | "featured";
}

export const AppTile = ({
  title,
  href,
  icon,
  description,
  status,
  variant = "default",
  className,
  ...props
}: AppTileProps) => {
  const isFeatured = variant === "featured";

  return (
    <a
      href={href}
      className={`group block focus:outline-none focus:ring-4 focus:ring-witchcraft focus:ring-offset-2 focus:ring-offset-void ${className || ""}`}
      {...props}
    >
      <Card
        className={`
          h-full transition-all duration-200 relative overflow-hidden flex flex-col
          group-hover:-translate-y-1 group-hover:-translate-x-1
          group-hover:shadow-[6px_6px_0px_0px_#7D5FFF] group-hover:border-witchcraft
          ${isFeatured ? "border-witchcraft shadow-[4px_4px_0px_0px_#7D5FFF]" : ""}
        `}
      >
        {/* Status Indicator */}
        {status && (
          <div className="absolute top-4 right-4 z-10">
            <Badge variant={status === "online" ? "success" : status === "beta" ? "warning" : "default"}>
                {status.toUpperCase()}
            </Badge>
          </div>
        )}

        {/* Hover Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-witchcraft/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Icon Area */}
        <div className={`
            mb-4 p-3 w-fit border-2 border-void bg-surface/50 transition-colors duration-200
            group-hover:border-ectoplasm group-hover:bg-void
        `}>
             <div className="text-witchcraft group-hover:text-ectoplasm transition-colors duration-200">
                {icon || (
                    // Default generic "chip" icon if none provided
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h2v2H8V8zm0 4h2v2H8v-2zm0 4h2v2H8v-2zm4-8h2v2h-2V8zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-8h2v2h-2V8zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                    </svg>
                )}
             </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <Typography.H3 className="mb-2 group-hover:text-witchcraft transition-colors">
            {title}
          </Typography.H3>
          {description && (
            <Typography.Body className="text-sm text-text-muted group-hover:text-text-body transition-colors">
              {description}
            </Typography.Body>
          )}
        </div>

        {/* Decorative Corner Pixel */}
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-text-muted/20 group-hover:bg-ectoplasm transition-colors" />
      </Card>
    </a>
  );
};
