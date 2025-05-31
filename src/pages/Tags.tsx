
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { TagsList } from '@/components/settings/TagsList';
import { TagModal } from '@/components/settings/TagModal';

export interface Tag {
  id: string;
  name: string;
  color: string;
  usageCount: number;
}

const Tags: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState<Tag[]>([
    {
      id: '1',
      name: 'Billing',
      color: '#3b82f6',
      usageCount: 24
    },
    {
      id: '2',
      name: 'Technical',
      color: '#ef4444',
      usageCount: 18
    },
    {
      id: '3',
      name: 'Feature Request',
      color: '#10b981',
      usageCount: 12
    },
    {
      id: '4',
      name: 'Bug Report',
      color: '#f59e0b',
      usageCount: 8
    }
  ]);

  const handleAddTag = () => {
    setEditingTag(null);
    setIsModalOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setIsModalOpen(true);
  };

  const handleDeleteTag = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (tag && tag.usageCount > 0) {
      alert(`Cannot delete tag "${tag.name}" because it's used by ${tag.usageCount} tickets.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
      setTags(tags => tags.filter(t => t.id !== tagId));
    }
  };

  const handleSaveTag = (tag: Omit<Tag, 'id' | 'usageCount'>) => {
    if (editingTag) {
      // Update existing tag
      setTags(tags => 
        tags.map(t => 
          t.id === editingTag.id 
            ? { ...t, ...tag }
            : t
        )
      );
    } else {
      // Create new tag
      const newTag: Tag = {
        id: Date.now().toString(),
        usageCount: 0,
        ...tag
      };
      setTags(tags => [...tags, newTag]);
    }
    setIsModalOpen(false);
    setEditingTag(null);
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
            <p className="text-gray-600 mt-1">
              Create and manage tags to categorize your tickets.
            </p>
          </div>
          <Button onClick={handleAddTag} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Tag
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <TagsList
          tags={filteredTags}
          onEdit={handleEditTag}
          onDelete={handleDeleteTag}
        />

        <TagModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTag(null);
          }}
          onSave={handleSaveTag}
          editingTag={editingTag}
          existingNames={tags.map(t => t.name)}
        />
      </div>
    </div>
  );
};

export default Tags;
