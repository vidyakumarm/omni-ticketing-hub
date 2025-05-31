
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { CustomField } from '@/pages/CustomFields';

interface CustomFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: Omit<CustomField, 'id' | 'order'>) => void;
  editingField: CustomField | null;
  existingKeys: string[];
}

export const CustomFieldModal: React.FC<CustomFieldModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingField,
  existingKeys
}) => {
  const [formData, setFormData] = useState({
    label: '',
    key: '',
    type: 'text' as CustomField['type'],
    options: [] as string[],
    required: false
  });
  const [newOption, setNewOption] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingField) {
      setFormData({
        label: editingField.label,
        key: editingField.key,
        type: editingField.type,
        options: editingField.options || [],
        required: editingField.required
      });
    } else {
      setFormData({
        label: '',
        key: '',
        type: 'text',
        options: [],
        required: false
      });
    }
    setErrors({});
  }, [editingField, isOpen]);

  const generateKey = (label: string) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
  };

  const handleLabelChange = (label: string) => {
    setFormData(prev => ({
      ...prev,
      label,
      key: editingField ? prev.key : generateKey(label)
    }));
  };

  const handleAddOption = () => {
    if (newOption.trim() && !formData.options.includes(newOption.trim())) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const handleRemoveOption = (optionToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter(option => option !== optionToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.label.trim()) {
      newErrors.label = 'Label is required';
    } else if (formData.label.length > 30) {
      newErrors.label = 'Label must be 30 characters or less';
    }

    if (!formData.key.trim()) {
      newErrors.key = 'Key is required';
    } else if (!/^[a-z0-9_]+$/.test(formData.key)) {
      newErrors.key = 'Key can only contain lowercase letters, numbers, and underscores';
    } else if (!editingField && existingKeys.includes(formData.key)) {
      newErrors.key = 'Key already exists';
    }

    if (formData.type === 'dropdown' && formData.options.length < 2) {
      newErrors.options = 'Dropdown fields must have at least 2 options';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newOption.trim()) {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingField ? 'Edit Custom Field' : 'Add New Custom Field'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Label */}
          <div className="space-y-2">
            <Label htmlFor="label">Label *</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="e.g., Product"
              maxLength={30}
            />
            {errors.label && (
              <p className="text-sm text-red-500">{errors.label}</p>
            )}
          </div>

          {/* Key */}
          <div className="space-y-2">
            <Label htmlFor="key">Key *</Label>
            <Input
              id="key"
              value={formData.key}
              onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
              placeholder="e.g., product"
              disabled={!!editingField}
              className={editingField ? 'bg-gray-100' : ''}
            />
            {errors.key && (
              <p className="text-sm text-red-500">{errors.key}</p>
            )}
            {editingField && (
              <p className="text-xs text-gray-500">Key cannot be changed after creation</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: CustomField['type']) => 
                setFormData(prev => ({ ...prev, type: value, options: value === 'dropdown' ? prev.options : [] }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="dropdown">Dropdown</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options (for dropdown type) */}
          {formData.type === 'dropdown' && (
            <div className="space-y-2">
              <Label>Options *</Label>
              <div className="flex gap-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter option"
                  maxLength={20}
                />
                <Button
                  type="button"
                  onClick={handleAddOption}
                  disabled={!newOption.trim() || formData.options.includes(newOption.trim())}
                >
                  Add
                </Button>
              </div>
              
              {formData.options.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.options.map((option, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {option}
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(option)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {errors.options && (
                <p className="text-sm text-red-500">{errors.options}</p>
              )}
            </div>
          )}

          {/* Required */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="required"
              checked={formData.required}
              onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="required">Required field</Label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingField ? 'Update Field' : 'Create Field'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
