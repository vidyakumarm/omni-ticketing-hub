
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Workflow } from '@/pages/Workflows';

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workflow: Omit<Workflow, 'id' | 'order'>) => void;
  workflow?: Workflow | null;
}

export const WorkflowModal: React.FC<WorkflowModalProps> = ({
  isOpen,
  onClose,
  onSave,
  workflow
}) => {
  const [formData, setFormData] = useState<Omit<Workflow, 'id' | 'order'>>({
    name: '',
    trigger: {
      event: 'ticket_created',
      conditions: [],
      logic: 'AND'
    },
    actions: [],
    active: true
  });

  useEffect(() => {
    if (workflow) {
      setFormData({
        name: workflow.name,
        trigger: workflow.trigger,
        actions: workflow.actions,
        active: workflow.active
      });
    } else {
      setFormData({
        name: '',
        trigger: {
          event: 'ticket_created',
          conditions: [],
          logic: 'AND'
        },
        actions: [],
        active: true
      });
    }
  }, [workflow, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      trigger: {
        ...prev.trigger,
        conditions: [
          ...prev.trigger.conditions,
          { field: 'priority', operator: 'equals', value: '' }
        ]
      }
    }));
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      trigger: {
        ...prev.trigger,
        conditions: prev.trigger.conditions.filter((_, i) => i !== index)
      }
    }));
  };

  const updateCondition = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      trigger: {
        ...prev.trigger,
        conditions: prev.trigger.conditions.map((cond, i) => 
          i === index ? { ...cond, [field]: value } : cond
        )
      }
    }));
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [
        ...prev.actions,
        { type: 'assign_agent', details: {} }
      ]
    }));
  };

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const updateAction = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { ...action, [field]: value } : action
      )
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {workflow ? 'Edit Workflow' : 'Add New Workflow'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Workflow Name */}
          <div className="space-y-2">
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input
              id="workflow-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter workflow name"
              maxLength={50}
              required
            />
          </div>

          {/* Trigger Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Trigger</h3>
            
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select 
                value={formData.trigger.event} 
                onValueChange={(value: 'ticket_created' | 'ticket_updated' | 'ticket_tagged') => 
                  setFormData(prev => ({ 
                    ...prev, 
                    trigger: { ...prev.trigger, event: value } 
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ticket_created">Ticket Created</SelectItem>
                  <SelectItem value="ticket_updated">Ticket Updated</SelectItem>
                  <SelectItem value="ticket_tagged">Ticket Tagged</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Conditions</Label>
                <Button type="button" variant="outline" size="sm" onClick={addCondition}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Condition
                </Button>
              </div>

              {formData.trigger.conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                  <Select 
                    value={condition.field} 
                    onValueChange={(value) => updateCondition(index, 'field', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="channel">Channel</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="subject">Subject</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={condition.operator} 
                    onValueChange={(value) => updateCondition(index, 'operator', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="not_equals">Not Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    value={condition.value as string}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {formData.trigger.conditions.length > 1 && (
                <div className="space-y-2">
                  <Label>Logic</Label>
                  <Select 
                    value={formData.trigger.logic} 
                    onValueChange={(value: 'AND' | 'OR') => 
                      setFormData(prev => ({ 
                        ...prev, 
                        trigger: { ...prev.trigger, logic: value } 
                      }))
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AND">AND</SelectItem>
                      <SelectItem value="OR">OR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Actions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Actions</h3>
              <Button type="button" variant="outline" size="sm" onClick={addAction}>
                <Plus className="h-4 w-4 mr-1" />
                Add Action
              </Button>
            </div>

            {formData.actions.map((action, index) => (
              <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                <Select 
                  value={action.type} 
                  onValueChange={(value) => updateAction(index, 'type', value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assign_agent">Assign to Agent</SelectItem>
                    <SelectItem value="change_status">Change Status</SelectItem>
                    <SelectItem value="add_tag">Add Tag</SelectItem>
                    <SelectItem value="send_notification">Send Notification</SelectItem>
                    <SelectItem value="send_webhook">Send Webhook</SelectItem>
                  </SelectContent>
                </Select>

                {action.type === 'assign_agent' && (
                  <Input
                    value={action.details.agentName || ''}
                    onChange={(e) => updateAction(index, 'details', { 
                      ...action.details, 
                      agentName: e.target.value,
                      agentId: `agent-${e.target.value.toLowerCase().replace(' ', '-')}`
                    })}
                    placeholder="Agent name"
                    className="flex-1"
                  />
                )}

                {action.type === 'change_status' && (
                  <Select 
                    value={action.details.status || ''} 
                    onValueChange={(value) => updateAction(index, 'details', { 
                      ...action.details, 
                      status: value 
                    })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {action.type === 'add_tag' && (
                  <Input
                    value={action.details.tagName || ''}
                    onChange={(e) => updateAction(index, 'details', { 
                      ...action.details, 
                      tagName: e.target.value,
                      tagId: `tag-${e.target.value.toLowerCase().replace(' ', '-')}`
                    })}
                    placeholder="Tag name"
                    className="flex-1"
                  />
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAction(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {formData.actions.length === 0 && (
              <p className="text-gray-500 text-sm">No actions defined. Add at least one action.</p>
            )}
          </div>

          {/* Active Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="workflow-active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="workflow-active">Active</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.name || formData.actions.length === 0}
            >
              {workflow ? 'Update' : 'Create'} Workflow
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
