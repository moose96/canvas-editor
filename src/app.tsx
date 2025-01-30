import Background from './assets/icons/background.svg?react';
import Img from './assets/icons/img.svg?react';
import Logo from './assets/icons/logo.svg?react';
import Reset from './assets/icons/reset.svg?react';
import Text from './assets/icons/text.svg?react';
import placeholder from './assets/placeholder.webp';
import Line from './components/atoms/line.tsx';
import PrimaryButton from './components/atoms/primary-button.tsx';
import TextButton from './components/atoms/text-button.tsx';
import ActionButton from './components/molecules/action-button.tsx';

export default function App() {
  return (
    <div className="flex gap-6 justify-center py-14">
      <img src={placeholder} alt="placeholder" className="aspect-[4/5] max-w-[759px]" />
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Logo className="w-16 h-16" />
              <h1 className="typography-display text-black-75">CanvasEditor</h1>
            </div>
            <TextButton label="Reset" icon={<Reset />} />
          </div>
          <Line />
          <div className="bg-white-97 rounded-[10px] px-4 py-6">
            <h2 className="typography-body-bold">Add content</h2>
          </div>
          <div className="flex flex-wrap gap-x-[29px] gap-y-8 max-w-[759px]">
            <ActionButton icon={<Text />} label="Text" />
            <ActionButton icon={<Img />} label="Image" />
            <ActionButton icon={<Background />} label="Background" />
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <Line />
          <PrimaryButton label="Export to PNG" className="self-end w-max" />
        </div>
      </div>
    </div>
  );
}
