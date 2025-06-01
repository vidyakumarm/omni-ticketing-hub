
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Inbox, 
  LayoutGrid, 
  Settings, 
  Users, 
  LogOut,
  Send,
  HelpCircle,
  User,
  Bot,
  CreditCard
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/inbox', label: 'Inbox', icon: Inbox },
    { path: '/kanban', label: 'Kanban', icon: LayoutGrid },
    { path: '/accounts-contacts', label: 'Accounts & Contacts', icon: Users },
    { path: '/broadcasts', label: 'Broadcasts', icon: Send },
    { path: '/help-center', label: 'Help Center', icon: HelpCircle },
  ];

  const settingsItems = [
    { path: '/settings/custom-fields', label: 'Custom Fields' },
    { path: '/settings/custom-statuses', label: 'Custom Statuses' },
    { path: '/settings/slas', label: 'SLAs' },
    { path: '/settings/tags', label: 'Tags' },
    { path: '/settings/workflows', label: 'Workflows' },
    { path: '/settings/ai', label: 'AI & Automation', icon: Bot },
    { path: '/settings/billing', label: 'Billing & Subscription', icon: CreditCard },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <div className="text-white font-bold text-lg">S</div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Syncrivo
            </span>
            <span className="text-xs text-gray-500 -mt-1">Smart Support</span>
          </div>
        </Link>

        {/* Main Navigation */}
        <div className="flex items-center space-x-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}

          {/* Settings Dropdown */}
          <div className="relative group">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
            
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-1">
                {settingsItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Profile */}
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Button>
          </Link>

          {/* Logout */}
          <Link to="/login">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-red-600 hover:text-red-700">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
