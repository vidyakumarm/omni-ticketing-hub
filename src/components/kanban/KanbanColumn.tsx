
import React from 'react';
import { TicketCard } from './TicketCard';

export interface KanbanColumnProps {
  id: string;
  title: string;
  tickets: any[];
  onQuickReply?: (ticketId: string) => void;
  onAssignTicket?: (ticketId: string, agentId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tickets,
  onQuickReply = () => {},
  onAssignTicket = () => {}
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 min-w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
          {tickets.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {tickets.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            No tickets in this column
          </p>
        ) : (
          tickets.map((ticket) => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket} 
              onQuickReply={onQuickReply}
              onAssignTicket={onAssignTicket}
            />
          ))
        )}
      </div>
    </div>
  );
};
