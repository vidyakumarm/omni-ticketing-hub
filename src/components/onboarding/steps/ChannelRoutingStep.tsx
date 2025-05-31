
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ChannelRoutingStepProps {
  data: any;
  updateData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ChannelRoutingStep = ({ data, updateData, onNext, onPrev }: ChannelRoutingStepProps) => {
  const [emailConfig, setEmailConfig] = useState({
    smtpServer: '',
    port: 587,
    username: '',
    password: '',
    useSSL: true
  });

  const connectMSTeams = () => {
    const clientId = 'your_ms_teams_client_id';
    const redirectUri = encodeURIComponent(`${window.location.origin}/oauth/msteams/callback`);
    const authUrl = `/oauth/msteams/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
    window.location.href = authUrl;
  };

  const setupEmail = async () => {
    try {
      const response = await fetch('/api/integrations/email/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailConfig)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.connected) {
          updateData({
            channels: {
              ...data.channels,
              email: { connected: true, enabled: true, config: emailConfig }
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to setup email:', error);
    }
  };

  const toggleChannel = (channel: string, enabled: boolean) => {
    updateData({
      channels: {
        ...data.channels,
        [channel]: { ...data.channels[channel], enabled }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Channel & Ticket Routing</h2>
        <p className="text-gray-600">Connect your support channels</p>
      </div>

      <div className="space-y-4">
        {/* Slack */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Slack</CardTitle>
            <div className="flex items-center space-x-2">
              {data.channels.slack.connected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <span className="text-sm">
                {data.channels.slack.connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="slack-enabled"
                checked={data.channels.slack.enabled}
                onCheckedChange={(checked) => toggleChannel('slack', !!checked)}
                disabled={!data.channels.slack.connected}
              />
              <Label htmlFor="slack-enabled">Enable Slack integration</Label>
            </div>
          </CardContent>
        </Card>

        {/* MS Teams */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">MS Teams</CardTitle>
            <div className="flex items-center space-x-2">
              {data.channels.teams.connected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <span className="text-sm">
                {data.channels.teams.connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {!data.channels.teams.connected ? (
              <Button onClick={connectMSTeams} variant="outline" size="sm">
                Connect MS Teams
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="teams-enabled"
                  checked={data.channels.teams.enabled}
                  onCheckedChange={(checked) => toggleChannel('teams', !!checked)}
                />
                <Label htmlFor="teams-enabled">Enable MS Teams integration</Label>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Email</CardTitle>
            <div className="flex items-center space-x-2">
              {data.channels.email.connected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <span className="text-sm">
                {data.channels.email.connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {!data.channels.email.connected ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="smtp-server">SMTP Server</Label>
                    <Input
                      id="smtp-server"
                      value={emailConfig.smtpServer}
                      onChange={(e) => setEmailConfig(prev => ({ ...prev, smtpServer: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      type="number"
                      value={emailConfig.port}
                      onChange={(e) => setEmailConfig(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={emailConfig.username}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={emailConfig.password}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <Button onClick={setupEmail} variant="outline" size="sm">
                  Setup Email
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-enabled"
                  checked={data.channels.email.enabled}
                  onCheckedChange={(checked) => toggleChannel('email', !!checked)}
                />
                <Label htmlFor="email-enabled">Enable Email integration</Label>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Web Widget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Web Widget</CardTitle>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Available</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="web-enabled"
                  checked={data.channels.web.enabled}
                  onCheckedChange={(checked) => toggleChannel('web', !!checked)}
                />
                <Label htmlFor="web-enabled">Enable Web Widget</Label>
              </div>
              {data.channels.web.enabled && (
                <div className="p-3 bg-gray-50 rounded text-xs">
                  <p className="font-medium mb-2">Embed this code on your website:</p>
                  <code className="break-all">
                    {`<script src="https://widget.thena.com/embed.js" data-workspace="${data.workspaceName}"></script>`}
                  </code>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ChannelRoutingStep;
