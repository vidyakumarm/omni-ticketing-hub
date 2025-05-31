
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

interface TicketFilters {
  search: string;
  channel: string;
  status: string[];
  agentId: string;
  dateFrom: string;
  dateTo: string;
  customFields: Record<string, string>;
}

interface InboxFiltersProps {
  filters: TicketFilters;
  onFilterChange: (filters: Partial<TicketFilters>) => void;
}

export const InboxFilters: React.FC<InboxFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    onFilterChange({ status: newStatus });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      channel: '',
      status: [],
      agentId: '',
      dateFrom: '',
      dateTo: '',
      customFields: {},
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.channel || 
    filters.status.length > 0 || 
    filters.agentId || 
    filters.dateFrom || 
    filters.dateTo ||
    Object.values(filters.customFields).some(Boolean);

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      {/* First Row */}
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tickets by ID, subject, or customer name..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Channel Filter */}
        <Select value={filters.channel} onValueChange={(value) => onFilterChange({ channel: value })}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Channels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Channels</SelectItem>
            <SelectItem value="slack">Slack</SelectItem>
            <SelectItem value="teams">MS Teams</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="web">Web</SelectItem>
          </SelectContent>
        </Select>

        {/* Agent Filter */}
        <Select value={filters.agentId} onValueChange={(value) => onFilterChange({ agentId: value })}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Agents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Agents</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            <SelectItem value="agent-1">Alice Johnson</SelectItem>
            <SelectItem value="agent-2">Bob Smith</SelectItem>
            <SelectItem value="agent-3">Carol Davis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Second Row */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          {['open', 'pending', 'resolved', 'closed'].map((status) => (
            <Badge
              key={status}
              variant={filters.status.includes(status) ? 'default' : 'outline'}
              className="cursor-pointer capitalize"
              onClick={() => handleStatusToggle(status)}
            >
              {status}
            </Badge>
          ))}
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Date Range:</span>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
            className="w-[140px]"
          />
          <span className="text-gray-400">to</span>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange({ dateTo: e.target.value })}
            className="w-[140px]"
          />
        </div>

        {/* Priority Filter (Custom Field Example) */}
        <Select 
          value={filters.customFields.priority || ''} 
          onValueChange={(value) => onFilterChange({ 
            customFields: { ...filters.customFields, priority: value }
          })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
