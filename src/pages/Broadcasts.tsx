
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BroadcastsTable } from '@/components/broadcasts/BroadcastsTable';
import { BroadcastModal } from '@/components/broadcasts/BroadcastModal';
import { BroadcastDetailPanel } from '@/components/broadcasts/BroadcastDetailPanel';
import { Search } from 'lucide-react';

export interface Broadcast {
  id: string;
  name: string;
  channels: string[];
  audience: {
    type: 'all' | 'segments';
    filters?: any;
  };
  scheduledAt: string;
  status: 'scheduled' | 'sent' | 'failed';
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  message: string;
  deliveryStats?: {
    total: number;
    delivered: number;
    failed: number;
  };
}

const Broadcasts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);
  const [selectedBroadcastId, setSelectedBroadcastId] = useState<string | null>(null);

  // Mock data
  const broadcasts: Broadcast[] = [
    {
      id: 'bc-1',
      name: 'May Product Update',
      channels: ['slack', 'teams'],
      audience: { type: 'all' },
      scheduledAt: '2025-06-02T10:00:00Z',
      status: 'sent',
      createdBy: { id: 'user-1', name: 'Alice Johnson' },
      createdAt: '2025-06-01T08:00:00Z',
      message: 'Exciting new features are now available!',
      deliveryStats: { total: 150, delivered: 148, failed: 2 }
    },
    {
      id: 'bc-2',
      name: 'System Maintenance Notice',
      channels: ['slack'],
      audience: { type: 'segments', filters: { priority: 'high' } },
      scheduledAt: '2025-06-05T09:00:00Z',
      status: 'scheduled',
      createdBy: { id: 'user-2', name: 'Bob Smith' },
      createdAt: '2025-06-01T14:30:00Z',
      message: 'Scheduled maintenance on Sunday...'
    }
  ];

  const filteredBroadcasts = broadcasts.filter(broadcast =>
    broadcast.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBroadcast = () => {
    setSelectedBroadcast(null);
    setIsModalOpen(true);
  };

  const handleEditBroadcast = (broadcast: Broadcast) => {
    setSelectedBroadcast(broadcast);
    setIsModalOpen(true);
  };

  const handleViewDetails = (broadcastId: string) => {
    setSelectedBroadcastId(broadcastId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBroadcast(null);
  };

  const handleCloseDetailPanel = () => {
    setSelectedBroadcastId(null);
  };

  const handleSaveBroadcast = (broadcastData: Partial<Broadcast>) => {
    console.log('Saving broadcast:', broadcastData);
    // Handle save logic here
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Broadcasts</h1>
          <Button onClick={handleCreateBroadcast}>
            Create New Broadcast
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search broadcasts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredBroadcasts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No broadcasts yet
            </h3>
            <p className="text-gray-500 mb-4">
              Send a broadcast message to inform customers.
            </p>
            <Button onClick={handleCreateBroadcast}>
              Create Your First Broadcast
            </Button>
          </div>
        ) : (
          <BroadcastsTable
            broadcasts={filteredBroadcasts}
            onEdit={handleEditBroadcast}
            onViewDetails={handleViewDetails}
          />
        )}

        {isModalOpen && (
          <BroadcastModal
            isOpen={isModalOpen}
            broadcast={selectedBroadcast}
            onClose={handleCloseModal}
            onSave={handleSaveBroadcast}
          />
        )}

        {selectedBroadcastId && (
          <BroadcastDetailPanel
            broadcastId={selectedBroadcastId}
            broadcasts={broadcasts}
            onClose={handleCloseDetailPanel}
          />
        )}
      </div>
    </Layout>
  );
};

export default Broadcasts;
