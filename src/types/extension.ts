// SillyTavern-compatible Extension Types
// Based on SillyTavern extension manifest format

export interface ExtensionManifest {
  display_name: string;
  loading_order: number;
  requires: string[];
  optional: string[];
  js: string;
  css?: string;
  author?: string;
  version?: string;
  homePage?: string;
  auto_update?: boolean;
}

export interface Extension {
  id: string;
  name: string;
  displayName: string;
  version: string;
  author?: string;
  description?: string;
  enabled: boolean;
  manifest: ExtensionManifest;
  path: string;
  loaded: boolean;
  error?: string;
}

export interface ExtensionSettings {
  enabledExtensions: string[];
  extensionData: Record<string, unknown>;
}

export interface ExtensionAPI {
  // Core hooks for extensions
  registerSlashCommand: (name: string, callback: (args: string[]) => void, description?: string) => void;
  registerMessageHandler: (callback: (message: unknown) => void) => void;
  registerSettingsPanel: (id: string, component: unknown) => void;
  
  // Data access
  getCharacter: () => unknown;
  getChat: () => unknown[];
  getSettings: () => unknown;
  
  // UI helpers
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  showModal: (title: string, content: unknown) => void;
}

export type ExtensionLoadOrder = 'early' | 'normal' | 'late';

export interface ExtensionDependency {
  name: string;
  version?: string;
  optional?: boolean;
}
