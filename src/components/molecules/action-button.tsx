import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export default function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      className={twMerge(
        'bg-white-97 p-3 rounded-[10px] relative flex items-center justify-center w-[365px] h-[256px] cursor-pointer transition-colors duration-250',
        'hover:bg-black-25',
        'focus:focus-outline',
        'disabled:text-black-25',
      )}
      onClick={onClick}
    >
      <div className="aspect-square w-32">{icon}</div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 typography-body-medium">{label}</div>
    </button>
  );
}
