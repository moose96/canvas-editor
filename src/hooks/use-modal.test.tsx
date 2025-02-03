import useModal, { ModalBaseProps } from '@hooks/use-modal.tsx';
import { act, render, renderHook, RenderHookResult, RenderResult } from '@testing-library/react';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const showModalMock = vi.fn();
let renderResult: RenderResult;

const TestComponent = forwardRef<HTMLDialogElement, ModalBaseProps<string>>(({ onAction }, ref) => {
  useImperativeHandle(
    ref,
    () =>
      ({
        showModal: showModalMock,
      }) as unknown as HTMLDialogElement,
  );

  useEffect(() => {
    setTimeout(() => {
      onAction?.('test');
    }, 0);
  }, [onAction]);

  return <div data-testid="test-component" />;
});

let renderHookResult: RenderHookResult<ReturnType<typeof useModal>, ModalBaseProps<string>>;

describe('test useModal', () => {
  beforeEach(() => {
    renderHookResult = renderHook(() => useModal(TestComponent));
    renderResult = render(renderHookResult.result.current.modalElement);
  });

  it('should return ModalElement', () => {
    const { result } = renderHookResult;
    const { getByTestId } = renderResult;

    expect(result.current.modalElement).toBeDefined();
    expect(getByTestId('test-component')).toBeInTheDocument();
  });

  it('should call showModal function and return value', async () => {
    const { result } = renderHookResult;
    let openModalResult: string;

    await act(async () => {
      openModalResult = await result.current.openModal();
    });

    expect(openModalResult).toEqual('test');
    expect(showModalMock).toHaveBeenCalled();
  });
});
