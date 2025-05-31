
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Settings, 
  Plus, 
  Users, 
  BarChart3, 
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp,
  Star,
  Slack,
  Mail,
  Globe,
  AlertCircle
} from 'lucide-react';

interface DashboardMetrics {
  openTicketsCount: number;
  avgFirstResponseTime: string;
  ticketsResolvedToday: number;
  csatScore: number;
  workloadDistribution: Array<{
    agentId: string;
    agentName: string;
    ticketCount: number;
  }>;
}

interface Activity {
  type: string;
  ticketId?: string;
  agentName: string;
  timestamp: string;
  description: string;
}

interface IntegrationStatus {
  slack: { connected: boolean; lastSyncedAt?: string };
  msteams: { connected: boolean; error?: string };
  email: { connected: boolean };
  webWidget: { installed: boolean };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [metricsRes, activityRes, integrationRes] = await Promise.all([
        fetch('/api/workspace/dashboard-metrics'),
        fetch('/api/workspace/recent-activity?limit=10'),
        fetch('/api/workspace/integration-status')
      ]);

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setRecentActivity(activityData);
      }

      if (integrationRes.ok) {
        const integrationData = await integrationRes.json();
        setIntegrationStatus(integrationData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReconnect = async (integration: string) => {
    try {
      await fetch(`/api/integrations/${integration}/reconnect`, {
        method: 'POST'
      });
      fetchDashboardData();
    } catch (error) {
      console.error(`Failed to reconnect ${integration}:`, error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 
              className="text-xl font-bold text-gray-900 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              Thena
            </h1>
            <nav className="hidden md:flex space-x-6">
              <button className="text-gray-600 hover:text-gray-900">Inbox</button>
              <button className="text-gray-600 hover:text-gray-900">Kanban</button>
              <button className="text-gray-600 hover:text-gray-900">Analytics</button>
              <button className="text-gray-600 hover:text-gray-900">Broadcasts</button>
              <button className="text-gray-600 hover:text-gray-900">Help Center</button>
              <button className="text-gray-600 hover:text-gray-900">Integrations</button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tickets, users, articles..."
                className="pl-10 w-64"
              />
            </div>

            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.openTicketsCount || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. First Response</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.avgFirstResponseTime || '0m'}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.ticketsResolvedToday || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CSAT Score</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.csatScore || 0}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    {recentActivity.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 flex-col">
                      <Plus className="h-6 w-6 mb-2" />
                      Create New Ticket
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <MessageSquare className="h-6 w-6 mb-2" />
                      Send Broadcast
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Users className="h-6 w-6 mb-2" />
                      Invite Agent
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <BarChart3 className="h-6 w-6 mb-2" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Channel Status Panel */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Channel Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Slack className="h-5 w-5" />
                      <span>Slack</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {integrationStatus?.slack.connected ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                      ) : (
                        <>
                          <Badge variant="destructive">Disconnected</Badge>
                          <Button size="sm" onClick={() => handleReconnect('slack')}>
                            Reconnect
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>MS Teams</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {integrationStatus?.msteams.connected ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                      ) : (
                        <>
                          <Badge variant="destructive">Disconnected</Badge>
                          <Button size="sm" onClick={() => handleReconnect('msteams')}>
                            Connect
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5" />
                      <span>Email</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {integrationStatus?.email.connected ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                      ) : (
                        <>
                          <Badge variant="destructive">Disconnected</Badge>
                          <Button size="sm" onClick={() => handleReconnect('email')}>
                            Setup
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Web Widget</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {integrationStatus?.webWidget.installed ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Installed</Badge>
                      ) : (
                        <>
                          <Badge variant="outline">Not Installed</Badge>
                          <Button size="sm" variant="outline">
                            Get Code
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Workload Distribution */}
              {metrics?.workloadDistribution && metrics.workloadDistribution.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Workload Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {metrics.workloadDistribution.map((agent) => (
                        <div key={agent.agentId} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{agent.agentName}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${Math.min((agent.ticketCount / 20) * 100, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{agent.ticketCount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
