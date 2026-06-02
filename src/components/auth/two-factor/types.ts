
export interface TwoFactorAuthProps {
  userId: string;
}

export interface TotpSetupData {
  secret: string;
  qrCodeUrl: string;
}

// Add the missing types for component props
export interface TwoFactorDisabledProps {
  onSetup: () => void;
}

export interface TwoFactorEnabledProps {
  onShowBackupCodes: () => void;
  onDisable: () => Promise<void>;
}

export interface TwoFactorSetupProps {
  secret: string;
  qrCodeUrl: string;
  onVerify: (verificationCode: string) => Promise<string[]>;
  onCancel: () => void;
}

export interface BackupCodesProps {
  backupCodes: string[];
  onRegenerate: () => Promise<void>;
  onBack: () => void;
}
