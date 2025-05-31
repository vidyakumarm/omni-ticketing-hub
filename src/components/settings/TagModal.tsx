
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tag } from '@/pages/Tags';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tag: Omit<Tag, 'id' | 'usageCount'>) => void;
  editingTag: Tag | null;
  existingNames: string[];
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
  '#f97316', // orange
  '#6b7280'  // gray
];

export const TagModal: React.FC<TagModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTag,
  existingNames
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_COLORS[0]);
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (editingTag) {
      setName(editingTag.name);
      setColor(editingTag.color);
    } else {
      setName('');
      setColor(DEFAULT_COLORS[0]);
    }
    setErrors({});
  }, [editingTag, isOpen]);

  const validateForm = () => {
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Tag name is required';
    } else if (name.length > 30) {
      newErrors.name = 'Tag name must be 30 characters or less';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      newErrors.name = 'Tag name can only contain letters, numbers, and spaces';
    } else if (existingNames.includes(name.trim()) && (!editingTag || editingTag.name !== name.trim())) {
      newErrors.name = 'A tag with this name already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        name: name.trim(),
        color
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingTag ? 'Edit Tag' : 'Add New Tag'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Tag Name</Label>
            <Input
              id="tag-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter tag name"
              maxLength={30}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tag Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {DEFAULT_COLORS.map((defaultColor) => (
                <button
                  key={defaultColor}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === defaultColor ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: defaultColor }}
                  onClick={() => setColor(defaultColor)}
                />
              ))}
            </div>
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-20 h-10"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-gray-700">Preview: {name || 'Tag Name'}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingTag ? 'Update Tag' : 'Create Tag'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
