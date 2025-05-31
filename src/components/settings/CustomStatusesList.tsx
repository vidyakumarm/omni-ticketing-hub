
import React from 'react';
import { CustomStatusItem } from './CustomStatusItem';
import { CustomStatus } from '@/pages/CustomStatuses';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

interface CustomStatusesListProps {
  customStatuses: CustomStatus[];
  onEdit: (status: CustomStatus) => void;
  onDelete: (statusId: string) => void;
  onReorder: (statuses: CustomStatus[]) => void;
}

export const CustomStatusesList: React.FC<CustomStatusesListProps> = ({
  customStatuses,
  onEdit,
  onDelete,
  onReorder
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = customStatuses.findIndex(status => status.id === active.id);
      const newIndex = customStatuses.findIndex(status => status.id === over.id);
      
      const reorderedStatuses = arrayMove(customStatuses, oldIndex, newIndex);
      onReorder(reorderedStatuses);
    }
  };

  if (customStatuses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No custom statuses defined</div>
        <p className="text-gray-500">Use custom statuses to match your support process.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4 font-medium text-gray-900 w-8">Order</th>
              <th className="text-left p-4 font-medium text-gray-900">Status Name</th>
              <th className="text-left p-4 font-medium text-gray-900">Color</th>
              <th className="text-right p-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={customStatuses.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {customStatuses
                  .sort((a, b) => a.order - b.order)
                  .map((status) => (
                    <CustomStatusItem
                      key={status.id}
                      customStatus={status}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
      </div>
    </div>
  );
};
