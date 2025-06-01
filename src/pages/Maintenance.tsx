
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wrench, Clock } from 'lucide-react';

interface MaintenanceProps {
  estimatedReturn?: string; // ISO date string
  message?: string;
}

const Maintenance: React.FC<MaintenanceProps> = ({ 
  estimatedReturn = '2025-06-01T14:00:00Z',
  message = 'We\'re performing scheduled maintenance to improve your experience.'
}) => {
  const formatReturnTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-lg mx-auto p-6">
        <div className="mb-8">
          <div className="relative mb-6">
            <Wrench className="h-20 w-20 text-blue-500 mx-auto animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-spin"></div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            We'll be back soon!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            {message}
          </p>
          
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Estimated return time</span>
            </div>
            <p className="text-lg font-semibold text-blue-600">
              {formatReturnTime(estimatedReturn)}
            </p>
          </div>
          
          <div className="text-sm text-gray-500 mb-6">
            <p>Thank you for your patience while we make improvements.</p>
            <p>For urgent support, please email: <span className="font-medium">support@thena.ai</span></p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button onClick={handleRefresh} className="w-full">
            Check if we're back
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = 'mailto:support@thena.ai?subject=Maintenance Mode Inquiry'}
            className="w-full"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
