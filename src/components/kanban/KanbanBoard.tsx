
import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import { TicketCard } from './TicketCard';

interface Ticket {
  id: string;
  subject: string;
  preview: string;
  customer: {
    name: string;
    avatarUrl: string;
    identifier: string;
  };
  channel: 'slack' | 'email' | 'teams' | 'web';
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'High' | 'Medium' | 'Low';
  assignee: {
    id: string;
    name: string;
    avatarUrl: string;
  } | null;
  lastUpdated: string;
}

interface KanbanData {
  columns: {
    open: Ticket[];
    pending: Ticket[];
    resolved: Ticket[];
    closed: Ticket[];
  };
}

interface KanbanBoardProps {
  data: KanbanData;
  onTicketMove: (ticketId: string, newStatus: string, oldStatus: string) => void;
  onQuickReply: (ticketId: string, message: string) => void;
  onAssignTicket: (ticketId: string, agentId: string, agentName: string) => void;
}

const columnConfigs = [
  { id: 'open', title: 'Open', color: 'bg-red-50 border-red-200' },
  { id: 'pending', title: 'Pending', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'resolved', title: 'Resolved', color: 'bg-green-50 border-green-200' },
  { id: 'closed', title: 'Closed', color: 'bg-gray-50 border-gray-200' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  data,
  onTicketMove,
  onQuickReply,
  onAssignTicket,
}) => {
  const [activeTicket, setActiveTicket] = React.useState<Ticket | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    // Find the ticket being dragged
    const ticketId = active.id as string;
    let foundTicket: Ticket | null = null;
    
    Object.values(data.columns).forEach(column => {
      const ticket = column.find(t => t.id === ticketId);
      if (ticket) {
        foundTicket = ticket;
      }
    });
    
    setActiveTicket(foundTicket);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTicket(null);
    
    if (!over) return;
    
    const ticketId = active.id as string;
    const newStatus = over.id as string;
    
    // Find current status
    let currentStatus = '';
    Object.entries(data.columns).forEach(([status, tickets]) => {
      if (tickets.find(t => t.id === ticketId)) {
        currentStatus = status;
      }
    });
    
    if (currentStatus && currentStatus !== newStatus) {
      onTicketMove(ticketId, newStatus, currentStatus);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4" style={{ minHeight: '600px' }}>
          {columnConfigs.map((config) => (
            <KanbanColumn
              key={config.id}
              id={config.id}
              title={config.title}
              color={config.color}
              tickets={data.columns[config.id as keyof typeof data.columns]}
              onQuickReply={onQuickReply}
              onAssignTicket={onAssignTicket}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeTicket ? (
            <TicketCard
              ticket={activeTicket}
              onQuickReply={onQuickReply}
              onAssignTicket={onAssignTicket}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
