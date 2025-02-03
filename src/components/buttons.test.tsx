import PrimaryButton from '@components/atoms/primary-button.tsx';
import TextButton from '@components/atoms/text-button.tsx';
import ActionButton from '@components/molecules/action-button.tsx';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe.each([
  ['PrimaryButton', PrimaryButton],
  ['TextButton', TextButton],
  ['ActionButton', ActionButton],
])('test %s', (_, Component) => {
  it('should render label', () => {
    const { getByText } = render(<Component label="test label" icon={null} />);
    expect(getByText('test label')).toBeInTheDocument();
  });

  it('should call onClick callback while clicking', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    const { getByText } = render(<Component label="test label" icon={null} onClick={onClick} />);

    const button = getByText('test label');

    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe.each([
  ['TextButton', TextButton],
  ['ActionButton', ActionButton],
])('test %s', (_, Component) => {
  it('should pass icon prop', () => {
    const { getByTestId } = render(<Component label="test label" icon={<div data-testid="icon" />} />);

    expect(getByTestId('icon')).toBeInTheDocument();
  });
});

describe.each([
  ['PrimaryButton', PrimaryButton],
  ['TextButton', TextButton],
])('test %s', (_, Component) => {
  it('should pass className prop', () => {
    const { getByRole } = render(<Component label="test label" className="custom class" />);

    expect(getByRole('button')).toHaveClass('custom class');
  });
});
