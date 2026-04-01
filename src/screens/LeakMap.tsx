import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Construction, 
  History, 
  Layers, 
  Rotate3d,
  Navigation,
  Droplets
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a custom icon that keeps the original glowing aesthetic
const anomalyIcon = L.divIcon({
  className: 'custom-anomaly-icon',
  html: `<div class="relative w-8 h-8 group cursor-pointer">
    <div class="absolute inset-0 bg-error/40 rounded-full animate-ping"></div>
    <div class="absolute inset-0 m-auto w-4 h-4 bg-error rounded-full border-2 border-[#0c1517] shadow-[0_0_15px_rgba(255,180,171,0.8)]"></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Component to handle map center updates when searched
const MapCenterUpdater: React.FC<{ center: [number, number] | null }> = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, 13);
    }
  }, [center, map]);
  return null;
};

// Component to handle map move events
const MapEventHandler: React.FC<{ onMoveEnd: (center: L.LatLng) => void }> = ({ onMoveEnd }) => {
  const map = useMap();
  
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMoveEnd = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onMoveEnd(map.getCenter());
      }, 800); // debounce API calls
    };
    
    map.on('moveend', handleMoveEnd);
    return () => {
      map.off('moveend', handleMoveEnd);
      clearTimeout(timeout);
    };
  }, [map, onMoveEnd]);
  
  return null;
};

type PipeStatus = 'optimal' | 'elevated' | 'critical';

interface PipeNetwork {
  id: string;
  path: [number, number][]; // LatLng tuple array
  status: PipeStatus;
  flowRate: 'slow' | 'normal' | 'fast';
  color: string;
}

const generatePipes = (lat: number, lng: number): PipeNetwork[] => {
  const hash = Math.abs(Math.sin(lat * 12.9 + lng * 78.2)) * 10000;
  
  const pipes: PipeNetwork[] = [];
  
  const mainNodes: [number, number][] = [
    [lat + 0.015, lng + 0.02],
    [lat + 0.02, lng - 0.015],
    [lat - 0.015, lng - 0.025],
    [lat - 0.02, lng + 0.01]
  ];

  const colors = {
    optimal: '#2ddbde', // primary
    elevated: '#f59e0b', // amber
    critical: '#ffb4ab' // error
  };

  mainNodes.forEach((node, i) => {
    // Generate branching pseudo-randomly
    const isCritical = (hash + i) % 10 > 8;
    const isElevated = (hash + i) % 10 > 5 && !isCritical;
    const status = isCritical ? 'critical' : isElevated ? 'elevated' : 'optimal';
    
    // Main paths from center out
    pipes.push({
      id: `main-${i}`,
      path: [[lat, lng], [node[0], node[1]]],
      status: status,
      flowRate: isCritical ? 'fast' : isElevated ? 'normal' : 'slow',
      color: colors[status]
    });

    // Sub branches returning or diverging
    pipes.push({
      id: `sub-${i}-1`,
      path: [[node[0], node[1]], [node[0] + (i % 2 === 0 ? 0.01 : -0.01), node[1] + (i > 1 ? 0.01 : -0.01)]],
      status: status === 'critical' ? 'elevated' : 'optimal',
      flowRate: 'normal',
      color: colors[status === 'critical' ? 'elevated' : 'optimal']
    });

    pipes.push({
      id: `sub-${i}-2`,
      path: [[node[0], node[1]], [node[0] - (i % 2 === 0 ? 0.01 : -0.01), node[1] - (i > 1 ? 0.01 : -0.01)]],
      status: 'optimal',
      flowRate: 'slow',
      color: colors.optimal
    });
  });

  // Cross links connecting nodes
  pipes.push({
    id: `cross-1`,
    path: [mainNodes[0], mainNodes[1]],
    status: 'elevated',
    flowRate: 'fast',
    color: colors.elevated
  });
  pipes.push({
    id: `cross-2`,
    path: [mainNodes[2], mainNodes[3]],
    status: 'optimal',
    flowRate: 'normal',
    color: colors.optimal
  });

  return pipes;
};

const getBearing = (startLat: number, startLng: number, destLat: number, destLng: number) => {
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const destLatRad = (destLat * Math.PI) / 180;
  const destLngRad = (destLng * Math.PI) / 180;

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);

  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
};

export const LeakMap: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeLayer, setActiveLayer] = useState('Layers');
  const [currentCoords, setCurrentCoords] = useState<L.LatLng>(new L.LatLng(37.7749, -122.4194));
  const [locationName, setLocationName] = useState('San Francisco');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedCenter, setSearchedCenter] = useState<[number, number] | null>(null);

  // Reverse geocoding when map is panned
  const handleMapMove = async (center: L.LatLng) => {
    setCurrentCoords(center);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}`);
      const data = await res.json();
      if (data && data.address) {
        const name = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county || 'Unknown Region';
        setLocationName(name);
      } else {
        setLocationName('Uncharted Territory');
      }
    } catch {
      // Silently fail if rate limited
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setSearchedCenter([lat, lon]);
        setLocationName(data[0].display_name.split(',')[0]);
        setCurrentCoords(new L.LatLng(lat, lon));
      } else {
        toast.error('Location not found');
      }
    } catch (error) {
      toast.error('Error searching location');
    }
    setIsSearching(false);
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    const toastId = toast.loading('Running predictive ML simulation...', {
      description: 'Analyzing geospatial gradients across 14 sectors.',
    });

    setTimeout(() => {
      setIsSimulating(false);
      toast.success('Simulation Complete', {
        id: toastId,
        description: 'New high-risk vectors identified in Dogpatch Marine.',
        action: {
          label: 'View Logs',
          onClick: () => console.log('Logs viewed')
        }
      });
    }, 2500);
  };

  const getTileUrl = () => {
    switch (activeLayer) {
      case 'Flow': return "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png";
      case 'Terrain': return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      case 'History': return "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
      case 'Layers':
      default: return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    }
  };

  const generateRisks = (lat: number, lng: number) => {
    const hash1 = Math.abs(Math.sin(lat * 12.9 + lng * 78.2)) * 10000;
    const hash2 = Math.abs(Math.sin(lat * 45.1 + lng * 12.3)) * 10000;
    const hash3 = Math.abs(Math.cos(lat * 99.9 + lng * 11.1)) * 10000;
    
    const val1 = Math.floor(hash1 % 100);
    const val2 = Math.floor(hash2 % 100);
    const val3 = Math.floor(hash3 % 100);

    return [
      { label: `Sector ${Math.floor(hash1 % 100)} Alpha`, status: val1 > 70 ? 'High Risk' : val1 > 30 ? 'Elevated' : 'Optimal', color: val1 > 70 ? 'bg-error' : val1 > 30 ? 'bg-primary' : 'bg-secondary', val: val1 },
      { label: `Sector ${Math.floor(hash2 % 100)} Beta`, status: val2 > 70 ? 'High Risk' : val2 > 30 ? 'Elevated' : 'Optimal', color: val2 > 70 ? 'bg-error' : val2 > 30 ? 'bg-primary' : 'bg-secondary', val: val2 },
      { label: `Sector ${Math.floor(hash3 % 100)} Gamma`, status: val3 > 70 ? 'High Risk' : val3 > 30 ? 'Elevated' : 'Optimal', color: val3 > 70 ? 'bg-error' : val3 > 30 ? 'bg-primary' : 'bg-secondary', val: val3 },
    ];
  };

  const generateMaintenance = (lat: number, lng: number) => {
    const hash = Math.abs(Math.sin(lat * lng)) * 10000;
    const count = Math.floor(hash % 4) + 2;
    const tasks = ['Valve Replacement', 'Sensor Calibration', 'Pipe Lining', 'Diagnostic Check', 'Pressure Testing', 'Leak Repair'];
    const statuses = ['45m', 'En-Route', 'Scheduled', 'Tomorrow', 'In Progress'];
    const colors = ['border-secondary', 'border-primary', 'border-outline', 'border-error'];
    
    return Array.from({length: count}).map((_, i) => {
      const h = Math.abs(Math.sin((hash + i) * 123.45)) * 10000;
      return {
        id: `WO-${Math.floor(1000 + (h % 9000))}`,
        label: tasks[Math.floor((h / 10) % tasks.length)],
        loc: `Lat: ${lat.toFixed(3)}, Lng: ${(lng + (i*0.01)).toFixed(3)}`,
        eta: statuses[Math.floor((h / 100) % statuses.length)],
        color: colors[Math.floor((h / 1000) % colors.length)]
      };
    });
  };

  const risks = generateRisks(currentCoords.lat, currentCoords.lng);
  const maintenance = generateMaintenance(currentCoords.lat, currentCoords.lng);

  const baseCoords = searchedCenter ? new L.LatLng(searchedCenter[0], searchedCenter[1]) : new L.LatLng(37.7749, -122.4194);
  const pipes = React.useMemo(() => generatePipes(baseCoords.lat, baseCoords.lng), [baseCoords.lat, baseCoords.lng]);

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative overflow-hidden animate-in fade-in duration-700 rounded-2xl border border-outline-variant/10">
      
      <form onSubmit={handleSearch} className="absolute top-8 left-8 z-[20] flex items-center gap-2 bg-[#141d1f]/90 backdrop-blur-xl p-2 rounded-2xl border border-outline-variant/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <input 
          type="text" 
          placeholder="Search global coordinates or city..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-white px-4 py-2 w-64 text-sm font-headline"
        />
        <button 
          type="submit" 
          disabled={isSearching}
          className="px-6 py-2 primary-gradient text-on-primary font-bold rounded-xl text-xs uppercase tracking-widest disabled:opacity-50"
        >
          {isSearching ? 'Locating...' : 'Search'}
        </button>
      </form>

      {/* Interactive Map using react-leaflet */}
      <div className="absolute inset-0 z-0 bg-surface-container-lowest">
        <MapContainer 
          center={[37.7749, -122.4194]} 
          zoom={13} 
          scrollWheelZoom={true}
          className={cn(
            "w-full h-full transition-all duration-1000",
            activeLayer !== 'Terrain' && "invert hue-rotate-180 brightness-75 contrast-125 saturate-50 mix-blend-screen"
          )}
        >
          {/* We are styling the standard OSM map to look dark mode/futuristic */}
          <TileLayer
            key={activeLayer}
            attribution='&copy; OpenStreetMap contributors'
            url={getTileUrl()}
          />
          <MapCenterUpdater center={searchedCenter} />
          <MapEventHandler onMoveEnd={handleMapMove} />
          
          {/* Dynamic Pipe Network rendering */}
          {activeLayer !== 'Terrain' && pipes.map(pipe => {
            const arrows = [];
            for (let i = 0; i < pipe.path.length - 1; i++) {
              const start = pipe.path[i];
              const end = pipe.path[i + 1];
              
              const midLat = (start[0] + end[0]) / 2;
              const midLng = (start[1] + end[1]) / 2;
              
              const bearing = getBearing(start[0], start[1], end[0], end[1]);
              
              const arrowIcon = L.divIcon({
                className: 'clear-leaflet-div',
                html: `<div style="transform: rotate(${bearing}deg); color: ${pipe.color}; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; opacity: 0.9;">
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 0px 4px ${pipe.color});">
                           <path d="M5 12h14"></path>
                           <path d="m12 5 7 7-7 7"></path>
                         </svg>
                       </div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              });
              
              arrows.push(
                <Marker key={`${pipe.id}-arrow-${i}`} position={[midLat, midLng]} icon={arrowIcon} interactive={false} />
              );
            }

            return (
              <React.Fragment key={pipe.id}>
                <Polyline
                  positions={pipe.path}
                  color={pipe.color}
                  weight={pipe.flowRate === 'fast' ? 5 : 3}
                  opacity={0.6}
                  className={cn(
                    pipe.flowRate === 'fast' ? 'pipe-flow-fast' : pipe.flowRate === 'slow' ? 'pipe-flow-slow' : 'pipe-flow-normal'
                  )}
                />
                {arrows}
              </React.Fragment>
            );
          })}

          {/* Anomaly Marker 1 */}
          <Marker position={[currentCoords.lat + 0.01, currentCoords.lng + 0.01]} icon={anomalyIcon}>
            <Popup className="custom-leaflet-popup">
              <div className="bg-[#141d1f] border border-[#40484c] p-4 rounded-xl shadow-2xl min-w-[200px] text-on-surface">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="text-error w-4 h-4" />
                  <span className="text-[10px] font-headline uppercase tracking-widest text-error font-bold">Anomaly Detected</span>
                </div>
                <p className="text-sm font-headline mb-1">{locationName} Vector</p>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#40484c]/50">
                  <div>
                    <p className="text-[8px] text-[#8a9297] uppercase tracking-wider">Confidence</p>
                    <p className="text-xs font-bold text-[#2ddbde]">{(Math.abs(Math.sin(currentCoords.lat)) * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-[#8a9297] uppercase tracking-wider">Est. Loss</p>
                    <p className="text-xs font-bold text-[#ffb4ab]">{Math.floor(Math.abs(Math.cos(currentCoords.lng)) * 500)} L/hr</p>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Anomaly Marker 2 */}
          <Marker position={[currentCoords.lat - 0.01, currentCoords.lng - 0.02]} icon={anomalyIcon}>
            <Popup className="custom-leaflet-popup">
              <div className="bg-[#141d1f] border border-[#40484c] p-4 rounded-xl shadow-2xl min-w-[200px] text-on-surface">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="text-error w-4 h-4" />
                  <span className="text-[10px] font-headline uppercase tracking-widest text-error font-bold">Pressure Drop</span>
                </div>
                <p className="text-sm font-headline mb-1">{locationName} Sub-hub</p>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#40484c]/50">
                  <div>
                    <p className="text-[8px] text-[#8a9297] uppercase tracking-wider">Confidence</p>
                    <p className="text-xs font-bold text-[#2ddbde]">{(Math.abs(Math.cos(currentCoords.lat)) * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-[#8a9297] uppercase tracking-wider">Delta</p>
                    <p className="text-xs font-bold text-[#ffb4ab]">-{Math.floor(Math.abs(Math.sin(currentCoords.lng)) * 30)} PSI</p>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Right Sidebar Widgets */}
      <div className="absolute top-8 right-8 w-80 h-[calc(100vh-8rem)] z-10 flex flex-col gap-6 pointer-events-none">
        
        <section className="glass-card p-6 rounded-2xl shadow-2xl pointer-events-auto backdrop-blur-3xl bg-[#141d1f]/80 border border-outline-variant/30">
          <header className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-sm font-bold tracking-tight text-white">Area: {locationName}</h3>
            <Navigation className="text-primary w-4 h-4" />
          </header>
          <div className="space-y-4">
            {risks.map((risk) => (
              <div key={risk.label} className="space-y-1">
                <div className="flex justify-between text-[10px] text-outline uppercase font-bold tracking-wider">
                  <span>{risk.label}</span>
                  <span className={risk.color.replace('bg-', 'text-')}>{risk.status}</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className={cn("h-full", risk.color)} style={{ width: `${risk.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleSimulate}
            disabled={isSimulating}
            className="mt-6 w-full py-3 bg-primary-container/40 text-primary border border-primary/20 rounded-xl text-xs font-headline font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSimulating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </span>
            ) : "Run ML Simulation"}
          </button>
        </section>

        <section className="glass-card p-6 rounded-2xl shadow-2xl flex-1 flex flex-col min-h-0 pointer-events-auto backdrop-blur-3xl bg-[#141d1f]/80 border border-outline-variant/30">
          <header className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-sm font-bold tracking-tight text-white">Active Maintenance</h3>
            <Construction className="text-secondary w-4 h-4" />
          </header>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {maintenance.map((wo) => (
              <div key={wo.id} className={cn("bg-surface-container-high/40 p-3 rounded-lg border-l-2 hover:bg-surface-container-high/60 transition-colors cursor-pointer", wo.color)}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold bg-[#2d3638] text-white px-2 py-0.5 rounded-md tracking-wider">{`#${wo.id}`}</span>
                  <span className="text-[10px] text-outline font-bold tracking-wider">{wo.eta}</span>
                </div>
                <p className="text-xs font-bold mb-1 text-white">{wo.label}</p>
                <p className="text-[10px] text-outline-variant">{wo.loc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#141d1f]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-outline-variant/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-10">
        {[
          { label: 'Layers', icon: Layers },
          { label: 'Flow', icon: Droplets },
          { label: 'Terrain', icon: Rotate3d },
          { label: 'History', icon: History },
        ].map((ctrl, i) => (
          <React.Fragment key={ctrl.label}>
            {i === 3 && <div className="w-px h-8 bg-outline-variant/30 mx-2" />}
            <button 
              onClick={() => {
                setActiveLayer(ctrl.label);
                toast(`Map layer changed to ${ctrl.label}`);
              }}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all",
                activeLayer === ctrl.label 
                  ? "text-primary bg-primary-container/40 border border-primary/30 shadow-inner" 
                  : "text-outline hover:text-white hover:bg-surface-bright"
              )}
            >
              <ctrl.icon className="w-5 h-5" />
              <span className="text-[8px] font-headline font-bold uppercase tracking-tighter mt-1.5">{ctrl.label}</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 right-8 flex items-center gap-6 text-[10px] text-outline uppercase tracking-widest font-headline font-bold z-10 bg-[#0c1517]/80 px-4 py-2 rounded-full border border-outline-variant/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(120,220,119,0.8)]"></div>
          Latency: 14ms
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(45,219,222,0.8)]"></div>
          Nodes: 12,408
        </div>
        <div className="flex items-center gap-2 text-white">
          <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(120,220,119,0.8)]"></div>
          Efficiency: 98.2%
        </div>
      </div>
    </div>
  );
};

