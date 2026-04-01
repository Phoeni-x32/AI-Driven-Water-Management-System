import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  ShieldCheck, 
  Leaf, 
  AlertTriangle, 
  MapPin, 
  Waves, 
  CloudLightning, 
  Share2 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const flowData = [
  { time: '04:00', value: 45 },
  { time: '08:00', value: 85 },
  { time: '12:00', value: 72 },
  { time: '16:00', value: 65 },
  { time: '20:00', value: 50 },
  { time: 'NOW', value: 48 },
];

export const GlobalCommand: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOverride, setIsOverride] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  const handleGenerateReport = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    toast('Report Generation Started', { description: 'Compiling real-time sensor data and network health metrics...' });
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('Report Ready', { description: 'Hydrosphere_Daily_Report.pdf has been saved securely.' });
    }, 3000);
  };

  const handleOverride = () => {
    if (isOverride) {
      setIsOverride(false);
      toast.success('System Restored', { description: 'Auto-pumps re-engaged and AI predictive control restored.' });
    } else {
      setIsOverride(true);
      toast.error('Emergency Override Activated', { description: 'Manual control protocols engaged. Auto-pumps and AI governance disabled.' });
    }
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface">Global Command</h2>
          <p className="text-outline font-body mt-1">Real-time aquifer intelligence and network integrity.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-surface-container-high text-primary border border-outline-variant/20 rounded-xl font-label text-sm hover:bg-surface-bright transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span> : null}
            Generate Report
          </button>
          <button 
            onClick={handleOverride}
            className={cn(
              "px-6 py-2.5 rounded-xl font-label text-sm font-bold transition-all shadow-[0_0_20px_rgba(45,219,222,0.2)]",
              isOverride 
                ? "bg-error text-on-error shadow-[0_0_20px_rgba(255,84,73,0.3)] animate-pulse" 
                : "bg-gradient-to-br from-primary to-primary-container text-on-primary hover:opacity-90"
            )}
          >
            {isOverride ? 'RESTORE AI CONTROL' : 'Emergency Override'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Network Health Gauge */}
        <div className="md:col-span-8 glass-card p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="z-10 space-y-6 text-center md:text-left">
            <div className={cn("inline-flex items-center px-4 py-1.5 rounded-full border", isOverride ? "bg-error/10 text-error border-error/20" : "bg-secondary-container/10 text-secondary border-secondary/20")}>
              <span className={cn("w-2 h-2 rounded-full animate-pulse mr-2", isOverride ? "bg-error" : "bg-secondary")}></span>
              <span className="text-[10px] font-black uppercase tracking-widest font-label">
                {isOverride ? 'MANUAL OVERRIDE ACTIVE' : 'System Integrity'}
              </span>
            </div>
            <h3 className="font-headline text-5xl font-bold text-on-surface leading-tight">
              {isOverride ? 'Critical' : 'Excellent'} <br/>
              <span className={cn("text-glow", isOverride ? "text-error" : "text-primary")}>Network Health</span>
            </h3>
            <p className="text-on-surface-variant max-w-sm font-body">
              {isOverride 
                ? 'AI safety protocols disabled. Main aquifers are currently operating under manual operator control.' 
                : 'Predictive models indicate optimal pressure stability across all 14 city sectors for the next 48 hours.'}
            </p>
            <div className="flex items-center space-x-6 pt-4">
              <div>
                <p className="text-[10px] uppercase font-label tracking-widest text-outline">Active Sensors</p>
                <p className="text-2xl font-headline font-bold">12,482</p>
              </div>
              <div className="w-px h-8 bg-outline-variant/30"></div>
              <div>
                <p className="text-[10px] uppercase font-label tracking-widest text-outline">Uptime</p>
                <p className="text-2xl font-headline font-bold">99.98%</p>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-0 relative flex items-center justify-center">
            <div className="w-64 h-64 rounded-full border-8 border-surface-container-highest flex items-center justify-center relative">
              <div className={cn("absolute inset-0 rounded-full border-8 border-t-transparent rotate-[140deg] opacity-20 blur-sm", isOverride ? "border-error" : "border-primary")}></div>
              <div className={cn("absolute inset-0 rounded-full border-8 border-t-transparent rotate-[140deg]", isOverride ? "border-error" : "border-primary")}></div>
              <div className="text-center z-10">
                <span className="font-headline text-6xl font-bold text-on-surface tracking-tighter">{isOverride ? '42' : '94'}</span>
                <span className={cn("font-headline text-2xl", isOverride ? "text-error" : "text-primary")}>%</span>
                <p className="text-[10px] uppercase font-label tracking-widest text-outline mt-1">Composite Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Metric */}
        <div className="md:col-span-4 bg-surface-container-high p-8 rounded-[2rem] flex flex-col justify-between border border-outline-variant/10">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-primary-container/30 flex items-center justify-center text-primary">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="text-secondary font-label text-xs font-bold">+12% vs LY</span>
          </div>
          <div className="mt-8">
            <p className="text-outline font-label uppercase text-[10px] tracking-[0.2em] mb-2">AI Optimization Savings</p>
            <h4 className="font-headline text-4xl font-bold text-on-surface">1.4M Gal</h4>
            <div className="mt-6 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary w-3/4"></div>
            </div>
            <p className="text-xs text-on-surface-variant mt-4 font-body leading-relaxed">
              HydraAI reduced unnecessary pump cycles in Sector 4, saving enough to power 420 homes today.
            </p>
          </div>
        </div>

        {/* Flow Velocity Chart */}
        <div className="md:col-span-7 glass-card p-8 rounded-[2rem] relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-headline text-xl font-bold">Flow Velocity</h4>
              <p className="text-xs text-outline font-label">Real-time velocity across main conduits (m/s)</p>
            </div>
            <div className="flex space-x-2">
              <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(45,219,222,0.8)]"></span>
              <span className="w-3 h-3 rounded-full bg-surface-container-highest"></span>
            </div>
          </div>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flowData}>
                <defs>
                  <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2ddbde" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2ddbde" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2ddbde" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorFlow)" 
                />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8a9297', fontSize: 10, fontWeight: 'bold' }} 
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="absolute left-[55%] top-4 px-3 py-1.5 bg-surface-bright rounded-lg border border-outline-variant/30 shadow-xl">
              <p className="text-[10px] font-bold text-primary">Live: 4.82 m/s</p>
            </div>
          </div>
        </div>

        {/* Anomalies List */}
        <div className="md:col-span-5 bg-surface-container-high p-8 rounded-[2rem] border border-outline-variant/10">
          <h4 className="font-headline text-xl font-bold mb-6 flex items-center">
            AI-Detected Anomalies
            <span className="ml-3 px-2 py-0.5 rounded-md bg-error-container/30 text-error text-[10px] font-black uppercase tracking-tighter">Live Monitor</span>
          </h4>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-surface-container-highest border-l-4 border-error/50 flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-headline font-bold text-on-surface">Micro-fracture detected</p>
                <p className="text-xs text-outline font-body flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  Upper East Grid • 04:12 AM
                </p>
              </div>
              <div className="bg-error/10 text-error px-2 py-1 rounded text-[10px] font-bold">URGENT</div>
            </div>
            {showAllAlerts && (
              <>
                <div className="p-4 rounded-2xl bg-surface-container-highest border-l-4 border-outline/50 flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-headline font-bold text-on-surface">Pressure Drop (Resolved)</p>
                    <p className="text-xs text-outline font-body flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Sector 4 Sub-station • Yesterday
                    </p>
                  </div>
                  <div className="bg-outline/10 text-outline px-2 py-1 rounded text-[10px] font-bold">LOGGED</div>
                </div>
              </>
            )}
            <button 
              onClick={() => {
                setShowAllAlerts(!showAllAlerts);
                if (!showAllAlerts) toast('Alerts System', { description: 'Expanded anomaly cache.' });
              }}
              className="w-full py-4 text-primary font-label text-xs font-bold border-2 border-dashed border-outline-variant/30 rounded-2xl hover:bg-primary/5 transition-colors"
            >
              {showAllAlerts ? 'HIDE PREVIOUS' : 'VIEW ALL ALERTS (14)'}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Reservoir Level', value: '88.4% Capacity', icon: Waves, color: 'text-primary' },
          { label: 'Weather Impact', value: 'Minimal Risk', icon: CloudLightning, color: 'text-secondary' },
          { label: 'Node Connection', value: 'Stable (Sync)', icon: Share2, color: 'text-tertiary' },
        ].map((item, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl flex items-center space-x-4">
            <div className={cn("w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center", item.color)}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-label tracking-widest text-outline">{item.label}</p>
              <p className="font-headline text-lg font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
