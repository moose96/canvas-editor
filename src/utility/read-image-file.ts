/**
 * Prompts user for image file and return it as base64 string.
 */
export default async function readImageFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  return new Promise<string | null>((resolve) => {
    input.addEventListener('change', () => {
      const file = input.files?.[0];

      if (!file) {
        return resolve(null);
      }

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result as string);
      });
      reader.readAsDataURL(file);
    });
    input.click();
  });
}
