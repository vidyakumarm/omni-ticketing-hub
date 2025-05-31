
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { TicketHeader } from '@/components/ticket-detail/TicketHeader';
import { CustomerInfoPanel } from '@/components/ticket-detail/CustomerInfoPanel';
import { ConversationThread } from '@/components/ticket-detail/ConversationThread';
import { ReplyComposer } from '@/components/ticket-detail/ReplyComposer';
import { ContextPanel } from '@/components/ticket-detail/ContextPanel';
import { ActionToolbar } from '@/components/ticket-detail/ActionToolbar';
import { useToast } from '@/hooks/use-toast';

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
  customer: {
    id: string;
    name: string;
    avatarUrl: string;
    contactInfo: {
      email: string;
      slackId?: string;
    };
    accountId?: string;
  };
  customFields: Record<string, string>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  slaStatus: {
    firstResponseDeadline: string;
    resolutionDeadline: string;
  };
  linkedItems: Array<{
    type: string;
    id: string;
    url: string;
  }>;
  activityLog: Array<{
    type: string;
    timestamp: string;
    by: string;
    details: string;
  }>;
}

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatarUrl: string;
    role: 'customer' | 'agent';
  };
  timestamp: string;
  content: string;
  attachments: Array<{
    fileName: string;
    url: string;
  }>;
  isInternal: boolean;
}

// Mock data for development
const mockTicket: Ticket = {
  id: 'ticket-1',
  subject: 'Unable to login to my account',
  status: 'open',
  priority: 'High',
  assignee: {
    id: 'agent-1',
    name: 'Alice Johnson',
    avatarUrl: '/placeholder.svg'
  },
  channel: 'email',
  customer: {
    id: 'customer-1',
    name: 'John Doe',
    avatarUrl: '/placeholder.svg',
    contactInfo: {
      email: 'john.doe@example.com'
    }
  },
  customFields: {
    product: 'Pro',
    plan: 'Premium'
  },
  tags: ['login-issue', 'urgent'],
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T14:45:00Z',
  slaStatus: {
    firstResponseDeadline: '2024-01-15T18:30:00Z',
    resolutionDeadline: '2024-01-17T10:30:00Z'
  },
  linkedItems: [],
  activityLog: [
    {
      type: 'assignment',
      timestamp: '2024-01-15T11:00:00Z',
      by: 'System',
      details: 'Assigned to Alice Johnson'
    }
  ]
};

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    sender: {
      id: 'customer-1',
      name: 'John Doe',
      avatarUrl: '/placeholder.svg',
      role: 'customer'
    },
    timestamp: '2024-01-15T10:30:00Z',
    content: 'Hi, I\'m having trouble logging into my account. I keep getting an error message.',
    attachments: [],
    isInternal: false
  },
  {
    id: 'msg-2',
    sender: {
      id: 'agent-1',
      name: 'Alice Johnson',
      avatarUrl: '/placeholder.svg',
      role: 'agent'
    },
    timestamp: '2024-01-15T11:15:00Z',
    content: 'Hi John, I\'m sorry to hear you\'re having trouble. Can you tell me what error message you\'re seeing?',
    attachments: [],
    isInternal: false
  }
];

const TicketDetail: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<Ticket>(mockTicket);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [showInternalNotes, setShowInternalNotes] = useState(false);

  if (!ticketId) {
    return <Navigate to="/inbox" replace />;
  }

  const handleReply = async (content: string, isInternal: boolean, attachments: File[]) => {
    try {
      console.log('Sending reply:', { content, isInternal, attachments });
      
      // Mock API call
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: {
          id: 'current-agent',
          name: 'Current Agent',
          avatarUrl: '/placeholder.svg',
          role: 'agent'
        },
        timestamp: new Date().toISOString(),
        content,
        attachments: attachments.map(file => ({
          fileName: file.name,
          url: URL.createObjectURL(file)
        })),
        isInternal
      };

      setMessages(prev => [...prev, newMessage]);
      setTicket(prev => ({ ...prev, updatedAt: new Date().toISOString() }));
      
      toast({
        title: isInternal ? 'Internal note added' : 'Reply sent',
        description: isInternal ? 'Your internal note has been added to the ticket.' : 'Your reply has been sent to the customer.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reply. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      console.log('Changing status to:', newStatus);
      setTicket(prev => ({ ...prev, status: newStatus as any, updatedAt: new Date().toISOString() }));
      toast({
        title: 'Status updated',
        description: `Ticket status changed to ${newStatus}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleAssign = async (agentId: string, agentName: string) => {
    try {
      console.log('Assigning to:', agentId, agentName);
      setTicket(prev => ({
        ...prev,
        assignee: { id: agentId, name: agentName, avatarUrl: '/placeholder.svg' },
        updatedAt: new Date().toISOString()
      }));
      toast({
        title: 'Ticket assigned',
        description: `Ticket assigned to ${agentName}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign ticket. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    try {
      console.log('Changing priority to:', newPriority);
      setTicket(prev => ({ ...prev, priority: newPriority as any, updatedAt: new Date().toISOString() }));
      toast({
        title: 'Priority updated',
        description: `Ticket priority changed to ${newPriority}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update priority. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleAddTag = async (tag: string) => {
    try {
      console.log('Adding tag:', tag);
      if (!ticket.tags.includes(tag)) {
        setTicket(prev => ({ ...prev, tags: [...prev.tags, tag], updatedAt: new Date().toISOString() }));
        toast({
          title: 'Tag added',
          description: `Tag "${tag}" added to ticket`
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add tag. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveTag = async (tag: string) => {
    try {
      console.log('Removing tag:', tag);
      setTicket(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag), updatedAt: new Date().toISOString() }));
      toast({
        title: 'Tag removed',
        description: `Tag "${tag}" removed from ticket`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove tag. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <TicketHeader
          ticket={ticket}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onAssign={handleAssign}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Customer Info Panel */}
          <div className="lg:col-span-1">
            <CustomerInfoPanel
              customer={ticket.customer}
              tags={ticket.tags}
              customFields={ticket.customFields}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Conversation Thread */}
            <ConversationThread
              messages={messages}
              showInternalNotes={showInternalNotes}
              onToggleInternalNotes={setShowInternalNotes}
            />

            {/* Reply Composer */}
            <ReplyComposer onReply={handleReply} />
          </div>

          {/* Context Panel */}
          <div className="lg:col-span-1">
            <ContextPanel
              ticket={ticket}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />
          </div>
        </div>

        {/* Action Toolbar */}
        <ActionToolbar
          ticket={ticket}
          onStatusChange={handleStatusChange}
          onAssign={handleAssign}
          onAddTag={handleAddTag}
        />
      </div>
    </div>
  );
};

export default TicketDetail;
