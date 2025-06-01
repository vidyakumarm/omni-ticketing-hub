import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users, Send, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Broadcast {
  id: string;
  name: string;
  audience: {
    type: 'all' | 'segments';
    filters?: any;
  };
  channels: ('slack' | 'teams')[];
  message: string;
  schedule: {
    type: 'now' | 'later';
    dateTime?: string;
  };
  timeZone: string;
  status: 'scheduled' | 'sent' | 'failed';
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  broadcast?: Broadcast | null;
  onSave: (broadcast: Omit<Broadcast, 'id' | 'createdAt' | 'createdBy' | 'status'>) => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  broadcast,
  onSave,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: broadcast?.name || '',
    audience: broadcast?.audience || { type: 'all' as const },
    channels: broadcast?.channels || [],
    message: broadcast?.message || '',
    schedule: broadcast?.schedule || { type: 'now' as const },
    timeZone: broadcast?.timeZone || 'UTC',
  });

  const [audienceCount, setAudienceCount] = useState(1250);
  const [showPreview, setShowPreview] = useState(false);

  const steps = [
    { number: 1, title: 'Audience', icon: Users },
    { number: 2, title: 'Message', icon: Send },
    { number: 3, title: 'Schedule', icon: Calendar },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const renderPreviewModal = () => {
    if (!showPreview) return null;

    const sampleCustomerName = 'Acme Corp';
    const previewMessage = formData.message.replace(/\{\{customerName\}\}/g, sampleCustomerName);

    return (
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Message Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Sample customer: {sampleCustomerName}</p>
              <div className="whitespace-pre-wrap">{previewMessage}</div>
            </div>
            <Button onClick={() => setShowPreview(false)} className="w-full">
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Audience Type</Label>
              <div className="mt-2 space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={formData.audience.type === 'all'}
                    onChange={() => setFormData(prev => ({ ...prev, audience: { type: 'all' } }))}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>All Customers</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={formData.audience.type === 'segments'}
                    onChange={() => setFormData(prev => ({ ...prev, audience: { type: 'segments', filters: {} } }))}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>Segment by Filters</span>
                </label>
              </div>
            </div>

            {formData.audience.type === 'segments' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Filter Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Channel</Label>
                    <select className="w-full mt-1 border rounded-md p-2">
                      <option>All Channels</option>
                      <option>Slack</option>
                      <option>MS Teams</option>
                      <option>Email</option>
                    </select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <select className="w-full mt-1 border rounded-md p-2">
                      <option>All Priorities</option>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-700">
                <Users className="h-5 w-5" />
                <span className="font-medium">Preview Count: {audienceCount.toLocaleString()} customers</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Broadcast Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., May Product Update"
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-base font-medium">Channel Selection</Label>
              <div className="mt-2 space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.channels.includes('slack')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ ...prev, channels: [...prev.channels, 'slack'] }));
                      } else {
                        setFormData(prev => ({ ...prev, channels: prev.channels.filter(c => c !== 'slack') }));
                      }
                    }}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>Slack</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.channels.includes('teams')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ ...prev, channels: [...prev.channels, 'teams'] }));
                      } else {
                        setFormData(prev => ({ ...prev, channels: prev.channels.filter(c => c !== 'teams') }));
                      }
                    }}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>MS Teams</span>
                </label>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Message</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(true)}
                >
                  Preview
                </Button>
              </div>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Write your broadcast message here... Use {{customerName}} for personalization."
                className="mt-2 min-h-[120px]"
              />
              <p className="text-sm text-gray-500 mt-2">
                Available variables: {'{{customerName}}'}, {'{{ticketId}}'}
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Send Schedule</Label>
              <div className="mt-2 space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={formData.schedule.type === 'now'}
                    onChange={() => setFormData(prev => ({ ...prev, schedule: { type: 'now' } }))}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>Send Now</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={formData.schedule.type === 'later'}
                    onChange={() => setFormData(prev => ({ ...prev, schedule: { type: 'later', dateTime: '' } }))}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>Schedule for Later</span>
                </label>
              </div>
            </div>

            {formData.schedule.type === 'later' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.schedule.dateTime?.split('T')[0] || ''}
                    onChange={(e) => {
                      const currentTime = formData.schedule.dateTime?.split('T')[1] || '00:00';
                      setFormData(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, dateTime: `${e.target.value}T${currentTime}` }
                      }));
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={formData.schedule.dateTime?.split('T')[1] || ''}
                    onChange={(e) => {
                      const currentDate = formData.schedule.dateTime?.split('T')[0] || new Date().toISOString().split('T')[0];
                      setFormData(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, dateTime: `${currentDate}T${e.target.value}` }
                      }));
                    }}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <div>
              <Label>Time Zone</Label>
              <select
                value={formData.timeZone}
                onChange={(e) => setFormData(prev => ({ ...prev, timeZone: e.target.value }))}
                className="w-full mt-1 border rounded-md p-2"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Kolkata">India Standard Time</option>
              </select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Review Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Audience:</span>
                  <span>{formData.audience.type === 'all' ? 'All customers' : 'Filtered segment'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Channels:</span>
                  <span>{formData.channels.join(' & ') || 'None selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Schedule:</span>
                  <span>
                    {formData.schedule.type === 'now' 
                      ? 'Send immediately' 
                      : formData.schedule.dateTime || 'Not set'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {broadcast ? 'Edit Broadcast' : 'Create New Broadcast'}
            </DialogTitle>
          </DialogHeader>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center space-x-2 ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      isActive ? 'border-blue-600 bg-blue-50' : 
                      isCompleted ? 'border-green-600 bg-green-50' : 
                      'border-gray-300'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep === 3 ? (
                <Button
                  onClick={handleSave}
                  disabled={!formData.name || formData.channels.length === 0 || !formData.message}
                  className="flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{formData.schedule.type === 'now' ? 'Send Now' : 'Schedule'}</span>
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && formData.audience.type === 'segments' && !formData.audience.filters) ||
                    (currentStep === 2 && (!formData.name || formData.channels.length === 0 || !formData.message))
                  }
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {renderPreviewModal()}
    </>
  );
};
