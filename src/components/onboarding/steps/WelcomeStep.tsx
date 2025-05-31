
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Welcome to Thena!</h2>
        <p className="text-lg text-gray-600">
          Let's get you set up in 3 quick steps.
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex items-center space-x-3 text-left">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span className="text-gray-700">Manage support in Slack</span>
        </div>
        <div className="flex items-center space-x-3 text-left">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span className="text-gray-700">Manage support in MS Teams</span>
        </div>
        <div className="flex items-center space-x-3 text-left">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span className="text-gray-700">Manage support via Email</span>
        </div>
        <div className="flex items-center space-x-3 text-left">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span className="text-gray-700">Manage support on Web</span>
        </div>
      </div>

      <Button onClick={onNext} size="lg" className="mt-8">
        Continue
      </Button>
    </div>
  );
};

export default WelcomeStep;
