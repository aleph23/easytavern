import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';
import { Character } from '@/types/chat';

interface PortraitGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  activeCharacter?: Character;
  onGenerate: (target: 'user' | 'character', character?: Character) => void;
}

export const PortraitGenerator = ({ isOpen, onClose, activeCharacter, onGenerate }: PortraitGeneratorProps) => {
  const [target, setTarget] = useState<'user' | 'character'>('character');

  const handleGenerate = () => {
    onGenerate(target, activeCharacter);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel border-border">
        <DialogHeader>
          <DialogTitle>Generate Portrait</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select value={target} onValueChange={(v) => setTarget(v as 'user' | 'character')}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="character">Active Character ({activeCharacter?.name || 'None'})</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <p className="text-xs text-muted-foreground">
                This will generate a portrait based on the character's description or user persona. The image will be added to the chat.
            </p>
        </div>
        <DialogFooter>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleGenerate} disabled={target === 'character' && !activeCharacter}>Generate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
