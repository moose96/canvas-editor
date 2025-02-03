/**
 * Gets value from tailwind config and other css variables
 *
 * @param name - css variable
 */
export default function getThemeValue(name: string) {
  return window.getComputedStyle(document.documentElement).getPropertyValue(name);
}
