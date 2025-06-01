
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw } from 'lucide-react';

interface RateLimitedProps {
  retryAfter?: number; // seconds
}

const RateLimited: React.FC<RateLimitedProps> = ({ retryAfter = 60 }) => {
  const [countdown, setCountdown] = useState(retryAfter);
  const [canRetry, setCanRetry] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanRetry(true);
    }
  }, [countdown]);

  const handleRetry = () => {
    window.location.reload();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-2">429</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Too Many Requests</h2>
          <p className="text-gray-600 mb-6">
            You've made too many requests. Please wait before trying again.
          </p>
          
          {!canRetry ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-medium">
                Please wait {formatTime(countdown)}
              </p>
              <div className="w-full bg-yellow-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((retryAfter - countdown) / retryAfter) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">
                You can now try again!
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleRetry} 
            disabled={!canRetry}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {canRetry ? 'Try Again' : 'Please Wait...'}
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RateLimited;
