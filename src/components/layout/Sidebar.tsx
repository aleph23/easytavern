import { useState } from 'react';
import { Plus, MessageSquare, User, ChevronLeft, Search, MoreVertical } from 'lucide-react';
import { Character } from '@/types/chat';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  activeCharacter?: Character;
  onSelectCharacter: (character: Character) => void;
  onNewChat: () => void;
}

const DEFAULT_CHARACTERS: Character[] = [
  {
    id: 'default',
    name: 'Assistant',
    description: 'A helpful AI assistant',
    systemPrompt: 'You are a helpful assistant.',
    greeting: 'Hello! How can I help you today?',
  },
  {
    id: 'creative',
    name: 'Creative Writer',
    description: 'Specializes in creative writing and storytelling',
    systemPrompt: 'You are a creative writing assistant. Help users craft compelling stories, develop characters, and explore narrative techniques.',
    greeting: "Welcome, fellow storyteller! What tale shall we weave together today?",
  },
  {
    id: 'coder',
    name: 'Code Assistant',
    description: 'Expert programmer and code reviewer',
    systemPrompt: 'You are an expert programmer. Provide clean, efficient code solutions and explain your reasoning.',
    greeting: "Ready to code! What problem shall we solve?",
  },
];

export const Sidebar = ({
  isOpen,
  onClose,
  characters = DEFAULT_CHARACTERS,
  activeCharacter,
  onSelectCharacter,
  onNewChat,
}: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCharacters = characters.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border',
          'transform transition-transform duration-200 ease-in-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sidebar-foreground">Characters</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-sidebar-accent rounded-lg lg:hidden"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search characters..."
              className="w-full pl-9 pr-3 py-2 bg-sidebar-accent border border-sidebar-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
          <button
            onClick={onNewChat}
            className="w-full p-3 mb-2 border border-dashed border-sidebar-border rounded-xl text-muted-foreground hover:text-sidebar-foreground hover:border-sidebar-primary/50 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>

          <div className="space-y-1">
            {filteredCharacters.map((character) => (
              <button
                key={character.id}
                onClick={() => onSelectCharacter(character)}
                className={cn(
                  'w-full p-3 rounded-xl text-left transition-colors group',
                  activeCharacter?.id === character.id
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'hover:bg-sidebar-accent text-sidebar-foreground'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    activeCharacter?.id === character.id
                      ? 'bg-sidebar-primary-foreground/20'
                      : 'bg-sidebar-accent'
                  )}>
                    {character.avatar ? (
                      <img
                        src={character.avatar}
                        alt={character.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{character.name}</span>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 rounded transition-all">
                        <MoreVertical className="w-3 h-3" />
                      </button>
                    </div>
                    <p className={cn(
                      'text-xs truncate',
                      activeCharacter?.id === character.id
                        ? 'text-sidebar-primary-foreground/70'
                        : 'text-muted-foreground'
                    )}>
                      {character.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Local Mode</p>
              <p className="text-xs text-muted-foreground">All data stays on device</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
