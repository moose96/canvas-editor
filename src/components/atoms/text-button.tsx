import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface TextButtonProps {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  autoFocus?: boolean;
  ariaLabel?: string;
}

export default function TextButton({ label, icon, onClick, className = '', autoFocus, ariaLabel }: TextButtonProps) {
  return (
    <button
      className={twMerge(
        'typography-body-medium flex gap-2 cursor-pointer h-max items-center rounded-[5px] transition-colors duration-250',
        'focus:focus-outline',
        className,
      )}
      onClick={onClick}
      autoFocus={autoFocus}
      aria-label={ariaLabel}
    >
      {label && <span>{label}</span>}
      {icon}
    </button>
  );
}
