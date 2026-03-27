# ROADMAP - EasyTavern

## Observations

The codebase is a modern React + TypeScript application using Vite, shadcn/ui components, and Tailwind CSS. It has basic chat functionality with OpenAI-compatible API support, character management, and settings persistence via localStorage. The current implementation is web-based only (no Electron), uses a single-page layout, lacks streaming support, and has no extension system. The architecture follows React best practices with custom hooks (`useChat`, `useSettings`) and component-based structure.

## Approach

The implementation will transform EasyTavern into a feature-rich, tab-based desktop application compatible with SillyTavern extensions. The approach prioritizes: 
[x] (1) Electron integration for desktop deployment, 
[x] (2) tab-based architecture to declutter the main interface, 
[] (3) Compatible with all SillyTavern extensions, 
[] (4) enhance backend connectivity with streaming support, 
[] (5) modular extension system,
[x] (6) Add Aceternity and Framer Motion for elegant backgrounds. 

## Implementation Plan

### 1. Electron Desktop Application Setup

[x] **Add Electron dependencies and configuration:**
- Install `electron`, `electron-builder`, `concurrently` as dev dependencies
- Create `file:electron/main.ts` for Electron main process with window management, IPC handlers, and menu setup
- Create `file:electron/preload.ts` for secure context bridge exposing IPC to renderer
- Update `file:package.json` scripts to include `electron:dev`, `electron:build` for development and production builds
- Configure `file:electron-builder.json` for packaging (Windows, macOS, Linux targets)
- Modify `file:vite.config.ts` to support Electron renderer process (adjust base path, output directory)
- Add Node.js polyfills for Electron environment compatibility

[x] **File system access layer:**
- Create `file:src/lib/electron-api.ts` wrapper for IPC communication (file read/write, dialog operations)
- Implement file-based storage in `file:src/hooks/useSettings.ts` to use Electron's app data directory instead of localStorage for app portability

### 2. Tab-Based Interface Architecture

**Core tab management system:**
[] Create `file:src/types/tabs.ts` defining `Tab`, `tabType` (chats, characters, settings, extensions, worlds), and `tabManager` interfaces.
  This menu is normally hidden above the top of the screen, only revealing itself by mouse-proximity to a 'North Star' icon; a blue-white dot at the top,
  center of the background.
[x] Create `file:src/hooks/useTabManager.ts` for tab state management (create, close, switch, reorder tabs) with persistence
[] Create `file:src/components/tabs/tabBar.tsx` component with tabs, close buttons, and new tab dropdown
[x] Create `file:src/components/tabs/tabContent.tsx` router component that renders appropriate content based on active tab type

**Refactor main layout:**
- Stack:
  [] Specialized Component: Plate Text Editor framework
  [x] Styles: TailwindCSS v4
  [] Component Library: shadcn/ui & GlassUI & PlateJS
  [x] Backgrounds from AceternityUI (user selectable (Vortex / Aurora / Gradient Ani ) or static)
  [] UI Animations: Framer Motion
  
[x] Tabbed menu hidden behind top-down pulling GlassUI's drawer
[] Char interface will use variable transparency GlassUI aesthetics with PlateJS functionality.
[x]- This will be a portable app and all config files should be externalized to the executable directory for easy customization (with defaults hardcoded incase something goes wrong)

**To this end:**
[] Install necessary dependencies (React/Radix/Lucide-Animated/GlassUI/Aceterity/(Framer) Motion/PlateJS)
[] Update `file:src/pages/Index.tsx` to use hidden tab-based layout instead of single-page
[] Move current chat interface to `file:src/components/tabs/Chat.tsx` as a tab content component
[] Create `file:src/components/tabs/Settings.tsx` by extracting settings panel into dedicated tab
[] Create `file:src/components/tabs/Extensions.tsx`v3 that will--like Silly Tavern--present a list of installed extensions who settings are behind an accordian.
[x] Implement tab context provider in `file:src/contexts/TabContext.tsx` for global tab state access

**Tab persistence:**
[] Implement session recovery on app restart

### 3. SillyTavern Character Card Compatibility

**Character card format support:**
[x] Character Card standards are defined here: `aleph23/easytavern/src/components/chara/` in {`chara-card-v2`, `...v3.js`}
[x] Create `file:src/types/character-card.ts` defining both Character Card V2 and V3 specs, with V3 as the native internal format
  [x] V2 spec: name, description, personality, scenario, first_mes, mes_example, creator_notes, system_prompt, post_history_instructions, alternate_greetings, character_book, tags, creator, character_version, extensions
  [x] V3 spec: superset of V2 with additional fields (assets, nickname, creator_notes_multilingual, ccv3 metadata)
[] Make a SillyTavern Extnension-compnatible card editor out of https://github.com/aleph23/tavern-card-crafter-v3/b
  [x] PNG/APNG files: extract tEXt chunk named "ccv3" (V3) or "Chara" EXIF metadata (V2)
  [x] JSON files: parse as V2 or V3 format
  [] CHARX files: unzip and read card.json with asset extraction (This is VERY low priority. There are few charX's in the wild)
[] Integrate tavern-card-crafter-v3 as a dependency -- a preinstalled submodule.

**Enhanced character management:**
[] Update `file:src/types/chat.ts` Character interface to use V3 spec as native format
[] Utilize aleph23/tavern-card-crafter-v3 as the internal character editor.
   [] Create `file:src/components/character/CharacterImport.tsx` dialog for importing from file/URL with automatic V2-to-V3 upsampling
   [] Create a library tab with lorebook, character, and world as three sub categories beneath. Display character avatars 
      from PNG files (extract from card metadata) of only thoose characters present in the ongoing chat.
[] Implement character library in `file:src/hooks/useCharacters.ts` with CRUD operations, file system integration, and V2/V3 format detection
[] Make a stand-alone SillyTavern compatible extension out of aleph23/tavern-card-crafter-v3 and make that extension EasyTaverns's character card editor.

**World Info/Lorebook system:**
[] Create `file:src/types/worlds.ts` for lorebook entries (keys, content, insertion order, enabled state). This should track not only the 'whole world' lorebooks, but also the individual character's embedded lorebooks as they behave by the same keyword trigger logic and are placed at the same depth in the prompt.
[] Create `file:src/components/world/WorldsEditor.tsx` tab for managing lorebook entries
[] Implement lorebook injection logic in `file:src/hooks/useChat.ts` prompt builder (scan for keywords, insert at appropriate positions)

### 4. Backend Connectivity Enhancement

**Streaming response support:**
[] Migrate to PlateJs editor inside Vercel's Prompt-Kit chat interface.

**Image generation integration:**
[x] Create `file:src/types/image-generation.ts` for image provider configs (Stable Diffusion, DALL-E, NovelAI, etc.)
[x] Create `file:src/hooks/useImageGeneration.ts` for image API calls with provider abstraction
[] Create `file:src/components/image/ImageGenerationPanel.tsx` for image-prompt modification input and and a running gallery of images from the present chat. (Images should get saved along side (& linked to, not embedded with) the chat file
[x] Add image message type to `file:src/types/chat.ts` and rendering in `file:src/components/chat/ChatMessage.tsx`
[] Implement image embedding in chat context for multimodal models
[] Explore integrating StableDiffusion.cpp at some point.

**Advanced API features:**
[] Add stopping strings support in `file:src/hooks/useChat.ts` (custom token sequences to halt generation)
[] Implement token counting using divide by 4 approximation.
[] Add context management (sliding window depth/size & summarization) in `file:src/lib/context-manager.ts`
[] Create `file:src/components/settings/SystemPrompts.tsx` for managing reusable prompts. Add a setting to allow for certain system prompts to be assigned to certain models.

### 5. Extension System Architecture

**Extension loader and runtime:**
[x] Create `file:src/types/extension.ts` defining extension manifest schema (name, version, author, entry point, permissions, hooks)
[] Create `file:src/lib/extension-loader.ts` for discovering extensions in `extensions/` directory, validating manifests, and loading scripts
[] Create `file:src/lib/extension-runtime.ts` providing sandboxed execution context with limited API access
[] Implement extension event bus in `file:src/lib/extension-events.ts` (message sent/received, character loaded, settings changed, etc.)

**Extension API surface:**
[] Create `file:src/lib/extension-api.ts` exposing safe APIs to extensions:
  [] `getContext()` - access current chat state (read-only)
  [] `registerSlashCommand(name, handler)` - add custom commands using Prompt-Kit's slash command functionality
  [] `onEvent(eventName, callback)` - subscribe to app events
  [] `callPopup(content, options)` - show UI dialogs
  [] `fetch(url, options)` - proxied HTTP requests
  [] `storage.get/set(key, value)` - extension-scoped storage
[] Create `file:src/components/extensions/ExtensionManager.tsx` tab for installing/enabling/configuring extensions.  Third Party SillyTavern extensions get saved in extensions/{specific-extension}/ directory, relative to main electron app.

**SillyTavern extension compatibility layer:**
[] Create `file:src/lib/st-compat.ts` adapter mapping SillyTavern's global APIs to EasyTavern's extension API
[] Implement `eventSource` emulation for SillyTavern extensions
[] Add compatibility shims for common SillyTavern extension patterns (DOM manipulation, character access)

### 6. Advanced Chat Features

**Chat branching and history:**
[] Add `parentId` and `children` to Message type in `file:src/types/chat.ts` for tree structure
[] Create `file:src/components/chat/ChatBranches.tsx` UI for visualizing and navigating branches
[] Implement branch creation on message regeneration in `file:src/hooks/useChat.ts`
[] Add branch comparison view in `file:src/components/chat/BranchCompare.tsx`

**RAG (Retrieval-Augmented Generation):**
[] Create `file:src/lib/vector-store.ts` for document embedding and similarity search (use local embeddings or API)
[] Create `file:src/components/rag/DocumentManager.tsx` for uploading and managing reference documents
[] Implement context injection in `file:src/hooks/useChat.ts` based on semantic search results
[] Add document citation rendering in chat messages

### 7. UI/UX Enhancements

**Theme and customization:**
[] Extend `file:tailwind.config.ts` with custom theme variables for user customization
[] Create `file:src/components/settings/ThemeEditor.tsx` for visual theme customization

**Keyboard shortcuts:**
[] Create `file:src/hooks/useKeyboardShortcuts.ts` for global hotkey management.  Pneumonic hotkey are default (ctrl-C -> Copy, ctrl-B -> Bold text, ctrl-I -> Italicised text, etc)
[] Add shortcut customization in settings tab

**Accessibility:**
[] Add ARIA labels to all interactive components
[] Impliment Kokoro TTS.

### 8. Data Management and Persistence

**Chat history storage:**
[] Create `file:src/lib/database.ts` using Dexie.js for structured chat storage (conversations, messages, metadata)
[] Implement chat export/import in `file:src/lib/chat-exporter.ts` (JSON & SillyTavern-style JSONL, Markdown, HTML formats, plain TXT)
[] Add search functionality in `file:src/components/chat/ChatSearch.tsx` for finding past conversations
[] Implement automatic backup system in Electron main process

### 9. Testing and Quality Assurance

**Unit tests:**
[] Add tests for `file:src/hooks/useChat.ts` covering message sending, streaming, error handling
[] Add tests for API settings
[] Add tests for other components. Move them all to top-level, alongside the src/ directory.

**Integration tests:**
[] Create `file:__tests__/tab-management.test.tsx` for tab lifecycle
[] Create `file:__tests__/extension-system.test.tsx` for extension loading and API access
[] Test backend connectivity with mock servers

### 10. Documentation

**User documentation:**
[] Create `file:docs/user-guide.md` covering installation, basic usage, character management, extension installation
[] Create `file:docs/api-providers.md` documenting supported backends and configuration
[] Create `file:docs/keyboard-shortcuts.md` listing all shortcuts

**Developer documentation:**
[] Create `file:docs/extension-development.md` with extension API reference and examples
[] Create `file:docs/architecture.md` explaining tab system, state management, and data flow
[] Create `file:docs/contributing.md` for community contributions

### 11 Pies in Skies Additions  (Very LOW priotrity)

**Group chat support:**
- Create `file:src/types/group-chat.ts` for group configurations (participants, turn order, activation conditions)
- Create `file:src/components/chat/GroupChatManager.tsx` for setting up multi-character conversations
- Implement round-robin and smart turn-taking in `file:src/hooks/useGroupChat.ts`
- Update message rendering to show character avatars in group context


## Architecture Diagram

```mermaid
graph TD
    A[Electron Main Process] --> B[IPC Bridge]
    B --> C[React Renderer]
    C --> D[Tab Manager]
    D --> E1[Chat Tab]
    D --> E2[Character Editor Tab]
    D --> E3[Settings Tab]
    D --> E4[Extensions Tab]
    D --> E5[World Info Tab]
    
    E1 --> F[Chat Hook]
    F --> G[Backend Connector]
    G --> H1[Text Inference APIs]
    G --> H2[Image Generation APIs]
    
    E1 --> I[Extension Runtime]
    I --> J[Extension Loader]
    J --> K[Extension Event Bus]
    
    E2 --> L[Character Manager]
    L --> M[Character Parser/Exporter]
    M --> N[File System via IPC]
    
    E5 --> O[World Info Manager]
    O --> F
    
    C --> P[Dexie.js Storage]
    C --> Q[Settings Manager]
    Q --> N
```

## Data Flow Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant T as Tab Manager
    participant C as Chat Hook
    participant E as Extension System
    participant B as Backend API
    participant S as Storage
    
    U->>T: Open new chat tab
    T->>C: Initialize chat state
    U->>C: Send message
    C->>E: Emit beforeSend event
    E->>C: Modify message (if extension active)
    C->>B: POST /chat/completions (streaming)
    B-->>C: Stream response chunks
    C->>E: Emit messageChunk event
    C->>S: Save message to IndexedDB
    C->>U: Display streamed response
    E->>C: Emit afterReceive event
```
