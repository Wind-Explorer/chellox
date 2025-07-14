export function isTauriApp(): boolean {
  return !!(window as any).__TAURI_INTERNALS__;
}
