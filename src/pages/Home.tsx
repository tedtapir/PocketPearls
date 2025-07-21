import React from 'react';
import { useState } from 'react';
import { PearlAvatar } from '../components/PearlAvatar';
import { StatsPanel } from '../components/StatsPanel';
import { ActionBar } from '../components/ActionBar';
import { NotificationSystem } from '../components/NotificationSystem';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { StatChangeNotification } from '../components/StatChangeNotification';
import { usePearlTicker } from '../hooks/usePearlTicker';
import { ChevronDown } from 'lucide-react';

export const Home: React.FC = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [notification, setNotification] = useState<{
    changes: Record<string, number>;
    message: string;
  } | null>(null);
  
  usePearlTicker();
  
  // Listen for activity results to show notifications
  React.useEffect(() => {
    const handleActivityResult = (event: CustomEvent) => {
      const { statChanges, message } = event.detail;
      if (Object.keys(statChanges).length > 0) {
        setNotification({ changes: statChanges, message });
      }
    };
    
    window.addEventListener('activityResult', handleActivityResult as EventListener);
    return () => window.removeEventListener('activityResult', handleActivityResult as EventListener);
  }, []);
  
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      <NotificationSystem />
      
      {/* Stat Change Notification */}
      {notification && (
        <StatChangeNotification
          changes={notification.changes}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      {/* Full Screen Video Background - Responsive */}
      <div className="fixed inset-0 w-full h-full">
        <PearlAvatar />
      </div>
      
      {/* Top Right Stats Panel - Responsive positioning */}
      <div className="fixed top-4 right-4 z-20 max-w-[280px] sm:max-w-xs">
        <StatsPanel />
      </div>
      
      {/* Top Left Analytics Dropdown - Responsive positioning */}
      <div className="fixed top-4 left-4 z-20">
        <div className="relative">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="pp-btn flex items-center gap-2 text-sm sm:text-base"
          >
            <span>Your Journey</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAnalytics ? 'rotate-180' : ''}`} />
          </button>
          
          {showAnalytics && (
            <div className="absolute top-full left-0 mt-2 z-30 max-w-[280px] sm:max-w-xs">
              <AnalyticsDashboard />
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Action Bar - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <ActionBar />
      </div>
    </div>
  );
};