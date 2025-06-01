
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface ContactFiltersProps {
  filters: {
    accountId: string;
    emailPhone: string;
  };
  onFilterChange: (filters: any) => void;
}

export const ContactFilters: React.FC<ContactFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  const accounts = [
    { id: 'acc-1', name: 'Acme Corporation' },
    { id: 'acc-2', name: 'TechCorp Inc.' },
    { id: 'acc-3', name: 'Global Solutions' }
  ];

  const handleClearFilters = () => {
    onFilterChange({
      accountId: '',
      emailPhone: ''
    });
  };

  const hasActiveFilters = filters.accountId || filters.emailPhone;

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="account">Account</Label>
          <Select
            value={filters.accountId}
            onValueChange={(value) => onFilterChange({ accountId: value === 'all' ? '' : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All accounts</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailPhone">Email/Phone</Label>
          <Input
            placeholder="Search by email or phone..."
            value={filters.emailPhone}
            onChange={(e) => onFilterChange({ emailPhone: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
