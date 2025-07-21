import React, { useEffect, useState } from 'react';
import { usePearl } from '../state/pearlStore';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success';
  timestamp: number;
}

export const NotificationSystem: React.FC = () => {
  const { hunger, energy, hygiene, statusFlags, lastInteraction } = usePearl();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const checkNotifications = () => {
      const now = Date.now();
      const hoursSinceInteraction = (now - lastInteraction) / (1000 * 60 * 60);
      const newNotifications: Notification[] = [];

      // Hunger warning
      if (hunger < 25 && hoursSinceInteraction > 2) {
        newNotifications.push({
          id: 'hunger-low',
          title: 'She\'s Hungry',
          message: 'She hasn\'t eaten today. Check in?',
          type: 'warning',
          timestamp: now
        });
      }

      // Energy warning
      if (energy < 20 && hoursSinceInteraction > 1) {
        newNotifications.push({
          id: 'energy-low',
          title: 'She\'s Exhausted',
          message: 'Help her rest.',
          type: 'warning',
          timestamp: now
        });
      }

      // Hygiene warning
      if (hygiene < 40 && hoursSinceInteraction > 24) {
        newNotifications.push({
          id: 'hygiene-low',
          title: 'She\'s Withdrawn',
          message: 'Maybe suggest a wash.',
          type: 'warning',
          timestamp: now
        });
      }

      // Status-based notifications
      if (statusFlags.includes('sick')) {
        newNotifications.push({
          id: 'sick',
          title: 'She\'s Under the Weather',
          message: 'Gentle care needed.',
          type: 'warning',
          timestamp: now
        });
      }

      if (statusFlags.includes('playful')) {
        newNotifications.push({
          id: 'playful',
          title: 'She\'s in a Playful Mood',
          message: 'Perfect timing for activities!',
          type: 'success',
          timestamp: now
        });
      }

      if (statusFlags.includes('leavingWarning')) {
        newNotifications.push({
          id: 'leaving',
          title: 'She\'s Close to Giving Up',
          message: 'One more day like this...',
          type: 'warning',
          timestamp: now
        });
      }

      // Filter out duplicates and old notifications
      const filteredNotifications = newNotifications.filter(notif => 
        !notifications.some(existing => existing.id === notif.id) &&
        now - notif.timestamp < 5 * 60 * 1000 // 5 minutes
      );

      if (filteredNotifications.length > 0) {
        setNotifications(prev => [...prev, ...filteredNotifications]);
      }
    };

    const interval = setInterval(checkNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [hunger, energy, hygiene, statusFlags, lastInteraction, notifications]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`pearl-card max-w-sm p-4 ${
            notification.type === 'warning' ? 'border-pp-warn' :
            notification.type === 'success' ? 'border-pp-accent1' :
            'border-pp-accent2'
          }`}
          style={{ 
            animation: 'slideInRight 0.3s ease-out',
            boxShadow: notification.type === 'warning' 
              ? '0 0 20px rgba(255, 179, 71, 0.3)' 
              : '0 0 20px rgba(143, 216, 255, 0.3)'
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-white text-sm">{notification.title}</h4>
              <p className="text-gray-300 text-xs mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="text-gray-400 hover:text-white ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};