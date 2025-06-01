
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Category } from '@/pages/HelpCenter';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Partial<Category>) => void;
  category?: Category | null;
  categories: Category[];
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  categories
}) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    parentId: category?.parentId || ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        parentId: category.parentId || ''
      });
    } else {
      setFormData({
        name: '',
        parentId: ''
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData: Partial<Category> = {
      name: formData.name,
      parentId: formData.parentId || null,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    };

    if (category) {
      categoryData.id = category.id;
    }

    onSave(categoryData);
  };

  const isValid = formData.name.trim().length > 0 && formData.name.length <= 30;

  const flattenCategories = (cats: Category[], level: number = 0): Array<Category & { level: number }> => {
    const result: Array<Category & { level: number }> = [];
    for (const cat of cats) {
      if (!category || cat.id !== category.id) { // Don't show current category as parent option
        result.push({ ...cat, level });
        if (cat.children) {
          result.push(...flattenCategories(cat.children, level + 1));
        }
      }
    }
    return result;
  };

  const flatCategories = flattenCategories(categories);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Getting Started"
              maxLength={30}
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.name.length}/30 characters
            </p>
          </div>

          <div>
            <Label htmlFor="parent">Parent Category</Label>
            <Select value={formData.parentId} onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="None (top-level)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None (top-level)</SelectItem>
                {flatCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {'  '.repeat(cat.level)}{cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              {category ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
