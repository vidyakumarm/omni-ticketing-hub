
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Account } from '@/pages/AccountsContacts';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreated: (account: Account) => void;
  editingAccount?: Account | null;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onAccountCreated,
  editingAccount
}) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    address: '',
    ownerId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingAccount) {
      setFormData({
        name: editingAccount.name,
        industry: editingAccount.industry,
        website: editingAccount.website,
        address: editingAccount.address,
        ownerId: editingAccount.ownerId
      });
    } else {
      setFormData({
        name: '',
        industry: '',
        website: '',
        address: '',
        ownerId: ''
      });
    }
    setErrors({});
  }, [editingAccount, isOpen]);

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Other'
  ];

  const owners = [
    { id: 'user-1', name: 'Alice Johnson' },
    { id: 'user-2', name: 'Bob Smith' },
    { id: 'user-3', name: 'Carol Davis' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Account name must be 100 characters or less';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.ownerId) {
      newErrors.ownerId = 'Account owner is required';
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Website must be a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const ownerName = owners.find(o => o.id === formData.ownerId)?.name || '';

    const accountData: Account = {
      id: editingAccount?.id || `acc-${Date.now()}`,
      name: formData.name,
      industry: formData.industry,
      website: formData.website,
      address: formData.address,
      ownerId: formData.ownerId,
      ownerName,
      openTicketsCount: editingAccount?.openTicketsCount || 0,
      lastActivity: editingAccount?.lastActivity || new Date().toISOString(),
      customFields: editingAccount?.customFields || {},
      createdAt: editingAccount?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAccountCreated(accountData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingAccount ? 'Edit Account' : 'Add New Account'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter account name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => handleInputChange('industry', value)}
            >
              <SelectTrigger className={errors.industry ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-sm text-red-600">{errors.industry}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://example.com"
              className={errors.website ? 'border-red-500' : ''}
            />
            {errors.website && (
              <p className="text-sm text-red-600">{errors.website}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Account Owner *</Label>
            <Select
              value={formData.ownerId}
              onValueChange={(value) => handleInputChange('ownerId', value)}
            >
              <SelectTrigger className={errors.ownerId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ownerId && (
              <p className="text-sm text-red-600">{errors.ownerId}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingAccount ? 'Update Account' : 'Create Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
