
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, UserPlus, MoreVertical } from 'lucide-react';

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

interface TicketCardProps {
  ticket: Ticket;
  onQuickReply: (ticketId: string, message: string) => void;
  onAssignTicket: (ticketId: string, agentId: string, agentName: string) => void;
  isDragging?: boolean;
}

const agents = [
  { id: 'agent-1', name: 'Alice Johnson', avatarUrl: '/placeholder.svg' },
  { id: 'agent-2', name: 'Bob Smith', avatarUrl: '/placeholder.svg' },
  { id: 'agent-3', name: 'Carol Davis', avatarUrl: '/placeholder.svg' },
];

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onQuickReply,
  onAssignTicket,
  isDragging = false,
}) => {
  const [showQuickReply, setShowQuickReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [showAssignPopover, setShowAssignPopover] = useState(false);
  const [showMorePopover, setShowMorePopover] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: dragState,
  } = useDraggable({
    id: ticket.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleQuickReply = () => {
    if (replyMessage.trim()) {
      onQuickReply(ticket.id, replyMessage);
      setReplyMessage('');
      setShowQuickReply(false);
    }
  };

  const handleAssign = (agentId: string, agentName: string) => {
    onAssignTicket(ticket.id, agentId, agentName);
    setShowAssignPopover(false);
  };

  const truncateSubject = (subject: string, maxLength: number = 40) => {
    return subject.length > maxLength ? subject.substring(0, maxLength) + '...' : subject;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'slack':
        return '💬';
      case 'email':
        return '📧';
      case 'teams':
        return '👥';
      case 'web':
        return '🌐';
      default:
        return '📝';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move group ${
        dragState || isDragging ? 'opacity-50 rotate-2' : ''
      }`}
      role="listitem"
      aria-grabbed={dragState}
      tabIndex={0}
    >
      {/* Ticket Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">#{ticket.id}</span>
          <span className="text-xs">{getChannelIcon(ticket.channel)}</span>
        </div>
        
        {/* Hover Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickReply(!showQuickReply);
            }}
          >
            <MessageSquare className="h-3 w-3" />
          </Button>
          
          <Popover open={showAssignPopover} onOpenChange={setShowAssignPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <UserPlus className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="space-y-2">
                <p className="font-medium text-sm">Assign to:</p>
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => handleAssign(agent.id, agent.name)}
                    className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={agent.avatarUrl} />
                      <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{agent.name}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={showMorePopover} onOpenChange={setShowMorePopover}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="space-y-1">
                <button className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded">
                  View Details
                </button>
                <button className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded">
                  Change Status
                </button>
                <button className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded">
                  Add Tag
                </button>
                <button className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded text-red-600">
                  Delete
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Subject */}
      <h4 className="font-medium text-gray-900 mb-2 text-sm">
        {truncateSubject(ticket.subject)}
      </h4>

      {/* Customer */}
      <div className="flex items-center gap-2 mb-3">
        <Avatar className="h-6 w-6">
          <AvatarImage src={ticket.customer.avatarUrl} />
          <AvatarFallback>{ticket.customer.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-xs text-gray-600 truncate">{ticket.customer.name}</span>
      </div>

      {/* Assignee and Priority */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {ticket.assignee ? (
            <>
              <Avatar className="h-5 w-5">
                <AvatarImage src={ticket.assignee.avatarUrl} />
                <AvatarFallback>{ticket.assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600">{ticket.assignee.name}</span>
            </>
          ) : (
            <span className="text-xs text-gray-400">Unassigned</span>
          )}
        </div>
        
        <Badge variant="outline" className={`text-xs ${getPriorityColor(ticket.priority)}`}>
          {ticket.priority}
        </Badge>
      </div>

      {/* Quick Reply */}
      {showQuickReply && (
        <div className="mt-3 space-y-2 border-t pt-3">
          <Textarea
            placeholder="Type your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            className="min-h-[60px] text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleQuickReply} disabled={!replyMessage.trim()}>
              Send
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowQuickReply(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
