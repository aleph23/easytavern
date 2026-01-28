import { useState } from 'react';
import { Plus, Trash2, Check, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';
import { useTabs } from '@/contexts/TabContext';

export const Settings = () => {
  const {
    settings,
    updateProvider,
    addProvider,
    removeProvider,
    updateChatSettings,
    resetSettings
  } = useSettings();

  const { closeTab, activeTabId } = useTabs();

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
    <div className="h-full flex flex-col bg-background max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden flex flex-col flex-1 border border-border shadow-sm">
        <div className="flex border-b border-border bg-muted/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 px-4 py-4 text-sm font-medium transition-colors border-b-2',
                activeTab === tab.id
                  ? 'text-primary border-primary bg-background'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1 scrollbar-thin">
          {activeTab === 'providers' && (
            <div className="space-y-4">
              {settings.providers.map((provider) => (
                <div
                  key={provider.id}
                  className={cn(
                    'p-4 rounded-xl border transition-colors',
                    provider.enabled ? 'border-primary/50 bg-primary/5' : 'border-border bg-card'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={provider.enabled}
                          onChange={(e) => updateProvider(provider.id, { enabled: e.target.checked })}
                          className="w-4 h-4 rounded border-border bg-secondary accent-primary"
                        />
                        <span className="font-medium">{provider.name}</span>
                      </label>
                      <span className="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">
                        {provider.type}
                      </span>
                    </div>
                    {!['ollama', 'openai', 'anthropic', 'webllm'].includes(provider.id) && (
                      <button
                        onClick={() => removeProvider(provider.id)}
                        className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Base URL</label>
                      <input
                        type="text"
                        value={provider.baseUrl}
                        onChange={(e) => updateProvider(provider.id, { baseUrl: e.target.value })}
                        disabled={provider.type === 'webllm'}
                        className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                      />
                    </div>

                    {provider.type !== 'ollama' && provider.type !== 'koboldcpp' && provider.type !== 'llamacpp' && provider.type !== 'webllm' && (
                      <div>
                        <label className="text-xs text-muted-foreground">API Key</label>
                        <div className="relative mt-1">
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

                    <div>
                      <label className="text-xs text-muted-foreground">Available Models (comma-separated)</label>
                      <input
                        type="text"
                        value={provider.models.join(', ')}
                        onChange={(e) => updateProvider(provider.id, {
                          models: e.target.value.split(',').map(m => m.trim()).filter(Boolean)
                        })}
                        className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono"
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
                className="w-full p-3 border border-dashed border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Custom Provider
              </button>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Active Provider</label>
                  <select
                    value={settings.chatSettings.activeProvider}
                    onChange={(e) => updateChatSettings({ activeProvider: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {enabledProviders.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Model</label>
                  <select
                    value={settings.chatSettings.activeModel}
                    onChange={(e) => updateChatSettings({ activeModel: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {activeProvider?.models.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">System Prompt</label>
                <textarea
                  value={settings.chatSettings.systemPrompt}
                  onChange={(e) => updateChatSettings({ systemPrompt: e.target.value })}
                  rows={4}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground flex justify-between">
                    <span>Temperature</span>
                    <span className="font-mono">{settings.chatSettings.temperature}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.chatSettings.temperature}
                    onChange={(e) => updateChatSettings({ temperature: parseFloat(e.target.value) })}
                    className="w-full mt-1 accent-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground flex justify-between">
                    <span>Max Tokens</span>
                    <span className="font-mono">{settings.chatSettings.maxTokens}</span>
                  </label>
                  <input
                    type="range"
                    min="256"
                    max="8192"
                    step="256"
                    value={settings.chatSettings.maxTokens}
                    onChange={(e) => updateChatSettings({ maxTokens: parseInt(e.target.value) })}
                    className="w-full mt-1 accent-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground flex justify-between">
                    <span>Top P</span>
                    <span className="font-mono">{settings.chatSettings.topP}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.chatSettings.topP}
                    onChange={(e) => updateChatSettings({ topP: parseFloat(e.target.value) })}
                    className="w-full mt-1 accent-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground flex justify-between">
                    <span>Frequency Penalty</span>
                    <span className="font-mono">{settings.chatSettings.frequencyPenalty}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.chatSettings.frequencyPenalty}
                    onChange={(e) => updateChatSettings({ frequencyPenalty: parseFloat(e.target.value) })}
                    className="w-full mt-1 accent-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tts' && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Kokoro TTS integration coming soon.</p>
              <p className="text-sm mt-2">Configure local or remote Kokoro endpoints for voice synthesis.</p>
            </div>
          )}

          {activeTab === 'memory' && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Long-term memory integration coming soon.</p>
              <p className="text-sm mt-2">Connect to Supra or similar vector databases for persistent context.</p>
            </div>
          )}
        </div>

        <div className="flex justify-between p-4 border-t border-border bg-muted/30">
          <button
            onClick={resetSettings}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Defaults
          </button>
          <button
            onClick={() => closeTab(activeTabId)}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4" />
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
