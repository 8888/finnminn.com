import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Card } from '@finnminn/ui';
import { useAuth } from '@finnminn/auth';

interface Plant {
  id: string;
  alias: string;
  species: string;
  historicalReports: Array<{
    date: string;
    healthStatus: string;
    imageUrl: string;
  }>;
  carePlan?: {
    waterFrequency: string;
    lightNeeds: string;
    toxicity: string;
    additionalNotes: string;
  };
}

export const PlantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const { getIdToken } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || '';

  const fetchPlant = useCallback(async () => {
    try {
      const token = await getIdToken();
      const response = await fetch(`${API_BASE}/api/plants/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPlant(data);
      } else if (response.status === 404) {
        console.error("Plant not found in the Void.");
        navigate('/');
      }
    } catch (error) {
      console.error("Failed to fetch plant from the Void:", error);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, API_BASE, id, navigate]);

  useEffect(() => {
    fetchPlant();
  }, [fetchPlant]);

  const handleDelete = async () => {
    if (!window.confirm("ARE YOU SURE YOU WISH TO BANISH THIS SPECIMEN BACK TO THE VOID?")) return;

    try {
      const token = await getIdToken();
      const response = await fetch(`${API_BASE}/api/plants/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        navigate('/');
      } else {
        alert("THE SPIRITS REFUSE TO LET GO. (Delete failed)");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Typography.Body className="animate-pulse text-toxic">
          COMMUNING WITH THE PLANT SPIRIT...
        </Typography.Body>
      </div>
    );
  }

  if (!plant) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <Button 
            onClick={() => navigate('/')}
            variant="primary" 
            className="mb-4 text-[10px] py-1 border-toxic/20 text-toxic/60"
          >
            ← RETURN TO COLLECTION
          </Button>
          <Typography.H1 className="text-toxic">
            {plant.alias.toUpperCase()}
          </Typography.H1>
          <Typography.H3 className="text-witchcraft italic">
            {plant.species}
          </Typography.H3>
        </div>
        <Button 
          onClick={handleDelete}
          variant="primary" 
          className="border-radical text-radical hover:bg-radical/10 text-[10px] py-1"
        >
          [ BANISH SPECIMEN ]
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Image and Care Plan */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden border-toxic/30">
            <div className="aspect-video bg-void relative">
              {plant.historicalReports[0]?.imageUrl ? (
                <img 
                  src={plant.historicalReports[0].imageUrl} 
                  alt={plant.alias}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-toxic/20">
                  [ NO VISUAL DATA ]
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 border-toxic/20 bg-toxic/5">
            <Typography.H3 className="text-toxic mb-4 border-b border-toxic/10 pb-2">
              CARE RITUALS
            </Typography.H3>
            {plant.carePlan ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography.Body className="text-toxic/40 text-[10px] uppercase font-mono">Watering Frequency</Typography.Body>
                  <Typography.Body className="text-toxic">{plant.carePlan.waterFrequency}</Typography.Body>
                </div>
                <div>
                  <Typography.Body className="text-toxic/40 text-[10px] uppercase font-mono">Light Requirements</Typography.Body>
                  <Typography.Body className="text-toxic">{plant.carePlan.lightNeeds}</Typography.Body>
                </div>
                <div>
                  <Typography.Body className="text-toxic/40 text-[10px] uppercase font-mono">Toxicity Level</Typography.Body>
                  <Typography.Body className="text-radical">{plant.carePlan.toxicity}</Typography.Body>
                </div>
                <div>
                  <Typography.Body className="text-toxic/40 text-[10px] uppercase font-mono">Notes from the Oracle</Typography.Body>
                  <Typography.Body className="text-toxic/80 italic text-sm">{plant.carePlan.additionalNotes}</Typography.Body>
                </div>
              </div>
            ) : (
              <Typography.Body className="text-toxic/30 italic">No care rituals have been transcribed yet.</Typography.Body>
            )}
          </Card>
        </div>

        {/* History / Reports */}
        <div className="space-y-6">
          <Typography.H3 className="text-toxic border-b border-toxic/10 pb-2">
            CHRONICLES
          </Typography.H3>
          <div className="space-y-4">
            {plant.historicalReports.map((report, idx) => (
              <Card key={idx} className="p-4 border-toxic/10 bg-void hover:border-toxic/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <Typography.Body className="text-witchcraft text-[10px] font-mono">
                    {new Date(report.date).toLocaleDateString()}
                  </Typography.Body>
                </div>
                <Typography.Body className="text-toxic/80 text-xs leading-relaxed">
                  {report.healthStatus}
                </Typography.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
