
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  customFields: Record<string, string>;
  tags: string[];
}

interface MergeTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
  preselectedTicketId?: string;
  onMergeComplete: (targetTicketId: string) => void;
}

interface CustomFieldConflict {
  field: string;
  values: { ticketId: string; value: string }[];
  selectedValue: string;
}

export const MergeTicketsModal: React.FC<MergeTicketsModalProps> = ({
  isOpen,
  onClose,
  tickets,
  preselectedTicketId,
  onMergeComplete,
}) => {
  const { toast } = useToast();
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);
  const [targetTicketId, setTargetTicketId] = useState<string>('');
  const [mergeMessages, setMergeMessages] = useState(true);
  const [copyTags, setCopyTags] = useState(true);
  const [copyCustomFields, setCopyCustomFields] = useState(true);
  const [closeSourceTickets, setCloseSourceTickets] = useState(true);
  const [customFieldConflicts, setCustomFieldConflicts] = useState<CustomFieldConflict[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && tickets.length > 0) {
      // Initialize selected tickets
      const initialSelected = tickets.map(t => t.id);
      setSelectedTicketIds(initialSelected);
      
      // Set preselected or first ticket as target
      const initialTarget = preselectedTicketId || tickets[0].id;
      setTargetTicketId(initialTarget);
      
      // Detect custom field conflicts
      detectCustomFieldConflicts(tickets);
    }
  }, [isOpen, tickets, preselectedTicketId]);

  const detectCustomFieldConflicts = (ticketList: Ticket[]) => {
    const fieldValues: Record<string, { ticketId: string; value: string }[]> = {};
    
    ticketList.forEach(ticket => {
      Object.entries(ticket.customFields).forEach(([field, value]) => {
        if (!fieldValues[field]) fieldValues[field] = [];
        fieldValues[field].push({ ticketId: ticket.id, value });
      });
    });

    const conflicts: CustomFieldConflict[] = [];
    Object.entries(fieldValues).forEach(([field, values]) => {
      const uniqueValues = Array.from(new Set(values.map(v => v.value)));
      if (uniqueValues.length > 1) {
        conflicts.push({
          field,
          values,
          selectedValue: values[0].value // Default to first value
        });
      }
    });

    setCustomFieldConflicts(conflicts);
  };

  const handleTicketSelection = (ticketId: string, checked: boolean) => {
    setSelectedTicketIds(prev => 
      checked 
        ? [...prev, ticketId]
        : prev.filter(id => id !== ticketId)
    );
  };

  const handleMerge = async () => {
    if (selectedTicketIds.length < 2) {
      toast({
        title: 'Invalid selection',
        description: 'Please select at least 2 tickets to merge.',
        variant: 'destructive'
      });
      return;
    }

    if (!targetTicketId || !selectedTicketIds.includes(targetTicketId)) {
      toast({
        title: 'Invalid target',
        description: 'Please select a valid target ticket.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare custom field overrides
      const customFieldOverrides = copyCustomFields ? 
        customFieldConflicts.reduce((acc, conflict) => {
          acc[conflict.field] = conflict.selectedValue;
          return acc;
        }, {} as Record<string, string>) : null;

      const sourceTicketIds = selectedTicketIds.filter(id => id !== targetTicketId);

      // Mock API call - replace with actual implementation
      console.log('Merging tickets:', {
        targetTicketId,
        sourceTicketIds,
        mergeMessages,
        copyTags,
        copyCustomFields: customFieldOverrides,
        closeSourceTickets
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Tickets merged successfully',
        description: `${sourceTicketIds.length} tickets merged into #${targetTicketId.slice(0, 8)}`
      });

      onMergeComplete(targetTicketId);
      onClose();
    } catch (error) {
      toast({
        title: 'Merge failed',
        description: 'Could not merge tickets. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConflictValueChange = (field: string, value: string) => {
    setCustomFieldConflicts(prev => 
      prev.map(conflict => 
        conflict.field === field 
          ? { ...conflict, selectedValue: value }
          : conflict
      )
    );
  };

  const selectedTickets = tickets.filter(t => selectedTicketIds.includes(t.id));
  const targetTicket = tickets.find(t => t.id === targetTicketId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="merge-modal-title"
      >
        <DialogHeader>
          <DialogTitle id="merge-modal-title">
            {preselectedTicketId 
              ? `Merging into #${preselectedTicketId.slice(0, 8)}`
              : 'Merge Tickets'
            }
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Tickets */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Selected Tickets</h3>
            <div className="space-y-2">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                  role="checkbox"
                  aria-checked={selectedTicketIds.includes(ticket.id)}
                >
                  <Checkbox
                    checked={selectedTicketIds.includes(ticket.id)}
                    onCheckedChange={(checked) => handleTicketSelection(ticket.id, !!checked)}
                    disabled={selectedTicketIds.length <= 2 && selectedTicketIds.includes(ticket.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">#{ticket.id.slice(0, 8)}</span>
                      <Badge variant="outline" className="capitalize">{ticket.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{ticket.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Ticket Selection */}
          {selectedTickets.length >= 2 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Primary (Target) Ticket</h3>
              <RadioGroup value={targetTicketId} onValueChange={setTargetTicketId}>
                {selectedTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={ticket.id} id={`target-${ticket.id}`} />
                    <Label htmlFor={`target-${ticket.id}`} className="flex-1">
                      <span className="font-medium">#{ticket.id.slice(0, 8)}</span> - {ticket.subject}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Merge Options */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Merge Options</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="merge-messages"
                  checked={mergeMessages}
                  onCheckedChange={setMergeMessages}
                />
                <Label htmlFor="merge-messages" className="text-sm">
                  Merge Messages
                  <p className="text-xs text-gray-500">Combine all messages under target ticket; preserve distinctions</p>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copy-tags"
                  checked={copyTags}
                  onCheckedChange={setCopyTags}
                />
                <Label htmlFor="copy-tags" className="text-sm">
                  Copy Tags
                  <p className="text-xs text-gray-500">Copy all tags from merged tickets to target</p>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copy-custom-fields"
                  checked={copyCustomFields}
                  onCheckedChange={setCopyCustomFields}
                />
                <Label htmlFor="copy-custom-fields" className="text-sm">
                  Copy Custom Fields
                  <p className="text-xs text-gray-500">If custom field values differ, use selected values below</p>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="close-source"
                  checked={closeSourceTickets}
                  onCheckedChange={setCloseSourceTickets}
                />
                <Label htmlFor="close-source" className="text-sm">
                  Close Merged Tickets
                  <p className="text-xs text-gray-500">Set status of merged tickets to "Closed"</p>
                </Label>
              </div>
            </div>
          </div>

          {/* Custom Field Conflicts */}
          {copyCustomFields && customFieldConflicts.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Resolve Custom Field Conflicts</h3>
              <div className="space-y-4">
                {customFieldConflicts.map((conflict) => (
                  <Card key={conflict.field}>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-sm mb-2 capitalize">{conflict.field}</h4>
                      <RadioGroup 
                        value={conflict.selectedValue} 
                        onValueChange={(value) => handleConflictValueChange(conflict.field, value)}
                      >
                        {Array.from(new Set(conflict.values.map(v => v.value))).map((value) => (
                          <div key={value} className="flex items-center space-x-2">
                            <RadioGroupItem value={value} id={`${conflict.field}-${value}`} />
                            <Label htmlFor={`${conflict.field}-${value}`}>{value}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation */}
          {targetTicket && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800">
                    Tickets will be merged into <strong>#{targetTicket.id.slice(0, 8)}</strong>. 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleMerge} 
              disabled={selectedTicketIds.length < 2 || !targetTicketId || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Merging {selectedTicketIds.filter(id => id !== targetTicketId).length} tickets...
                </>
              ) : (
                'Merge'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
