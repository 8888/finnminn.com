import React from 'react';
import { VesselGrid, VesselCard, Typography } from '@finnminn/ui';

export const Home: React.FC = () => {
  // Mock data for initial layout verification
  const plants = [
    { id: '1', species: 'Monstera Deliciosa', alias: 'Shadow King', status: 'Healthy' as const },
    { id: '2', species: 'Pothos', alias: 'Void Creeper', status: 'Thirsty' as const },
    { id: '3', species: 'Snake Plant', alias: 'Grave Spike', status: 'Distressed' as const },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Typography variant="h2" color="toxic">YOUR_VESSELS</Typography>
        <Typography variant="code" size="sm">ACTIVE_VESSELS: {plants.length}</Typography>
      </div>
      
      <VesselGrid>
        {plants.map((plant) => (
          <VesselCard
            key={plant.id}
            species={plant.species}
            alias={plant.alias}
            status={plant.status}
            onClick={() => console.log(`Opening ${plant.alias}`)}
          />
        ))}
      </VesselGrid>
    </div>
  );
};
