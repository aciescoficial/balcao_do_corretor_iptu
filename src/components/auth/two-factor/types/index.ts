
export interface TwoFactorAuthProps {
  userId: string;
}

export interface TotpSetupData {
  secret: string;
  qrCodeUrl: string;
}

export interface TwoFactorEnabledProps {
  onShowBackupCodes: () => void;
  onDisable: () => void;
}

export interface TwoFactorDisabledProps {
  onSetup: () => void;
}

export interface TwoFactorSetupProps {
  secret: string;
  qrCodeUrl: string;
  onVerify: (code: string) => Promise<string[]>;
  onCancel: () => void;
}

export interface BackupCodesProps {
  backupCodes: string[];
  onRegenerate: () => Promise<string[]>;
  onBack: () => void;
}
