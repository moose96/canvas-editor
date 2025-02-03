import RemoveAlert, { RemoveAlertAction } from '@components/organisms/remove-alert.tsx';
import { render, RenderResult } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let renderResult: RenderResult;
let user: UserEvent;
const actionMock = vi.fn();

describe('test RemoveAlert modal', () => {
  beforeEach(() => {
    renderResult = render(<RemoveAlert ref={{ current: null }} onAction={actionMock} />);
    user = userEvent.setup();
  });

  it('should call onAction with Action.Close', async () => {
    const { getByLabelText } = renderResult;

    const button = getByLabelText('Close dialog');

    await user.click(button);

    expect(actionMock).toHaveBeenCalledWith(RemoveAlertAction.Close);
  });

  it.each([
    ['Cancel', RemoveAlertAction.Cancel],
    ['Reset', RemoveAlertAction.Reset],
  ])('should call onAction with Action.%s', async (label, expected) => {
    const { getByText } = renderResult;

    const button = getByText(label);

    await user.click(button);

    expect(actionMock).toHaveBeenCalledWith(expected);
  });
});
