
import React from 'react';
import { KanbanColumn } from './KanbanColumn';

export interface KanbanBoardProps {
  data?: any;
  onTicketMove?: (ticketId: string, newStatus: string) => void;
  onQuickReply?: (ticketId: string) => void;
  onAssignTicket?: (ticketId: string, agentId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  data = {},
  onTicketMove = () => {},
  onQuickReply = () => {},
  onAssignTicket = () => {}
}) => {
  const columns = [
    { id: 'new', title: 'New', tickets: [] },
    { id: 'in-progress', title: 'In Progress', tickets: [] },
    { id: 'waiting', title: 'Waiting for Customer', tickets: [] },
    { id: 'resolved', title: 'Resolved', tickets: [] }
  ];

  return (
    <div className="flex gap-6 overflow-x-auto pb-6">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          tickets={column.tickets}
          onTicketMove={onTicketMove}
          onQuickReply={onQuickReply}
          onAssignTicket={onAssignTicket}
        />
      ))}
    </div>
  );
};
