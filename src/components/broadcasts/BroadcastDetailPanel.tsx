
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MessageSquare, Clock, X } from 'lucide-react';
import { Broadcast } from '@/types/broadcast';

interface BroadcastDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  broadcast: Broadcast | null;
}

export const BroadcastDetailPanel: React.FC<BroadcastDetailPanelProps> = ({
  isOpen,
  onClose,
  broadcast,
}) => {
  if (!broadcast) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>{broadcast.name}</SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
            <Badge className={`${getStatusColor(broadcast.status)} border-0`}>
              {broadcast.status}
            </Badge>
          </div>

          {/* Audience */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Audience</h4>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="capitalize">{broadcast.audience.type}</span>
              {broadcast.audience.filters && (
                <Badge variant="outline" className="text-xs">
                  Filtered by {broadcast.audience.filters.channel}
                </Badge>
              )}
            </div>
          </div>

          {/* Channels */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Channels</h4>
            <div className="flex space-x-2">
              {broadcast.channels.map((channel) => (
                <Badge key={channel} variant="secondary">
                  {channel}
                </Badge>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Schedule</h4>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>
                {broadcast.schedule.type === 'now' 
                  ? 'Sent immediately' 
                  : `Scheduled for ${formatDate(broadcast.schedule.dateTime!)}`
                }
              </span>
            </div>
          </div>

          {/* Message */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Message</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <MessageSquare className="h-4 w-4 text-gray-400 mt-1" />
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{broadcast.message}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Details</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDate(broadcast.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Created by {broadcast.createdBy.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Time zone: {broadcast.timeZone}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
