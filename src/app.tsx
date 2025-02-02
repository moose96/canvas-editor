import Background from '@assets/icons/background.svg?react';
import Img from '@assets/icons/img.svg?react';
import Logo from '@assets/icons/logo.svg?react';
import Reset from '@assets/icons/reset.svg?react';
import Text from '@assets/icons/text.svg?react';
import Line from '@components/atoms/line.tsx';
import PrimaryButton from '@components/atoms/primary-button.tsx';
import TextButton from '@components/atoms/text-button.tsx';
import EditorService from '@components/canvas/editor-service.ts';
import ActionButton from '@components/molecules/action-button.tsx';
import RemoveAlert, { RemoveAlertAction } from '@components/organisms/remove-alert.tsx';
import useModal from '@hooks/use-modal.tsx';
import readImageFile from '@utility/read-image-file.ts';
import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorService = useRef<EditorService>();
  const { modalElement, openModal } = useModal(RemoveAlert);

  const getEditorService = async () => {
    if (!canvasRef.current) {
      return;
    }

    if (!editorService.current) {
      editorService.current = await EditorService.create(canvasRef.current);
    }

    return editorService.current;
  };

  useEffect(() => {
    getEditorService().then((service) => service?.draw());
  }, []);

  const handleText = async () => {
    const editorService = await getEditorService();

    if (!editorService) {
      return;
    }

    await editorService.addText();
  };

  const handleImage = async () => {
    const editorService = await getEditorService();

    if (!editorService) {
      return;
    }

    const file = await readImageFile();

    if (file) {
      await editorService.addImage(file);
    }
  };

  const handleBackground = async () => {
    const editorService = await getEditorService();

    if (!editorService) {
      return;
    }

    const file = await readImageFile();

    if (file) {
      await editorService.setBackground(file);
    }
  };

  const handleReset = async () => {
    const editorService = await getEditorService();

    if (!editorService) {
      return;
    }

    const actionType = await openModal();

    if (actionType === RemoveAlertAction.Reset) {
      await editorService.reset();
    }
  };

  const handleExport = async () => {
    const editorService = await getEditorService();

    if (!editorService) {
      return;
    }

    await editorService.export();
  };

  return (
    <div className="flex gap-6 justify-center py-14">
      <canvas ref={canvasRef} className="w-[759px] h-[948px]" width={1080} height={1350}></canvas>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Logo className="w-16 h-16" />
              <h1 className="typography-display text-black-75">CanvasEditor</h1>
            </div>
            <TextButton
              className={twMerge(
                'text-red relative',
                'after:absolute after:left-0 after:-bottom-[1px] after:w-full after:h-[1px] after:bg-red',
              )}
              label="Reset"
              icon={<Reset />}
              onClick={handleReset}
            />
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
          <PrimaryButton label="Export to PNG" className="self-end w-max" onClick={handleExport} />
        </div>
      </div>
      {modalElement}
    </div>
  );
}
