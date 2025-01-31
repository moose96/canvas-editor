import { useEffect, useRef } from 'react';

import Background from './assets/icons/background.svg?react';
import Img from './assets/icons/img.svg?react';
import Logo from './assets/icons/logo.svg?react';
import Reset from './assets/icons/reset.svg?react';
import Text from './assets/icons/text.svg?react';
import Line from './components/atoms/line.tsx';
import PrimaryButton from './components/atoms/primary-button.tsx';
import TextButton from './components/atoms/text-button.tsx';
import EditorService from './components/canvas/editor-service.ts';
import ActionButton from './components/molecules/action-button.tsx';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorService = useRef<EditorService>();

  const getEditorService = () => {
    if (!canvasRef.current) {
      return;
    }

    if (!editorService.current) {
      editorService.current = new EditorService(canvasRef.current);
    }

    return editorService.current;
  };

  useEffect(() => {
    getEditorService()?.draw();
  }, []);

  const handleText = async () => {
    const editorService = getEditorService();

    if (!editorService) {
      return;
    }

    await editorService.addText();
  };

  const handleImage = async () => {
    const editorService = getEditorService();

    if (!editorService) {
      return;
    }

    await editorService.addImage(
      'https://fastly.picsum.photos/id/248/200/200.jpg?hmac=36BllTJxy_tU762d2RYKfYaSQ3-RmP74hVxabGP_u3o',
    );
  };

  const handleBackground = async () => {
    const editorService = getEditorService();

    if (!editorService) {
      return;
    }

    await editorService.setBackground(
      'https://fastly.picsum.photos/id/188/1500/1200.jpg?hmac=Ud6sFBV7D7iKYZ2sdQPghHR5sYCFP9qQegF9mUcMaUY',
    );
  };

  const handleReset = async () => {
    const editorService = getEditorService();

    if (!editorService) {
      return;
    }

    await editorService.reset();
  };

  return (
    <div className="flex gap-6 justify-center py-14">
      <canvas ref={canvasRef} className="w-[759px] h-[948px]" width={759} height={948}></canvas>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Logo className="w-16 h-16" />
              <h1 className="typography-display text-black-75">CanvasEditor</h1>
            </div>
            <TextButton label="Reset" icon={<Reset />} onClick={handleReset} />
          </div>
          <Line />
          <div className="bg-white-97 rounded-[10px] px-4 py-6">
            <h2 className="typography-body-bold">Add content</h2>
          </div>
          <div className="flex flex-wrap gap-x-[29px] gap-y-8 max-w-[759px]">
            <ActionButton icon={<Text />} label="Text" onClick={handleText} />
            <ActionButton icon={<Img />} label="Image" onClick={handleImage} />
            <ActionButton icon={<Background />} label="Background" onClick={handleBackground} />
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
