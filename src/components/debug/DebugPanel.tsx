import { Bug, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useDebugLog, LogEntry } from '@/contexts/DebugContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// LogItem component to render individual log entries nicely
const LogItem = ({ log }: { log: LogEntry }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-border last:border-0 p-2 text-xs font-mono">
      <div
        className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-1 rounded select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className={cn(
                "uppercase font-bold text-[10px]",
                log.type === 'image' ? "text-purple-400" :
                log.type === 'llm' ? "text-blue-400" : "text-gray-400"
            )}>{log.type}</span>
            <span className={cn(
                "uppercase text-[10px]",
                log.direction === 'request' ? "text-yellow-400" :
                log.direction === 'response' ? "text-green-400" :
                log.direction === 'error' ? "text-red-400" : "text-gray-400"
            )}>{log.direction}</span>
            {log.provider && (
                <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">{log.provider}</span>
            )}
        </div>
        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
            {new Date(log.timestamp).toLocaleTimeString()}
        </span>
      </div>

      {expanded && (
        <div className="mt-2 bg-black/30 p-2 rounded overflow-x-auto border border-border/50">
            <pre className="text-[10px] text-gray-300 whitespace-pre-wrap break-all font-mono">
                {typeof log.content === 'object' ? JSON.stringify(log.content, null, 2) : String(log.content)}
            </pre>
        </div>
      )}
    </div>
  );
};

export const DebugPanel = () => {
  const { logs, clearLogs } = useDebugLog();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" title="Debug Logs" className="hover:bg-background/20">
          <Bug className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:w-[540px] flex flex-col p-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle>Debug Logs</SheetTitle>
            <Button variant="destructive" size="sm" onClick={clearLogs} disabled={logs.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1">
            <div className="flex flex-col">
                {logs.length === 0 && (
                    <div className="text-center text-muted-foreground py-12 px-4">
                        <Bug className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No logs recorded in this session.</p>
                        <p className="text-xs mt-2">Logs are ephemeral and will be cleared on refresh/exit.</p>
                    </div>
                )}
                {logs.slice().reverse().map((log) => (
                    <LogItem key={log.id} log={log} />
                ))}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
