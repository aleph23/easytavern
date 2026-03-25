import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TabManager } from "@/components/tabs/TabManager";
import { BackgroundProvider } from "@/hooks/useBackground";
import { DebugProvider } from "@/contexts/DebugContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DebugProvider>
        <BackgroundProvider>
          <Toaster />
          <Sonner />
          <TabManager />
        </BackgroundProvider>
      </DebugProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
