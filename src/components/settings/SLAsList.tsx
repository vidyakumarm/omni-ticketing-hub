
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SLAItem } from './SLAItem';
import { SLA } from '@/pages/SLAs';

interface SLAsListProps {
  slas: SLA[];
  onEdit: (sla: SLA) => void;
  onDelete: (slaId: string) => void;
  onReorder: (slas: SLA[]) => void;
}

export const SLAsList: React.FC<SLAsListProps> = ({
  slas,
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
      const oldIndex = slas.findIndex(sla => sla.id === active.id);
      const newIndex = slas.findIndex(sla => sla.id === over.id);
      
      const reorderedSLAs = arrayMove(slas, oldIndex, newIndex).map((sla, index) => ({
        ...sla,
        order: index + 1
      }));
      
      onReorder(reorderedSLAs);
    }
  };

  if (slas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No SLAs defined</div>
        <p className="text-gray-500">Define SLAs to ensure timely responses.</p>
      </div>
    );
  }

  const sortedSLAs = [...slas].sort((a, b) => a.order - b.order);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={sortedSLAs.map(s => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {sortedSLAs.map((sla) => (
            <SLAItem
              key={sla.id}
              sla={sla}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
