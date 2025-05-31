
import React from 'react';
import { WorkflowItem } from './WorkflowItem';
import { Workflow } from '@/pages/Workflows';

interface WorkflowsListProps {
  workflows: Workflow[];
  onEdit: (workflow: Workflow) => void;
  onDelete: (workflowId: string) => void;
  onToggleActive: (workflowId: string) => void;
  onReorder: (workflows: Workflow[]) => void;
}

export const WorkflowsList: React.FC<WorkflowsListProps> = ({
  workflows,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder
}) => {
  if (workflows.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No workflows defined</div>
        <p className="text-gray-500">Automate routine tasks by creating workflows.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4 font-medium text-gray-900">Name</th>
              <th className="text-left p-4 font-medium text-gray-900">Trigger</th>
              <th className="text-left p-4 font-medium text-gray-900">Action</th>
              <th className="text-left p-4 font-medium text-gray-900">Status</th>
              <th className="text-right p-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows
              .sort((a, b) => a.order - b.order)
              .map((workflow) => (
                <WorkflowItem
                  key={workflow.id}
                  workflow={workflow}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleActive={onToggleActive}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
