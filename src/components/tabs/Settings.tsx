import { useState } from 'react';
import { Eye, EyeOff, RefreshCw, Trash2, Plus } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { cn } from '@/lib/utils';
import { APIProvider } from '@/types/chat';

export const Settings = () => {
  const {
    settings,
    updateProvider,
    addProvider,
    removeProvider,
    updateChatSettings,
    resetSettings,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<'providers' | 'chat' | 'tts' | 'memory'>('providers');
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  const enabledProviders = settings.providers.filter(p => p.enabled);
  const activeProvider = settings.providers.find(p => p.id === settings.chatSettings.activeProvider);

  const tabs = [
    { id: 'providers', label: 'API Providers' },
    { id: 'chat', label: 'Chat Settings' },
    { id: 'tts', label: 'TTS (Kokoro)' },
    { id: 'memory', label: 'Memory' },
  ] as const;

  return (
    <div className="h-full flex flex-col bg-background animate-fade-in p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <button
            onClick={resetSettings}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors border border-border rounded-lg"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Defaults
          </button>
      </div>

      <div className="flex border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-6 py-3 text-sm font-medium transition-colors relative',
              activeTab === tab.id
                ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin pr-2">
        {activeTab === 'providers' && (
          <div className="space-y-6 max-w-4xl">
            {settings.providers.map((provider) => (
              <div
                key={provider.id}
                className={cn(
                  'p-6 rounded-xl border transition-colors',
                  provider.enabled ? 'border-primary/50 bg-primary/5' : 'border-border bg-card'
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={provider.enabled}
                        onChange={(e) => updateProvider(provider.id, { enabled: e.target.checked })}
                        className="w-4 h-4 rounded border-border bg-secondary accent-primary"
                      />
                      <span className="font-medium text-lg">{provider.name}</span>
                    </label>
                    <span className="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground font-mono">
                      {provider.type}
                    </span>
                  </div>
                  {!['ollama', 'openai', 'anthropic'].includes(provider.id) && (
                    <button
                      onClick={() => removeProvider(provider.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Base URL</label>
                    <input
                      type="text"
                      value={provider.baseUrl}
                      onChange={(e) => updateProvider(provider.id, { baseUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {provider.type !== 'ollama' && provider.type !== 'koboldcpp' && provider.type !== 'llamacpp' && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">API Key</label>
                      <div className="relative">
                        <input
                          type={showApiKeys[provider.id] ? 'text' : 'password'}
                          value={provider.apiKey || ''}
                          onChange={(e) => updateProvider(provider.id, { apiKey: e.target.value })}
                          placeholder="sk-..."
                          className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                        />
                        <button
                          onClick={() => setShowApiKeys(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                        >
                          {showApiKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Available Models (comma-separated)</label>
                    <input
                      type="text"
                      value={provider.models.join(', ')}
                      onChange={(e) => updateProvider(provider.id, {
                        models: e.target.value.split(',').map(m => m.trim()).filter(Boolean)
                      })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => addProvider({
                id: `custom-${Date.now()}`,
                name: 'Custom Provider',
                type: 'custom',
                baseUrl: 'http://localhost:8080/v1',
                models: ['model-name'],
                enabled: false,
              })}
              className="w-full p-4 border border-dashed border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Custom Provider
            </button>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Active Provider</label>
                <select
                  value={settings.chatSettings.activeProvider}
                  onChange={(e) => updateChatSettings({ activeProvider: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {enabledProviders.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Model</label>
                <select
                  value={settings.chatSettings.activeModel}
                  onChange={(e) => updateChatSettings({ activeModel: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {activeProvider?.models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">System Prompt</label>
              <textarea
                value={settings.chatSettings.systemPrompt}
                onChange={(e) => updateChatSettings({ systemPrompt: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none font-mono"
              />
            </div>

            <div className="space-y-6 p-4 border border-border rounded-xl bg-card/30">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex justify-between mb-2">
                  <span>Temperature</span>
                  <span className="font-mono bg-background px-2 py-0.5 rounded border border-border">{settings.chatSettings.temperature}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.chatSettings.temperature}
                  onChange={(e) => updateChatSettings({ temperature: parseFloat(e.target.value) })}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground flex justify-between mb-2">
                  <span>Max Tokens</span>
                  <span className="font-mono bg-background px-2 py-0.5 rounded border border-border">{settings.chatSettings.maxTokens}</span>
                </label>
                <input
                  type="range"
                  min="256"
                  max="32768"
                  step="256"
                  value={settings.chatSettings.maxTokens}
                  onChange={(e) => updateChatSettings({ maxTokens: parseInt(e.target.value) })}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground flex justify-between mb-2">
                  <span>Top P</span>
                  <span className="font-mono bg-background px-2 py-0.5 rounded border border-border">{settings.chatSettings.topP}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.chatSettings.topP}
                  onChange={(e) => updateChatSettings({ topP: parseFloat(e.target.value) })}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground flex justify-between mb-2">
                  <span>Frequency Penalty</span>
                  <span className="font-mono bg-background px-2 py-0.5 rounded border border-border">{settings.chatSettings.frequencyPenalty}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.chatSettings.frequencyPenalty}
                  onChange={(e) => updateChatSettings({ frequencyPenalty: parseFloat(e.target.value) })}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tts' && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <p className="font-medium">Kokoro TTS integration coming soon.</p>
            <p className="text-sm mt-2">Configure local or remote Kokoro endpoints for voice synthesis.</p>
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <p className="font-medium">Long-term memory integration coming soon.</p>
            <p className="text-sm mt-2">Connect to Supra or similar vector databases for persistent context.</p>
          </div>
        )}
      </div>
    </div>
  );

};
