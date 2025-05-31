
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomStatus } from '@/pages/CustomStatuses';

interface CustomStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: Omit<CustomStatus, 'id' | 'order'>) => void;
  customStatus?: CustomStatus | null;
  existingNames: string[];
}

const colorPresets = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899'  // pink
];

export const CustomStatusModal: React.FC<CustomStatusModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customStatus,
  existingNames
}) => {
  const [formData, setFormData] = useState({
    name: '',
    color: colorPresets[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customStatus) {
      setFormData({
        name: customStatus.name,
        color: customStatus.color
      });
    } else {
      setFormData({
        name: '',
        color: colorPresets[0]
      });
    }
    setErrors({});
  }, [customStatus, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Status name is required';
    } else if (formData.name.length > 30) {
      newErrors.name = 'Status name must be 30 characters or less';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.name)) {
      newErrors.name = 'Status name can only contain letters, numbers, and spaces';
    } else {
      const isDuplicate = existingNames.some(
        name => name.toLowerCase() === formData.name.toLowerCase() && 
        (!customStatus || name !== customStatus.name)
      );
      if (isDuplicate) {
        newErrors.name = 'A status with this name already exists';
      }
    }

    if (!formData.color || !/^#[0-9a-fA-F]{6}$/.test(formData.color)) {
      newErrors.color = 'Please select a valid color';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        color: formData.color
      });
    }
  };

  const getTextColor = (backgroundColor: string) => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {customStatus ? 'Edit Custom Status' : 'Add New Custom Status'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status-name">Status Name</Label>
            <Input
              id="status-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter status name"
              maxLength={30}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
            <p className="text-sm text-gray-500">{formData.name.length}/30 characters</p>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-10 h-10 rounded-md border-2 flex items-center justify-center ${
                    formData.color === color ? 'border-gray-900' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                >
                  {formData.color === color && (
                    <span style={{ color: getTextColor(color) }}>✓</span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-2">
              <Label htmlFor="custom-color">Custom Color</Label>
              <Input
                id="custom-color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-20 h-10 p-1 border rounded"
              />
            </div>
            {errors.color && (
              <p className="text-sm text-red-600">{errors.color}</p>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div 
              className="inline-block px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: formData.color,
                color: getTextColor(formData.color)
              }}
            >
              {formData.name || 'Status Name'}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {customStatus ? 'Update' : 'Create'} Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
