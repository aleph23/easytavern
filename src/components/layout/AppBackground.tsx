import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';
import { BackgroundType, useBackground } from '@/hooks/useBackground';
import React from 'react';

export const AppBackground = () => {
  const { background } = useBackground()

  if (background.type === 'color') return null

  if (background.type === 'dotted-matrix') {
    return (
      <DottedGlowBackground
        className='absolute inset-0 w-full h-full z-0'
        darkColor='rgba(255,255,255,0.5)'
        glowColor='var(--accent)'
        darkGlowColor='var(--accent-muted)'
      />
    )
  }

  if (background.type === 'rain') {
    return (
      <BackgroundBeamsWithCollision className='z-0'>
        <span />
      </BackgroundBeamsWithCollision>
    )
  }

  if (background.type === 'image' && background.imageUrl) {
    return (
      <div
        className='absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30'
        style={{ backgroundImage: `url(${background.imageUrl})` }}
      />
    )
  }

  return null
}
