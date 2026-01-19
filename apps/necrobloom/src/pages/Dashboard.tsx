import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Card } from '@finnminn/ui';
import { useAuth } from '@finnminn/auth';
import { AddPlantModal } from '../components/AddPlantModal';
import { HealthCheckModal } from '../components/HealthCheckModal';
import { usePlants } from '../hooks/usePlants';

interface HealthReport {
  date: string;
  healthStatus: string;
  imageUrl: string;
}

interface Plant {
  id: string;
  alias: string;
  species: string;
  historicalReports: Array<HealthReport>;
}

export const Dashboard: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getIdToken } = useAuth();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || '';

  const fetchPlants = useCallback(async () => {
    try {
      const token = await getIdToken();
      const response = await fetch(`${API_BASE}/api/plants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPlants(data);
      }
    } catch (error) {
      console.error("Failed to fetch plants from the Void:", error);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, API_BASE]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Typography.H1 className="text-toxic glow-ectoplasm">
            COLLECTION FROM THE VOID
          </Typography.H1>
          <Typography.Body className="text-toxic/40">
            {plants.length} specimens currently under observation.
          </Typography.Body>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          variant="primary" 
          className="border-toxic text-toxic hover:bg-toxic/10"
        >
          + RESURRECT NEW SPECIMEN
        </Button>
      </div>

      {isModalOpen && (
        <AddPlantModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchPlants}
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64 animate-pulse border-toxic/10 bg-toxic/5" />
          ))}
        </div>
      ) : plants.length === 0 ? (
        <Card className="p-12 border-dashed border-toxic/20 text-center space-y-4">
          <Typography.H3 className="text-toxic/30">
            THE VOID IS EMPTY
          </Typography.H3>
          <Typography.Body className="text-toxic/20">
            No floral spirits have been bound yet.
          </Typography.Body>
          <Button variant="primary" className="opacity-50">
            [ INITIAITE FIRST RITUAL ]
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <Card 
              key={plant.id.toString()} 
              className="p-4 border-toxic/30 hover:border-toxic transition-colors group cursor-pointer"
              onClick={() => navigate(`/plant/${plant.id}`)}
            >
              <div className="aspect-video bg-void border border-toxic/10 mb-4 overflow-hidden relative group">
                {plant.historicalReports[0]?.imageUrl ? (
                  <img 
                    src={plant.historicalReports[0].imageUrl} 
                    alt={plant.alias}
                    className="w-full h-full object-cover transition-all"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-toxic/10 text-xs">
                    [ NO VISUAL DATA ]
                  </div>
                )}
              </div>
              <Typography.H3 className="text-toxic truncate">
                {plant.alias.toUpperCase()}
              </Typography.H3>
              <Typography.Body className="text-witchcraft text-xs italic mb-4">
                {plant.species}
              </Typography.Body>
              <div className="flex justify-between items-center text-[10px] text-toxic/40 font-mono mb-4">
                <span>VITALITY: {plant.historicalReports.length > 0 ? (plant.historicalReports[plant.historicalReports.length - 1]?.healthStatus?.substring(0, 15) + "...") : "NO DATA"}</span>
                <span>ID: {plant.id.toString().substring(0, 8)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
