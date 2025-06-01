
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BroadcastsTable } from '@/components/broadcasts/BroadcastsTable';
import { BroadcastModal } from '@/components/broadcasts/BroadcastModal';
import { BroadcastDetailPanel } from '@/components/broadcasts/BroadcastDetailPanel';
import { Broadcast } from '@/types/broadcast';
import { 
  Plus, 
  Search, 
  Filter,
  BarChart3,
  Users,
  Send,
  CheckCircle
} from 'lucide-react';

const Broadcasts: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const mockBroadcasts: Broadcast[] = [
    {
      id: '1',
      name: 'May Product Update',
      audience: { type: 'all' },
      channels: ['slack', 'teams'],
      message: 'Hello {{customerName}}, we have exciting updates to share about our latest product features...',
      schedule: { type: 'now' },
      timeZone: 'UTC',
      status: 'sent',
      createdBy: { id: '1', name: 'John Doe' },
      createdAt: '2024-01-20T10:00:00Z',
    },
    {
      id: '2',
      name: 'Scheduled Maintenance Notice',
      audience: { type: 'segments', filters: { channel: 'slack' } },
      channels: ['slack'],
      message: 'Dear {{customerName}}, we will be performing scheduled maintenance on...',
      schedule: { type: 'later', dateTime: '2024-01-25T02:00:00Z' },
      timeZone: 'UTC',
      status: 'scheduled',
      createdBy: { id: '2', name: 'Jane Smith' },
      createdAt: '2024-01-18T14:30:00Z',
    },
  ];

  const stats = [
    { label: 'Total Broadcasts', value: '24', icon: Send, color: 'text-blue-600' },
    { label: 'Total Recipients', value: '1,250', icon: Users, color: 'text-green-600' },
    { label: 'Delivery Rate', value: '98.5%', icon: CheckCircle, color: 'text-emerald-600' },
    { label: 'Avg. Open Rate', value: '76%', icon: BarChart3, color: 'text-purple-600' },
  ];

  const handleCreateBroadcast = () => {
    setSelectedBroadcast(null);
    setShowModal(true);
  };

  const handleEditBroadcast = (broadcast: Broadcast) => {
    setSelectedBroadcast(broadcast);
    setShowModal(true);
  };

  const handleViewBroadcast = (broadcast: Broadcast) => {
    setSelectedBroadcast(broadcast);
    setShowDetail(true);
  };

  const handleSaveBroadcast = (broadcastData: Omit<Broadcast, 'id' | 'createdAt' | 'createdBy' | 'status'>) => {
    console.log('Saving broadcast:', broadcastData);
    // Here you would typically save to backend
    setShowModal(false);
  };

  const filteredBroadcasts = mockBroadcasts.filter(broadcast =>
    broadcast.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Broadcasts</h1>
            <p className="text-gray-600 mt-2">Send messages to multiple customers across channels</p>
          </div>
          <Button onClick={handleCreateBroadcast} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Broadcast</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Broadcast History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search broadcasts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>

            <BroadcastsTable
              broadcasts={filteredBroadcasts}
              onEdit={handleEditBroadcast}
              onView={handleViewBroadcast}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <BroadcastModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        broadcast={selectedBroadcast}
        onSave={handleSaveBroadcast}
      />

      <BroadcastDetailPanel
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        broadcast={selectedBroadcast}
      />
    </Layout>
  );
};

export default Broadcasts;
