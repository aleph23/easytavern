import { Box, Package, Download, AlertTriangle } from 'lucide-react';

export const Extensions = () => {
  return (
    <div className="h-full flex flex-col bg-background animate-fade-in p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Box className="w-6 h-6" />
          Extensions
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Install from URL
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
        <Package className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No Extensions Installed</h3>
        <p className="text-sm max-w-md text-center mb-6">
          Extensions allow you to add new features, providers, and capabilities to EasyTavern.
        </p>

        <div className="flex items-center gap-2 p-3 bg-yellow-500/10 text-yellow-500 rounded-lg text-sm border border-yellow-500/20">
          <AlertTriangle className="w-4 h-4" />
          Extension system is currently under development.
        </div>
      </div>
    </div>
  );
};
