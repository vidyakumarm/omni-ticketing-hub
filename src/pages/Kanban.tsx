
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';

const Kanban: React.FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
            <p className="text-gray-600">Manage tickets visually with drag-and-drop</p>
          </div>
          <KanbanBoard />
        </div>
      </div>
    </Layout>
  );
};

export default Kanban;
