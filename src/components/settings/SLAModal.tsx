
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SLA } from '@/pages/SLAs';

interface SLAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sla: Omit<SLA, 'id' | 'order'>) => void;
  editingSLA: SLA | null;
  existingNames: string[];
}

export const SLAModal: React.FC<SLAModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSLA,
  existingNames
}) => {
  const [formData, setFormData] = useState({
    name: '',
    scope: {
      allTickets: true,
      channels: [] as string[],
      priorities: [] as string[],
      customFieldScopes: [] as Array<{ fieldKey: string; value: string }>
    },
    firstResponseSLA: { hours: 1, minutes: 0 } as { hours: number; minutes: number } | null,
    resolutionSLA: { days: 0, hours: 4 } as { days: number; hours: number } | null,
    noFirstResponse: false,
    noResolution: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingSLA) {
      setFormData({
        name: editingSLA.name,
        scope: editingSLA.scope,
        firstResponseSLA: editingSLA.firstResponseSLA,
        resolutionSLA: editingSLA.resolutionSLA,
        noFirstResponse: !editingSLA.firstResponseSLA,
        noResolution: !editingSLA.resolutionSLA
      });
    } else {
      setFormData({
        name: '',
        scope: {
          allTickets: true,
          channels: [],
          priorities: [],
          customFieldScopes: []
        },
        firstResponseSLA: { hours: 1, minutes: 0 },
        resolutionSLA: { days: 0, hours: 4 },
        noFirstResponse: false,
        noResolution: false
      });
    }
    setErrors({});
  }, [editingSLA, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be 50 characters or less';
    } else if (existingNames.includes(formData.name) && formData.name !== editingSLA?.name) {
      newErrors.name = 'Name already exists';
    }

    if (!formData.scope.allTickets && 
        formData.scope.channels.length === 0 && 
        formData.scope.priorities.length === 0 && 
        formData.scope.customFieldScopes.length === 0) {
      newErrors.scope = 'Select at least one scope option';
    }

    if (formData.scope.allTickets && formData.noFirstResponse && formData.noResolution) {
      newErrors.sla = 'All Tickets scope requires at least one SLA to be defined';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const slaData = {
      name: formData.name.trim(),
      scope: formData.scope,
      firstResponseSLA: formData.noFirstResponse ? null : formData.firstResponseSLA,
      resolutionSLA: formData.noResolution ? null : formData.resolutionSLA
    };

    onSave(slaData);
  };

  const handleScopeChange = (field: string, checked: boolean) => {
    if (field === 'allTickets' && checked) {
      setFormData(prev => ({
        ...prev,
        scope: {
          allTickets: true,
          channels: [],
          priorities: [],
          customFieldScopes: []
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        scope: {
          ...prev.scope,
          allTickets: field === 'allTickets' ? checked : false,
          [field]: checked ? 
            (Array.isArray(prev.scope[field as keyof typeof prev.scope]) ? 
              [...(prev.scope[field as keyof typeof prev.scope] as string[]), field] : 
              [field]) : 
            (Array.isArray(prev.scope[field as keyof typeof prev.scope]) ? 
              (prev.scope[field as keyof typeof prev.scope] as string[]).filter(item => item !== field) : 
              [])
        }
      }));
    }
  };

  const channels = ['slack', 'email', 'teams', 'web'];
  const priorities = ['High', 'Medium', 'Low'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingSLA ? 'Edit SLA' : 'Add New SLA'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., High Priority - 1h / 4h"
              maxLength={50}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Scope */}
          <div className="space-y-3">
            <Label>Scope *</Label>
            {errors.scope && <p className="text-sm text-red-600">{errors.scope}</p>}
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allTickets"
                  checked={formData.scope.allTickets}
                  onCheckedChange={(checked) => handleScopeChange('allTickets', checked as boolean)}
                />
                <Label htmlFor="allTickets">All Tickets</Label>
              </div>

              {!formData.scope.allTickets && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">By Channel</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {channels.map(channel => (
                        <div key={channel} className="flex items-center space-x-2">
                          <Checkbox
                            id={`channel-${channel}`}
                            checked={formData.scope.channels.includes(channel)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  scope: {
                                    ...prev.scope,
                                    channels: [...prev.scope.channels, channel]
                                  }
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  scope: {
                                    ...prev.scope,
                                    channels: prev.scope.channels.filter(c => c !== channel)
                                  }
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={`channel-${channel}`} className="capitalize">
                            {channel}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">By Priority</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {priorities.map(priority => (
                        <div key={priority} className="flex items-center space-x-2">
                          <Checkbox
                            id={`priority-${priority}`}
                            checked={formData.scope.priorities.includes(priority)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  scope: {
                                    ...prev.scope,
                                    priorities: [...prev.scope.priorities, priority]
                                  }
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  scope: {
                                    ...prev.scope,
                                    priorities: prev.scope.priorities.filter(p => p !== priority)
                                  }
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={`priority-${priority}`}>
                            {priority}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* First Response SLA */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="noFirstResponse"
                checked={formData.noFirstResponse}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, noFirstResponse: checked as boolean }))}
              />
              <Label htmlFor="noFirstResponse">No first response SLA</Label>
            </div>
            
            {!formData.noFirstResponse && (
              <div className="space-y-2">
                <Label>First Response SLA</Label>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={formData.firstResponseSLA?.hours || 0}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        firstResponseSLA: {
                          ...prev.firstResponseSLA!,
                          hours: parseInt(e.target.value) || 0
                        }
                      }))}
                      className="w-20"
                    />
                    <Label>hours</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={formData.firstResponseSLA?.minutes || 0}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        firstResponseSLA: {
                          ...prev.firstResponseSLA!,
                          minutes: parseInt(e.target.value) || 0
                        }
                      }))}
                      className="w-20"
                    />
                    <Label>minutes</Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resolution SLA */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="noResolution"
                checked={formData.noResolution}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, noResolution: checked as boolean }))}
              />
              <Label htmlFor="noResolution">No resolution SLA</Label>
            </div>
            
            {!formData.noResolution && (
              <div className="space-y-2">
                <Label>Resolution SLA</Label>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={formData.resolutionSLA?.days || 0}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        resolutionSLA: {
                          ...prev.resolutionSLA!,
                          days: parseInt(e.target.value) || 0
                        }
                      }))}
                      className="w-20"
                    />
                    <Label>days</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={formData.resolutionSLA?.hours || 0}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        resolutionSLA: {
                          ...prev.resolutionSLA!,
                          hours: parseInt(e.target.value) || 0
                        }
                      }))}
                      className="w-20"
                    />
                    <Label>hours</Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {errors.sla && <p className="text-sm text-red-600">{errors.sla}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingSLA ? 'Update SLA' : 'Create SLA'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
