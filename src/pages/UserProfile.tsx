
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  User, 
  Shield, 
  Bell, 
  Key, 
  Upload, 
  Save,
  Plus,
  Trash,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'security', label: 'Security & Password', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API & Webhooks', icon: Key },
  ];

  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    role: 'Admin',
    timeZone: 'America/New_York',
    language: 'en',
    avatarUrl: null,
    twoFactorEnabled: false,
  };

  const mockApiKeys = [
    {
      id: '1',
      name: 'CI/CD Automation',
      createdAt: '2024-01-15T10:00:00Z',
      lastUsedAt: '2024-01-20T14:30:00Z',
      status: 'active',
    },
    {
      id: '2',
      name: 'Analytics Dashboard',
      createdAt: '2024-01-10T10:00:00Z',
      lastUsedAt: null,
      status: 'active',
    },
  ];

  const mockWebhooks = [
    {
      id: '1',
      endpointUrl: 'https://api.company.com/****/webhooks',
      triggers: ['ticket_created', 'ticket_updated'],
      hasSecret: true,
      lastDeliveredAt: '2024-01-20T15:45:00Z',
    },
  ];

  const renderProfileTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={mockUser.avatarUrl || ''} />
            <AvatarFallback className="text-lg">
              {mockUser.firstName[0]}{mockUser.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload Avatar</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" value={mockUser.firstName} />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input id="lastName" value={mockUser.lastName} />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={mockUser.email} readOnly className="bg-gray-50" />
          <p className="text-sm text-gray-500 mt-1">Email cannot be changed as it's used for login</p>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" value={mockUser.phone} />
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Input id="role" value={mockUser.role} readOnly className="bg-gray-50" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="timeZone">Time Zone</Label>
            <select id="timeZone" className="w-full mt-1 border rounded-md p-2" value={mockUser.timeZone}>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Asia/Kolkata">India Standard Time</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <Label htmlFor="language">Language</Label>
            <select id="language" className="w-full mt-1 border rounded-md p-2" value={mockUser.language}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <Button className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </CardContent>
    </Card>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password *</Label>
            <div className="relative">
              <Input 
                id="currentPassword" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="newPassword">New Password *</Label>
            <Input id="newPassword" type="password" placeholder="Enter new password" />
            <p className="text-sm text-gray-500 mt-1">
              Min 8 characters with uppercase, lowercase, digit, and special character
            </p>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password *</Label>
            <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
          </div>

          <Button>Change Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {mockUser.twoFactorEnabled ? '2FA is enabled' : '2FA is disabled'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {mockUser.twoFactorEnabled 
                  ? 'Your account is protected with two-factor authentication'
                  : 'Add an extra layer of security to your account'}
              </p>
            </div>
            <Button
              variant={mockUser.twoFactorEnabled ? 'destructive' : 'default'}
              onClick={() => setShow2FAModal(true)}
            >
              {mockUser.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Email Notifications</h4>
          <div className="space-y-3">
            {[
              'New Ticket Assigned to Me',
              'Ticket Status Changed',
              'New Broadcast Sent',
              'Weekly Analytics Summary',
              'Daily Digest of Unassigned Tickets',
            ].map((notification) => (
              <label key={notification} className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                <span>{notification}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Slack Notifications</h4>
          <div className="space-y-3">
            {[
              'New Ticket Assigned to Me',
              'Escalations / SLA Breaches',
            ].map((notification) => (
              <label key={notification} className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                <span>{notification}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Desktop Push Notifications</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="h-4 w-4 text-blue-600" />
              <span>Browser notifications for new tickets</span>
            </label>
          </div>
        </div>

        <Button>Save Preferences</Button>
      </CardContent>
    </Card>
  );

  const renderApiTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>API Keys</CardTitle>
          <Button onClick={() => setShowApiKeyModal(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Generate New API Key</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockApiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      key.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {key.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Webhooks</CardTitle>
          <Button onClick={() => setShowWebhookModal(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add New Webhook</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endpoint URL</TableHead>
                <TableHead>Triggers</TableHead>
                <TableHead>Secret?</TableHead>
                <TableHead>Last Delivered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWebhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-mono text-sm">{webhook.endpointUrl}</TableCell>
                  <TableCell>{webhook.triggers.join(', ')}</TableCell>
                  <TableCell>{webhook.hasSecret ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {webhook.lastDeliveredAt ? new Date(webhook.lastDeliveredAt).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderApiKeyModal = () => (
    <Dialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate New API Key</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="keyName">Key Name *</Label>
            <Input 
              id="keyName" 
              placeholder="e.g., CI/CD Automation" 
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowApiKeyModal(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1">Generate</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderWebhookModal = () => (
    <Dialog open={showWebhookModal} onOpenChange={setShowWebhookModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Webhook</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="endpointUrl">Endpoint URL *</Label>
            <Input 
              id="endpointUrl" 
              placeholder="https://api.yourapp.com/webhooks" 
            />
          </div>
          <div>
            <Label>Triggers</Label>
            <div className="mt-2 space-y-2">
              {['Ticket Created', 'Ticket Updated', 'Ticket Tagged', 'SLA Breached', 'Broadcast Sent'].map((trigger) => (
                <label key={trigger} className="flex items-center space-x-2">
                  <input type="checkbox" className="h-4 w-4 text-blue-600" />
                  <span>{trigger}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="secret">Secret / Signing Key (Optional)</Label>
            <Input 
              id="secret" 
              placeholder="Enter secret for payload signing" 
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowWebhookModal(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1">Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your profile, security, and preferences</p>
        </div>

        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'api' && renderApiTab()}
          </div>
        </div>
      </div>

      {renderApiKeyModal()}
      {renderWebhookModal()}
    </Layout>
  );
};

export default UserProfile;
