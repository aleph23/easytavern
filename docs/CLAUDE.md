# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and other AI when working with code in this repository.

## Project Overview

EasyTavern is a React-based chat application for interacting with AI models, being transformed into a feature-rich desktop application compatible with SillyTavern extensions. Built with Vite, TypeScript, React, shadcn/ui, and Tailwind CSS. Supports multiple API providers (OpenAI, Anthropic, Ollama, KoboldCpp, LlamaCpp, OpenRouter, DeepSeek) with OpenAI-compatible endpoints.

**Status**: Actively implementing roadmap at `.env/ROADMAP.md` - transforming into Electron desktop app with tab-based interface, SillyTavern character card compatibility (V2/V3), extension system, streaming support, and enhanced UI with Next.js/GlassUI/AceternityUI/Framer Motion.

## Commands

### Development
```bash
npm run dev          # Start development server on localhost:8080
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
```

### Testing
```bash
npm test             # Run tests once with Vitest
npm run test:watch   # Run tests in watch mode
npm test -- <pattern>  # Run specific test file
```

### Code Quality
```bash
npm run lint         # Run ESLint on all TypeScript files
```

## Architecture

### Current State Management
- **Settings**: `useSettings` hook (src/hooks/useSettings.ts) with localStorage persistence
- **Chat**: `useChat` hook (src/hooks/useChat.ts) for message state and API calls
- No global state library; using React hooks and local state

### Key Hooks
- `useChat`: Handles message sending, editing, deletion, and API communication
- `useSettings`: Manages API providers, chat settings (temperature, max tokens, etc.), and persistence

### Data Types (src/types/chat.ts)
- `Message`: Chat message structure
- `Character`: Character card metadata
- `APIProvider`: API provider configuration
- `ChatSettings`: Active model, parameters, system prompt
- `AppSettings`: Global settings container

### Character Card Specifications
Located in `src/components/chara/`:
- `chara-card-v2.js`: SillyTavern V2 format
- `chara-card-v3.js`: SillyTavern V3 format (native internal format)

Both formats support:
- Character metadata (name, description, personality, scenario)
- System prompts and post-history instructions
- Character books/lorebooks (keys, content, insertion order)
- Multiple greetings and extensions

V3 additions: assets, nickname, multilingual creator notes, source, group-only greetings, timestamps

### API Communication
- OpenAI-compatible `/chat/completions` endpoint for all providers
- System prompts prepended to message array
- No streaming yet (implementing SSE in roadmap)

### Component Structure
```
src/
├── components/
│   ├── chat/          # ChatArea, ChatInput, ChatMessage
│   ├── layout/        # Header, Sidebar
│   ├── settings/      # SettingsPanel
│   ├── chara/         # Character card specifications (V2/V3)
│   └── ui/            # shadcn/ui components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Route pages (Index, NotFound)
├── types/             # TypeScript type definitions
└── test/              # Test setup and files
```

### Styling
- Tailwind CSS (tailwind.config.ts)
- shadcn/ui component library
- Path alias: `@/` → `src/`
- CSS variables for theming in index.css

## Roadmap Implementation

See `.env/ROADMAP.md` for detailed plan. Key phases:

1. **Electron Desktop App**: Main process, preload script, IPC bridge, file system access
2. **Tab-Based Interface**: Tab manager, draggable tabs, hidden menu (North Star icon), GlassUI drawer or AceternityUI floating navbar
3. **Character Card Compatibility**: PNG/JSON/CHARX parsing, V2-to-V3 upsampling, embedded lorebooks, character library
4. **Backend Enhancement**: SSE streaming, WebLLM, image generation, token counting, context management
5. **Extension System**: Loader, sandboxed runtime, event bus, SillyTavern compatibility API
6. **Next.js Migration**: GlassUI, AceternityUI backgrounds (Vortex/Aurora/Gradient), Framer Motion animations
7. **Advanced Features**: Group chat, chat branching, RAG, keyboard shortcuts

### Adding API Providers
1. Add to `DEFAULT_PROVIDERS` in `src/hooks/useSettings.ts`
2. Match `type` to `APIProvider` interface
3. Set `enabled: false` for providers requiring API keys

### Storage Strategy
- **Current**: localStorage (`nexus-chat-settings`)
- **Future**: Electron app data directory with external config files for portability

### Build Configuration
- Vite: `vite.config.ts` (IPv6, port 8080, HMR overlay disabled, React SWC)
- Vitest: `vitest.config.ts` (jsdom environment, setup in src/test/setup.ts)
- ESLint: `eslint.config.js` (TypeScript, React hooks)

## Development Guidelines

- Character card native format: V3 (V2 should be upsampled)
- All button controls: Icon-only with text tooltips (Lucide icons)
- Config files: Externalized to executable directory with hardcoded defaults
- Tab menu: Hidden behind mouse-proximity North Star icon at top center
- Dialog transparency: Variable transparency GlassUI objects
