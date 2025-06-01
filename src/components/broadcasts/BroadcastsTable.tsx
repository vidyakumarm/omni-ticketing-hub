
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Eye, Calendar, Users } from 'lucide-react';
import { Broadcast } from '@/types/broadcast';

interface BroadcastsTableProps {
  broadcasts: Broadcast[];
  onEdit: (broadcast: Broadcast) => void;
  onView: (broadcast: Broadcast) => void;
}

export const BroadcastsTable: React.FC<BroadcastsTableProps> = ({
  broadcasts,
  onEdit,
  onView,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Audience</TableHead>
          <TableHead>Channels</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {broadcasts.map((broadcast) => (
          <TableRow key={broadcast.id}>
            <TableCell className="font-medium">{broadcast.name}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="capitalize">{broadcast.audience.type}</span>
                {broadcast.audience.filters && (
                  <Badge variant="outline" className="text-xs">
                    Filtered
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-1">
                {broadcast.channels.map((channel) => (
                  <Badge key={channel} variant="secondary" className="text-xs">
                    {channel}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Badge className={`${getStatusColor(broadcast.status)} border-0`}>
                {broadcast.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{formatDate(broadcast.createdAt)}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(broadcast)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(broadcast)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
