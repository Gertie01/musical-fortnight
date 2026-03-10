'use client';

import { FC } from 'react';

export interface SettingsProps {
  className?: string;
  apiKey?: string;
  onApiKeyChange?: (value: string) => void;
}

const Settings: FC<SettingsProps> = ({ className, apiKey, onApiKeyChange }) => {
  return (
    <input
      value={apiKey}
      onChange={(e) => onApiKeyChange?.(e.target.value)}
    />
  );
};

export default Settings;
