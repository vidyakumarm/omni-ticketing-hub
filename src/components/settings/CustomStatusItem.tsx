
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash, GripVertical } from 'lucide-react';
import { CustomStatus } from '@/pages/CustomStatuses';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CustomStatusItemProps {
  customStatus: CustomStatus;
  onEdit: (status: CustomStatus) => void;
  onDelete: (statusId: string) => void;
}

export const CustomStatusItem: React.FC<CustomStatusItemProps> = ({
  customStatus,
  onEdit,
  onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: customStatus.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getTextColor = (backgroundColor: string) => {
    // Convert hex to RGB
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return dark text for light backgrounds, light text for dark backgrounds
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b hover:bg-gray-50"
    >
      <td className="p-4">
        <button
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          {...attributes}
          {...listeners}
          aria-label="Reorder status"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>
      </td>
      <td className="p-4">
        <div className="font-medium text-gray-900">{customStatus.name}</div>
      </td>
      <td className="p-4">
        <Badge 
          style={{ 
            backgroundColor: customStatus.color,
            color: getTextColor(customStatus.color)
          }}
          className="border-0"
        >
          {customStatus.name}
        </Badge>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(customStatus)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(customStatus.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
