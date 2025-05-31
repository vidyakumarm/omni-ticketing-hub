
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InviteTeamStepProps {
  data: any;
  updateData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const InviteTeamStep = ({ data, updateData, onNext, onPrev }: InviteTeamStepProps) => {
  const [emailInput, setEmailInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const parseEmails = (emailString: string): string[] => {
    return emailString
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);
  };

  const sendInvites = async () => {
    const emails = parseEmails(emailInput);
    const invalidEmails = emails.filter(email => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setErrors({ emails: `Invalid email addresses: ${invalidEmails.join(', ')}` });
      return;
    }

    if (emails.length === 0) {
      setErrors({ emails: 'Please enter at least one email address' });
      return;
    }

    try {
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: emails,
          role: data.invitedRole
        })
      });

      if (response.ok) {
        updateData({ invitedEmails: emails });
        setErrors({});
        onNext();
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.message || 'Failed to send invites' });
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    }
  };

  const skipForNow = () => {
    updateData({ invitedEmails: [] });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Invite Your Team</h2>
        <p className="text-gray-600">Add team members to help manage support</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="space-y-2">
          <Label htmlFor="emails">Team Member Emails</Label>
          <Textarea
            id="emails"
            placeholder="Enter email addresses separated by commas&#10;example@company.com, another@company.com"
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
              setErrors(prev => ({ ...prev, emails: '' }));
            }}
            className={errors.emails ? "border-red-500" : ""}
            rows={4}
          />
          {errors.emails && (
            <p className="text-sm text-red-600">{errors.emails}</p>
          )}
          <p className="text-xs text-gray-500">
            Separate multiple email addresses with commas
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Assign Role</Label>
          <Select value={data.invitedRole} onValueChange={(value) => updateData({ invitedRole: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Agent">Agent</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Observer">Observer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <div className="space-y-3 pt-4">
          <Button onClick={sendInvites} className="w-full">
            Send Invites
          </Button>
          <Button onClick={skipForNow} variant="outline" className="w-full">
            Skip for Now
          </Button>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default InviteTeamStep;
