
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { InboxFilters } from '@/components/inbox/InboxFilters';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { useToast } from '@/hooks/use-toast';

interface TicketFilters {
  search: string;
  channel: string;
  status: string[];
  agentId: string;
  dateFrom: string;
  dateTo: string;
  customFields: Record<string, string>;
}

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

// Mock data for development
const mockKanbanData: KanbanData = {
  columns: {
    open: [
      {
        id: "ticket-001",
        subject: "Login issue with SSO",
        preview: "Unable to login using single sign-on, getting error message...",
        customer: {
          name: "John Doe",
          avatarUrl: "/placeholder.svg",
          identifier: "john.doe@company.com"
        },
        channel: "email",
        status: "open",
        priority: "High",
        assignee: {
          id: "agent-1",
          name: "Alice Johnson",
          avatarUrl: "/placeholder.svg"
        },
        lastUpdated: "2024-01-15T10:30:00Z"
      },
      {
        id: "ticket-004",
        subject: "Password reset not working",
        preview: "Tried to reset password multiple times but email never arrives...",
        customer: {
          name: "Sarah Wilson",
          avatarUrl: "/placeholder.svg",
          identifier: "sarah.wilson@example.com"
        },
        channel: "web",
        status: "open",
        priority: "Medium",
        assignee: null,
        lastUpdated: "2024-01-15T08:15:00Z"
      }
    ],
    pending: [
      {
        id: "ticket-002",
        subject: "Feature request for dark mode",
        preview: "Would love to see a dark mode option in the application...",
        customer: {
          name: "Jane Smith",
          avatarUrl: "/placeholder.svg",
          identifier: "jane.smith@example.com"
        },
        channel: "slack",
        status: "pending",
        priority: "Medium",
        assignee: {
          id: "agent-2",
          name: "Bob Smith",
          avatarUrl: "/placeholder.svg"
        },
        lastUpdated: "2024-01-15T09:15:00Z"
      }
    ],
    resolved: [
      {
        id: "ticket-003",
        subject: "Billing question about premium plan",
        preview: "I have a question about upgrading to the premium plan...",
        customer: {
          name: "Bob Wilson",
          avatarUrl: "/placeholder.svg",
          identifier: "bob.wilson@startup.io"
        },
        channel: "web",
        status: "resolved",
        priority: "Low",
        assignee: {
          id: "agent-3",
          name: "Carol Davis",
          avatarUrl: "/placeholder.svg"
        },
        lastUpdated: "2024-01-14T16:45:00Z"
      }
    ],
    closed: []
  }
};

const Kanban = () => {
  console.log('Kanban component rendering');
  
  const { toast } = useToast();
  const [filters, setFilters] = useState<TicketFilters>({
    search: '',
    channel: '',
    status: [],
    agentId: '',
    dateFrom: '',
    dateTo: '',
    customFields: {},
  });

  // Using mock data instead of real API call for now
  const { data: kanbanData, isLoading, error } = useQuery({
    queryKey: ['kanban-tickets', filters],
    queryFn: async (): Promise<KanbanData> => {
      console.log('Fetching kanban tickets with filters:', filters);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockKanbanData;
    },
  });

  console.log('Kanban data:', kanbanData);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);

  const handleFilterChange = (newFilters: Partial<TicketFilters>) => {
    console.log('Filter change:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleTicketMove = async (ticketId: string, newStatus: string, oldStatus: string) => {
    console.log('Moving ticket:', ticketId, 'from', oldStatus, 'to', newStatus);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      toast({
        title: "Ticket moved",
        description: `Ticket #${ticketId} moved to ${newStatus}`,
        action: (
          <button 
            onClick={() => handleTicketMove(ticketId, oldStatus, newStatus)}
            className="underline"
          >
            Undo
          </button>
        ),
      });
    } catch (error) {
      console.error('Error moving ticket:', error);
      toast({
        title: "Error",
        description: "Failed to move ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleQuickReply = async (ticketId: string, message: string) => {
    console.log('Quick reply for ticket:', ticketId, 'message:', message);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Reply sent",
        description: `Reply sent for ticket #${ticketId}`,
      });
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Couldn't send reply. Try again.",
        variant: "destructive",
      });
    }
  };

  const handleAssignTicket = async (ticketId: string, agentId: string, agentName: string) => {
    console.log('Assigning ticket:', ticketId, 'to agent:', agentId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      toast({
        title: "Ticket assigned",
        description: `Assigned to ${agentName}`,
      });
    } catch (error) {
      console.error('Error assigning ticket:', error);
      toast({
        title: "Error",
        description: "Failed to assign ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    console.error('Error in Kanban:', error);
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700">Couldn't fetch kanban data. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Kanban Board</h1>
        </div>
      </div>

      <div className="max-w-full mx-auto p-6">
        {/* Filters */}
        <InboxFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Kanban Board */}
        <div className="mt-6">
          {isLoading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading kanban board...</p>
            </div>
          ) : (
            <KanbanBoard
              data={kanbanData || mockKanbanData}
              onTicketMove={handleTicketMove}
              onQuickReply={handleQuickReply}
              onAssignTicket={handleAssignTicket}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Kanban;
