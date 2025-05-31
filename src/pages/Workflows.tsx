
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { WorkflowsList } from '@/components/settings/WorkflowsList';
import { WorkflowModal } from '@/components/settings/WorkflowModal';

export interface Workflow {
  id: string;
  name: string;
  trigger: {
    event: 'ticket_created' | 'ticket_updated' | 'ticket_tagged';
    conditions: Array<{
      field: string;
      operator: string;
      value: string | number | string[];
    }>;
    logic: 'AND' | 'OR';
  };
  actions: Array<{
    type: 'assign_agent' | 'change_status' | 'add_tag' | 'send_notification' | 'send_webhook';
    details: Record<string, any>;
  }>;
  active: boolean;
  order: number;
}

const Workflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Auto-assign high priority tickets',
      trigger: {
        event: 'ticket_created',
        conditions: [
          { field: 'priority', operator: 'equals', value: 'High' }
        ],
        logic: 'AND'
      },
      actions: [
        { type: 'assign_agent', details: { agentId: 'agent-1', agentName: 'John Doe' } }
      ],
      active: true,
      order: 1
    },
    {
      id: '2',
      name: 'Tag billing-related tickets',
      trigger: {
        event: 'ticket_created',
        conditions: [
          { field: 'subject', operator: 'contains', value: 'billing' }
        ],
        logic: 'AND'
      },
      actions: [
        { type: 'add_tag', details: { tagId: 'tag-1', tagName: 'Billing' } }
      ],
      active: true,
      order: 2
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);

  const handleEdit = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setIsModalOpen(true);
  };

  const handleDelete = (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      setWorkflows(prev => prev.filter(w => w.id !== workflowId));
    }
  };

  const handleSave = (workflowData: Omit<Workflow, 'id' | 'order'>) => {
    if (editingWorkflow) {
      setWorkflows(prev => prev.map(w => 
        w.id === editingWorkflow.id 
          ? { ...workflowData, id: w.id, order: w.order }
          : w
      ));
    } else {
      const newWorkflow: Workflow = {
        ...workflowData,
        id: Date.now().toString(),
        order: workflows.length + 1
      };
      setWorkflows(prev => [...prev, newWorkflow]);
    }
    setIsModalOpen(false);
    setEditingWorkflow(null);
  };

  const handleToggleActive = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, active: !w.active } : w
    ));
  };

  const handleReorder = (reorderedWorkflows: Workflow[]) => {
    setWorkflows(reorderedWorkflows);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
            <p className="text-gray-600 mt-1">Automate routine tasks with conditional rules</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Workflow
          </Button>
        </div>

        <WorkflowsList
          workflows={workflows}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onReorder={handleReorder}
        />

        <WorkflowModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingWorkflow(null);
          }}
          onSave={handleSave}
          workflow={editingWorkflow}
        />
      </div>
    </div>
  );
};

export default Workflows;
