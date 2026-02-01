import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Card } from '@finnminn/ui';
import { useAuth } from '@finnminn/auth';
import { AddPlantModal } from '../components/AddPlantModal';
import { VesselHeader } from '../components/VesselHeader';
import { VitalityMeter } from '../components/VitalityMeter';
import { CohortSection } from '../components/CohortSection';
import { Plant, HealthStatus } from '../types/plant';
import { getPlantHealth, mapWateringFrequency, sortPlantsByNeglect } from '../utils/plantLogic';

type SortOption = 'alpha' | 'neglect';

export const Dashboard: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<HealthStatus | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('alpha');
  
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

  const filteredAndSortedPlants = useMemo(() => {
    let result = [...plants];

    // Filter by health status if active
    if (activeFilter) {
      result = result.filter(p => getPlantHealth(p) === activeFilter);
    }

    // Sort
    if (sortBy === 'alpha') {
      result.sort((a, b) => a.alias.localeCompare(b.alias));
    } else {
      result.sort(sortPlantsByNeglect);
    }

    return result;
  }, [plants, activeFilter, sortBy]);

  const cohorts = useMemo(() => {
    const groups: Record<string, Plant[]> = {
      'Daily Rituals': [],
      'Weekly Cycles': [],
      'Bi-Weekly Rhythms': [],
      'Monthly Communions': [],
      'Strange Rhythms': [],
      'UNBOUND FREQUENCIES': []
    };

    filteredAndSortedPlants.forEach(plant => {
      const cohort = mapWateringFrequency(plant.carePlan?.waterFrequency);
      if (groups[cohort]) {
        groups[cohort].push(plant);
      } else {
        groups['Strange Rhythms'].push(plant);
      }
    });

    return groups;
  }, [filteredAndSortedPlants]);

  return (
    <div className="space-y-4">
      <VesselHeader plants={plants} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex-1 w-full max-w-2xl">
          <VitalityMeter 
            plants={plants} 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-void border border-toxic/30 text-toxic text-xs p-2 font-mono outline-none focus:border-toxic"
          >
            <option value="alpha">SORT: ALPHABETICAL</option>
            <option value="neglect">SORT: NEGLECT LEVEL</option>
          </select>
          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="primary" 
            className="text-xs py-2 border-toxic text-toxic hover:bg-toxic/10 whitespace-nowrap"
          >
            + RESURRECT SPECIMEN
          </Button>
        </div>
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
      ) : filteredAndSortedPlants.length === 0 ? (
        <div className="py-20 text-center">
          <Typography.H3 className="text-radical/40 mb-2">NO SPECIMENS MATCH THIS STATE</Typography.H3>
          <Button onClick={() => setActiveFilter(null)} variant="primary" className="text-xs">
            [ CLEAR VITALITY FILTER ]
          </Button>
        </div>
      ) : (
        Object.entries(cohorts).map(([title, cohortPlants]) => (
          <CohortSection key={title} title={title} count={cohortPlants.length}>
            {cohortPlants.map((plant) => (
              <Card 
                key={plant.id} 
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
                  {/* Health Badge Overlay */}
                  <div className={`absolute top-2 right-2 px-2 py-0.5 text-[8px] font-bold uppercase rounded-sm border ${
                    getPlantHealth(plant) === 'thriving' ? 'bg-ectoplasm/80 text-void border-ectoplasm' :
                    getPlantHealth(plant) === 'in-peril' ? 'bg-radical/80 text-void border-radical' :
                    'bg-witchcraft/80 text-void border-witchcraft'
                  }`}>
                    {getPlantHealth(plant)}
                  </div>
                </div>
                <Typography.H3 className="text-toxic truncate">
                  {plant.alias.toUpperCase()}
                </Typography.H3>
                <Typography.Body className="text-witchcraft text-xs italic mb-4">
                  {plant.species}
                </Typography.Body>
                <div className="flex justify-between items-center text-[10px] text-toxic/40 font-mono">
                  <span>LAST AUDIT: {plant.historicalReports.length > 0 ? new Date(plant.historicalReports[plant.historicalReports.length - 1].date).toLocaleDateString() : 'NEVER'}</span>
                  <span>ID: {plant.id.substring(0, 8)}</span>
                </div>
              </Card>
            ))}
          </CohortSection>
        ))
      )}
    </div>
  );
};