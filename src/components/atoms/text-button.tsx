import { ReactNode } from 'react';

export interface TextButtonProps {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

export default function TextButton({ label, icon, onClick }: TextButtonProps) {
  return (
    <button
      className="typography-body-medium text-red flex gap-2 border-b border-red cursor-pointer h-max items-center"
      onClick={onClick}
    >
      <span>{label}</span>
      {icon}
    </button>
  );
}
