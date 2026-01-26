import { Settings, Trash2, Menu, Zap, Users } from 'lucide-react';
import { ChatSettings, APIProvider } from '@/types/chat';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOpenSettings: () => void;
  onClearChat: () => void;
  onToggleSidebar?: () => void;
  settings: ChatSettings;
  providers: APIProvider[];
}

export const Header = ({ 
  onOpenSettings, 
  onClearChat, 
  onToggleSidebar,
  settings,
  providers 
}: HeaderProps) => {
  const activeProvider = providers.find(p => p.id === settings.activeProvider);

  return (
    <header className="glass-panel border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-secondary rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gradient hidden sm:block">Nexus</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeProvider && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm">
              <span className={cn(
                'w-2 h-2 rounded-full',
                activeProvider.enabled ? 'bg-primary' : 'bg-accent'
              )} />
              <span className="text-muted-foreground">{activeProvider.name}</span>
              <span className="text-foreground font-mono text-xs">{settings.activeModel}</span>
            </div>
          )}

          <button
            onClick={onClearChat}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
