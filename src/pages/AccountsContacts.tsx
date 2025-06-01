
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { AccountsTable } from '@/components/accounts/AccountsTable';
import { ContactsTable } from '@/components/accounts/ContactsTable';
import { AccountFilters } from '@/components/accounts/AccountFilters';
import { ContactFilters } from '@/components/accounts/ContactFilters';
import { AccountModal } from '@/components/accounts/AccountModal';
import { ContactModal } from '@/components/accounts/ContactModal';
import { AccountDetailPanel } from '@/components/accounts/AccountDetailPanel';
import { ContactDetailPanel } from '@/components/accounts/ContactDetailPanel';

export interface Account {
  id: string;
  name: string;
  industry: string;
  website: string;
  address: string;
  ownerId: string;
  ownerName: string;
  primaryContactId?: string;
  primaryContactName?: string;
  openTicketsCount: number;
  lastActivity: string;
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  accountId: string;
  accountName: string;
  openTicketsCount: number;
  lastInteraction: string;
  createdAt: string;
  updatedAt: string;
}

interface AccountFilters {
  industry: string;
  ownerId: string;
  customFields: Record<string, any>;
  dateFrom: string;
  dateTo: string;
}

interface ContactFilters {
  accountId: string;
  emailPhone: string;
}

const AccountsContacts: React.FC = () => {
  const [activeTab, setActiveTab] = useState('accounts');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const [accountFilters, setAccountFilters] = useState<AccountFilters>({
    industry: '',
    ownerId: '',
    customFields: {},
    dateFrom: '',
    dateTo: ''
  });

  const [contactFilters, setContactFilters] = useState<ContactFilters>({
    accountId: '',
    emailPhone: ''
  });

  // Mock data
  const mockAccounts: Account[] = [
    {
      id: 'acc-1',
      name: 'Acme Corporation',
      industry: 'Technology',
      website: 'https://acme.com',
      address: '123 Main St, San Francisco, CA',
      ownerId: 'user-1',
      ownerName: 'Alice Johnson',
      primaryContactId: 'contact-1',
      primaryContactName: 'John Smith',
      openTicketsCount: 3,
      lastActivity: '2024-01-15T10:30:00Z',
      customFields: {},
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    }
  ];

  const mockContacts: Contact[] = [
    {
      id: 'contact-1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@acme.com',
      phone: '+1-555-0123',
      title: 'CTO',
      accountId: 'acc-1',
      accountName: 'Acme Corporation',
      openTicketsCount: 2,
      lastInteraction: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    }
  ];

  const handleAccountCreated = (account: Account) => {
    console.log('Account created:', account);
    setIsAccountModalOpen(false);
    setEditingAccount(null);
  };

  const handleContactCreated = (contact: Contact) => {
    console.log('Contact created:', contact);
    setIsContactModalOpen(false);
    setEditingContact(null);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsAccountModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };

  const handleDeleteAccount = (accountId: string) => {
    console.log('Delete account:', accountId);
  };

  const handleDeleteContact = (contactId: string) => {
    console.log('Delete contact:', contactId);
  };

  const handleAccountFilterChange = (newFilters: any) => {
    setAccountFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleContactFilterChange = (newFilters: any) => {
    setContactFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Accounts & Contacts</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsAccountModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Account
            </Button>
            <Button 
              onClick={() => setIsContactModalOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Contact
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search accounts, contacts, or emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-4">
            <AccountFilters 
              filters={accountFilters}
              onFilterChange={handleAccountFilterChange}
            />
            <AccountsTable
              accounts={mockAccounts}
              onEdit={handleEditAccount}
              onDelete={handleDeleteAccount}
              onViewAccount={setSelectedAccount}
            />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <ContactFilters 
              filters={contactFilters}
              onFilterChange={handleContactFilterChange}
            />
            <ContactsTable
              contacts={mockContacts}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
              onViewContact={setSelectedContact}
              onViewAccount={(accountId) => {
                const account = mockAccounts.find(a => a.id === accountId);
                if (account) setSelectedAccount(account);
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <AccountModal
          isOpen={isAccountModalOpen}
          onClose={() => {
            setIsAccountModalOpen(false);
            setEditingAccount(null);
          }}
          onAccountCreated={handleAccountCreated}
          editingAccount={editingAccount}
        />

        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => {
            setIsContactModalOpen(false);
            setEditingContact(null);
          }}
          onContactCreated={handleContactCreated}
          editingContact={editingContact}
          accounts={mockAccounts}
        />

        {/* Detail Panels */}
        {selectedAccount && (
          <AccountDetailPanel
            account={selectedAccount}
            onClose={() => setSelectedAccount(null)}
            onEdit={handleEditAccount}
          />
        )}

        {selectedContact && (
          <ContactDetailPanel
            contact={selectedContact}
            onClose={() => setSelectedContact(null)}
            onEdit={handleEditContact}
            account={mockAccounts.find(a => a.id === selectedContact.accountId)}
          />
        )}
      </div>
    </div>
  );
};

export default AccountsContacts;
