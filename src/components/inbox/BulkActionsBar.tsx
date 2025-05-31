
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkAction: (action: string, payload: any) => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onBulkAction,
}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {selectedCount} ticket{selectedCount !== 1 ? 's' : ''} selected
        </Badge>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Bulk Actions:</span>
          
          {/* Assign to Agent */}
          <Select onValueChange={(value) => onBulkAction('assign', { agentId: value })}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Assign to..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent-1">Alice Johnson</SelectItem>
              <SelectItem value="agent-2">Bob Smith</SelectItem>
              <SelectItem value="agent-3">Carol Davis</SelectItem>
              <SelectItem value="unassigned">Unassign</SelectItem>
            </SelectContent>
          </Select>

          {/* Change Status */}
          <Select onValueChange={(value) => onBulkAction('status', { status: value })}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Tag */}
          <Select onValueChange={(value) => onBulkAction('tag', { tag: value })}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Tag..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
            </SelectContent>
          </Select>

          {/* Merge (if 2+ selected) */}
          {selectedCount >= 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('merge', {})}
            >
              Merge
            </Button>
          )}

          {/* Delete */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBulkAction('delete', {})}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
