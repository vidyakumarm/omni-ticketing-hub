
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Pencil, Mail, Phone } from 'lucide-react';
import { Contact, Account } from '@/pages/AccountsContacts';

interface ContactDetailPanelProps {
  contact: Contact;
  account?: Account;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
}

export const ContactDetailPanel: React.FC<ContactDetailPanelProps> = ({
  contact,
  account,
  onClose,
  onEdit
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg border-l z-50 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Contact Details</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(contact)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {contact.firstName} {contact.lastName}
            </h3>
            {contact.title && (
              <p className="text-gray-600">{contact.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <div className="mt-1">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Mail className="h-4 w-4" />
                  {contact.email}
                </a>
              </div>
            </div>

            {contact.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <div className="mt-1">
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Phone className="h-4 w-4" />
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-500">Account</label>
              <div className="mt-1">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  {contact.accountName}
                </button>
                {account && (
                  <div className="text-sm text-gray-500 mt-1">
                    {account.industry}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Created</label>
              <div className="mt-1 text-gray-900">{formatDate(contact.createdAt)}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <div className="mt-1 text-gray-900">{formatDate(contact.updatedAt)}</div>
            </div>
          </div>
        </div>

        {/* Open Tickets */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Open Tickets</h4>
            <Badge className={contact.openTicketsCount > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
              {contact.openTicketsCount}
            </Badge>
          </div>
          {contact.openTicketsCount === 0 ? (
            <p className="text-gray-500 text-sm">No open tickets</p>
          ) : (
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded">
                <div className="font-medium text-sm">Sample Ticket #001</div>
                <div className="text-xs text-gray-500">Login issues with SSO</div>
              </div>
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <div className="text-sm text-gray-900">Contact created</div>
                <div className="text-xs text-gray-500">{formatDate(contact.createdAt)}</div>
              </div>
            </div>
            {contact.lastInteraction && (
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <div className="text-sm text-gray-900">Last interaction</div>
                  <div className="text-xs text-gray-500">{formatDate(contact.lastInteraction)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
