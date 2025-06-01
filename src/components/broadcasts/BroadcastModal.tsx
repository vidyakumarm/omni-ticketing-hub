
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Broadcast } from '@/pages/Broadcasts';

interface BroadcastModalProps {
  broadcast?: Broadcast | null;
  onClose: () => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  broadcast,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: broadcast?.name || '',
    audienceType: broadcast?.audience.type || 'all',
    channels: broadcast?.channels || [],
    message: broadcast?.message || '',
    scheduleType: 'now',
    scheduledDate: '',
    scheduledTime: '',
    timeZone: 'Asia/Kolkata'
  });

  const handleChannelChange = (channel: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        channels: [...prev.channels, channel]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        channels: prev.channels.filter(c => c !== channel)
      }));
    }
  };

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

  const handleSubmit = () => {
    console.log('Submitting broadcast:', formData);
    onClose();
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return true; // Audience step is always valid
      case 2:
        return formData.channels.length > 0 && formData.message.length > 0;
      case 3:
        return formData.name.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {broadcast ? 'Edit Broadcast' : 'Create New Broadcast'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep
                    ? 'bg-blue-600 text-white'
                    : step < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Audience Definition</CardTitle>
              <CardDescription>Choose who will receive this broadcast</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Audience Type</Label>
                <Select
                  value={formData.audienceType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, audienceType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="segments">Segment by Filters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.audienceType === 'segments' && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Filter options would be implemented here (similar to Analytics filters)
                  </p>
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Preview Count</p>
                <p className="text-lg font-bold text-blue-600">
                  {formData.audienceType === 'all' ? '150' : '45'} customers
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Message Composition</CardTitle>
              <CardDescription>Compose your broadcast message</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Channels</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.channels.includes('slack')}
                      onCheckedChange={(checked) => handleChannelChange('slack', checked as boolean)}
                    />
                    <Label>Slack</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.channels.includes('teams')}
                      onCheckedChange={(checked) => handleChannelChange('teams', checked as boolean)}
                    />
                    <Label>MS Teams</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your broadcast message..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={6}
                />
                <p className="text-xs text-gray-500">
                  Use variables like {"{{customerName}}"} to personalize messages
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Review</CardTitle>
              <CardDescription>Review and schedule your broadcast</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Broadcast Name</Label>
                <Input
                  id="name"
                  placeholder="Enter broadcast name..."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Schedule</Label>
                <Select
                  value={formData.scheduleType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, scheduleType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send Now</SelectItem>
                    <SelectItem value="later">Schedule For Later</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.scheduleType === 'later' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Date</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">Time</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Review Summary</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Audience:</strong> {formData.audienceType === 'all' ? 'All customers' : 'Filtered segment'}</p>
                  <p><strong>Channels:</strong> {formData.channels.join(', ')}</p>
                  <p><strong>Schedule:</strong> {formData.scheduleType === 'now' ? 'Send immediately' : 'Scheduled'}</p>
                  <p><strong>Message:</strong> {formData.message.slice(0, 100)}...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!isStepValid()}>
              {formData.scheduleType === 'now' ? 'Confirm & Send' : 'Confirm & Schedule'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
