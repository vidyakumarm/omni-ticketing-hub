import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MergeTicketsModal } from '@/components/tickets/MergeTicketsModal';

interface Ticket {
  id: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  assignee: {
    id: string;
    name: string;
    avatarUrl: string;
  } | null;
}

interface ActionToolbarProps {
  ticket: Ticket;
  onStatusChange: (status: string) => void;
  onAssign: (agentId: string, agentName: string) => void;
  onAddTag: (tag: string) => void;
}

const agents = [
  { id: 'agent-1', name: 'Alice Johnson', avatarUrl: '/placeholder.svg' },
  { id: 'agent-2', name: 'Bob Smith', avatarUrl: '/placeholder.svg' },
  { id: 'agent-3', name: 'Carol Davis', avatarUrl: '/placeholder.svg' },
];

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  ticket,
  onStatusChange,
  onAssign,
  onAddTag,
}) => {
  const [newTag, setNewTag] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
      setShowAddTag(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement PDF export
    console.log('Exporting ticket as PDF');
  };

  const handleMerge = () => {
    setShowMergeModal(true);
  };

  const handleMergeComplete = (targetTicketId: string) => {
    console.log('Merge completed, target ticket:', targetTicketId);
    // In a real app, you might redirect to the target ticket or refresh the page
  };

  // Mock additional tickets for merge (in real app, this would come from API)
  const mockTicketsForMerge = [
    {
      id: ticket.id,
      subject: 'Current ticket subject',
      status: ticket.status,
      customFields: { product: 'Pro', plan: 'Business' },
      tags: ['login', 'urgent']
    },
    {
      id: 'ticket-related-1',
      subject: 'Related SSO authentication issue',
      status: 'open' as const,
      customFields: { product: 'Enterprise', plan: 'Business' },
      tags: ['login', 'sso']
    },
    {
      id: 'ticket-related-2',
      subject: 'Similar login problem',
      status: 'pending' as const,
      customFields: { product: 'Pro', plan: 'Basic' },
      tags: ['login', 'authentication']
    }
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Status Change */}
              <Select value={ticket.status} onValueChange={onStatusChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              {/* Assign */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    {ticket.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={ticket.assignee.avatarUrl} />
                          <AvatarFallback>{ticket.assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{ticket.assignee.name}</span>
                      </div>
                    ) : (
                      'Assign'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="start">
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
                  </div>
                </PopoverContent>
              </Popover>

              {/* Add Tag */}
              <Popover open={showAddTag} onOpenChange={setShowAddTag}>
                <PopoverTrigger asChild>
                  <Button variant="outline">Add Tag</Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="start">
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Add tag:</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Tag name..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddTag();
                          if (e.key === 'Escape') setShowAddTag(false);
                        }}
                        autoFocus
                      />
                      <Button size="sm" onClick={handleAddTag} disabled={!newTag.trim()}>
                        Add
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-3">
              {/* Merge */}
              <Button variant="outline" onClick={handleMerge}>
                Merge
              </Button>

              {/* Export */}
              <Button variant="outline" onClick={handleExport}>
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Merge Tickets Modal */}
      <MergeTicketsModal
        isOpen={showMergeModal}
        onClose={() => setShowMergeModal(false)}
        tickets={mockTicketsForMerge}
        preselectedTicketId={ticket.id}
        onMergeComplete={handleMergeComplete}
      />
    </>
  );
};
