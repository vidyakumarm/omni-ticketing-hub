
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CustomFieldItem } from './CustomFieldItem';
import { CustomField } from '@/pages/CustomFields';

interface CustomFieldsListProps {
  fields: CustomField[];
  onEdit: (field: CustomField) => void;
  onDelete: (fieldId: string) => void;
  onReorder: (fields: CustomField[]) => void;
}

export const CustomFieldsList: React.FC<CustomFieldsListProps> = ({
  fields,
  onEdit,
  onDelete,
  onReorder
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex(field => field.id === active.id);
      const newIndex = fields.findIndex(field => field.id === over.id);
      
      const reorderedFields = arrayMove(fields, oldIndex, newIndex).map((field, index) => ({
        ...field,
        order: index + 1
      }));
      
      onReorder(reorderedFields);
    }
  };

  if (fields.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No custom fields yet</div>
        <p className="text-gray-500">Click 'Add New Field' to create one.</p>
      </div>
    );
  }

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={sortedFields.map(f => f.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {sortedFields.map((field) => (
            <CustomFieldItem
              key={field.id}
              field={field}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
