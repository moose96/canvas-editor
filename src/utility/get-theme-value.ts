export default function getThemeValue(name: string) {
  return window.getComputedStyle(document.documentElement).getPropertyValue(name);
}
