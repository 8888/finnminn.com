import { useCallback } from 'react';
import { useAuth } from '@finnminn/auth';

export const usePlants = () => {
  const { getIdToken } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || '';

  const banishPlant = useCallback(async (plantId: string) => {
    if (!window.confirm("ARE YOU SURE YOU WISH TO BANISH THIS SPECIMEN BACK TO THE VOID?")) {
      return false;
    }

    try {
      const token = await getIdToken();
      if (!token) return false;
      const response = await fetch(`${API_BASE}/api/plants/${plantId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        return true;
      } else {
        alert("THE SPIRITS REFUSE TO LET GO.");
        return false;
      }
    } catch (error) {
      console.error("The ritual of banishment failed:", error);
      alert("A disturbance in the Void prevented the banishment.");
      return false;
    }
  }, [getIdToken, API_BASE]);

  return {
    banishPlant,
  };
};
