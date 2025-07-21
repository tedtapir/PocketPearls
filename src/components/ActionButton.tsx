import React from 'react';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  primary?: boolean;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  label, 
  onClick, 
  icon, 
  primary, 
  disabled 
}) => {
  return (
    <button
      className={`pp-btn ${primary ? 'primary' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <div className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </div>
    </button>
  );
};