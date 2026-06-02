
import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  PackageCheck,
  Truck,
  PackageX,
  ExternalLink
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pendente_pagamento':
        return {
          label: 'Pendente Pagamento',
          variant: 'outline' as const,
          icon: <Clock className="h-3 w-3 text-yellow-500" />,
          className: 'border-yellow-200 text-yellow-700 bg-yellow-50'
        };
      case 'pagamento_aprovado':
        return {
          label: 'Pagamento Aprovado',
          variant: 'outline' as const,
          icon: <CheckCircle2 className="h-3 w-3 text-green-500" />,
          className: 'border-green-200 text-green-700 bg-green-50'
        };
      case 'em_producao':
        return {
          label: 'Em Produção',
          variant: 'outline' as const,
          icon: <PackageCheck className="h-3 w-3 text-blue-500" />,
          className: 'border-blue-200 text-blue-700 bg-blue-50'
        };
      case 'enviado':
        return {
          label: 'Enviado',
          variant: 'outline' as const,
          icon: <Truck className="h-3 w-3 text-indigo-500" />,
          className: 'border-indigo-200 text-indigo-700 bg-indigo-50'
        };
      case 'entregue':
        return {
          label: 'Entregue',
          variant: 'outline' as const,
          icon: <CheckCircle2 className="h-3 w-3 text-emerald-500" />,
          className: 'border-emerald-200 text-emerald-700 bg-emerald-50'
        };
      case 'cancelado':
        return {
          label: 'Cancelado',
          variant: 'outline' as const,
          icon: <PackageX className="h-3 w-3 text-red-500" />,
          className: 'border-red-200 text-red-700 bg-red-50'
        };
      default:
        return {
          label: 'Desconhecido',
          variant: 'outline' as const,
          icon: <AlertCircle className="h-3 w-3" />,
          className: 'border-gray-200 text-gray-700 bg-gray-50'
        };
    }
  };

  const { label, variant, icon, className } = getStatusConfig();

  return (
    <Badge variant={variant} className={className}>
      <span className="flex items-center gap-1">
        {icon} {label}
      </span>
    </Badge>
  );
};

interface TrackingInfoProps {
  code: string;
}

export const TrackingInfo: React.FC<TrackingInfoProps> = ({ code }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span className="inline-flex items-center text-xs text-blue-500 ml-2 cursor-pointer hover:underline">
            <span className="mr-0.5">Rastreio</span>
            <ExternalLink className="h-3 w-3" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Código de rastreio: {code}</p>
          <p className="text-xs text-muted-foreground">Clique para rastrear</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
