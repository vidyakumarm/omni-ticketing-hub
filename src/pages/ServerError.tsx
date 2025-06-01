
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const ServerError: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@thena.ai?subject=Server Error Report';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-2">500</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Server Error</h2>
          <p className="text-gray-600 mb-6">
            Something went wrong on our end. We've been notified and are working to fix it.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button onClick={handleGoBack} className="w-full">
            Go Back
          </Button>
          <Button onClick={handleContactSupport} variant="outline" className="w-full">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
