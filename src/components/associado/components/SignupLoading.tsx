
import React from 'react';
import { Loader2 } from 'lucide-react';

const SignupLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
};

export default SignupLoading;
