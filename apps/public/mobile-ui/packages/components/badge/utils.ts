export function isPresetColor(color?: string): boolean {
  const PresetColorTypes = ["primary", "error", "warning", "info"];
  return (PresetColorTypes as any[]).indexOf(color) !== -1;
}
