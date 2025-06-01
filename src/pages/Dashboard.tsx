
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Inbox, 
  LayoutGrid, 
  Users, 
  Settings,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Open Tickets', value: '23', icon: AlertCircle, color: 'text-red-600' },
    { label: 'Resolved Today', value: '8', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Avg Response Time', value: '1.2h', icon: Clock, color: 'text-blue-600' },
    { label: 'Customer Satisfaction', value: '4.8', icon: TrendingUp, color: 'text-purple-600' },
  ];

  const quickActions = [
    { label: 'View Inbox', icon: Inbox, path: '/inbox', color: 'bg-blue-500' },
    { label: 'Kanban Board', icon: LayoutGrid, path: '/kanban', color: 'bg-green-500' },
    { label: 'Manage Accounts', icon: Users, path: '/accounts-contacts', color: 'bg-purple-500' },
    { label: 'Settings', icon: Settings, path: '/settings/custom-fields', color: 'bg-gray-500' },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your support.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.path}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className={`${action.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-medium text-gray-900">{action.label}</h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">Ticket #TK-001 resolved by Alice Johnson</span>
                  </div>
                  <span className="text-xs text-gray-500">2 minutes ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">New ticket created: Login issue with SSO</span>
                  </div>
                  <span className="text-xs text-gray-500">5 minutes ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">Ticket #TK-003 assigned to Bob Smith</span>
                  </div>
                  <span className="text-xs text-gray-500">10 minutes ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
