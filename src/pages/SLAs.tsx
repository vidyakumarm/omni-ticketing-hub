
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SLAsList } from '@/components/settings/SLAsList';
import { SLAModal } from '@/components/settings/SLAModal';

export interface SLA {
  id: string;
  name: string;
  scope: {
    allTickets: boolean;
    channels: string[];
    priorities: string[];
    customFieldScopes: Array<{ fieldKey: string; value: string }>;
  };
  firstResponseSLA: { hours: number; minutes: number } | null;
  resolutionSLA: { days: number; hours: number } | null;
  order: number;
}

const SLAs: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSLA, setEditingSLA] = useState<SLA | null>(null);
  const [slas, setSLAs] = useState<SLA[]>([
    {
      id: '1',
      name: 'High Priority - 1h first response / 4h resolution',
      scope: {
        allTickets: false,
        channels: [],
        priorities: ['High'],
        customFieldScopes: []
      },
      firstResponseSLA: { hours: 1, minutes: 0 },
      resolutionSLA: { days: 0, hours: 4 },
      order: 1
    },
    {
      id: '2',
      name: 'Enterprise Customers - 30min / 2h',
      scope: {
        allTickets: false,
        channels: [],
        priorities: [],
        customFieldScopes: [{ fieldKey: 'product', value: 'Enterprise' }]
      },
      firstResponseSLA: { hours: 0, minutes: 30 },
      resolutionSLA: { days: 0, hours: 2 },
      order: 2
    }
  ]);

  const handleAddSLA = () => {
    setEditingSLA(null);
    setIsModalOpen(true);
  };

  const handleEditSLA = (sla: SLA) => {
    setEditingSLA(sla);
    setIsModalOpen(true);
  };

  const handleDeleteSLA = (slaId: string) => {
    if (window.confirm('Are you sure you want to delete this SLA? This action cannot be undone.')) {
      setSLAs(slas => slas.filter(s => s.id !== slaId));
    }
  };

  const handleSaveSLA = (sla: Omit<SLA, 'id' | 'order'>) => {
    if (editingSLA) {
      // Update existing SLA
      setSLAs(slas => 
        slas.map(s => 
          s.id === editingSLA.id 
            ? { ...s, ...sla }
            : s
        )
      );
    } else {
      // Create new SLA
      const newSLA: SLA = {
        id: Date.now().toString(),
        order: Math.max(...slas.map(s => s.order), 0) + 1,
        ...sla
      };
      setSLAs(slas => [...slas, newSLA]);
    }
    setIsModalOpen(false);
    setEditingSLA(null);
  };

  const handleReorderSLAs = (reorderedSLAs: SLA[]) => {
    setSLAs(reorderedSLAs);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SLAs</h1>
            <p className="text-gray-600 mt-1">
              Define Service Level Agreements for first response and resolution deadlines.
            </p>
          </div>
          <Button onClick={handleAddSLA} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New SLA
          </Button>
        </div>

        <SLAsList
          slas={slas}
          onEdit={handleEditSLA}
          onDelete={handleDeleteSLA}
          onReorder={handleReorderSLAs}
        />

        <SLAModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSLA(null);
          }}
          onSave={handleSaveSLA}
          editingSLA={editingSLA}
          existingNames={slas.map(s => s.name)}
        />
      </div>
    </div>
  );
};

export default SLAs;
