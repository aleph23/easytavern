# Multi-Agent Development Workflow

## Agent Roles

### Project Manager Agent
- **Responsibility**: Track overall progress, coordinate between agents, maintain task dependencies
- **Tools**: Task management, progress tracking, roadmap updates, PROGRESS TRACKING!
- **Communication**: Weekly status reports, blocker resolution

### Research/QA Agent
- **Responsibility**: Research best practices, verify implementations, write tests, code review
- **Focus Areas**:
  - SillyTavern extension compatibility research
  - Character card format validation
  - Security review for extension sandboxing
  - Test coverage and quality assurance

### Full-Stack Coder Agent
- **Responsibility**: Complex architectural implementations
- **Focus Areas**:
  - Electron main process and IPC bridge
  - Extension system runtime and sandboxing
  - Streaming API implementation
  - State management refactoring
  - Next.js migration

### Implementation Coder Agent
- **Responsibility**: Straightforward feature implementations
- **Focus Areas**:
  - UI components (tabs, settings panels)
  - Character card parser/exporter
  - File system utilities
  - Basic hooks and utilities
  - shadcn/ui component integration

## Current Sprint: Foundation Phase

### Sprint Goal
Establish Electron desktop application with tab-based interface and file system access.

### Task Assignments

#### Full-Stack Coder
- [ ] Electron main process setup (main.ts)
- [ ] IPC bridge and preload script (preload.ts)
- [ ] File system access layer
- [ ] Tab manager core architecture

#### Implementation Coder
- [ ] Install Electron dependencies
- [ ] Update package.json scripts
- [ ] Create electron-builder.json config
- [ ] Tab UI components (TabBar, TabContent)
- [ ] Vite config for Electron

#### Research/QA
- [ ] Research Electron security best practices
- [ ] Validate character card V2/V3 spec compliance
- [ ] Set up test framework for Electron IPC
- [ ] Document extension API requirements

#### Project Manager
- [ ] Track dependency installations
- [ ] Monitor integration points
- [ ] Update roadmap with completion status
- [ ] Coordinate handoffs between agents

## Communication Protocol

### Status Updates
Each agent reports status in `AGENT_STATUS.md`:
- What was completed
- What is in progress
- Blockers or questions
- Next steps

### Handoff Protocol
When passing work between agents:
1. Document what was done
2. List integration points
3. Note any deviations from plan
4. Provide test instructions

### Code Review
Research/QA agent reviews all PRs:
- Security checks
- Test coverage
- Performance concerns
- Standards compliance
