
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Pencil, ExternalLink } from 'lucide-react';
import { Account } from '@/pages/AccountsContacts';

interface AccountDetailPanelProps {
  account: Account;
  onClose: () => void;
  onEdit: (account: Account) => void;
}

export const AccountDetailPanel: React.FC<AccountDetailPanelProps> = ({
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
          <h2 className="text-xl font-semibold text-gray-900">Account Details</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(account)}
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

        {/* Account Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
            <Badge variant="outline" className="mt-1">{account.industry}</Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {account.website && (
              <div>
                <label className="text-sm font-medium text-gray-500">Website</label>
                <div className="mt-1">
                  <a
                    href={account.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {account.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            {account.address && (
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <div className="mt-1 text-gray-900">{account.address}</div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-500">Account Owner</label>
              <div className="mt-1 text-gray-900">{account.ownerName}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Created</label>
              <div className="mt-1 text-gray-900">{formatDate(account.createdAt)}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <div className="mt-1 text-gray-900">{formatDate(account.updatedAt)}</div>
            </div>
          </div>
        </div>

        {/* Open Tickets */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Open Tickets</h4>
            <Badge className={account.openTicketsCount > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
              {account.openTicketsCount}
            </Badge>
          </div>
          {account.openTicketsCount === 0 ? (
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

        {/* Associated Contacts */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Associated Contacts</h4>
          {account.primaryContactName ? (
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded">
                <div className="font-medium text-sm">{account.primaryContactName}</div>
                <div className="text-xs text-gray-500">Primary Contact</div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No contacts associated</p>
          )}
        </div>

        {/* Activity Timeline */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <div className="text-sm text-gray-900">Account created</div>
                <div className="text-xs text-gray-500">{formatDate(account.createdAt)}</div>
              </div>
            </div>
            {account.updatedAt !== account.createdAt && (
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <div className="text-sm text-gray-900">Account updated</div>
                  <div className="text-xs text-gray-500">{formatDate(account.updatedAt)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
