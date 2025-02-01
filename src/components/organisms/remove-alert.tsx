import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import Alert from '../../assets/icons/alert.svg?react';
import Close from '../../assets/icons/close.svg?react';
import PrimaryButton from '../atoms/primary-button.tsx';
import TextButton from '../atoms/text-button.tsx';

export enum RemoveAlertAction {
  Close,
  Cancel,
  Reset,
}

export interface RemoveAlertProps {
  onAction?: (action: RemoveAlertAction) => void;
}

const RemoveAlert = forwardRef<HTMLDialogElement, RemoveAlertProps>(({ onAction }: RemoveAlertProps, forwardedRef) => {
  const handleClick = (action: RemoveAlertAction) => () => {
    if (typeof forwardedRef === 'function' || !forwardedRef) {
      return;
    }

    forwardedRef.current?.close();
    onAction?.(action);
  };

  return (
    <dialog
      ref={forwardedRef}
      className={twMerge('bg-white rounded-[10px] px-32 py-12 m-auto', 'backdrop:bg-[#0000007f]')}
    >
      <div className="flex flex-col gap-12">
        <TextButton
          className="absolute top-8 right-8 w-8 h-8"
          icon={<Close />}
          onClick={handleClick(RemoveAlertAction.Close)}
        />
        <div className="flex flex-col items-center max-w-[calc(18.125rem_+_90px)]">
          <Alert className="w-[18.125rem] h-[18.125rem] text-red" />
          <div className="flex flex-col gap-2 text-center">
            <h3 className="typography-display">WARNING</h3>
            <p className="typography-body-medium">
              You’re about to reset whole process. Are you sure you want to do it?
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center gap-8">
          <TextButton label="Cancel" autoFocus onClick={handleClick(RemoveAlertAction.Cancel)} />
          <PrimaryButton label="Reset" onClick={handleClick(RemoveAlertAction.Reset)} />
        </div>
      </div>
    </dialog>
  );
});

RemoveAlert.displayName = 'RemoveAlert';

export default RemoveAlert;
