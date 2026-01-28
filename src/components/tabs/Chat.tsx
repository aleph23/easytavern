import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useSettings } from '@/hooks/useSettings';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { Character } from '@/types/chat';
import { toast } from '@/hooks/use-toast';
import { useTabManager } from '@/hooks/useTabManager';

export const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    updateChatSettings,
  } = useSettings();

  const handleSend = async (content: string) => {
    const enabledProviders = settings.providers.filter(p => p.enabled);
    if (enabledProviders.length === 0) {
      toast({
        title: 'No provider enabled',
        description: 'Please enable at least one API provider in settings.',
        variant: 'destructive',
      });
      // In new architecture, we should probably open Settings tab
      // createTab('settings'); // This would need to be passed down or accessed via context if we want to switch tabs from here
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
          onOpenSettings={() => {
            // We can't easily open settings tab from here without context or prop
            // But for now, let's just log or ignore, or implement a way to signal up
            // Ideally, Header should dispatch an event or we use a global TabContext
             const event = new CustomEvent('open-settings-tab');
             window.dispatchEvent(event);
          }}
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
    </div>
  );
};
