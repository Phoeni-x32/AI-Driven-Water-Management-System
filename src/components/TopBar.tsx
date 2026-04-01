import React, { useState, useEffect } from 'react';
import { Bell, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { toast } from 'sonner';
import { AccountModal } from './Modals';

export const TopBar: React.FC = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully logged out');
      setIsAccountOpen(false);
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-20 md:left-64 h-16 bg-background/60 backdrop-blur-xl flex items-center justify-between px-8 w-full z-40 border-b border-outline-variant/10">
        <div className="flex items-center gap-8">
          <p className="font-headline uppercase text-xs tracking-widest text-outline">HydroSphere OS</p>
          <div className="flex items-center gap-6">
            <span className="font-headline uppercase text-xs tracking-widest text-secondary font-black">Health: 94%</span>
            <span className="font-headline uppercase text-xs tracking-widest text-outline hover:text-primary cursor-pointer transition-opacity duration-200">AI: Active</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => toast('No new notifications')} className="group text-outline hover:text-primary transition-colors">
            <Bell className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <button onClick={() => setIsAccountOpen(true)} className="group text-outline hover:text-primary transition-colors">
            <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          </button>
          <div className="w-px h-6 bg-outline-variant/20 mx-1"></div>
          <button onClick={() => setIsAccountOpen(true)} className="flex items-center gap-2 text-outline hover:text-primary transition-colors group" title="Account">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full border border-primary/20 object-cover" />
            ) : (
              <UserIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider hidden md:block border-b border-transparent group-hover:border-primary transition-colors">Account</span>
          </button>
        </div>
      </header>
      
      <AccountModal 
        isOpen={isAccountOpen} 
        onClose={() => setIsAccountOpen(false)} 
        user={user} 
      />
    </>
  );
};
