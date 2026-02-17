import React from 'react';
import { useBackground, BackgroundType } from '@/hooks/useBackground';
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';

export const AppBackground = () => {
  const { background } = useBackground();

  if (background.type === 'none') return null;

  if (background.type === 'dotted-glow') {
    return (
      <DottedGlowBackground
        className="absolute inset-0 w-full h-full z-0"
        color="rgba(255,255,255,0.15)"
        darkColor="rgba(255,255,255,0.15)"
        glowColor="hsl(187 85% 53% / 0.6)"
        darkGlowColor="hsl(187 85% 53% / 0.6)"
        opacity={0.5}
        gap={14}
        radius={1.5}
        speedScale={0.6}
      />
    );
  }

  if (background.type === 'beams') {
    return (
      <BackgroundBeamsWithCollision className="z-0">
        <span />
      </BackgroundBeamsWithCollision>
    );
  }

  if (background.type === 'image' && background.imageUrl) {
    return (
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${background.imageUrl})` }}
      />
    );
  }

  return null;
};
