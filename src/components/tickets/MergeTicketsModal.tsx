
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { CheckedState } from '@radix-ui/react-checkbox';

interface MergeTicket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  customFields?: Record<string, any>;
  tags?: string[];
}

interface MergeTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: MergeTicket[];
  preselectedTicketId?: string;
  onMergeComplete: (targetTicketId: string) => void;
}

interface CustomFieldConflict {
  fieldName: string;
  values: Array<{
    ticketId: string;
    value: any;
  }>;
  selectedValue: any;
}

export const MergeTicketsModal: React.FC<MergeTicketsModalProps> = ({
  isOpen,
  onClose,
  tickets,
  preselectedTicketId,
  onMergeComplete,
}) => {
  const { toast } = useToast();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [targetTicketId, setTargetTicketId] = useState<string>('');
  const [mergeMessages, setMergeMessages] = useState(true);
  const [copyTags, setCopyTags] = useState(true);
  const [copyCustomFields, setCopyCustomFields] = useState(true);
  const [closeSourceTickets, setCloseSourceTickets] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [customFieldConflicts, setCustomFieldConflicts] = useState<CustomFieldConflict[]>([]);
  const [error, setError] = useState<string>('');

  // Initialize selected tickets and target when modal opens
  useEffect(() => {
    if (isOpen && tickets.length > 0) {
      const initialSelected = preselectedTicketId 
        ? tickets.map(t => t.id)
        : tickets.slice(0, 2).map(t => t.id);
      
      setSelectedTickets(initialSelected);
      setTargetTicketId(preselectedTicketId || tickets[0]?.id || '');
      setError('');
      setCustomFieldConflicts([]);
    }
  }, [isOpen, tickets, preselectedTicketId]);

  // Detect custom field conflicts when selection changes
  useEffect(() => {
    if (selectedTickets.length < 2) {
      setCustomFieldConflicts([]);
      return;
    }

    const selectedTicketObjects = tickets.filter(t => selectedTickets.includes(t.id));
    const conflicts: CustomFieldConflict[] = [];
    const allFieldNames = new Set<string>();

    // Collect all custom field names
    selectedTicketObjects.forEach(ticket => {
      if (ticket.customFields) {
        Object.keys(ticket.customFields).forEach(field => allFieldNames.add(field));
      }
    });

    // Check for conflicts in each field
    allFieldNames.forEach(fieldName => {
      const values = selectedTicketObjects
        .map(ticket => ({
          ticketId: ticket.id,
          value: ticket.customFields?.[fieldName] || null
        }))
        .filter(item => item.value !== null);

      const uniqueValues = new Set(values.map(v => v.value));
      
      if (uniqueValues.size > 1) {
        const targetTicket = selectedTicketObjects.find(t => t.id === targetTicketId);
        conflicts.push({
          fieldName,
          values,
          selectedValue: targetTicket?.customFields?.[fieldName] || values[0]?.value
        });
      }
    });

    setCustomFieldConflicts(conflicts);
  }, [selectedTickets, targetTicketId, tickets]);

  const handleTicketSelection = (ticketId: string, checked: CheckedState) => {
    const isChecked = checked === true;
    
    if (isChecked) {
      setSelectedTickets(prev => [...prev, ticketId]);
    } else {
      setSelectedTickets(prev => {
        const newSelected = prev.filter(id => id !== ticketId);
        // If we unselected the current target, pick a new one
        if (ticketId === targetTicketId && newSelected.length > 0) {
          setTargetTicketId(newSelected[0]);
        }
        return newSelected;
      });
    }
  };

  const handleSelectAll = (checked: CheckedState) => {
    const isChecked = checked === true;
    if (isChecked) {
      setSelectedTickets(tickets.map(t => t.id));
      if (!targetTicketId) {
        setTargetTicketId(tickets[0]?.id || '');
      }
    } else {
      setSelectedTickets([]);
      setTargetTicketId('');
    }
  };

  const handleTargetChange = (ticketId: string) => {
    setTargetTicketId(ticketId);
    // Ensure target ticket is selected
    if (!selectedTickets.includes(ticketId)) {
      setSelectedTickets(prev => [...prev, ticketId]);
    }
  };

  const handleConflictValueChange = (fieldName: string, value: any) => {
    setCustomFieldConflicts(prev => 
      prev.map(conflict => 
        conflict.fieldName === fieldName 
          ? { ...conflict, selectedValue: value }
          : conflict
      )
    );
  };

  const handleMerge = async () => {
    if (selectedTickets.length < 2) {
      setError('Please select at least 2 tickets to merge.');
      return;
    }

    if (!targetTicketId || !selectedTickets.includes(targetTicketId)) {
      setError('Please select a valid target ticket.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Prepare custom field overrides
      const customFieldOverrides = copyCustomFields && customFieldConflicts.length > 0
        ? Object.fromEntries(
            customFieldConflicts.map(conflict => [conflict.fieldName, conflict.selectedValue])
          )
        : null;

      const mergePayload = {
        targetTicketId,
        sourceTicketIds: selectedTickets.filter(id => id !== targetTicketId),
        mergeMessages,
        copyTags,
        copyCustomFields: customFieldOverrides,
        closeSourceTickets
      };

      console.log('Merge payload:', mergePayload);

      toast({
        title: "Tickets merged successfully",
        description: `${selectedTickets.length} tickets have been merged into #${targetTicketId}`,
      });

      onMergeComplete(targetTicketId);
      onClose();
    } catch (err) {
      setError('Failed to merge tickets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTicketObjects = tickets.filter(t => selectedTickets.includes(t.id));
  const sourceTickets = selectedTicketObjects.filter(t => t.id !== targetTicketId);
  const targetTicket = tickets.find(t => t.id === targetTicketId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-labelledby="merge-modal-title">
        <DialogHeader>
          <DialogTitle id="merge-modal-title">
            {preselectedTicketId ? `Merging into #${preselectedTicketId}` : 'Merge Tickets'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Selected Tickets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Selected Tickets</h3>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={selectedTickets.length === tickets.length}
                  onCheckedChange={handleSelectAll}
                  id="select-all"
                />
                <Label htmlFor="select-all" className="text-sm">Select All</Label>
              </div>
            </div>

            <div className="border rounded-lg">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className={`flex items-center space-x-3 p-3 border-b last:border-b-0 ${
                    selectedTickets.includes(ticket.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <Checkbox 
                    checked={selectedTickets.includes(ticket.id)}
                    onCheckedChange={(checked) => handleTicketSelection(ticket.id, checked)}
                    id={`ticket-${ticket.id}`}
                    aria-checked={selectedTickets.includes(ticket.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`ticket-${ticket.id}`} className="font-medium">
                        #{ticket.id}
                      </Label>
                      <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{ticket.subject}</p>
                    {ticket.tags && ticket.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {ticket.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Ticket Selection */}
          {selectedTickets.length >= 2 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Primary (Target) Ticket</h3>
              <RadioGroup value={targetTicketId} onValueChange={handleTargetChange}>
                {selectedTicketObjects.map((ticket) => (
                  <div key={ticket.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={ticket.id} id={`target-${ticket.id}`} />
                    <Label htmlFor={`target-${ticket.id}`} className="flex-1">
                      #{ticket.id} - {ticket.subject}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Merge Options */}
          <div>
            <h3 className="text-lg font-medium mb-3">Merge Options</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={mergeMessages}
                  onCheckedChange={(checked) => setMergeMessages(checked === true)}
                  id="merge-messages"
                />
                <Label htmlFor="merge-messages">
                  Merge Messages - Combine all messages under target ticket
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={copyTags}
                  onCheckedChange={(checked) => setCopyTags(checked === true)}
                  id="copy-tags"
                />
                <Label htmlFor="copy-tags">
                  Copy Tags - Copy all tags from merged tickets to target
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={copyCustomFields}
                  onCheckedChange={(checked) => setCopyCustomFields(checked === true)}
                  id="copy-custom-fields"
                />
                <Label htmlFor="copy-custom-fields">
                  Copy Custom Fields - Merge custom field values
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={closeSourceTickets}
                  onCheckedChange={(checked) => setCloseSourceTickets(checked === true)}
                  id="close-source-tickets"
                />
                <Label htmlFor="close-source-tickets">
                  Close Merged Tickets - Set status of merged tickets to "Closed"
                </Label>
              </div>
            </div>
          </div>

          {/* Custom Field Conflicts */}
          {copyCustomFields && customFieldConflicts.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Resolve Custom Field Conflicts</h3>
              <div className="space-y-4">
                {customFieldConflicts.map((conflict) => (
                  <div key={conflict.fieldName} className="border rounded-lg p-4">
                    <Label className="font-medium mb-2 block">
                      {conflict.fieldName}
                    </Label>
                    <RadioGroup 
                      value={conflict.selectedValue} 
                      onValueChange={(value) => handleConflictValueChange(conflict.fieldName, value)}
                    >
                      {conflict.values.map((item) => (
                        <div key={`${conflict.fieldName}-${item.ticketId}`} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={item.value} 
                            id={`${conflict.fieldName}-${item.ticketId}`} 
                          />
                          <Label htmlFor={`${conflict.fieldName}-${item.ticketId}`}>
                            {item.value} (from #{item.ticketId})
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation */}
          {targetTicket && sourceTickets.length > 0 && (
            <Alert>
              <AlertDescription>
                {sourceTickets.length} ticket{sourceTickets.length > 1 ? 's' : ''} will be merged into #{targetTicket.id}. 
                This action cannot be undone.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleMerge} 
            disabled={selectedTickets.length < 2 || !targetTicketId || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Merging {selectedTickets.length} tickets...
              </>
            ) : (
              'Merge Tickets'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
