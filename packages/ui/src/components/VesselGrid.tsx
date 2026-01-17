import React from "react";

interface VesselGridProps {
  children: React.ReactNode;
}

export const VesselGrid: React.FC<VesselGridProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {children}
    </div>
  );
};
