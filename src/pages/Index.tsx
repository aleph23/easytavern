import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useSettings } from '@/hooks/useSettings';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { Character } from '@/types/chat';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState<Character | undefined>();
  
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    clearMessages,
    deleteMessage,
    editMessage 
  } = useChat();

  const {
    settings,
    updateProvider,
    addProvider,
    removeProvider,
    updateChatSettings,
    resetSettings,
  } = useSettings();

  const handleSend = async (content: string) => {
    const enabledProviders = settings.providers.filter(p => p.enabled);
    if (enabledProviders.length === 0) {
      toast({
        title: 'No provider enabled',
        description: 'Please enable at least one API provider in settings.',
        variant: 'destructive',
      });
      setSettingsOpen(true);
      return;
    }

    await sendMessage(content, settings.chatSettings, settings.providers);
  };

  const handleSelectCharacter = (character: Character) => {
    setActiveCharacter(character);
    updateChatSettings({ systemPrompt: character.systemPrompt });
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    clearMessages();
    setSidebarOpen(false);
  };

  return (
    <div className="h-full flex bg-background overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        characters={[]}
        activeCharacter={activeCharacter}
        onSelectCharacter={handleSelectCharacter}
        onNewChat={handleNewChat}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenSettings={() => setSettingsOpen(true)}
          onClearChat={clearMessages}
          onToggleSidebar={() => setSidebarOpen(true)}
          settings={settings.chatSettings}
          providers={settings.providers}
        />

        <ChatArea
          messages={messages}
          onDeleteMessage={deleteMessage}
          onEditMessage={editMessage}
        />

        {error && (
          <div className="mx-4 mb-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive animate-fade-in">
            {error}
          </div>
        )}

        <div className="p-4 pt-0">
          <ChatInput
            onSend={handleSend}
            isLoading={isLoading}
            disabled={!settings.providers.some(p => p.enabled)}
          />
        </div>
      </div>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateProvider={updateProvider}
        onUpdateChatSettings={updateChatSettings}
        onAddProvider={addProvider}
        onRemoveProvider={removeProvider}
        onReset={resetSettings}
      />
    </div>
  );
};

export default Index;
