
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, Edit, Trash2 } from 'lucide-react';
import { CustomField } from '@/pages/CustomFields';

interface CustomFieldItemProps {
  field: CustomField;
  onEdit: (field: CustomField) => void;
  onDelete: (fieldId: string) => void;
}

export const CustomFieldItem: React.FC<CustomFieldItemProps> = ({
  field,
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
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'dropdown':
        return 'Dropdown';
      case 'text':
        return 'Text';
      case 'number':
        return 'Number';
      case 'date':
        return 'Date';
      case 'boolean':
        return 'Boolean';
      default:
        return type;
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`transition-all ${isDragging ? 'opacity-50 z-50' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Field Info */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div>
              <div className="font-medium text-gray-900">{field.label}</div>
              <div className="text-sm text-gray-500 font-mono">{field.key}</div>
            </div>

            <div>
              <Badge variant="outline">{getTypeDisplay(field.type)}</Badge>
            </div>

            <div className="text-sm text-gray-600">
              {field.type === 'dropdown' && field.options ? (
                <div className="flex flex-wrap gap-1">
                  {field.options.slice(0, 3).map((option, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {option}
                    </Badge>
                  ))}
                  {field.options.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{field.options.length - 3} more
                    </Badge>
                  )}
                </div>
              ) : (
                '-'
              )}
            </div>

            <div className="flex items-center gap-2">
              {field.required && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(field)}
              className="h-8 w-8 p-0"
              aria-label="Edit field"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(field.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              aria-label="Delete field"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
