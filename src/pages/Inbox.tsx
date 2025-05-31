
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { InboxFilters } from '@/components/inbox/InboxFilters';
import { BulkActionsBar } from '@/components/inbox/BulkActionsBar';
import { TicketListTable } from '@/components/inbox/TicketListTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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

interface TicketsResponse {
  tickets: Ticket[];
  pagination: {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

const Inbox = () => {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [filters, setFilters] = useState<TicketFilters>({
    search: '',
    channel: '',
    status: [],
    agentId: '',
    dateFrom: '',
    dateTo: '',
    customFields: {},
  });

  const buildQueryParams = () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      perPage: perPage.toString(),
    });

    if (filters.search) params.append('search', filters.search);
    if (filters.channel) params.append('channel', filters.channel);
    if (filters.status.length > 0) {
      filters.status.forEach(status => params.append('status', status));
    }
    if (filters.agentId) params.append('agentId', filters.agentId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    Object.entries(filters.customFields).forEach(([key, value]) => {
      if (value) params.append(`customField_${key}`, value);
    });

    return params.toString();
  };

  const { data: ticketsData, isLoading, error } = useQuery({
    queryKey: ['tickets', currentPage, perPage, filters],
    queryFn: async (): Promise<TicketsResponse> => {
      const queryParams = buildQueryParams();
      const response = await fetch(`/api/workspace/workspace-id/tickets?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      return response.json();
    },
  });

  const handleFilterChange = (newFilters: Partial<TicketFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSelectTicket = (ticketId: string, selected: boolean) => {
    if (selected) {
      setSelectedTickets(prev => [...prev, ticketId]);
    } else {
      setSelectedTickets(prev => prev.filter(id => id !== ticketId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected && ticketsData?.tickets) {
      setSelectedTickets(ticketsData.tickets.map(ticket => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleBulkAction = async (action: string, payload: any) => {
    console.log('Bulk action:', action, payload, selectedTickets);
    // API calls for bulk actions will be implemented here
    setSelectedTickets([]); // Clear selection after action
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700">Couldn't fetch tickets. Please try again.</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
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
          <h1 className="text-2xl font-semibold text-gray-900">Inbox</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Ticket
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <InboxFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Bulk Actions */}
        {selectedTickets.length > 0 && (
          <BulkActionsBar
            selectedCount={selectedTickets.length}
            onBulkAction={handleBulkAction}
          />
        )}

        {/* Ticket List */}
        <div className="mt-6">
          {isLoading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading tickets...</p>
            </div>
          ) : ticketsData?.tickets.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">No tickets found. Try removing filters or create a new ticket.</p>
              <Button>Create New Ticket</Button>
            </div>
          ) : (
            <TicketListTable
              tickets={ticketsData?.tickets || []}
              selectedTickets={selectedTickets}
              onSelectTicket={handleSelectTicket}
              onSelectAll={handleSelectAll}
              pagination={ticketsData?.pagination}
              currentPage={currentPage}
              perPage={perPage}
              onPageChange={setCurrentPage}
              onPerPageChange={setPerPage}
            />
          )}
        </div>

        {/* Footer */}
        {ticketsData?.pagination && (
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 text-center">
              Showing {((currentPage - 1) * perPage) + 1}–{Math.min(currentPage * perPage, ticketsData.pagination.totalItems)} of {ticketsData.pagination.totalItems} tickets
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
