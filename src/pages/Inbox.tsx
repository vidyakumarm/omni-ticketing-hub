
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { InboxFilters } from '@/components/inbox/InboxFilters';
import { TicketListTable } from '@/components/inbox/TicketListTable';
import { BulkActionsBar } from '@/components/inbox/BulkActionsBar';
import { NewTicketModal } from '@/components/ticket-creation/NewTicketModal';

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

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'on tickets:', selectedTickets);
    // Handle bulk actions here
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Mock tickets for the table
  const mockTickets = [
    {
      id: 'ticket-1',
      subject: 'Login issue with SSO',
      customer: { name: 'John Doe', avatarUrl: '/placeholder.svg' },
      channel: 'email' as const,
      status: 'open' as const,
      priority: 'High' as const,
      assignee: { id: 'agent-1', name: 'Alice Johnson' },
      lastUpdated: '2024-01-15T10:30:00Z'
    }
  ];

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedTickets(selected ? mockTickets.map(t => t.id) : []);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
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
          totalPages={1}
          onPageChange={() => {}}
        />

        {/* New Ticket Modal */}
        <NewTicketModal
          isOpen={isNewTicketModalOpen}
          onClose={() => setIsNewTicketModalOpen(false)}
          onTicketCreated={handleTicketCreated}
        />
      </div>
    </div>
  );
};

export default Inbox;
