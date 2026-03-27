# Copilot Instructions for EasyTavern

## Project Overview
EasyTavern is a React-based chat application being transformed into a feature-rich desktop app. It is built with Vite, TypeScript, React, shadcn/ui, and Tailwind CSS. The app supports multiple AI API providers (OpenAI, Anthropic, Ollama, KoboldCpp, LlamaCpp, OpenRouter, DeepSeek) and is compatible with SillyTavern extensions.

### Key Features
- **Electron Desktop App**: Tab-based interface, file system access, and extension support.
- **Character Card Compatibility**: Supports SillyTavern V2/V3 formats.  Upgrades v1 and v2 cards to v3 format.
- **Enhanced UI**: Built with GlassUI/AceternityUI principles.

## Developer Workflows

### Development
- Start the development server:
  ```bash
  npm run dev
  ```
- Build for production:
  ```bash
  npm run build
  ```
- Preview production build:
  ```bash
  npm run preview
  ```

### Testing
- Run all tests:
  ```bash
  npm test
  ```
- Watch mode for tests:
  ```bash
  npm run test:watch
  ```
- Run specific test files:
  ```bash
  npm test -- <pattern>
  ```

### Code Quality
- Lint JavaScript/TypeScript files:
  ```bash
  npm run lint
  ```

## Architecture Overview

### State Management
- **Settings**: Managed via `useSettings` hook ([src/hooks/useSettings.ts](src/hooks/useSettings.ts)) with file-based persistence.
- **Chat**: Managed via `useChat` hook ([src/hooks/useChat.ts](src/hooks/useChat.ts)) for message state and API calls.

### Key Hooks
- `useChat`: Handles message sending, editing, deletion, and API communication.
- `useSettings`: Manages API providers, chat settings (temperature, max tokens, etc.), and persistence.

### Data Types
- Defined in [src/types](src/types):
  - `Message`: Chat message structure.
  - `Character`: Character card metadata.
  - `APIProvider`: API provider configuration.
  - `ChatSettings`: Active model, parameters, system prompt.
  - `AppSettings`: Global settings container.

## Project-Specific Conventions

### UI Components
- Built using `shadcn/ui` components. Examples:
  - `Drawer`, `Accordion`, `Button`, `Card` in [src/ui](src/ui).
- Tailwind v4 CSS is used for styling with utility classes.
- Chat interface will use Vercel's `prompt-kit` but made into a more feature rich editor with the help of `plate` (`PlateJS`, previously  `Slate`)
- Aceternity Backgrounds.

### Electron Integration
- **Main Process**: [electron/main.ts](electron/main.ts) handles window creation, IPC channels, and app lifecycle.
- **Preload Script**: [electron/preload.ts](electron/preload.ts) exposes secure IPC methods.
- **File System Access**: Implemented in [src/lib/electron-api.ts](src/lib/electron-api.ts).

### Testing
- Most tests are written using Vitest, jest, or mocha. Example test file: [test/example.test.ts](test/example.test.ts).

## Integration Points
- **API Providers**: Configured in `useSettings` and `useChat` hooks.
- **Character Cards**: Parsers located in [src/components/chara](src/components/chara). /aleph23/tavern-card-creator-v3 will get converted toST-compat extension and become a built-in extension for this.
- **Extensions**: SillyTavern extension compatibility.

## Key Files and Directories
- `src/hooks`: Custom React hooks for state management.
- `src/ui`: Reusable UI components.
- `electron/`: Electron main process and preload scripts.
- `test/`: Unit tests for the application.

## Notes for AI Agents
- Follow the roadmap in [docs/ROADMAP.md](docs/ROADMAP.md) for current priorities.
- Refer to [docs/AGENTS.md](docs/AGENTS.md) for general user directives.
- Use [docs/CLAUDE.md](docs/CLAUDE.md) for additional AI-specific guidance.

---

For questions or clarifications, consult the USER!
