
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ForbiddenProps {
  userRole?: string;
  resource?: string;
}

const Forbidden: React.FC<ForbiddenProps> = ({ 
  userRole = 'Agent', 
  resource = 'this page' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <Shield className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-2">403</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Access Forbidden</h2>
          <p className="text-gray-600 mb-4">
            You do not have permission to view {resource}.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Your role:</span> {userRole}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Resource:</span> {resource}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Link to="/dashboard">
            <Button className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" className="w-full">
              View Profile & Permissions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
