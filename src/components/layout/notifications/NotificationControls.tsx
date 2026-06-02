
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationControlsProps {
  totalMessages: number;
  currentIndex: number;
  onDismiss: () => void;
  onNext: () => void;
}

const NotificationControls: React.FC<NotificationControlsProps> = ({ 
  totalMessages, 
  currentIndex, 
  onDismiss, 
  onNext 
}) => {
  return (
    <div className="absolute right-2 flex items-center gap-2">
      {totalMessages > 1 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onNext}
          className="h-6 px-2 text-xs"
        >
          {currentIndex + 1}/{totalMessages}
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onDismiss}
        className="h-6 w-6 p-0 rounded-full"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default NotificationControls;
