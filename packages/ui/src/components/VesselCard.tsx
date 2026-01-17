import React from "react";
import { Card } from "./Card";
import { Typography } from "./Typography";
import { Badge } from "./Badge";
import { Image } from "./Image";

interface VesselCardProps {
  species: String;
  alias?: string;
  imageUrl?: string;
  status?: "Healthy" | "Thirsty" | "Distressed";
  onClick?: () => void;
}

export const VesselCard: React.FC<VesselCardProps> = ({
  species,
  alias,
  imageUrl,
  status = "Healthy",
  onClick,
}) => {
  const statusColor = {
    Healthy: "toxic",
    Thirsty: "radical",
    Distressed: "witchcraft",
  }[status] as "toxic" | "radical" | "witchcraft";

  return (
    <Card 
      variant="interactive" 
      onClick={onClick}
      className="flex flex-col gap-3 group overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden border-2 border-gloom/30 group-hover:border-witchcraft transition-colors">
        <Image 
          src={imageUrl || "/placeholder-vessel.jpg"} 
          alt={species as string}
          className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={statusColor}>{status.toUpperCase()}</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Typography variant="h3" color="witchcraft" className="truncate">
          {alias || species}
        </Typography>
        <Typography variant="code" size="xs" color="spirit" className="opacity-70 italic">
          {alias ? species : "Species Unknown"}
        </Typography>
      </div>
    </Card>
  );
};
