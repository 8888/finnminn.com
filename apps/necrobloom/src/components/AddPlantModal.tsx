import React, { useState } from 'react';
import { Card, Typography, Button, Input } from '@finnminn/ui';
import { useAuth } from '@finnminn/auth';

interface AddPlantModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [identifying, setIdentifying] = useState(false);
  const [oracleWhisper, setOracleWhisper] = useState('');
  const { getToken } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const [formData, setFormData] = useState({
    alias: '',
    species: '',
    zip: '',
    lighting: 'Indirect',
    image: ''
  });

  const identifyPlant = async (base64: string) => {
    setIdentifying(true);
    setOracleWhisper('');
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/identify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ image: base64 })
      });
      
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ 
          ...prev, 
          species: data.species,
          alias: prev.alias || data.scientificName 
        }));
        setOracleWhisper(data.description);
      }
    } catch (e) {
      console.error("The Oracle is silent...", e);
    } finally {
      setIdentifying(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, image: result }));
        // Removed automatic identifyPlant(result)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentifyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (formData.image) {
      identifyPlant(formData.image);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert("Visual data required for manifestation.");

    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/api/plants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const err = await response.text();
        alert(`Ritual failed: ${err}`);
      }
    } catch (error) {
      alert("Connection to the Void lost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
      <Card className="max-w-lg w-full p-6 border-toxic animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <Typography.H2 className="text-toxic">
            [ NEW RITUAL ]
          </Typography.H2>
          <button onClick={onClose} className="text-toxic/40 hover:text-radical transition-colors">
            [ ESCAPE ]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-toxic/40 uppercase tracking-widest">Nickname</label>
              <input 
                required
                className="w-full bg-void border border-toxic/20 p-2 text-toxic focus:border-toxic outline-none font-mono"
                placeholder="E.g. GHOST FERN"
                value={formData.alias}
                onChange={e => setFormData(prev => ({ ...prev, alias: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-toxic/40 uppercase tracking-widest">Species {identifying && <span className="animate-pulse text-radical">[ SCANNING... ]</span>}</label>
              <input 
                className="w-full bg-void border border-toxic/20 p-2 text-toxic focus:border-toxic outline-none font-mono"
                placeholder="E.g. Pteris"
                value={formData.species}
                onChange={e => setFormData(prev => ({ ...prev, species: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-toxic/40 uppercase tracking-widest">Climate (Zip Code)</label>
              <input 
                required
                className="w-full bg-void border border-toxic/20 p-2 text-toxic focus:border-toxic outline-none font-mono"
                placeholder="12345"
                value={formData.zip}
                onChange={e => setFormData(prev => ({ ...prev, zip: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-toxic/40 uppercase tracking-widest">Lighting Environment</label>
              <select 
                className="w-full bg-void border border-toxic/20 p-2 text-toxic focus:border-toxic outline-none font-mono"
                value={formData.lighting}
                onChange={e => setFormData(prev => ({ ...prev, lighting: e.target.value }))}
              >
                <option value="Direct">Direct Sun</option>
                <option value="Indirect">Indirect / Ethereal</option>
                <option value="Low">Deep Shadow</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-toxic/40 uppercase tracking-widest">Visual Incarnation (Photo)</label>
            <div className="border border-dashed border-toxic/30 aspect-video relative overflow-hidden bg-toxic/5 flex items-center justify-center">
              {formData.image ? (
                <>
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover grayscale" />
                  {identifying && (
                    <div className="absolute inset-0 bg-void/50 flex items-center justify-center backdrop-blur-sm">
                      <Typography.Body className="text-radical animate-pulse">CONSULTING ORACLE...</Typography.Body>
                    </div>
                  )}
                  {!identifying && (
                    <button 
                      onClick={handleIdentifyClick}
                      className="absolute bottom-2 right-2 bg-void/80 border border-toxic text-toxic px-2 py-1 text-[10px] uppercase hover:bg-toxic hover:text-void transition-colors"
                    >
                      [ IDENTIFY ]
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <Typography.Body className="text-toxic/20 text-xs">
                    SELECT FILE TO BIND
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
            {oracleWhisper && (
              <div className="p-2 border border-toxic/20 bg-toxic/5 text-xs text-toxic font-mono">
                <span className="text-radical">[ ORACLE ]</span> {oracleWhisper}
              </div>
            )}
          </div>

          <Button 
            disabled={loading}
            variant="primary" 
            className="w-full py-4 border-toxic text-toxic hover:bg-toxic/10 mt-4"
          >
            {loading ? "BINDING SPIRIT..." : "[ COMMENCE MANIFESTATION ]"}
          </Button>
        </form>
      </Card>
    </div>
  );
};
