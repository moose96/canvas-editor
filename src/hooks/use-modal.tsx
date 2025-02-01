import { ForwardRefExoticComponent, RefAttributes, useRef } from 'react';

import Observable from '../utility/observable.ts';

export interface ModalBaseProps<ActionType> extends RefAttributes<HTMLDialogElement> {
  onAction?: (action: ActionType) => void;
}

export default function useModal<ActionType>(Modal: ForwardRefExoticComponent<ModalBaseProps<ActionType>>) {
  const ref = useRef<HTMLDialogElement>(null);
  const result = useRef<Observable<ActionType>>();

  const getResult = () => {
    if (!result.current) {
      result.current = new Observable<ActionType>();
    }

    return result.current;
  };

  const openModal = async () => {
    return new Promise<ActionType>((resolve) => {
      getResult().subscribe((value) => {
        resolve(value);
      });

      ref.current?.showModal();
    });
  };

  const handleAction = (action: ActionType) => {
    getResult().next(action);
  };

  const modalElement = <Modal ref={ref} onAction={handleAction} />;

  return {
    modalElement,
    openModal,
  };
}
