
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkspaceDetailsStepProps {
  data: any;
  updateData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const WorkspaceDetailsStep = ({ data, updateData, onNext, onPrev }: WorkspaceDetailsStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const timeZones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  const languages = ['English', 'Spanish', 'French', 'German', 'Japanese'];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateAndContinue = () => {
    const newErrors: Record<string, string> = {};

    if (!data.workspaceName.trim()) {
      newErrors.workspaceName = 'Workspace name is required';
    }

    if (!data.supportEmail.trim()) {
      newErrors.supportEmail = 'Support email is required';
    } else if (!emailRegex.test(data.supportEmail)) {
      newErrors.supportEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Workspace Details</h2>
        <p className="text-gray-600">Tell us about your organization</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="space-y-2">
          <Label htmlFor="workspaceName">Workspace Name</Label>
          <Input
            id="workspaceName"
            value={data.workspaceName}
            onChange={(e) => {
              updateData({ workspaceName: e.target.value });
              setErrors(prev => ({ ...prev, workspaceName: '' }));
            }}
            className={errors.workspaceName ? "border-red-500" : ""}
          />
          {errors.workspaceName && (
            <p className="text-sm text-red-600">{errors.workspaceName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeZone">Time Zone</Label>
          <Select value={data.timeZone} onValueChange={(value) => updateData({ timeZone: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeZones.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultLanguage">Default Language</Label>
          <Select value={data.defaultLanguage} onValueChange={(value) => updateData({ defaultLanguage: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="supportEmail">Primary Support Email</Label>
          <Input
            id="supportEmail"
            type="email"
            value={data.supportEmail}
            onChange={(e) => {
              updateData({ supportEmail: e.target.value });
              setErrors(prev => ({ ...prev, supportEmail: '' }));
            }}
            className={errors.supportEmail ? "border-red-500" : ""}
          />
          {errors.supportEmail && (
            <p className="text-sm text-red-600">{errors.supportEmail}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={validateAndContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default WorkspaceDetailsStep;
