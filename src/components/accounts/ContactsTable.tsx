
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash } from 'lucide-react';
import { Contact } from '@/pages/AccountsContacts';

interface ContactsTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
  onViewContact: (contact: Contact) => void;
  onViewAccount: (accountId: string) => void;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts,
  onEdit,
  onDelete,
  onViewContact,
  onViewAccount
}) => {
  const formatLastInteraction = (dateString: string) => {
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

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No contacts found</div>
        <p className="text-gray-500">Create a new contact or sync from CRM.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact Name</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Open Tickets</TableHead>
            <TableHead>Last Interaction</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="hover:bg-gray-50">
              <TableCell>
                <button
                  onClick={() => onViewContact(contact)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-left"
                >
                  {contact.firstName} {contact.lastName}
                </button>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => onViewAccount(contact.accountId)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {contact.accountName}
                </button>
              </TableCell>
              <TableCell>
                <a 
                  href={`mailto:${contact.email}`}
                  className="text-gray-900 hover:text-blue-600"
                >
                  {contact.email}
                </a>
              </TableCell>
              <TableCell>
                <a 
                  href={`tel:${contact.phone}`}
                  className="text-gray-900 hover:text-blue-600"
                >
                  {contact.phone}
                </a>
              </TableCell>
              <TableCell>
                <span className="text-gray-900">{contact.title}</span>
              </TableCell>
              <TableCell>
                {contact.openTicketsCount > 0 ? (
                  <Badge className="bg-red-100 text-red-800">
                    {contact.openTicketsCount}
                  </Badge>
                ) : (
                  <Badge variant="outline">0</Badge>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-500">
                  {formatLastInteraction(contact.lastInteraction)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(contact)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(contact.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
