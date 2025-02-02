import { twMerge } from 'tailwind-merge';

export interface PrimaryButtonProps {
  label: string;
  className?: string;
  onClick?: () => void;
}

export default function PrimaryButton({ label, className, onClick }: PrimaryButtonProps) {
  return (
    <button
      className={twMerge(
        'rounded-[5px] bg-primary text-white px-8 py-2 typography-button cursor-pointer transition-colors duration-250',
        'hover:bg-[#550788]',
        'focus:focus-outline',
        'disabled:text-black-25',
        className,
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
