import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Sprout, Droplets, Timer, Play, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { ScheduleModal } from '../components/Modals';

const waterDemandData = [
  { day: 'MON', value: 40 },
  { day: 'TUE', value: 65 },
  { day: 'WED', value: 90 },
  { day: 'THU', value: 100 },
  { day: 'FRI', value: 75 },
  { day: 'SAT', value: 50 },
  { day: 'SUN', value: 35 },
];

export const AgriHub: React.FC = () => {
  const [activeSector, setActiveSector] = useState('East Wheat Fields');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isOverridden, setIsOverridden] = useState(false);
  const [zones, setZones] = useState([
    { id: 'Alpha-01', sub: 'Upper Plateau Wheat', flow: '42 L/min', progress: 82, active: true, time: 'Running' },
    { id: 'Alpha-02', sub: 'Central Pivot Fields', flow: '58 L/min', progress: 14, active: true, time: 'Running' },
    { id: 'Beta-01', sub: 'Lower Basin Storage', flow: '0 L/min', progress: 0, active: false, time: '45m' },
    { id: 'Beta-02', sub: 'Riverbed Buffer Zone', flow: '0 L/min', progress: 0, active: false, time: '4h 12m' },
  ]);

  const handleOverrideAll = () => {
    if (isOverridden) {
      setIsOverridden(false);
      setZones(zones.map(z => ({ ...z, active: z.time !== '45m' && z.time !== '4h 12m' ? true : false })));
      toast.success('AI Scheduling Restored', { description: 'Autonomous irrigation scheduling has resumed.' });
    } else {
      setIsOverridden(true);
      setZones(zones.map(z => ({ ...z, active: false })));
      toast.error('Valve Overrides Sent', { description: 'Manual bypass engaged for all currently operating zones.' });
    }
  };

  const getHeatmapColor = (index: number) => {
    let hash = 0;
    for (let i = 0; i < activeSector.length; i++) {
        hash = activeSector.charCodeAt(i) + ((hash << 5) - hash);
    }
    const rand = Math.abs(Math.sin(hash * (index + 1))) * 100;
    
    if (rand < 20) return "bg-error/40";
    if (rand < 60) return "bg-primary/30";
    return "bg-secondary/40";
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-headline font-bold tracking-tight text-on-surface">Agri Hub</h2>
          <p className="font-body text-outline max-w-lg">Optimizing regional aquifer consumption through AI-driven precision irrigation and soil dynamics.</p>
        </div>
        <div className="flex flex-col gap-3">
          <label className="font-label text-[10px] uppercase tracking-widest text-secondary font-bold">Active Farm Sector</label>
          <div className="flex flex-wrap gap-2">
            {['North Orchards', 'East Wheat Fields', 'South Vineyards', 'West Pastures'].map((sector) => {
              const isActive = activeSector === sector;
              return (
                <button 
                  key={sector}
                  onClick={() => {
                    setActiveSector(sector);
                    toast(`Switched to mapping ${sector}`);
                  }}
                  className={`px-5 py-2.5 rounded-full font-label text-sm transition-all ${
                    isActive ? 'primary-gradient text-on-primary shadow-lg shadow-primary/10' : 'bg-surface-container-high border border-outline-variant/10 text-on-surface hover:bg-surface-bright'
                  }`}
                >
                  {sector}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-8 overflow-hidden relative">
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                <Sprout className="text-secondary w-6 h-6" />
                Soil Moisture Heatmap
              </h3>
              <p className="text-xs text-outline font-label mt-1">Real-time subterranean hydration levels</p>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/10">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Live Telemetry</span>
            </div>
          </div>
          
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-surface-container-lowest">
            <img 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzYPAZ8vhIgeT--8cHucfhVXSnQF1Q3mgkNXfvwfA76NnYrVy_M5liU0P9nwyBFk-1JYHRDyiNOJ5Z2Mne5FpNCV3MWCPAQPHyoAzaDeJolz_LBnf6iYcew07DWqwN5NYtpkEc1-ayhlQNJAJQ6tcx-DOlaX0GvRdjxb5L4zSPAPaNvFjzARnsvlLivy97G_Q7WQWY4hC-kMdUixvZWiS5MT85S9BjBJKQJ4P2D5Vpicp-WpGpPViRC6lmjKyxqKAoqc19-1ZgY4UN"
              alt="Aerial farm fields"
            />
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-70">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={`${activeSector}-${i}`}
                  className={cn(
                    "border border-white/10 backdrop-blur-[2px] transition-colors duration-1000",
                    getHeatmapColor(i)
                  )}
                />
              ))}
            </div>
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 glass-card p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-[10px] text-on-surface">Optimal (75%+)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-[10px] text-on-surface">Stable (50-74%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-error/50"></div>
                <span className="text-[10px] text-on-surface">Critical (&lt; 30%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Water Demand */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-8 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-headline font-bold">Water Demand</h3>
              <Droplets className="text-primary w-5 h-5" />
            </div>
            <div className="space-y-6">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-headline font-bold text-primary">12.4</span>
                <span className="text-outline font-label mb-2">ML / week</span>
              </div>
              <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-tighter">AI Prediction Accuracy</span>
                  <span className="text-[10px] font-bold text-secondary">98.2%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: '98%' }}></div>
                </div>
              </div>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterDemandData}>
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {waterDemandData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.day === 'THU' ? '#2ddbde' : '#2d3638'} />
                      ))}
                    </Bar>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#8a9297', fontSize: 10, fontWeight: 'bold' }} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-3xl p-6 bg-secondary-container/10 border border-secondary/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Info className="text-secondary w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-secondary">Sustainability Insight</p>
                <p className="text-sm font-medium text-on-surface">Optimal evaporation window: 03:00 AM - 05:30 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Irrigation Status */}
        <div className="lg:col-span-12 glass-card rounded-3xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 className="text-2xl font-headline font-bold flex items-center gap-3">
                <Droplets className="text-primary w-6 h-6" />
                Irrigation Network Status
              </h3>
              <p className="text-sm text-outline mt-1">Real-time control and autonomous scheduling for {activeSector}</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsScheduleOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-highest text-on-surface font-bold text-sm hover:bg-surface-bright transition-all"
              >
                <Timer className="w-4 h-4" />
                Full Schedule
              </button>
              <button 
                onClick={handleOverrideAll}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-xl hover:scale-[1.02] transition-transform",
                  isOverridden 
                    ? "bg-error text-on-error shadow-error/20" 
                    : "primary-gradient text-on-primary shadow-primary/20"
                )}
              >
                <Play className="w-4 h-4 fill-current" />
                {isOverridden ? 'Restore Auto' : 'Override All'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {zones.map((zone) => (
              <div key={zone.id} className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                    zone.active ? "bg-secondary/10 text-secondary" : "bg-surface-container-highest text-outline"
                  )}>
                    {zone.active ? 'Active' : 'Scheduled'}
                  </div>
                </div>
                <h4 className="font-headline font-bold text-lg">Zone {zone.id}</h4>
                <p className="text-xs text-outline mb-4">{zone.sub}</p>
                {zone.active ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-outline">Flow Rate</span>
                      <span className="font-bold">{zone.flow}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-outline">Completion</span>
                      <span className="font-bold text-secondary">{zone.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-secondary" style={{ width: `${zone.progress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-4 text-primary">
                    <Timer className="w-4 h-4" />
                    <span className="text-xs font-bold">Starting in {zone.time}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <ScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </div>
  );
};
