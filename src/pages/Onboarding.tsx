
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <OnboardingWizard teamId={teamId} onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default Onboarding;
