
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash } from 'lucide-react';
import { Tag } from '@/pages/Tags';

interface TagItemProps {
  tag: Tag;
  onEdit: (tag: Tag) => void;
  onDelete: (tagId: string) => void;
}

export const TagItem: React.FC<TagItemProps> = ({
  tag,
  onEdit,
  onDelete
}) => {
  const getTextColor = (backgroundColor: string) => {
    // Simple contrast calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: tag.color }}
          />
          <Badge
            variant="outline"
            style={{
              backgroundColor: tag.color,
              color: getTextColor(tag.color),
              borderColor: tag.color
            }}
          >
            {tag.name}
          </Badge>
        </div>
      </td>
      <td className="p-4 text-gray-600">
        {tag.usageCount} ticket{tag.usageCount !== 1 ? 's' : ''}
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(tag)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(tag.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            disabled={tag.usageCount > 0}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
