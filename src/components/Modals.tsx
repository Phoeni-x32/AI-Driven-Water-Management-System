import React from 'react';
import { X, Clock, FileText, UserCircle, Shield, History, Activity } from 'lucide-react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'sonner';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface border border-outline/20 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-outline/10">
          <h2 className="text-xl font-headline font-bold text-on-surface">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-variant text-outline hover:text-on-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export const AccountModal: React.FC<{ isOpen: boolean; onClose: () => void; user: User | null }> = ({ isOpen, onClose, user }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully logged out');
      onClose();
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const activityLogs = [
    { id: 1, action: 'Logged In', time: 'Just now', ip: '192.168.1.104' },
    { id: 2, action: 'Generated Global Audit', time: '2 hours ago', ip: '192.168.1.104' },
    { id: 3, action: 'Emergency Override Rescinded', time: 'Yesterday', ip: '10.0.0.42' },
    { id: 4, action: 'Simulated Water Demand', time: '2 days ago', ip: '192.168.1.104' },
    { id: 5, action: 'Logged In', time: '2 days ago', ip: '192.168.1.104' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Profile & Activity">
      <div className="space-y-8">
        <div className="flex items-center gap-6 p-6 bg-surface-container-low rounded-xl border border-outline/10">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-full border-4 border-primary/20" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
              <UserCircle className="w-10 h-10 text-primary" />
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold font-headline text-on-surface">{user?.displayName || 'Operator'}</h3>
            <p className="text-outline">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2 text-xs font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full w-fit">
              <Shield className="w-3 h-3" /> System Admin
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Account Activity
          </h4>
          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest border border-outline/10 hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-3">
                  <History className="w-4 h-4 text-outline" />
                  <div>
                    <p className="font-bold text-sm text-on-surface">{log.action}</p>
                    <p className="text-xs text-outline font-mono mt-1">{log.ip}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-outline uppercase tracking-wider">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-outline/10 flex justify-end">
          <button onClick={handleLogout} className="px-6 py-3 bg-error/10 text-error hover:bg-error hover:text-on-error rounded-xl font-bold transition-all w-full md:w-auto">
            Sign Out of HydroSphere
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const ScheduleModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const schedule = [
    { day: 'Monday', zones: ['Alpha-01 (04:00 - 06:00)', 'Beta-02 (20:00 - 22:00)'] },
    { day: 'Tuesday', zones: ['Alpha-02 (03:00 - 05:00)', 'Gamma-01 (19:00 - 21:00)'] },
    { day: 'Wednesday', zones: ['Maintenance Mode - No Irrigation'] },
    { day: 'Thursday', zones: ['Alpha-01 (04:00 - 06:00)', 'Beta-01 (20:00 - 22:00)'] },
    { day: 'Friday', zones: ['Alpha-02 (03:00 - 05:00)', 'Beta-02 (19:00 - 21:00)'] },
    { day: 'Saturday', zones: ['System Flushing (01:00 - 03:00)'] },
    { day: 'Sunday', zones: ['AI Optimization Mode - Varies'] },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Weekly Irrigation Schedule">
      <div className="space-y-4">
        {schedule.map((day, idx) => (
          <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-outline/10">
            <div className="w-32 font-bold font-headline text-primary">{day.day}</div>
            <div className="flex-1 space-y-2">
              {day.zones.map((zone, zIdx) => (
                <div key={zIdx} className="flex items-center gap-2 text-sm text-on-surface">
                  <Clock className="w-4 h-4 text-outline" />
                  {zone}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
