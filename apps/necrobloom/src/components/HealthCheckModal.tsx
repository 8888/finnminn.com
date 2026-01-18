import React, { useState } from 'react';
import { Card, Typography, Button } from '@finnminn/ui';
import { useAuth } from '@finnminn/auth';

interface HealthCheckModalProps {
  plantId: string;
  plantAlias: string;
  onClose: () => void;
  onSuccess: (updatedPlant: any) => void;
}

export const HealthCheckModal: React.FC<HealthCheckModalProps> = ({ plantId, plantAlias, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const { getToken } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || '';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setDiagnosis('');
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/api/plants/${plantId}/health-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ image })
      });

      if (response.ok) {
        const updatedPlant = await response.json();
        const latestReport = updatedPlant.historicalReports[updatedPlant.historicalReports.length - 1];
        setDiagnosis(latestReport.healthStatus);
        onSuccess(updatedPlant);
      } else {
        const err = await response.text();
        alert(`Failed to check vitality: ${err}`);
      }
    } catch (error) {
      alert("Communication with the Void failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
      <Card className="max-w-md w-full p-6 border-toxic animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <Typography.H2 className="text-toxic">
            [ VITALITY SCAN ]
          </Typography.H2>
          <button onClick={onClose} className="text-toxic/40 hover:text-radical transition-colors">
            [ ESCAPE ]
          </button>
        </div>

        <Typography.Body className="text-witchcraft text-xs mb-4">
          CONSULTING THE SPIRIT OF: {plantAlias.toUpperCase()}
        </Typography.Body>

        {!diagnosis ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-toxic/40 uppercase tracking-widest">Current Image (Vitality Data)</label>
              <div className="border border-dashed border-toxic/30 aspect-square relative overflow-hidden bg-toxic/5 flex items-center justify-center">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover grayscale" />
                ) : (
                  <div className="text-center">
                    <Typography.Body className="text-toxic/20 text-xs">
                      CAPTURE CURRENT STATE
                    </Typography.Body>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <Button 
              disabled={loading || !image}
              variant="primary" 
              className="w-full py-4 border-toxic text-toxic hover:bg-toxic/10 mt-4"
            >
              {loading ? "COMMUNING WITH VOID..." : "[ ANALYZE VITALITY ]"}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 border border-toxic bg-toxic/5 font-mono text-sm text-toxic">
              <span className="text-radical block mb-2">[ DIAGNOSIS ]</span>
              {diagnosis}
            </div>
            <Button 
              onClick={onClose}
              variant="primary" 
              className="w-full py-4 border-toxic text-toxic hover:bg-toxic/10"
            >
              [ ACKNOWLEDGED ]
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
