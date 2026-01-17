import * as React from "react";

const FIREFLIES = Array.from({ length: 12 }, (_, i) => i);

export const Atmosphere = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
       {FIREFLIES.map((i) => (
         <div key={i} className="firefly" />
       ))}
    </div>
  );
};
