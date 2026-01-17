import * as React from "react";
import { CommandBar, CommandBarProps } from "./CommandBar";
import { Typography } from "./Typography";

export interface AppLauncherProps {
  /** Props to pass to the internal CommandBar */
  navigation?: CommandBarProps;
  /** The collection of AppTiles */
  children: React.ReactNode;
  /** Optional title for the grid section */
  title?: string;
  /** Optional subtitle or welcome message */
  subtitle?: React.ReactNode;
}

export const AppLauncher = ({
  navigation,
  children,
  title = "LAUNCH_PAD",
  subtitle = "Select a module to initialize...",
}: AppLauncherProps) => {
  return (
    <div className="min-h-screen w-full bg-void flex flex-col relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="fixed inset-0 pointer-events-none">
             {/* Radial gradient to highlight the center content */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(125,95,255,0.08),_transparent_70%)]" />
             {/* Scanlines/Grid texture could go here if we had the asset */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-witchcraft/20 to-transparent" />
        </div>

      {/* Navigation Layer */}
      <div className="z-50 relative">
        <CommandBar {...navigation} />
      </div>

      {/* Main Content Area */}
      <main className="flex-grow z-10 px-4 py-8 md:py-16 overflow-y-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            
            {/* Header Section */}
            <div className="text-center space-y-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
                <Typography.H1 className="text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white to-text-muted drop-shadow-[0_0_10px_rgba(125,95,255,0.5)] mb-0">
                    {title}
                </Typography.H1>
                <div className="text-ectoplasm font-mono text-xs md:text-sm tracking-widest uppercase">
                    {subtitle}
                </div>
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                {children}
            </div>

            {/* Footer / Copyright */}
            <div className="mt-16 text-center opacity-40 hover:opacity-100 transition-opacity">
                 <Typography.Code className="text-xs text-text-muted">
                    SYSTEM STATUS: OPERATIONAL // {new Date().getFullYear()}
                 </Typography.Code>
            </div>
        </div>
      </main>
    </div>
  );
};
