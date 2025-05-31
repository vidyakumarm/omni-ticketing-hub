
import React from 'react';
import { TagItem } from './TagItem';
import { Tag } from '@/pages/Tags';

interface TagsListProps {
  tags: Tag[];
  onEdit: (tag: Tag) => void;
  onDelete: (tagId: string) => void;
}

export const TagsList: React.FC<TagsListProps> = ({
  tags,
  onEdit,
  onDelete
}) => {
  if (tags.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No tags defined</div>
        <p className="text-gray-500">Click 'Add New Tag' to start categorizing tickets.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4 font-medium text-gray-900">Tag</th>
              <th className="text-left p-4 font-medium text-gray-900">Usage</th>
              <th className="text-right p-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <TagItem
                key={tag.id}
                tag={tag}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
