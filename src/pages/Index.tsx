import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useSettings } from '@/hooks/useSettings';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { PortraitGenerator } from '@/components/chat/PortraitGenerator';
import { Character, Message } from '@/types/chat';
import { toast } from '@/hooks/use-toast';
import { getChatFolder } from '@/lib/chat-persistence';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [portraitOpen, setPortraitOpen] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState<Character | undefined>();
  
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    clearMessages,
    deleteMessage,
    editMessage,
    startNewChat,
    generateSceneImage,
    setMessages
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
    startNewChat(character.name);
    setSidebarOpen(false);

    if (character.greeting) {
      setMessages([{
        id: 'greeting',
        role: 'assistant',
        content: character.greeting,
        timestamp: new Date()
      }]);
    }

    if (settings.imageGeneration.enabled) {
      const activeProvider = settings.providers.find(p => p.id === settings.chatSettings.activeProvider);
      if (activeProvider) {
        const context: Message[] = [
          { id: 'start', role: 'system', content: `Start of scene. Character: ${character.name}. ${character.description}. ${character.greeting || ''}`, timestamp: new Date() }
        ];
        const folder = getChatFolder(character.name);
        generateSceneImage(context, settings.chatSettings, activeProvider, settings.imageGeneration, undefined, folder);
      }
    }
  };

  const handleNewChat = () => {
    if (activeCharacter) {
      startNewChat(activeCharacter.name);
    } else {
      clearMessages();
    }
    setSidebarOpen(false);
  };

  const handleGeneratePortrait = async (target: 'user' | 'character', character?: Character) => {
    const activeProvider = settings.providers.find(p => p.id === settings.chatSettings.activeProvider);
    if (!activeProvider) {
        toast({ title: "No active provider", variant: "destructive" });
        return;
    }

    let context: Message[] = [];
    if (target === 'character' && character) {
        context = [
            { id: '1', role: 'system', content: `Character Name: ${character.name}\nDescription: ${character.description}\n${character.systemPrompt}`, timestamp: new Date() }
        ];
    } else {
        context = [
            { id: '1', role: 'user', content: "Generate a portrait of the user.", timestamp: new Date() }
        ];
    }

    await generateSceneImage(context, settings.chatSettings, activeProvider, settings.imageGeneration);
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
          onClearChat={handleNewChat}
          onOpenPortrait={() => setPortraitOpen(true)}
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

      <PortraitGenerator
        isOpen={portraitOpen}
        onClose={() => setPortraitOpen(false)}
        activeCharacter={activeCharacter}
        onGenerate={handleGeneratePortrait}
      />
    </div>
  );
};

export default Index;
