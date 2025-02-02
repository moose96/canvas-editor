export default function createFontProperty(
  fontFamily: string,
  fontSize: number,
  lineHeight: number,
  fontWeight: string,
) {
  return `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`;
}
