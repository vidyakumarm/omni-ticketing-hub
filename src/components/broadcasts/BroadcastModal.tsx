
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, MessageSquare, Send } from 'lucide-react';
import type { Broadcast } from '@/pages/Broadcasts';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (broadcast: Partial<Broadcast>) => void;
  broadcast?: Broadcast | null;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  onSave,
  broadcast
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: broadcast?.name || '',
    audienceType: broadcast?.audience?.type || 'all' as 'all' | 'segments',
    channels: broadcast?.channels || [],
    message: broadcast?.message || '',
    scheduleType: 'now',
    scheduledDate: '',
    scheduledTime: '',
    timeZone: 'Asia/Kolkata'
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChannelChange = (channel: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      channels: checked
        ? [...prev.channels, channel]
        : prev.channels.filter(c => c !== channel)
    }));
  };

  const handleSubmit = () => {
    const broadcastData: Partial<Broadcast> = {
      id: broadcast?.id || `broadcast-${Date.now()}`,
      name: formData.name,
      audience: {
        type: formData.audienceType,
        filters: {}
      },
      channels: formData.channels,
      message: formData.message,
      scheduledAt: formData.scheduleType === 'now' 
        ? new Date().toISOString()
        : new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString(),
      status: formData.scheduleType === 'now' ? 'sent' : 'scheduled',
      createdBy: { id: 'user-1', name: 'Admin User' },
      createdAt: broadcast?.createdAt || new Date().toISOString()
    };

    onSave(broadcastData);
    onClose();
    setStep(1);
    setFormData({
      name: '',
      audienceType: 'all',
      channels: [],
      message: '',
      scheduleType: 'now',
      scheduledDate: '',
      scheduledTime: '',
      timeZone: 'Asia/Kolkata'
    });
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '';
      case 2:
        return formData.channels.length > 0 && formData.message.trim() !== '';
      case 3:
        return formData.scheduleType === 'now' || 
               (formData.scheduledDate && formData.scheduledTime);
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {broadcast ? 'Edit Broadcast' : 'Create New Broadcast'}
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center space-x-4 mb-6">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              <span className={`ml-2 text-sm ${
                step >= stepNumber ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}>
                {stepNumber === 1 ? 'Audience' : stepNumber === 2 ? 'Message' : 'Schedule'}
              </span>
              {stepNumber < 3 && <div className="w-8 h-px bg-gray-300 ml-4" />}
            </div>
          ))}
        </div>

        {/* Step 1: Audience Definition */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Broadcast Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., May Product Update"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Audience Type</Label>
              <RadioGroup
                value={formData.audienceType}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  audienceType: value as 'all' | 'segments'
                }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All Customers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="segments" id="segments" />
                  <Label htmlFor="segments">Segment by Filters</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.audienceType === 'segments' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Filter Options</p>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="channel-filter">Channel</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slack">Slack</SelectItem>
                        <SelectItem value="teams">MS Teams</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Preview: ~150 customers match these filters
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Message Composition */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label>Select Channels</Label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="slack"
                    checked={formData.channels.includes('slack')}
                    onCheckedChange={(checked) => handleChannelChange('slack', checked as boolean)}
                  />
                  <Label htmlFor="slack">Slack</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="teams"
                    checked={formData.channels.includes('teams')}
                    onCheckedChange={(checked) => handleChannelChange('teams', checked as boolean)}
                  />
                  <Label htmlFor="teams">MS Teams</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Type your broadcast message here..."
                rows={8}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use variables like {{customerName}} for personalization
              </p>
            </div>

            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Preview Message
            </Button>
          </div>
        )}

        {/* Step 3: Schedule & Review */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Label>Schedule</Label>
              <RadioGroup
                value={formData.scheduleType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, scheduleType: value }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="now" id="now" />
                  <Label htmlFor="now">Send Now</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="later" id="later" />
                  <Label htmlFor="later">Schedule for Later</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.scheduleType === 'later' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="timezone">Time Zone</Label>
              <Select value={formData.timeZone} onValueChange={(value) => setFormData(prev => ({ ...prev, timeZone: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Review Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Review Summary</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Audience:</strong> {formData.audienceType === 'all' ? 'All Customers' : 'Filtered Segment'}</div>
                <div><strong>Channels:</strong> {formData.channels.map(c => c === 'teams' ? 'MS Teams' : 'Slack').join(', ')}</div>
                <div><strong>Schedule:</strong> {formData.scheduleType === 'now' ? 'Send immediately' : `${formData.scheduledDate} at ${formData.scheduledTime}`}</div>
                <div><strong>Message:</strong> {formData.message.substring(0, 100)}{formData.message.length > 100 ? '...' : ''}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {step < 3 ? (
              <Button onClick={handleNext} disabled={!isStepValid()}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!isStepValid()}>
                <Send className="h-4 w-4 mr-2" />
                {formData.scheduleType === 'now' ? 'Send Now' : 'Schedule Broadcast'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
