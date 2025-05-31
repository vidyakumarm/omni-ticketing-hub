
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CustomerSelector } from './CustomerSelector';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: (ticketId: string) => void;
}

interface FormData {
  channel: string;
  channelRef: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  body: string;
  priority: string;
  assigneeId: string;
  tags: string[];
  customFields: Record<string, string>;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({ isOpen, onClose, onTicketCreated }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    channel: '',
    channelRef: '',
    customerId: '',
    customerName: '',
    customerEmail: '',
    subject: '',
    body: '',
    priority: 'Medium',
    assigneeId: '',
    tags: [],
    customFields: {}
  });
  
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data for dropdowns
  const channels = [
    { value: 'email', label: 'Email' },
    { value: 'slack', label: 'Slack' },
    { value: 'teams', label: 'MS Teams' },
    { value: 'web', label: 'Web' },
    { value: 'phone', label: 'Phone' }
  ];

  const priorities = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];

  const agents = [
    { value: '', label: 'Unassigned' },
    { value: 'agent-1', label: 'Alice Johnson' },
    { value: 'agent-2', label: 'Bob Smith' },
    { value: 'agent-3', label: 'Carol Davis' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject || formData.subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters long';
    }
    if (formData.subject && formData.subject.length > 100) {
      newErrors.subject = 'Subject must be less than 100 characters';
    }
    if (!formData.body || formData.body.length < 10) {
      newErrors.body = 'Description must be at least 10 characters long';
    }
    if (!formData.channel) {
      newErrors.channel = 'Channel is required';
    }

    if (isCreatingCustomer) {
      if (!formData.customerName) {
        newErrors.customerName = 'Customer name is required';
      }
      if (!formData.customerEmail) {
        newErrors.customerEmail = 'Customer email is required';
      }
    } else if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      console.log('Creating ticket with data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTicketId = `ticket-${Date.now()}`;
      
      toast({
        title: 'Ticket created successfully',
        description: `Ticket #${newTicketId} has been created`
      });
      
      onTicketCreated(newTicketId);
      onClose();
      
      // Reset form
      setFormData({
        channel: '',
        channelRef: '',
        customerId: '',
        customerName: '',
        customerEmail: '',
        subject: '',
        body: '',
        priority: 'Medium',
        assigneeId: '',
        tags: [],
        customFields: {}
      });
      setAttachments([]);
      setIsCreatingCustomer(false);
      
    } catch (error) {
      toast({
        title: 'Error creating ticket',
        description: 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <DialogDescription>
            Create a ticket on behalf of a customer
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Channel */}
          <div className="space-y-2">
            <Label htmlFor="channel">Channel *</Label>
            <Select value={formData.channel} onValueChange={(value) => setFormData(prev => ({ ...prev, channel: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a channel" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel.value} value={channel.value}>
                    {channel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.channel && <p className="text-sm text-red-500">{errors.channel}</p>}
          </div>

          {/* Customer */}
          <div className="space-y-2">
            <Label>Customer *</Label>
            <CustomerSelector
              isCreatingNew={isCreatingCustomer}
              onToggleCreateNew={setIsCreatingCustomer}
              selectedCustomerId={formData.customerId}
              onCustomerSelect={(customerId) => setFormData(prev => ({ ...prev, customerId }))}
              customerName={formData.customerName}
              onCustomerNameChange={(name) => setFormData(prev => ({ ...prev, customerName: name }))}
              customerEmail={formData.customerEmail}
              onCustomerEmailChange={(email) => setFormData(prev => ({ ...prev, customerEmail: email }))}
            />
            {errors.customerId && <p className="text-sm text-red-500">{errors.customerId}</p>}
            {errors.customerName && <p className="text-sm text-red-500">{errors.customerName}</p>}
            {errors.customerEmail && <p className="text-sm text-red-500">{errors.customerEmail}</p>}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter ticket subject"
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="body">Description *</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Enter ticket description"
              className={`min-h-[100px] ${errors.body ? 'border-red-500' : ''}`}
            />
            {errors.body && <p className="text-sm text-red-500">{errors.body}</p>}
          </div>

          {/* Priority and Assignee */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select value={formData.assigneeId} onValueChange={(value) => setFormData(prev => ({ ...prev, assigneeId: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.value} value={agent.value}>
                      {agent.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas"
              onChange={(e) => handleTagsChange(e.target.value)}
            />
            <p className="text-xs text-gray-500">Separate multiple tags with commas</p>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <Input
              id="attachments"
              type="file"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            
            {attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !formData.subject || !formData.body}>
            {isSubmitting ? 'Creating...' : 'Create Ticket'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
