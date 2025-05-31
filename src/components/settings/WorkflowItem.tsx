
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash } from 'lucide-react';
import { Workflow } from '@/pages/Workflows';

interface WorkflowItemProps {
  workflow: Workflow;
  onEdit: (workflow: Workflow) => void;
  onDelete: (workflowId: string) => void;
  onToggleActive: (workflowId: string) => void;
}

export const WorkflowItem: React.FC<WorkflowItemProps> = ({
  workflow,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  const formatTrigger = () => {
    const event = workflow.trigger.event.replace('_', ' ');
    if (workflow.trigger.conditions.length === 0) {
      return `When a ticket is ${event}`;
    }
    
    const condition = workflow.trigger.conditions[0];
    return `When a ticket is ${event} and ${condition.field} ${condition.operator} "${condition.value}"`;
  };

  const formatAction = () => {
    const action = workflow.actions[0];
    switch (action.type) {
      case 'assign_agent':
        return `Assign to ${action.details.agentName}`;
      case 'change_status':
        return `Change status to ${action.details.status}`;
      case 'add_tag':
        return `Add tag: ${action.details.tagName}`;
      case 'send_notification':
        return `Send notification via ${action.details.channel}`;
      case 'send_webhook':
        return `Send webhook to ${action.details.url}`;
      default:
        return 'Unknown action';
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4">
        <div className="font-medium text-gray-900">{workflow.name}</div>
      </td>
      <td className="p-4 text-gray-600">
        <div className="max-w-xs truncate">{formatTrigger()}</div>
      </td>
      <td className="p-4 text-gray-600">
        <div className="max-w-xs truncate">{formatAction()}</div>
        {workflow.actions.length > 1 && (
          <Badge variant="outline" className="mt-1">
            +{workflow.actions.length - 1} more
          </Badge>
        )}
      </td>
      <td className="p-4">
        <Switch
          checked={workflow.active}
          onCheckedChange={() => onToggleActive(workflow.id)}
        />
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(workflow)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(workflow.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
