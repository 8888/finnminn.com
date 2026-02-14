import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Card } from '@finnminn/ui';
import { useAuth } from '@finnminn/auth';
import { usePlants } from '../hooks/usePlants';
import { HealthCheckModal } from '../components/HealthCheckModal';
import { Plant } from '../types/plant';

export const PlantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const { getIdToken } = useAuth();
  const { banishPlant } = usePlants();
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
        console.error("Plant not found in the Void:", id);
        setNotFound(true);
      }
    } catch (error) {
      console.error("Failed to fetch plant from the Void:", error);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, API_BASE, id]);

  useEffect(() => {
    fetchPlant();
  }, [fetchPlant]);

  const handleDelete = async () => {
    if (window.confirm("ARE YOU CERTAIN YOU WISH TO BANISH THIS SPECIMEN?")) {
      if (id && await banishPlant(id)) {
        navigate('/');
      }
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

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
        <Typography.H2 className="text-radical">
          SPECIMEN NOT FOUND
        </Typography.H2>
        <Typography.Body className="text-toxic/70">
          The plant with ID {id} could not be located in this realm.
        </Typography.Body>
        <Button 
          onClick={() => navigate('/')}
          variant="primary" 
          className="border-toxic text-toxic hover:bg-toxic/10"
        >
          RETURN TO COLLECTION
        </Button>
      </div>
    );
  }

  if (!plant) return null;

  return (
    <div className="space-y-8">
      {isHealthModalOpen && (
        <HealthCheckModal
          plantId={plant.id}
          plantAlias={plant.alias}
          onClose={() => setIsHealthModalOpen(false)}
          onSuccess={fetchPlant}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="w-full md:w-auto">
          <Button 
            onClick={() => navigate('/')}
            variant="primary" 
            className="mb-4 text-[10px] py-1 px-3 border-toxic/20 text-toxic/60"
          >
            ← RETURN TO COLLECTION
          </Button>
          <Typography.H1 className="text-toxic break-words">
            {plant.alias.toUpperCase()}
          </Typography.H1>
          <Typography.H3 className="text-witchcraft italic">
            {plant.species}
          </Typography.H3>
        </div>
        <Button 
          onClick={() => setIsHealthModalOpen(true)}
          variant="secondary" 
          className="text-xs py-2 px-6 w-full md:w-auto"
        >
          [ CHECK VITALITY ]
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

      <div className="flex justify-center pt-12 border-t border-toxic/10">
        <Button 
          onClick={handleDelete}
          variant="destructive" 
          className="text-[10px] py-1 px-4"
        >
          [ BANISH SPECIMEN ]
        </Button>
      </div>
    </div>
  );
};