
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  avatarUrl: string;
  contactInfo: {
    email: string;
    slackId?: string;
  };
  accountId?: string;
}

interface CustomerInfoPanelProps {
  customer: Customer;
  tags: string[];
  customFields: Record<string, string>;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const CustomerInfoPanel: React.FC<CustomerInfoPanelProps> = ({
  customer,
  tags,
  customFields,
  onAddTag,
  onRemoveTag,
}) => {
  const [newTag, setNewTag] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
      setShowAddTag(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Details */}
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={customer.avatarUrl} />
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{customer.name}</h3>
            <div className="space-y-1 mt-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Email:</span>
                <br />
                <a
                  href={`mailto:${customer.contactInfo.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {customer.contactInfo.email}
                </a>
              </div>
              {customer.contactInfo.slackId && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Slack ID:</span>
                  <br />
                  {customer.contactInfo.slackId}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Tags</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddTag(true)}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => onRemoveTag(tag)}
                  className="hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          {showAddTag && (
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTag();
                  if (e.key === 'Escape') setShowAddTag(false);
                }}
                className="text-sm"
                autoFocus
              />
              <Button size="sm" onClick={handleAddTag}>
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddTag(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Custom Fields */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Custom Fields</h4>
          <div className="space-y-2">
            {Object.entries(customFields).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="font-medium text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="ml-2 text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        {customer.accountId && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Account</h4>
            <div className="text-sm text-gray-600">
              Account ID: {customer.accountId}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
