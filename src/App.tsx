import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AgriHub } from './screens/AgriHub';
import { GlobalCommand } from './screens/GlobalCommand';
import { LeakMap } from './screens/LeakMap';
import { Sustainability } from './screens/Sustainability';
import { Login } from './screens/Login';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { cn } from './lib/utils';
import { Toaster } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('command');
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Toaster theme="dark" position="bottom-right" richColors toastOptions={{ style: { background: '#141d1f', border: '1px solid #40484c', color: '#dbe4e7' } }} />
        <Login />
      </>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'command':
        return <GlobalCommand />;
      case 'map':
        return <LeakMap />;
      case 'agri':
        return <AgriHub />;
      case 'sustainability':
        return <Sustainability />;
      default:
        return <GlobalCommand />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary/30 overflow-x-hidden">
      <Toaster theme="dark" position="bottom-right" richColors toastOptions={{ style: { background: '#141d1f', border: '1px solid #40484c', color: '#dbe4e7' } }} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className={cn(
          "flex-1 transition-all duration-500",
          activeTab === 'map' ? "pl-20 md:pl-64 pt-16" : "pl-20 md:pl-64 pt-24 pb-12 px-8"
        )}>
          {renderScreen()}
        </main>
      </div>

      {/* Background Organic Shapes */}
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed top-40 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
    </div>
  );
}
