
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { InboxFilters } from '@/components/inbox/InboxFilters';
import { TicketListTable } from '@/components/inbox/TicketListTable';
import { BulkActionsBar } from '@/components/inbox/BulkActionsBar';
import { NewTicketModal } from '@/components/ticket-creation/NewTicketModal';

const Inbox: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  const handleTicketCreated = (ticketId: string) => {
    navigate(`/ticket/${ticketId}`);
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
        <InboxFilters />

        {/* Bulk Actions Bar */}
        {selectedTickets.length > 0 && (
          <BulkActionsBar 
            selectedCount={selectedTickets.length}
            onClearSelection={() => setSelectedTickets([])}
          />
        )}

        {/* Ticket List */}
        <TicketListTable 
          selectedTickets={selectedTickets}
          onSelectionChange={setSelectedTickets}
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
