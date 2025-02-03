/**
 * A oneliner helper which creates font property.
 *
 * @param fontFamily
 * @param fontSize
 * @param lineHeight
 * @param fontWeight
 */
export default function createFontProperty(
  fontFamily: string,
  fontSize: number,
  lineHeight: number,
  fontWeight: string,
) {
  return `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`;
}
