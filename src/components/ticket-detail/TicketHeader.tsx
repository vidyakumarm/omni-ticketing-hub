
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'High' | 'Medium' | 'Low';
  assignee: {
    id: string;
    name: string;
    avatarUrl: string;
  } | null;
  channel: 'slack' | 'email' | 'teams' | 'web';
  createdAt: string;
  updatedAt: string;
}

interface TicketHeaderProps {
  ticket: Ticket;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onAssign: (agentId: string, agentName: string) => void;
}

const agents = [
  { id: 'agent-1', name: 'Alice Johnson', avatarUrl: '/placeholder.svg' },
  { id: 'agent-2', name: 'Bob Smith', avatarUrl: '/placeholder.svg' },
  { id: 'agent-3', name: 'Carol Davis', avatarUrl: '/placeholder.svg' },
];

export const TicketHeader: React.FC<TicketHeaderProps> = ({
  ticket,
  onStatusChange,
  onPriorityChange,
  onAssign,
}) => {
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [editedSubject, setEditedSubject] = useState(ticket.subject);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
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

  const handleSubjectSave = () => {
    // TODO: API call to update subject
    console.log('Updating subject to:', editedSubject);
    setIsEditingSubject(false);
  };

  const handleSubjectCancel = () => {
    setEditedSubject(ticket.subject);
    setIsEditingSubject(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Ticket ID and Subject */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-mono text-gray-500">#{ticket.id}</span>
            <span className="text-sm">{getChannelIcon(ticket.channel)}</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            {isEditingSubject ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubjectSave();
                    if (e.key === 'Escape') handleSubjectCancel();
                  }}
                  autoFocus
                />
                <Button size="sm" onClick={handleSubjectSave}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleSubjectCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-gray-900">{ticket.subject}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingSubject(true)}
                  className="p-1"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Status and Priority Badges */}
          <div className="flex items-center gap-3 mb-4">
            <Select value={ticket.status} onValueChange={onStatusChange}>
              <SelectTrigger asChild>
                <Badge
                  variant="outline"
                  className={`cursor-pointer transition-colors ${getStatusColor(ticket.status)}`}
                >
                  <SelectValue />
                </Badge>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ticket.priority} onValueChange={onPriorityChange}>
              <SelectTrigger asChild>
                <Badge
                  variant="outline"
                  className={`cursor-pointer transition-colors ${getPriorityColor(ticket.priority)}`}
                >
                  <SelectValue />
                </Badge>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High Priority</SelectItem>
                <SelectItem value="Medium">Medium Priority</SelectItem>
                <SelectItem value="Low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timestamps */}
          <div className="text-sm text-gray-500">
            <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
            <span className="mx-2">•</span>
            <span>Updated: {new Date(ticket.updatedAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Assignee */}
        <div className="ml-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-auto p-3">
                <div className="flex items-center gap-2">
                  {ticket.assignee ? (
                    <>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={ticket.assignee.avatarUrl} />
                        <AvatarFallback>{ticket.assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="text-sm font-medium">{ticket.assignee.name}</div>
                        <div className="text-xs text-gray-500">Assignee</div>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">Unassigned</div>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <div className="space-y-2">
                <p className="font-medium text-sm">Assign to:</p>
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => onAssign(agent.id, agent.name)}
                    className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={agent.avatarUrl} />
                      <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{agent.name}</span>
                  </button>
                ))}
                <button
                  onClick={() => onAssign('', 'Unassigned')}
                  className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded text-gray-500"
                >
                  <div className="h-6 w-6 rounded-full border border-gray-300" />
                  <span className="text-sm">Unassign</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
