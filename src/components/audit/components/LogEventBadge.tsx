
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { DownloadCloud, UploadCloud } from 'lucide-react';

interface LogEventBadgeProps {
  eventType: string;
}

export const LogEventBadge: React.FC<LogEventBadgeProps> = ({ eventType }) => {
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'import':
        return <UploadCloud className="h-4 w-4 text-blue-500" />;
      case 'export':
        return <DownloadCloud className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getEventBadge = (eventType: string) => {
    switch (eventType) {
      case 'import':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Importação
          </Badge>
        );
      case 'export':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Exportação
          </Badge>
        );
      case 'create':
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            Criação
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {eventType}
          </Badge>
        );
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getEventIcon(eventType)}
      {getEventBadge(eventType)}
    </div>
  );
};
