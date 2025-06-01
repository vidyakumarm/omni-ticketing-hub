import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { InboxFilters } from '@/components/inbox/InboxFilters';
import { TicketListTable } from '@/components/inbox/TicketListTable';
import { BulkActionsBar } from '@/components/inbox/BulkActionsBar';
import { NewTicketModal } from '@/components/ticket-creation/NewTicketModal';
import { MergeTicketsModal } from '@/components/tickets/MergeTicketsModal';

interface TicketFilters {
  search: string;
  status: string[];
  agentId: string;
  priority: string[];
  channel: string;
  dateFrom: string;
  dateTo: string;
  customFields: Record<string, any>;
}

const Inbox: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [filters, setFilters] = useState<TicketFilters>({
    search: '',
    status: [],
    agentId: '',
    priority: [],
    channel: '',
    dateFrom: '',
    dateTo: '',
    customFields: {}
  });

  const handleTicketCreated = (ticketId: string) => {
    navigate(`/ticket/${ticketId}`);
  };

  const handleBulkAction = (action: string, payload: any) => {
    console.log('Bulk action:', action, 'on tickets:', selectedTickets);
    
    if (action === 'merge') {
      setIsMergeModalOpen(true);
    } else {
      // Handle other bulk actions here
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleMergeComplete = (targetTicketId: string) => {
    // Clear selected tickets and navigate to merged ticket
    setSelectedTickets([]);
    navigate(`/ticket/${targetTicketId}`);
  };

  // Mock tickets for the table - enhanced with custom fields and tags
  const mockTickets = [
    {
      id: 'ticket-1',
      subject: 'Login issue with SSO',
      preview: 'User experiencing issues logging in with SSO configuration...',
      customer: { 
        name: 'John Doe', 
        avatarUrl: '/placeholder.svg',
        identifier: 'john.doe@company.com'
      },
      channel: 'email' as const,
      status: 'open' as const,
      priority: 'High' as const,
      assignee: { id: 'agent-1', name: 'Alice Johnson', avatarUrl: '/placeholder.svg' },
      lastUpdated: '2024-01-15T10:30:00Z',
      customFields: { product: 'Pro', plan: 'Business' },
      tags: ['login', 'sso', 'urgent']
    },
    {
      id: 'ticket-2',
      subject: 'SSO authentication error',
      preview: 'Getting error message when trying to authenticate via SSO...',
      customer: { 
        name: 'Jane Smith', 
        avatarUrl: '/placeholder.svg',
        identifier: 'jane.smith@company.com'
      },
      channel: 'slack' as const,
      status: 'open' as const,
      priority: 'Medium' as const,
      assignee: { id: 'agent-2', name: 'Bob Smith', avatarUrl: '/placeholder.svg' },
      lastUpdated: '2024-01-15T11:15:00Z',
      customFields: { product: 'Enterprise', plan: 'Business' },
      tags: ['login', 'sso']
    },
    {
      id: 'ticket-3',
      subject: 'Account access problems',
      preview: 'Cannot access account after recent update...',
      customer: { 
        name: 'Mike Johnson', 
        avatarUrl: '/placeholder.svg',
        identifier: 'mike.johnson@company.com'
      },
      channel: 'web' as const,
      status: 'pending' as const,
      priority: 'Low' as const,
      assignee: null,
      lastUpdated: '2024-01-15T09:45:00Z',
      customFields: { product: 'Pro', plan: 'Basic' },
      tags: ['access', 'account']
    }
  ];

  const selectedTicketObjects = mockTickets.filter(ticket => selectedTickets.includes(ticket.id));

  const handleSelectTicket = (ticketId: string, selected: boolean) => {
    setSelectedTickets(prev => 
      selected 
        ? [...prev, ticketId]
        : prev.filter(id => id !== ticketId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedTickets(selected ? mockTickets.map(t => t.id) : []);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
            <Button onClick={() => setIsNewTicketModalOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Ticket
            </Button>
          </div>

          {/* Filters */}
          <InboxFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Bulk Actions Bar */}
          {selectedTickets.length > 0 && (
            <BulkActionsBar 
              selectedCount={selectedTickets.length}
              onBulkAction={handleBulkAction}
            />
          )}

          {/* Ticket List */}
          <TicketListTable 
            tickets={mockTickets}
            selectedTickets={selectedTickets}
            onSelectTicket={handleSelectTicket}
            onSelectAll={handleSelectAll}
            currentPage={1}
            perPage={25}
            onPageChange={() => {}}
            onPerPageChange={() => {}}
          />

          {/* New Ticket Modal */}
          <NewTicketModal
            isOpen={isNewTicketModalOpen}
            onClose={() => setIsNewTicketModalOpen(false)}
            onTicketCreated={handleTicketCreated}
          />

          {/* Merge Tickets Modal */}
          <MergeTicketsModal
            isOpen={isMergeModalOpen}
            onClose={() => setIsMergeModalOpen(false)}
            tickets={selectedTicketObjects}
            onMergeComplete={handleMergeComplete}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Inbox;
