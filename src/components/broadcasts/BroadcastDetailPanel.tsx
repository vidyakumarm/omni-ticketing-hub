
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Calendar, Users, MessageSquare } from 'lucide-react';
import type { Broadcast } from '@/pages/Broadcasts';

interface BroadcastDetailPanelProps {
  broadcastId: string;
  broadcasts: Broadcast[];
  onClose: () => void;
}

export const BroadcastDetailPanel: React.FC<BroadcastDetailPanelProps> = ({
  broadcastId,
  broadcasts,
  onClose
}) => {
  const broadcast = broadcasts.find(b => b.id === broadcastId);

  if (!broadcast) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatChannels = (channels: string[]) => {
    return channels.map(channel => 
      channel === 'teams' ? 'MS Teams' : 'Slack'
    ).join(', ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Broadcast Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {broadcast.name}
                <Badge className={getStatusColor(broadcast.status)}>
                  {broadcast.status}
                </Badge>
              </CardTitle>
              <CardDescription>
                Created by {broadcast.createdBy.name} on {formatDate(broadcast.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Scheduled: {formatDate(broadcast.scheduledAt)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Channels: {formatChannels(broadcast.channels)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Audience: {broadcast.audience.type === 'all' ? 'All Customers' : 'Filtered Segment'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Message Content */}
          <Card>
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{broadcast.message}</p>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Stats (if broadcast is sent) */}
          {broadcast.status === 'sent' && broadcast.deliveryStats && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {broadcast.deliveryStats.total}
                    </div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {broadcast.deliveryStats.delivered}
                    </div>
                    <div className="text-xs text-gray-500">Delivered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {broadcast.deliveryStats.failed}
                    </div>
                    <div className="text-xs text-gray-500">Failed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-2">
            {broadcast.status === 'scheduled' && (
              <Button variant="outline" className="w-full">
                Edit Broadcast
              </Button>
            )}
            {broadcast.status === 'failed' && (
              <Button className="w-full">
                Retry Broadcast
              </Button>
            )}
            {broadcast.status === 'scheduled' && (
              <Button variant="destructive" className="w-full">
                Cancel Broadcast
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
