
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface CustomerSelectorProps {
  isCreatingNew: boolean;
  onToggleCreateNew: (isCreating: boolean) => void;
  selectedCustomerId: string;
  onCustomerSelect: (customerId: string) => void;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  customerEmail: string;
  onCustomerEmailChange: (email: string) => void;
}

export const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  isCreatingNew,
  onToggleCreateNew,
  selectedCustomerId,
  onCustomerSelect,
  customerName,
  onCustomerNameChange,
  customerEmail,
  onCustomerEmailChange
}) => {
  // Mock customers data
  const mockCustomers: Customer[] = [
    { id: 'cust-1', name: 'John Doe', email: 'john.doe@example.com' },
    { id: 'cust-2', name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: 'cust-3', name: 'Bob Johnson', email: 'bob.johnson@example.com' }
  ];

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <Button
          type="button"
          variant={!isCreatingNew ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToggleCreateNew(false)}
        >
          Select Existing
        </Button>
        <Button
          type="button"
          variant={isCreatingNew ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToggleCreateNew(true)}
        >
          Create New Customer
        </Button>
      </div>

      {!isCreatingNew ? (
        <Select value={selectedCustomerId} onValueChange={onCustomerSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a customer" />
          </SelectTrigger>
          <SelectContent>
            {mockCustomers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name} ({customer.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name *</Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => onCustomerNameChange(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-email">Customer Email *</Label>
              <Input
                id="customer-email"
                type="email"
                value={customerEmail}
                onChange={(e) => onCustomerEmailChange(e.target.value)}
                placeholder="Enter customer email"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
