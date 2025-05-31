
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface Pagination {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

interface TicketListTableProps {
  tickets: Ticket[];
  selectedTickets: string[];
  onSelectTicket: (ticketId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  pagination?: Pagination;
  currentPage: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export const TicketListTable: React.FC<TicketListTableProps> = ({
  tickets,
  selectedTickets,
  onSelectTicket,
  onSelectAll,
  pagination,
  currentPage,
  perPage,
  onPageChange,
  onPerPageChange,
}) => {
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'slack': return '💬';
      case 'teams': return '🟣';
      case 'email': return '📧';
      case 'web': return '🌐';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const allSelected = tickets.length > 0 && tickets.every(ticket => selectedTickets.includes(ticket.id));
  const someSelected = selectedTickets.length > 0 && !allSelected;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
                aria-label="Select all tickets"
                className={someSelected ? 'data-[state=checked]:bg-blue-600' : ''}
              />
            </TableHead>
            <TableHead>Ticket ID</TableHead>
            <TableHead>Subject / Preview</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow 
              key={ticket.id} 
              className="hover:bg-gray-50 cursor-pointer"
              role="row"
            >
              <TableCell>
                <Checkbox
                  checked={selectedTickets.includes(ticket.id)}
                  onCheckedChange={(checked) => onSelectTicket(ticket.id, !!checked)}
                  aria-label={`Select Ticket #${ticket.id.slice(0, 8)}`}
                />
              </TableCell>
              <TableCell>
                <a 
                  href={`/tickets/${ticket.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  #{ticket.id.slice(0, 8)}
                </a>
              </TableCell>
              <TableCell className="max-w-xs">
                <div>
                  <div className="font-medium text-gray-900 truncate">{ticket.subject}</div>
                  <div className="text-sm text-gray-500 truncate">{ticket.preview}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={ticket.customer.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {ticket.customer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{ticket.customer.name}</div>
                    <div className="text-xs text-gray-500">{ticket.customer.identifier}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span className="text-lg">{getChannelIcon(ticket.channel)}</span>
                  <span className="text-sm capitalize">{ticket.channel}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(ticket.status)} capitalize`}>
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </TableCell>
              <TableCell>
                {ticket.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={ticket.assignee.avatarUrl} />
                      <AvatarFallback className="text-xs">
                        {ticket.assignee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{ticket.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-500">
                  {formatLastUpdated(ticket.lastUpdated)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination && (
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <Select value={perPage.toString()} onValueChange={(value) => onPerPageChange(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
