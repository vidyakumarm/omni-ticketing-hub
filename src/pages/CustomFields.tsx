
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CustomFieldsList } from '@/components/settings/CustomFieldsList';
import { CustomFieldModal } from '@/components/settings/CustomFieldModal';

export interface CustomField {
  id: string;
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'boolean';
  options?: string[];
  required: boolean;
  order: number;
}

const CustomFields: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([
    {
      id: '1',
      key: 'product',
      label: 'Product',
      type: 'dropdown',
      options: ['Pro', 'Business', 'Enterprise'],
      required: true,
      order: 1
    },
    {
      id: '2',
      key: 'priority_level',
      label: 'Priority Level',
      type: 'dropdown',
      options: ['Low', 'Medium', 'High', 'Critical'],
      required: false,
      order: 2
    },
    {
      id: '3',
      key: 'region',
      label: 'Region',
      type: 'text',
      required: false,
      order: 3
    }
  ]);

  const handleAddField = () => {
    setEditingField(null);
    setIsModalOpen(true);
  };

  const handleEditField = (field: CustomField) => {
    setEditingField(field);
    setIsModalOpen(true);
  };

  const handleDeleteField = (fieldId: string) => {
    if (window.confirm('Deleting this field will remove it from all existing tickets. Are you sure?')) {
      setCustomFields(fields => fields.filter(f => f.id !== fieldId));
    }
  };

  const handleSaveField = (field: Omit<CustomField, 'id' | 'order'>) => {
    if (editingField) {
      // Update existing field
      setCustomFields(fields => 
        fields.map(f => 
          f.id === editingField.id 
            ? { ...f, ...field }
            : f
        )
      );
    } else {
      // Create new field
      const newField: CustomField = {
        id: Date.now().toString(),
        order: Math.max(...customFields.map(f => f.order), 0) + 1,
        ...field
      };
      setCustomFields(fields => [...fields, newField]);
    }
    setIsModalOpen(false);
    setEditingField(null);
  };

  const handleReorderFields = (reorderedFields: CustomField[]) => {
    setCustomFields(reorderedFields);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Custom Fields</h1>
            <p className="text-gray-600 mt-1">
              Drag and drop fields to reorder. Fields appear in this order when creating/viewing tickets.
            </p>
          </div>
          <Button onClick={handleAddField} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Field
          </Button>
        </div>

        <CustomFieldsList
          fields={customFields}
          onEdit={handleEditField}
          onDelete={handleDeleteField}
          onReorder={handleReorderFields}
        />

        <CustomFieldModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingField(null);
          }}
          onSave={handleSaveField}
          editingField={editingField}
          existingKeys={customFields.map(f => f.key)}
        />
      </div>
    </div>
  );
};

export default CustomFields;
