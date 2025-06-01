
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash } from 'lucide-react';
import { Account } from '@/pages/AccountsContacts';

interface AccountsTableProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
  onViewAccount: (account: Account) => void;
}

export const AccountsTable: React.FC<AccountsTableProps> = ({
  accounts,
  onEdit,
  onDelete,
  onViewAccount
}) => {
  const formatLastActivity = (dateString: string) => {
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

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No accounts found</div>
        <p className="text-gray-500">Create a new account to start tracking customers.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Primary Contact</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Open Tickets</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id} className="hover:bg-gray-50">
              <TableCell>
                <button
                  onClick={() => onViewAccount(account)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-left"
                >
                  {account.name}
                </button>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{account.industry}</Badge>
              </TableCell>
              <TableCell>
                {account.primaryContactName ? (
                  <span className="text-gray-900">{account.primaryContactName}</span>
                ) : (
                  <span className="text-gray-500">No primary contact</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-gray-900">{account.ownerName}</span>
              </TableCell>
              <TableCell>
                {account.openTicketsCount > 0 ? (
                  <Badge className="bg-red-100 text-red-800">
                    {account.openTicketsCount}
                  </Badge>
                ) : (
                  <Badge variant="outline">0</Badge>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-500">
                  {formatLastActivity(account.lastActivity)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(account)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(account.id)}
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
