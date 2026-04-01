import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  Leaf, 
  FileText, 
  Download, 
  Calendar, 
  ArrowRight, 
  TrendingUp,
  Scale,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const distributionData = [
  { name: 'North Hub', value: 92 },
  { name: 'Riverside', value: 68 },
  { name: 'Equity Avg', value: 85, isAvg: true },
  { name: 'District 7', value: 45 },
  { name: 'Industrial', value: 79 },
  { name: 'South Quay', value: 94 },
];

const initialDemandData = [
  { year: '2024', hist: 160 },
  { year: '2025', hist: 150 },
  { year: '2026', hist: 170 },
  { year: '2027', hist: 140, proj: 140 },
  { year: '2028', proj: 130 },
  { year: '2029', proj: 90 },
  { year: '2030', proj: 40 },
];

export const Sustainability: React.FC = () => {
  const [demandData, setDemandData] = React.useState(initialDemandData);
  const [popGrowth, setPopGrowth] = React.useState(50);
  const [droughtSeverity, setDroughtSeverity] = React.useState(80);
  const [industrialExpansion, setIndustrialExpansion] = React.useState(30);
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = () => {
    if (isExporting) return;
    setIsExporting(true);
    toast('Export Processing', { description: 'Compiling global compliance data and historical trends...' });
    setTimeout(() => {
      setIsExporting(false);
      const content = `HYDROSPHERE GLOBAL AUDIT\nDate: ${new Date().toISOString()}\n\nTotal Volume Recovered: 1.2B L\nCO2 Emission Reduction: 420 TONS\n\nCompliance Status: Excellent`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Global_Compliance_Audit.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Download Complete', { description: 'Global_Compliance_Audit.txt saved successfully.' });
    }, 2000);
  };

  const handleDocumentDownload = (ref: string, label: string) => {
    toast.success(`Downloading ${ref}`, { description: label });
    const content = `HYDROSPHERE OS\n\nDocument: ${label}\nReference: ${ref}\nDate: ${new Date().toISOString()}\n\nStatus: VERIFIED\nCompliance: Metric Standards Met.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ref}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scrollToConfig = () => {
    document.getElementById('simulator-config')?.scrollIntoView({ behavior: 'smooth' });
    toast('Simulator Configuration', { description: 'Scroll to adjust prediction parameters.' });
  };

  const calculateForecast = () => {
    // Arbitrary model algorithm just to show lines changing visually
    const factor = (popGrowth / 50) * 1.2 + (droughtSeverity / 80) * 0.8 + (industrialExpansion / 50) * 0.5;
    
    setDemandData([
      { year: '2024', hist: 160 },
      { year: '2025', hist: 150 },
      { year: '2026', hist: 170 },
      { year: '2027', hist: 140, proj: 140 },
      { year: '2028', proj: 130 * factor },
      { year: '2029', proj: 90 * factor },
      { year: '2030', proj: 40 * factor * 1.5 },
    ]);
    
    toast.success('Forecast Updated', { description: 'Predictive model parameters successfully applied.' });
  };
  return (
    <div className="p-8 md:p-12 space-y-12 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <section className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-outline-variant/10 pb-8">
        <div>
          <h1 className="font-headline text-5xl font-bold tracking-tighter text-on-surface mb-2">Sustainability & Analytics</h1>
          <p className="text-on-surface-variant font-body max-w-xl">Historical impact tracking and predictive modeling for equitable water resource management across the urban aquifer network.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={scrollToConfig}
            className="px-6 py-3 rounded-xl glass-card border border-outline-variant/20 font-label text-xs uppercase tracking-widest text-primary hover:bg-primary/10 transition-colors"
          >
            Configure Simulator
          </button>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-3 rounded-xl flex items-center gap-2 primary-gradient text-on-primary font-label text-xs uppercase tracking-widest font-bold shadow-lg shadow-primary/10 disabled:opacity-75 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
          >
            {isExporting ? <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span> : null}
            {isExporting ? 'Exporting...' : 'Export Global Audit'}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Leaf className="w-32 h-32 text-primary" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(120,220,119,0.5)]"></span>
              Sustainability ROI Q3-Q4
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
              <div>
                <h3 className="font-headline text-5xl font-light text-on-surface">1.2B <span className="text-xl text-outline">L</span></h3>
                <p className="text-outline-variant text-sm mt-1 uppercase tracking-tighter">Total Volume Recovered</p>
                <div className="mt-6 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[84%]"></div>
                </div>
                <p className="text-[10px] text-primary mt-2 uppercase font-bold tracking-widest">84% Toward Annual Goal</p>
              </div>
              <div>
                <h3 className="font-headline text-5xl font-light text-on-surface">420 <span className="text-xl text-outline">TONS</span></h3>
                <p className="text-outline-variant text-sm mt-1 uppercase tracking-tighter">CO2 Emission Reduction</p>
                <div className="mt-6 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[62%]"></div>
                </div>
                <p className="text-[10px] text-secondary mt-2 uppercase font-bold tracking-widest">Optimized Pumping Efficiency</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-high rounded-3xl p-8 flex flex-col">
          <h4 className="font-headline text-xl font-bold text-on-surface mb-6">Compliance Portal</h4>
          <div className="space-y-4">
            {[
              { label: 'EPA Water Quality Audit', ref: 'HS-2024-098', icon: FileText, color: 'text-primary' },
              { label: 'Energy Efficiency Impact', ref: 'HS-2024-112', icon: Zap, color: 'text-secondary' },
              { label: 'Equity Distribution Policy', ref: 'HS-2024-145', icon: Scale, color: 'text-tertiary' },
            ].map((doc) => (
              <div 
                key={doc.label} 
                onClick={() => handleDocumentDownload(doc.ref, doc.label)}
                className="group p-4 bg-surface-container-low hover:bg-surface-bright rounded-xl transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <doc.icon className={cn("w-5 h-5", doc.color)} />
                  <div>
                    <p className="text-sm font-bold text-on-surface">{doc.label}</p>
                    <p className="text-[10px] text-outline">Ref: {doc.ref}</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
          <button className="mt-auto pt-6 text-xs text-outline hover:text-on-surface transition-colors flex items-center gap-2">
            View All Documentation <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface">Equitable Distribution Report</h2>
            <p className="text-sm text-outline">Benchmarking access quality across socio-economic urban clusters.</p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10">
            <Calendar className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-label uppercase tracking-widest text-outline">Last 12 Months</span>
          </div>
        </div>
        <div className="glass-card rounded-3xl p-10 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isAvg ? '#2ddbde' : '#004d4f'} />
                ))}
              </Bar>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8a9297', fontSize: 10, fontWeight: 'bold' }} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section id="simulator-config" className="grid grid-cols-1 xl:grid-cols-4 gap-8 scroll-mt-24">
        <div className="xl:col-span-3 glass-card rounded-3xl p-8 overflow-hidden relative">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-headline text-2xl font-bold text-on-surface">Future Demand Simulator</h2>
              <p className="text-sm text-outline">Predictive modeling for 2025-2030 aquifer load.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container text-[10px] font-bold uppercase tracking-widest">Drought Risk: High</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandData}>
                <Line type="monotone" dataKey="hist" stroke="#8a9297" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="proj" stroke="#2ddbde" strokeWidth={3} dot={{ r: 4, fill: '#0c1517', stroke: '#2ddbde', strokeWidth: 2 }} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#8a9297', fontSize: 10 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-surface-container-high rounded-3xl p-8 space-y-8">
          <h4 className="font-headline text-lg font-bold text-on-surface">Model Parameters</h4>
          <div className="space-y-6">
            {[
              { label: 'Pop. Growth', val: `+${(popGrowth / 20).toFixed(1)}%`, color: 'accent-primary', state: popGrowth, setter: setPopGrowth },
              { label: 'Drought Severity', val: droughtSeverity > 70 ? 'Extreme' : droughtSeverity > 40 ? 'Moderate' : 'Low', color: 'accent-error', state: droughtSeverity, setter: setDroughtSeverity },
              { label: 'Industrial Expansion', val: industrialExpansion > 60 ? 'High' : industrialExpansion > 30 ? 'Moderate' : 'Low', color: 'accent-tertiary', state: industrialExpansion, setter: setIndustrialExpansion },
            ].map((param) => (
              <div key={param.label} className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-label uppercase tracking-widest text-outline">{param.label}</label>
                  <span className="text-xs font-bold text-on-surface">{param.val}</span>
                </div>
                <input 
                  type="range" 
                  min="0"
                  max="100"
                  value={param.state}
                  onChange={(e) => param.setter(parseInt(e.target.value))}
                  className={cn("w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer", param.color)} 
                />
              </div>
            ))}
          </div>
          <button 
            onClick={calculateForecast}
            className="w-full py-4 rounded-xl glass-card border border-primary/30 text-primary font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary/5 transition-all"
          >
            Update Forecast
          </button>
        </div>
      </section>
    </div>
  );
};
