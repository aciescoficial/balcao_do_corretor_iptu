
import { useState } from 'react';
import { useTwoFactorAuth } from './hooks/useTwoFactorAuth';
import { TwoFactorAuthProps } from './types';
import { TwoFactorEnabled } from './components/TwoFactorEnabled';
import { TwoFactorDisabled } from './components/TwoFactorDisabled';
import { TwoFactorSetup } from './components/TwoFactorSetup';
import { BackupCodes } from './components/BackupCodes';

export const TwoFactorAuth = ({ userId }: TwoFactorAuthProps) => {
  const [isEnabling, setIsEnabling] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  
  const {
    isEnabled,
    isLoading,
    secret,
    qrCodeUrl,
    backupCodes,
    setupNewTotpSecret,
    enableTwoFactor,
    disableTwoFactor,
    regenerateBackupCodes
  } = useTwoFactorAuth(userId);

  const handleStartSetup = async () => {
    await setupNewTotpSecret();
    setIsEnabling(true);
  };

  const handleVerify = async (code: string) => {
    const codes = await enableTwoFactor(code);
    setIsEnabling(false);
    setShowBackupCodes(true);
    return codes;
  };

  const handleDisable = async () => {
    await disableTwoFactor();
    setShowBackupCodes(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (showBackupCodes) {
    return (
      <BackupCodes 
        backupCodes={backupCodes}
        onRegenerate={regenerateBackupCodes}
        onBack={() => setShowBackupCodes(false)}
      />
    );
  }

  if (isEnabling) {
    return (
      <TwoFactorSetup 
        secret={secret}
        qrCodeUrl={qrCodeUrl}
        onVerify={handleVerify}
        onCancel={() => setIsEnabling(false)}
      />
    );
  }

  if (isEnabled) {
    return (
      <TwoFactorEnabled
        onShowBackupCodes={() => setShowBackupCodes(true)}
        onDisable={handleDisable}
      />
    );
  }

  return <TwoFactorDisabled onSetup={handleStartSetup} />;
};
