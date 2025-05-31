
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface FinishStepProps {
  data: any;
  onFinish: () => void;
  onPrev: () => void;
}

const FinishStep = ({ data, onFinish, onPrev }: FinishStepProps) => {
  const connectedChannels = Object.entries(data.channels)
    .filter(([_, channel]: [string, any]) => channel.connected && channel.enabled)
    .map(([name, _]) => name.charAt(0).toUpperCase() + name.slice(1));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold">You're All Set!</h2>
        <p className="text-gray-600">Your Thena workspace is ready to go</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          <h3 className="font-medium text-gray-900">Setup Summary</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Workspace:</span>
              <span className="font-medium">{data.workspaceName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Connected Channels:</span>
              <span className="font-medium">
                {connectedChannels.length > 0 ? connectedChannels.join(', ') : 'None'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Team Members Invited:</span>
              <span className="font-medium">{data.invitedEmails.length}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Time Zone:</span>
              <span className="font-medium">{data.timeZone}</span>
            </div>
          </div>
        </div>

        {data.invitedEmails.length === 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-700">
              💡 Remember to invite team members later to help manage support tickets!
            </p>
          </div>
        )}
      </div>

      <div className="text-center">
        <Button onClick={onFinish} size="lg" className="px-8">
          Go to Dashboard
        </Button>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default FinishStep;
