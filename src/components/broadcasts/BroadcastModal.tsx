
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Send, X } from 'lucide-react';
import { Broadcast } from '@/types/broadcast';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  broadcast?: Broadcast | null;
  onSave: (broadcastData: Omit<Broadcast, 'id' | 'createdAt' | 'createdBy' | 'status'>) => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  broadcast,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    audience: { type: 'all' as 'all' | 'segments' },
    channels: [] as string[],
    message: '',
    schedule: { type: 'now' as 'now' | 'later' },
    timeZone: 'UTC',
  });

  useEffect(() => {
    if (broadcast) {
      setFormData({
        name: broadcast.name,
        audience: broadcast.audience,
        channels: broadcast.channels,
        message: broadcast.message,
        schedule: broadcast.schedule,
        timeZone: broadcast.timeZone,
      });
    } else {
      setFormData({
        name: '',
        audience: { type: 'all' },
        channels: [],
        message: '',
        schedule: { type: 'now' },
        timeZone: 'UTC',
      });
    }
  }, [broadcast, isOpen]);

  const handleSave = () => {
    onSave(formData);
  };

  const handleChannelToggle = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const availableChannels = ['slack', 'teams', 'email'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {broadcast ? 'Edit Broadcast' : 'Create New Broadcast'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <Label htmlFor="name">Broadcast Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., May Product Update"
            />
          </div>

          {/* Audience */}
          <div>
            <Label className="text-sm font-medium">Audience</Label>
            <RadioGroup
              value={formData.audience.type}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                audience: { type: value as 'all' | 'segments' }
              }))}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All customers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="segments" id="segments" />
                <Label htmlFor="segments">Specific segments</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Channels */}
          <div>
            <Label className="text-sm font-medium">Channels *</Label>
            <div className="mt-2 space-y-2">
              {availableChannels.map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <Checkbox
                    id={channel}
                    checked={formData.channels.includes(channel)}
                    onCheckedChange={() => handleChannelToggle(channel)}
                  />
                  <Label htmlFor={channel} className="capitalize">{channel}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Hello {{customerName}}, we have exciting updates to share..."
              rows={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use {'{{customerName}}'} for personalization
            </p>
          </div>

          {/* Schedule */}
          <div>
            <Label className="text-sm font-medium">Schedule</Label>
            <RadioGroup
              value={formData.schedule.type}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                schedule: { type: value as 'now' | 'later' }
              }))}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="now" id="now" />
                <Label htmlFor="now">Send now</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="later" id="later" />
                <Label htmlFor="later">Schedule for later</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>{broadcast ? 'Update' : 'Create'} Broadcast</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
