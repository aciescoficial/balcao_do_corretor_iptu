
import React from 'react';
import { useSignupCompletion } from './hooks/useSignupCompletion';
import SignupLoading from './components/SignupLoading';
import SignupInvalidToken from './components/SignupInvalidToken';
import SignupCompleted from './components/SignupCompleted';
import SignupPasswordForm from './components/SignupPasswordForm';

const AssociadoSignupCompletion: React.FC = () => {
  // Get token from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  
  const {
    loading,
    submitting,
    tokenValid,
    signupData,
    completed,
    error,
    handleSubmit
  } = useSignupCompletion(token);
  
  if (loading) {
    return <SignupLoading />;
  }
  
  if (!tokenValid) {
    return <SignupInvalidToken error={error} />;
  }
  
  if (completed) {
    return <SignupCompleted />;
  }
  
  return (
    <SignupPasswordForm
      signupUserName={signupData?.nome || ''}
      submitting={submitting}
      onSubmit={handleSubmit}
    />
  );
};

export default AssociadoSignupCompletion;
