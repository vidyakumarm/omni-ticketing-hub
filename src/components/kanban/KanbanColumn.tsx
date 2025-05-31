
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
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

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tickets: Ticket[];
  onQuickReply: (ticketId: string, message: string) => void;
  onAssignTicket: (ticketId: string, agentId: string, agentName: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  tickets,
  onQuickReply,
  onAssignTicket,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col min-w-[280px] max-w-[280px]">
      {/* Column Header */}
      <div className={`rounded-t-lg border-2 ${color} p-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
            {tickets.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`flex-1 border-l-2 border-r-2 border-b-2 ${color} rounded-b-lg p-4 space-y-3 ${
          isOver ? 'bg-blue-50' : ''
        }`}
        role="list"
        aria-label={`${title} Tickets`}
        style={{ minHeight: '500px' }}
      >
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No tickets in this status</p>
            <button className="text-blue-600 hover:underline text-sm mt-2">
              Click here to view Inbox
            </button>
          </div>
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
