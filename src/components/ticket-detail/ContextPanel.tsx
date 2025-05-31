
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Ticket {
  id: string;
  channel: 'slack' | 'email' | 'teams' | 'web';
  createdAt: string;
  updatedAt: string;
  slaStatus: {
    firstResponseDeadline: string;
    resolutionDeadline: string;
  };
  linkedItems: Array<{
    type: string;
    id: string;
    url: string;
  }>;
  activityLog: Array<{
    type: string;
    timestamp: string;
    by: string;
    details: string;
  }>;
}

interface ContextPanelProps {
  ticket: Ticket;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({ ticket }) => {
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'slack':
        return '💬';
      case 'email':
        return '📧';
      case 'teams':
        return '👥';
      case 'web':
        return '🌐';
      default:
        return '📝';
    }
  };

  const formatTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    if (diff < 0) {
      return 'Overdue';
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Ticket Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ticket Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Channel</h4>
            <div className="flex items-center gap-2">
              <span>{getChannelIcon(ticket.channel)}</span>
              <span className="text-sm text-gray-600 capitalize">{ticket.channel}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Created</h4>
            <p className="text-sm text-gray-600">
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Last Updated</h4>
            <p className="text-sm text-gray-600">
              {new Date(ticket.updatedAt).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SLA Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">SLA Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">First Response</span>
              <Badge variant="outline" className="text-xs">
                {formatTimeRemaining(ticket.slaStatus.firstResponseDeadline)}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">
              Due: {new Date(ticket.slaStatus.firstResponseDeadline).toLocaleString()}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Resolution</span>
              <Badge variant="outline" className="text-xs">
                {formatTimeRemaining(ticket.slaStatus.resolutionDeadline)}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">
              Due: {new Date(ticket.slaStatus.resolutionDeadline).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Linked Items */}
      {ticket.linkedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Linked Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ticket.linkedItems.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium">{item.id}</span>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ticket.activityLog.map((activity, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{activity.details}</p>
                <p className="text-xs text-gray-500">by {activity.by}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
