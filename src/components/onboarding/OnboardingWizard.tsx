
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import WelcomeStep from './steps/WelcomeStep';
import WorkspaceDetailsStep from './steps/WorkspaceDetailsStep';
import ChannelRoutingStep from './steps/ChannelRoutingStep';
import InviteTeamStep from './steps/InviteTeamStep';
import FinishStep from './steps/FinishStep';

interface OnboardingWizardProps {
  teamId: string | null;
  onComplete: () => void;
}

interface OnboardingData {
  workspaceName: string;
  timeZone: string;
  defaultLanguage: string;
  supportEmail: string;
  channels: {
    slack: { connected: boolean; enabled: boolean };
    teams: { connected: boolean; enabled: boolean };
    email: { connected: boolean; enabled: boolean; config?: any };
    web: { connected: boolean; enabled: boolean };
  };
  invitedEmails: string[];
  invitedRole: string;
}

const OnboardingWizard = ({ teamId, onComplete }: OnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    workspaceName: '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    defaultLanguage: 'English',
    supportEmail: '',
    channels: {
      slack: { connected: !!teamId, enabled: !!teamId },
      teams: { connected: false, enabled: false },
      email: { connected: false, enabled: false },
      web: { connected: false, enabled: false }
    },
    invitedEmails: [],
    invitedRole: 'Agent'
  });

  const steps = [
    { title: 'Welcome', component: WelcomeStep },
    { title: 'Workspace Details', component: WorkspaceDetailsStep },
    { title: 'Channel Routing', component: ChannelRoutingStep },
    { title: 'Invite Team', component: InviteTeamStep },
    { title: 'Finish', component: FinishStep }
  ];

  useEffect(() => {
    if (teamId) {
      // Fetch Slack workspace info
      fetchSlackWorkspaceInfo(teamId);
    }
  }, [teamId]);

  const fetchSlackWorkspaceInfo = async (teamId: string) => {
    try {
      const response = await fetch(`/api/workspace/slack-info?teamId=${teamId}`);
      if (response.ok) {
        const { teamName } = await response.json();
        setData(prev => ({ ...prev, workspaceName: teamName }));
      }
    } catch (error) {
      console.log('Could not fetch Slack workspace info:', error);
    }
  };

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      // Create/update workspace
      await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceName: data.workspaceName,
          timeZone: data.timeZone,
          defaultLanguage: data.defaultLanguage,
          supportEmail: data.supportEmail
        })
      });

      // Send invites if any
      if (data.invitedEmails.length > 0) {
        await fetch('/api/users/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emails: data.invitedEmails,
            role: data.invitedRole
          })
        });
      }

      onComplete();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const renderCurrentStep = () => {
    const commonProps = {
      onNext: nextStep,
      onPrev: prevStep,
      isFirst: currentStep === 0,
      isLast: currentStep === steps.length - 1
    };

    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return <WorkspaceDetailsStep data={data} updateData={updateData} {...commonProps} />;
      case 2:
        return <ChannelRoutingStep data={data} updateData={updateData} {...commonProps} />;
      case 3:
        return <InviteTeamStep data={data} updateData={updateData} {...commonProps} />;
      case 4:
        return <FinishStep data={data} onFinish={handleFinish} onPrev={prevStep} />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Thena Setup</h1>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        {renderCurrentStep()}
      </CardContent>
    </Card>
  );
};

export default OnboardingWizard;
