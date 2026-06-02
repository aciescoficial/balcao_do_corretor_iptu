
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface LogFormatBadgeProps {
  format: string | null;
}

export const LogFormatBadge: React.FC<LogFormatBadgeProps> = ({ format }) => {
  if (!format) return null;
  
  switch (format.toLowerCase()) {
    case 'csv':
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          CSV
        </Badge>
      );
    case 'xml':
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          XML
        </Badge>
      );
    case 'json':
      return (
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
          JSON
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {format}
        </Badge>
      );
  }
};
