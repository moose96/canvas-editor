import { ReactNode } from 'react';

export interface TextButtonProps {
  label: string;
  icon: ReactNode;
}

export default function TextButton({ label, icon }: TextButtonProps) {
  return (
    <button className="typography-body-medium text-red flex gap-2 border-b border-red cursor-pointer h-max items-center">
      <span>{label}</span>
      {icon}
    </button>
  );
}
