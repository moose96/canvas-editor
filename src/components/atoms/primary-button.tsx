import { twMerge } from 'tailwind-merge';

export interface PrimaryButtonProps {
  label: string;
  className?: string;
}

export default function PrimaryButton({ label, className }: PrimaryButtonProps) {
  return (
    <button
      className={twMerge(
        'rounded-[5px] bg-primary text-white px-8 py-2 typography-button cursor-pointer',
        'hover:bg-[#550788]',
        'focus:focus-outline',
        'disabled:text-black-25',
        className,
      )}
    >
      {label}
    </button>
  );
}
