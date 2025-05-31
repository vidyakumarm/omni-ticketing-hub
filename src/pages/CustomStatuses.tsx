
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CustomStatusesList } from '@/components/settings/CustomStatusesList';
import { CustomStatusModal } from '@/components/settings/CustomStatusModal';

export interface CustomStatus {
  id: string;
  name: string;
  color: string;
  order: number;
}

const CustomStatuses: React.FC = () => {
  const [customStatuses, setCustomStatuses] = useState<CustomStatus[]>([
    {
      id: '1',
      name: 'Investigating',
      color: '#f59e0b',
      order: 1
    },
    {
      id: '2',
      name: 'Waiting for Customer',
      color: '#8b5cf6',
      order: 2
    },
    {
      id: '3',
      name: 'Escalated',
      color: '#ef4444',
      order: 3
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<CustomStatus | null>(null);

  const handleEdit = (status: CustomStatus) => {
    setEditingStatus(status);
    setIsModalOpen(true);
  };

  const handleDelete = (statusId: string) => {
    if (confirm('Are you sure you want to delete this custom status?')) {
      setCustomStatuses(prev => prev.filter(s => s.id !== statusId));
    }
  };

  const handleSave = (statusData: Omit<CustomStatus, 'id' | 'order'>) => {
    if (editingStatus) {
      setCustomStatuses(prev => prev.map(s => 
        s.id === editingStatus.id 
          ? { ...statusData, id: s.id, order: s.order }
          : s
      ));
    } else {
      const newStatus: CustomStatus = {
        ...statusData,
        id: Date.now().toString(),
        order: customStatuses.length + 1
      };
      setCustomStatuses(prev => [...prev, newStatus]);
    }
    setIsModalOpen(false);
    setEditingStatus(null);
  };

  const handleReorder = (reorderedStatuses: CustomStatus[]) => {
    setCustomStatuses(reorderedStatuses.map((status, index) => ({
      ...status,
      order: index + 1
    })));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Custom Statuses</h1>
            <p className="text-gray-600 mt-1">Define custom ticket statuses to match your support process</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Status
          </Button>
        </div>

        <CustomStatusesList
          customStatuses={customStatuses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />

        <CustomStatusModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStatus(null);
          }}
          onSave={handleSave}
          customStatus={editingStatus}
          existingNames={customStatuses.map(s => s.name)}
        />
      </div>
    </div>
  );
};

export default CustomStatuses;
