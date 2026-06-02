
import { Bell, Calendar, AlertTriangle } from 'lucide-react';

// Define renderIcon function
export const getNotificationIcon = (messageType: string) => {
  switch (messageType) {
    case 'payment':
      return Bell;
    case 'event':
      return Calendar;
    case 'inactive':
      return AlertTriangle;
    case 'info':
    default:
      return Bell;
  }
};

// Define getBgColor function
export const getNotificationBgColor = (messageType: string) => {
  switch (messageType) {
    case 'payment':
      return 'bg-amber-50 text-amber-900';
    case 'event':
      return 'bg-blue-50 text-blue-900';
    case 'inactive':
      return 'bg-red-50 text-red-900';
    case 'info':
    default:
      return 'bg-amber-50 text-amber-900';
  }
};
