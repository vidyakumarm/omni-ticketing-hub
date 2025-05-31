
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Pencil, Trash } from 'lucide-react';
import { SLA } from '@/pages/SLAs';

interface SLAItemProps {
  sla: SLA;
  onEdit: (sla: SLA) => void;
  onDelete: (slaId: string) => void;
}

export const SLAItem: React.FC<SLAItemProps> = ({
  sla,
  onEdit,
  onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sla.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatScope = () => {
    const parts = [];
    
    if (sla.scope.allTickets) {
      return 'All Tickets';
    }
    
    if (sla.scope.channels.length > 0) {
      parts.push(`Channels: ${sla.scope.channels.join(', ')}`);
    }
    
    if (sla.scope.priorities.length > 0) {
      parts.push(`Priority: ${sla.scope.priorities.join(', ')}`);
    }
    
    if (sla.scope.customFieldScopes.length > 0) {
      const customFields = sla.scope.customFieldScopes.map(
        cf => `${cf.fieldKey}: ${cf.value}`
      ).join(', ');
      parts.push(`Custom Fields: ${customFields}`);
    }
    
    return parts.join(' • ') || 'No scope defined';
  };

  const formatSLA = (slaTime: { hours: number; minutes: number } | { days: number; hours: number } | null, type: 'response' | 'resolution') => {
    if (!slaTime) return 'No SLA';
    
    if (type === 'response' && 'minutes' in slaTime) {
      const { hours, minutes } = slaTime;
      if (hours === 0) return `${minutes}m`;
      if (minutes === 0) return `${hours}h`;
      return `${hours}h ${minutes}m`;
    }
    
    if (type === 'resolution' && 'days' in slaTime) {
      const { days, hours } = slaTime;
      if (days === 0) return `${hours}h`;
      if (hours === 0) return `${days}d`;
      return `${days}d ${hours}h`;
    }
    
    return 'Invalid SLA';
  };

  return (
    <Card ref={setNodeRef} style={style} className="bg-white">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-gray-900 truncate">{sla.name}</h3>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Scope:</span> {formatScope()}
            </div>
            
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">First Response:</span>
                <Badge variant="secondary">
                  {formatSLA(sla.firstResponseSLA, 'response')}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Resolution:</span>
                <Badge variant="secondary">
                  {formatSLA(sla.resolutionSLA, 'resolution')}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(sla)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(sla.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
