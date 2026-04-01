import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Sprout, 
  BarChart3, 
  Bell, 
  Settings,
  Waves
} from 'lucide-react';
import { cn } from '../lib/utils';
import { User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user }) => {
  const navItems = [
    { id: 'command', label: 'Command Center', icon: LayoutDashboard },
    { id: 'map', label: 'Leak & Map', icon: MapPin },
    { id: 'agri', label: 'Agri Hub', icon: Sprout },
    { id: 'sustainability', label: 'Sustainability', icon: BarChart3 },
  ];

  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) {
      let namePart = user.email.split('@')[0].replace(/[0-9]/g, '');
      if (namePart.includes('.')) return namePart.split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
      if (namePart.includes('_')) return namePart.split('_').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
      if (namePart.toLowerCase() === 'johndoe') return 'John Doe';
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return 'Operator Profile';
  };

  const displayName = getDisplayName();
  const displayEmail = user?.email || 'Level 4 Admin';
  const displayPhoto = user?.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1igAkBKpAvcGcyteI2nChzuudcK_Pu-N_Tsu2KBgOITQnBC5LEycdUJr8BuQVJsHe_fjy7webKXrj67iNQ0M1nnMTOAQdYQ6Q2urVrGaY8_gQH9UUQcr24yKaygiOonFj4Id6xr2jUKxOGTRlVmXVRcJlXioGTgCwxzB0W_f6Tcvs5aTYoRMI_7xTo-hyYFSPPMPNr0C8jmTD7FYao62TU2ZpEtFU52Z6Zw1gNpWu_E1G7PyyYfCcP4tDZTRyUu4k6o-iGtD6EUbz';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-50 flex flex-col h-full py-8 bg-background text-primary font-headline tracking-tight w-20 md:w-64 border-r border-outline-variant/10 shadow-[0_0_32px_rgba(0,79,81,0.08)]">
      <div className="px-6 mb-12 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center">
          <Waves className="text-on-primary w-6 h-6" />
        </div>
        <div className="hidden md:block">
          <h1 className="text-2xl font-bold text-primary tracking-tighter">HydroSphere</h1>
          <p className="text-[10px] uppercase tracking-widest text-outline">Intelligent Aquifer</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center gap-4 w-full px-4 py-3 transition-all duration-300 rounded-lg group",
              activeTab === item.id 
                ? "bg-surface-bright text-primary font-bold rounded-r-full" 
                : "text-outline hover:text-primary hover:bg-surface-container-high"
            )}
          >
            <item.icon className={cn("w-6 h-6", activeTab === item.id && "fill-primary/20")} />
            <span className="hidden md:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-6 mt-auto mb-6">
        <div className="group flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors border border-outline-variant/5 hover:border-outline-variant/20 shadow-sm relative overflow-visible cursor-pointer">
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
              src={displayPhoto}
              alt={displayName}
            />
            <div className="hidden md:flex flex-col overflow-hidden">
              <p className="text-xs font-bold truncate text-on-surface">{displayName}</p>
              <p className="text-[10px] text-outline truncate w-[110px]" title={displayEmail}>{displayEmail}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="absolute -top-12 left-0 right-0 p-3 flex items-center justify-center gap-2 bg-error text-on-error rounded-xl font-bold text-sm shadow-xl shadow-error/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:-translate-y-2 transition-all duration-300 z-50 md:static md:p-2 md:bg-transparent md:text-outline md:-top-0 md:shadow-none md:justify-end md:hover:bg-error/10 hover:text-error md:rounded-lg"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 md:w-4 md:h-4" />
            <span className="md:hidden">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
