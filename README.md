# Easy Tavern - Slightly less silly

## Project info

SillyTavern is great.  But my it makes my eyes hurt.  And while there are several much prettier options out there, they all seem to know better than I do what it is I want to use them for.  Rather than take a character as the original author intended it, they all edit it--whether you want them to or not--and then integrate them into there system.

So Why can't there be something like SillyTavern, deeply customizable and a feature rich, but without also being oppressive? Dunno. So until I find it, I'll be writing this.

---

# EasyTavern Implementation Punch List

## Electron Desktop Application Setup

### 1.1 Electron Core Infrastructure
- [x] Install Electron dependencies: `npm install -D electron electron-builder concurrently`
- [x] Create `electron/main.ts` with:
  - [x] Window creation and management
  - [x] IPC channel handlers
  - [x] Application menu setup
- [x] Create `electron/preload.ts` with:
  - [x] Context bridge setup
  - [x] Secure IPC method exposure
  - [x] Node.js environment isolation
- [x] Add `electron:dev` for development
  - [x] Add `electron:build` for production builds
  - [ ] Configure build targets for Windows/macOS/Linux
- [x] Create `electron-builder.json` configuration:
  - [x] Platform-specific build settings
  - [x] App metadata (name, version, icons)
- [ ] Modify `vite.config.ts` for Electron renderer:
  - [x] Adjust base path for desktop environment
  - [x] Configure output directory structure
  - [ ] Add Electron-specific build optimizations
- [ ] Add Node.js polyfills for Electron compatibility:
  - [ ] Buffer polyfill for browser environments
  - [ ] File system abstraction layer

### 1.2 File System Access Layer
- [x] Create `src/lib/electron-api.ts` with:
  - [x] IPC communication wrapper functions
  - [x] File read/write operations
  - [x] Directory operations
  - [x] Dialog operations (open/save)
- [x] Update `src/hooks/useSettings.ts`:
  - [x] Replace localStorage with file-based storage
  - [x] Implement Electron app data directory usage
  - [x] Add file change detection for settings updates
  - [x] Create migration script for localStorage data

## Tab-Based Interface Architecture

### 2.1 Tab Management System
- [x] Create `src/types/tabs.ts` with:
  - [x] Tab interface definition
  - [x] TabType enum (chat, character-editor, settings, extensions, world-info)
  - [x] TabManager interface
  - [x] Tab state interfaces
- [x] Create `src/hooks/useTabManager.ts` with:
  - [x] Tab state management (create, close, switch, reorder)
  - [ ] Tab persistence logic
  - [ ] Tab data management
  - [ ] Tab history tracking
- [x] Create `src/components/tabs/tabBar.tsx`:
  - [ ] Draggable tab interface
  - [x] Close button functionality
  - [ ] New tab dropdown menu
  - [ ] Tab reordering support
  - [x] Hover effects and animations
- [x] Create `src/components/tabs/tabContent.tsx`:
  - [x] Tab routing logic
  - [ ] Lazy loading for tab components
  - [x] Tab transition animations
  - [ ] Error boundary for tab content

### 2.2 Main Layout Refactor
- [ ] Install dependencies:
  - [ ] `npm install next.js`
  - [ ] `npm install glass-ui`
  - [ ] `npm install @aceternity/aceternity-ui`
  - [ ] `npm install framer-motion`
  - [x] `npm install lucide-react`
- [x] Update `src/pages/Index.tsx` (Migrated to `src/components/tabs/Chat.tsx`):
  - [x] Replace single-page layout with tab-based structure
  - [x] Integrate tab bar component
  - [x] Add tab content router
  - [x] Implement responsive design
- [x] Create `src/components/tabs/Chat.tsx`:
  - [x] Move existing chat interface into tab component
  - [x] Add tab-specific state management
  - [x] Implement tab-specific settings
- [ ] Create `src/components/tabs/Settings.tsx`:
  - [ ] Extract settings panel from main layout
  - [ ] Add tab-specific settings categories
  - [ ] Implement tab-specific theme customization
- [ ] Create `src/components/tabs/Extensions.tsx`:
  - [ ] Create extension management interface
  - [ ] Add extension installation UI
  - [ ] Implement extension configuration panels
- [ ] Create `src/contexts/TabContext.tsx`:
  - [ ] Global tab state provider
  - [ ] Tab state access hooks
  - [ ] Tab event system
  - [ ] Tab state persistence context

### 2.3 Tab Persistence
- [ ] Extend `src/hooks/useSettings.ts`:
  - [ ] Save tab state (open tabs, active tab)
  - [ ] Save tab-specific data
  - [ ] Implement tab state serialization
  - [ ] Add tab state validation
- [ ] Implement session recovery:
  - [ ] Load tab state on app startup
  - [ ] Restore tab positions and order
  - [ ] Recover tab-specific data
  - [ ] Handle corrupted tab state gracefully

## SillyTavern Character Card Compatibility

### 3.1 Character Card Format Support
- [ ] Create `src/types/character-card.ts`:
  - [ ] Define V2 character card spec
  - [ ] Define V3 character card spec
  - [ ] Create type guards for format detection
  - [ ] Add extension field definitions
- [ ] Create `src/lib/character-parser.ts`:
  - [ ] PNG/APNG parsing with tEXt chunk extraction
  - [ ] JSON parsing for V2/V3 formats
  - [ ] CHARX file support (low priority)
  - [ ] Format detection and validation
  - [ ] Error handling for corrupted files
- [ ] Create `src/lib/character-exporter.ts`:
  - [ ] V3 format export to PNG/APNG with tEXt chunk
  - [ ] JSON export functionality
  - [ ] CHARX export (low priority)
  - [ ] Export validation and testing
- [ ] Add tavern-card-crafter-v3 dependency to `package.json`
- [ ] Create `src/lib/character-upsample.ts`:
  - [ ] V2 to V3 conversion logic
  - [ ] Field mapping implementation
  - [ ] Default value population for new V3 fields
  - [ ] Conversion validation

### 3.2 Enhanced Character Management
- [ ] Update `src/types/chat.ts`:
  - [ ] Update Character interface to use V3 spec
  - [ ] Add character metadata fields
  - [ ] Implement character validation types
- [ ] Create `src/components/character/CharacterImport.tsx`:
  - [ ] File upload interface
  - [ ] URL import functionality
  - [ ] Automatic V2-to-V3 upsampling
  - [ ] Import progress indicators
- [ ] Update `src/components/layout/Sidebar.tsx`:
  - [ ] Display character avatars from PNG metadata
  - [ ] Show only characters in active chat
  - [ ] Add character selection interface
  - [ ] Implement avatar caching
- [ ] Create `src/hooks/useCharacters.ts`:
  - [ ] Character CRUD operations
  - [ ] File system integration
  - [ ] V2/V3 format detection
  - [ ] Character search and filtering
- [ ] Integrate tavern-card-crafter-v3 utilities:
  - [ ] PNG metadata extraction
  - [ ] JSON serialization
  - [ ] Character editing capabilities
  - [ ] Format validation

### 3.3 World Info/Lorebook System
- [ ] Create `src/types/world-info.ts`:
  - [ ] Lorebook entry interface
  - [ ] Character-specific lorebook support
  - [ ] Trigger logic definitions
  - [ ] Insertion order management
- [ ] Create `src/components/world-info/WorldInfoEditor.tsx`:
  - [ ] Lorebook entry management UI
  - [ ] Character-specific lorebook tabs
  - [ ] Trigger keyword editor
  - [ ] Content preview functionality
- [ ] Update `src/hooks/useChat.ts`:
  - [ ] Lorebook injection logic
  - [ ] Keyword scanning implementation
  - [ ] Context-aware insertion
  - [ ] Lorebook priority system

## Backend Connectivity Enhancement

### 4.1 Streaming Response Support
- [ ] Update `src/hooks/useChat.ts`:
  - [ ] Add streaming support to sendMessage
  - [ ] Implement SSE connection handling
  - [ ] Add streaming state management
  - [ ] Error handling for streaming failures
- [ ] Create `src/lib/streaming.ts`:
  - [ ] OpenAI-compatible streaming parser
  - [ ] Anthropic streaming format support
  - [ ] Ollama streaming implementation
  - [ ] Streaming format detection
- [ ] Update `src/components/chat/ChatMessage.tsx`:
  - [ ] Typing indicator implementation
  - [ ] Partial message rendering
  - [ ] Streaming progress visualization
  - [ ] Streaming error display
- [ ] Add streaming UI feedback:
  - [ ] Connection status indicators
  - [ ] Streaming speed display
  - [ ] Cancel streaming functionality
  - [ ] Streaming quality settings

### 4.2 Image Generation Integration
- [ ] Create `src/types/image-generation.ts`:
  - [ ] Image provider config interfaces
  - [ ] Stable Diffusion configuration
  - [ ] DALL-E configuration
  - [ ] NovelAI configuration
- [ ] Create `src/hooks/useImageGeneration.ts`:
  - [ ] Provider abstraction layer
  - [ ] Image API call management
  - [ ] Image generation state
  - [ ] Error handling and retries
- [ ] Create `src/components/image/ImageGenerationPanel.tsx`:
  - [ ] Prompt input interface
  - [ ] Generation settings panel
  - [ ] Image gallery display
  - [ ] Image management controls
- [ ] Update `src/types/chat.ts`:
  - [ ] Add image message type
  - [ ] Image metadata interface
  - [ ] Image generation state types
- [ ] Update `src/components/chat/ChatMessage.tsx`:
  - [ ] Image message rendering
  - [ ] Image preview functionality
  - [ ] Image download support
  - [ ] Image optimization
- [ ] Add image embedding in chat context:
  - [ ] Multimodal model support
  - [ ] Image context injection
  - [ ] Image description generation
  - [ ] Image relevance scoring

### 4.3 Advanced API Features
- [ ] Add stopping strings support in `src/hooks/useChat.ts`:
  - [ ] Custom token sequence handling
  - [ ] Stopping string validation
  - [ ] Dynamic stopping string configuration
  - [ ] Stopping string testing interface
- [ ] Create `src/lib/tokenizer.ts`:
  - [ ] Tiktoken integration
  - [ ] Token counting approximation
  - [ ] Token usage tracking
  - [ ] Token limit warnings
- [ ] Create `src/lib/context-manager.ts`:
  - [ ] Sliding window implementation
  - [ ] Context summarization
  - [ ] Context size management
  - [ ] Context optimization
- [ ] Create `src/components/settings/PromptTemplates.tsx`:
  - [ ] Reusable prompt format management
  - [ ] Template creation interface
  - [ ] Template organization system
  - [ ] Template sharing functionality

## Extension System Architecture

### 5.1 Extension Loader and Runtime
- [ ] Create `src/types/extension.ts`:
  - [ ] Extension manifest schema
  - [ ] Permission definitions
  - [ ] Hook interfaces
  - [ ] Extension state types
- [ ] Create `src/lib/extension-loader.ts`:
  - [ ] Extension discovery in `extensions/` directory
  - [ ] Manifest validation
  - [ ] Script loading and execution
  - [ ] Extension dependency management
- [ ] Create `src/lib/extension-runtime.ts`:
  - [ ] Sandboxed execution context
  - [ ] Limited API access control
  - [ ] Extension lifecycle management
  - [ ] Memory usage monitoring
- [ ] Create `src/lib/extension-events.ts`:
  - [ ] Message sent/received events
  - [ ] Character loaded events
  - [ ] Settings changed events
  - [ ] Extension communication bus

### 5.2 Extension API Surface
- [ ] Create `src/lib/extension-api.ts`:
  - [ ] `getContext()` implementation
  - [ ] `registerSlashCommand()` API
  - [ ] `onEvent()` subscription system
  - [ ] `callPopup()` dialog functionality
  - [ ] `fetch()` proxied HTTP requests
  - [ ] `storage.get/set()` extension storage
- [ ] Create `src/components/extensions/ExtensionManager.tsx`:
  - [ ] Extension installation interface
  - [ ] Extension enabling/disabling UI
  - [ ] Extension configuration panels
  - [ ] Extension marketplace integration

### 5.3 SillyTavern Extension Compatibility
- [ ] Create `src/lib/st-compat.ts`:
  - [ ] Global API mapping to EasyTavern API
  - [ ] `eventSource` emulation implementation
  - [ ] DOM manipulation shims
  - [ ] Character access compatibility
- [ ] Implement compatibility shims:
  - [ ] Common SillyTavern extension patterns
  - [ ] Event system compatibility
  - [ ] API method compatibility
  - [ ] Data structure compatibility

## Advanced Chat Features

### 6.1 Group Chat Support
- [ ] Create `src/types/group-chat.ts`:
  - [ ] Group configuration interface
  - [ ] Participant management types
  - [ ] Turn order definitions
  - [ ] Activation condition types
- [ ] Create `src/components/chat/GroupChatManager.tsx`:
  - [ ] Multi-character conversation setup
  - [ ] Participant selection interface
  - [ ] Group configuration panel
  - [ ] Group chat visualization
- [ ] Create `src/hooks/useGroupChat.ts`:
  - [ ] Round-robin turn-taking logic
  - [ ] Smart turn order algorithm
  - [ ] Group state management
  - [ ] Group chat history tracking
- [ ] Update message rendering:
  - [ ] Character avatar display in group context
  - [ ] Speaker identification
  - [ ] Group chat message formatting
  - [ ] Group chat status indicators

### 6.2 Chat Branching and History
- [ ] Update `src/types/chat.ts`:
  - [ ] Add `parentId` and `children` to Message type
  - [ ] Tree structure interfaces
  - [ ] Branch metadata types
  - [ ] Comparison result types
- [ ] Create `src/components/chat/ChatBranches.tsx`:
  - [ ] Branch visualization UI
  - [ ] Branch navigation interface
  - [ ] Branch comparison tools
  - [ ] Branch management controls
- [ ] Update `src/hooks/useChat.ts`:
  - [ ] Branch creation on message regeneration
  - [ ] Branch state management
  - [ ] Branch persistence
  - [ ] Branch conflict resolution
- [ ] Create `src/components/chat/BranchCompare.tsx`:
  - [ ] Side-by-side branch comparison
  - [ ] Diff visualization
  - [ ] Branch merging interface
  - [ ] Branch analysis tools

### 6.3 RAG (Retrieval-Augmented Generation)
- [ ] Create `src/lib/vector-store.ts`:
  - [ ] Document embedding implementation
  - [ ] Similarity search algorithm
  - [ ] Local embedding support
  - [ ] API-based embedding fallback
- [ ] Create `src/components/rag/DocumentManager.tsx`:
  - [ ] Document upload interface
  - [ ] Document organization system
  - [ ] Document preview functionality
  - [ ] Document metadata management
- [ ] Update `src/hooks/useChat.ts`:
  - [ ] Context injection based on semantic search
  - [ ] Document relevance scoring
  - [ ] Context optimization
  - [ ] Citation generation
- [ ] Update chat message rendering:
  - [ ] Document citation display
  - [ ] Source attribution
  - [ ] Citation hover details
  - [ ] Citation management

## UI/UX Enhancements

### 7.1 Theme and Customization
- [ ] Update `tailwind.config.ts`:
  - [ ] Custom theme variables
  - [ ] User customization support
  - [ ] Theme inheritance system
  - [ ] Theme validation
- [ ] Create `src/components/settings/ThemeEditor.tsx`:
  - [ ] Visual theme customization interface
  - [ ] Color picker implementation
  - [ ] Typography customization
  - [ ] Layout customization
- [ ] Implement CSS injection:
  - [ ] User background support
  - [ ] Custom style injection
  - [ ] Theme switching
  - [ ] Style validation
- [ ] Add theme import/export:
  - [ ] Theme file format definition
  - [ ] Import functionality
  - [ ] Export functionality
  - [ ] Theme sharing system

### 7.2 Keyboard Shortcuts
- [ ] Create `src/hooks/useKeyboardShortcuts.ts`:
  - [ ] Global hotkey management
  - [ ] Shortcut registration system
  - [ ] Shortcut conflict resolution
  - [ ] Shortcut persistence
- [ ] Implement shortcuts:
  - [ ] Tab navigation (Ctrl+Tab, Ctrl+W)
  - [ ] Message actions (Ctrl+Enter, Ctrl+Z)
  - [ ] Quick settings access
  - [ ] Extension shortcuts
- [ ] Add shortcut customization:
  - [ ] Shortcut rebinding interface
  - [ ] Shortcut conflict detection
  - [ ] Shortcut presets
  - [ ] Shortcut export/import

### 7.3 Accessibility
- [ ] Add ARIA labels:
  - [ ] All interactive components
  - [ ] Form elements
  - [ ] Navigation elements
  - [ ] Status indicators
- [ ] Implement keyboard navigation:
  - [ ] Tab bar navigation
  - [ ] Chat interface navigation
  - [ ] Menu navigation
  - [ ] Focus management
- [ ] Add screen reader announcements:
  - [ ] New message notifications
  - [ ] State change announcements
  - [ ] Error messages
  - [ ] Loading states

## Data Management and Persistence

### 8.1 Chat History Storage
- [ ] Create `src/lib/database.ts`:
  - [ ] Dexie.js database setup
  - [ ] Conversation table schema
  - [ ] Message table schema
  - [ ] Metadata table schema
- [ ] Create `src/lib/chat-exporter.ts`:
  - [ ] JSON export functionality
  - [ ] Markdown export functionality
  - [ ] HTML export functionality
  - [ ] Export formatting options
- [ ] Create `src/components/chat/ChatSearch.tsx`:
  - [ ] Chat search interface
  - [ ] Conversation filtering
  - [ ] Message search
  - [ ] Search result preview
- [ ] Implement automatic backup system:
  - [ ] Backup scheduling
  - [ ] Backup file management
  - [ ] Backup restoration
  - [ ] Backup verification

## Testing and Quality Assurance

### 9.1 Unit Tests
- [ ] Test `src/hooks/useChat.ts`:
  - [ ] Message sending functionality
  - [ ] Streaming support
  - [ ] Error handling
  - [ ] State management
- [ ] Test API settings:
  - [ ] API configuration validation
  - [ ] API connection testing
  - [ ] Error handling
  - [ ] Default value management
- [ ] Test `src/lib/character-parser.ts`:
  - [ ] PNG parsing functionality
  - [ ] JSON parsing functionality
  - [ ] Format detection
  - [ ] Error handling
- [ ] Test `src/lib/extension-loader.ts`:
  - [ ] Extension discovery
  - [ ] Manifest validation
  - [ ] Safe loading
  - [ ] Error handling

### 9.2 Integration Tests
- [ ] Create `src/__tests__/tab-management.test.tsx`:
  - [ ] Tab lifecycle testing
  - [ ] Tab persistence testing
  - [ ] Tab state management
  - [ ] Tab error handling
- [ ] Create `src/__tests__/extension-system.test.tsx`:
  - [ ] Extension loading testing
  - [ ] API access testing
  - [ ] Extension communication
  - [ ] Error handling
- [ ] Test backend connectivity:
  - [ ] Mock server setup
  - [ ] API connection testing
  - [ ] Streaming testing
  - [ ] Error scenario testing

## Documentation

### 10.1 User Documentation
- [ ] Create `docs/user-guide.md`:
  - [ ] Installation instructions
  - [ ] Basic usage guide
  - [ ] Character management guide
  - [ ] Extension installation guide
- [ ] Create `docs/api-providers.md`:
  - [ ] Supported backends documentation
  - [ ] Configuration examples
  - [ ] API limitations
  - [ ] Troubleshooting guide
- [ ] Create `docs/keyboard-shortcuts.md`:
  - [ ] Complete shortcut list
  - [ ] Shortcut descriptions
  - [ ] Customization instructions
  - [ ] Shortcut reference

### 10.2 Developer Documentation
- [ ] Create `docs/extension-development.md`:
  - [ ] Extension API reference
  - [ ] Development examples
  - [ ] Best practices
  - [ ] Debugging guide
- [ ] Create `docs/architecture.md`:
  - [ ] Tab system explanation
  - [ ] State management overview
  - [ ] Data flow documentation
  - [ ] Component architecture
- [ ] Create `docs/contributing.md`:
  - [ ] Contribution guidelines
  - [ ] Development setup
  - [ ] Code style guide
  - [ ] Pull request process

## Architecture and Data Flow Documentation

### Architecture Diagram
- [ ] Create Mermaid architecture diagram
- [ ] Document component relationships
- [ ] Explain data flow
- [ ] Add diagram to documentation

### Data Flow Sequence
- [ ] Create Mermaid sequence diagram
- [ ] Document user interactions
- [ ] Explain system responses
- [ ] Add sequence to documentation
