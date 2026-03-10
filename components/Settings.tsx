'use client';

import { FC } from 'react';

interface SettingsProps {
  className?: string;
  // ... other props
}

export function Settings({ className, ...props }: SettingsProps) {
  return <div className={className}>{/* ... */}</div>;
}

const Settings: FC<SettingsProps> = ({ apiKey, onApiKeyChange }) => {
  return (
    <div className="settings">
      <input
        type="password"
        placeholder="Enter Gemini API Key..."
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
      />
    </div>
  );
};

export default Settings;
