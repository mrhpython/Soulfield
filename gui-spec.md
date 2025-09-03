# Soulfield OS GUI Architecture

## 1) UI Architecture & File Map

### Layout Strategy
Single-window application with left navigation rail (collapsible) and main content area. Top bar for system status and global actions.

### Proposed Directory Structure
```
soulfield-gui/
├── src/
│   ├── shell/              # App window frame and navigation
│   │   ├── AppShell        # Main window container with nav rail
│   │   ├── NavRail         # Collapsible left navigation
│   │   └── StatusBar       # Top bar with connection status
│   ├── tabs/               # Tab-specific views
│   │   ├── Projects/       # Project management and overview
│   │   ├── Sessions/       # Session history and time travel
│   │   ├── Agents/         # Agent prompt editor and management
│   │   ├── Commands/       # Command execution interface
│   │   ├── Memory/         # Memory search and inspection
│   │   ├── Specs/          # Specification editor with preview
│   │   ├── Logs/           # Log viewer with filtering
│   │   ├── Settings/       # Configuration management
│   │   └── MCP/            # MCP server monitoring
│   ├── services/           # API communication layer
│   │   ├── api             # HTTP client for backend
│   │   ├── state           # Global state management
│   │   └── storage         # Local preferences/cache
│   ├── components/         # Reusable UI components
│   │   ├── Editor          # Code/markdown editor wrapper
│   │   ├── DataTable       # Sortable/filterable tables
│   │   ├── Terminal        # Log/output viewer
│   │   └── TruthLensFlag   # Pass/fail indicator widget
│   └── utils/              # Helper functions and constants
├── assets/                 # Icons, fonts, static resources
└── config/                 # Build and runtime configuration
```

## 2) Text Wireframes (ASCII)

### Projects Tab
```
┌─────────────────────────────────────────────────────────────┐
│ [≡] Soulfield OS  ●Connected:8790  ◐TruthLens:Active       │
├─────┬───────────────────────────────────────────────────────┤
│ ▼ │ PROJECTS                                    [+ New]     │
│ P │ ┌─────────────────────────────────────────────────────┐│
│ S │ │ ▶ my-app          3 sessions   Last: 2h ago         ││
│ A │ │ ▼ data-pipeline   8 sessions   Last: 10m ago        ││
│ C │ │   ├─ Session #8   ✓ Applied    10m ago              ││
│ M │ │   ├─ Session #7   ⚠ Dry run    1h ago               ││
│ Sp│ │   └─ Session #6   ✗ Failed     2h ago               ││
│ L │ │                                                      ││
│ St│ │ ▶ research-tool   1 session    
# Soulfield OS GUI Architecture & UX Design

## 1. System Architecture

### 1.1 Stack Components
- **Frontend**: Electron + React/Vue (local-first desktop app)
- **IPC Layer**: WebSocket connection to `ws://127.0.0.1:8790`
- **State Management**: IndexedDB for GUI state, backend handles truth
- **File System**: Direct access to local project directories

### 1.2 Data Flow
```
GUI <-> WebSocket <-> Node Service <-> Core Modules
                          |
                    File System / Pinecone
```

## 2. Information Architecture

### 2.1 Primary Navigation Structure
```
[Projects] [Sessions] [Agents] [Commands] [Memory] [Specs] [Logs] [Settings] [MCP]
```

### 2.2 Layout Pattern
- **Left**: Tab navigation (vertical icons + labels)
- **Center**: Main content area (context-dependent)
- **Right**: Inspector panel (collapsible)
- **Bottom**: Status bar (connection, tokens, active job)

## 3. Tab Specifications

### 3.1 Projects Tab
- **Grid view**: Project cards with visual previews
- **Card contents**: Name, last modified, agent count, session count
- **Actions**: New, Open, Archive, Export
- **Inspector**: Project metadata, file tree, recent activity

### 3.2 Sessions Tab
- **Timeline view**: Horizontal scrollable timeline
- **Session nodes**: Timestamp, agent used, command type, token count
- **Playback controls**: Step forward/back, jump to timestamp
- **Inspector**: Full session context, inputs/outputs, cost breakdown

### 3.3 Agents Tab
- **Split view**: Agent list (left), prompt editor (right)
- **Editor features**: Syntax highlighting, variable interpolation preview
- **Agent metadata**: Usage stats, success rate, avg tokens
- **Actions**: New, Clone, Test, Version history

### 3.4 Commands Tab
- **Button grid**: Large clickable tiles for each sf command
- **Command cards**: Icon, name, description, last run
- **Quick actions**: Research, Specify, Dry Run, Apply
- **Inspector**: Command history, parameters, output preview

### 3.5 Memory Tab
- **Search bar**: Natural language queries to Pinecone
- **Results list**: Relevance-sorted memory chunks
- **Visualization**: Memory graph/constellation view
- **Inspector**: Full memory content, metadata, connections

### 3.6 Specs Tab
- **Split pane**: Markdown editor (left), live preview (right)
- **File browser**: Spec file tree navigation
- **Editor toolbar**: Format, insert template, validate
- **Version control**: Diff view, commit history

### 3.7 Logs Tab
- **Stream view**: Real-time log tailing
- **Filters**: Level (info/warn/error), source, timestamp range
- **Search**: Full-text search across logs
- **Actions**: Export, clear, pause/resume

### 3.8 Settings Tab
- **Sections**: Connection, API Keys, Paths, Preferences
- **Port config**: Backend service port (8790)
- **Key management**: Secure storage for API credentials
- **Theme**: Light/Dark mode toggle

### 3.9 MCP Tab
- **Server list**: Active MCP servers, status indicators
- **Server cards**:


--- END PART 0 ---


# 1) UI Architecture & File Map

## One-Window Layout
- **Architecture**: Single window with left navigation sidebar + main content area + optional right detail pane
- **Primary Panes**: Navigation (200px) | Main Content (flex) | Detail Panel (300px, collapsible)
- **Component Responsibilities**: Nav handles routing, Main displays active tab content, Detail shows contextual info/actions

## Project Structure
```
src/
├── main.ts                 # Electron main process entry
├── preload.ts             # IPC bridge for secure API access
├── renderer/              # Frontend application root
│   ├── App.tsx           # Main app shell with layout
│   ├── index.tsx         # React entry point
│   ├── components/       
│   │   ├── Layout/       # Shell, nav, header components
│   │   ├── Common/       # Reusable UI elements
│   │   └── Charts/       # Data visualization components
│   ├── tabs/            
│   │   ├── Projects/     # Project management tab
│   │   ├── Sessions/     # Active session monitoring
│   │   ├── Agents/       # Agent configuration/status
│   │   ├── Commands/     # Command palette/history
│   │   ├── Memory/       # Memory browser/editor
│   │   ├── Specs/        # Specification editor
│   │   ├── Logs/         # Log viewer/filters
│   │   ├── Settings/     # App configuration
│   │   └── MCP/          # Model Context Protocol tools
│   ├── services/         
│   │   ├── api.ts        # Backend API client
│   │   ├── ipc.ts        # Electron IPC handlers
│   │   └── websocket.ts  # Real-time event stream
│   ├── state/           
│   │   ├── store.ts      # Redux/Zustand store setup
│   │   └── slices/       # Feature-specific state
│   └── utils/           
│       ├── formatters.ts # Data formatting helpers
│       └── validators.ts # Input validation functions
```

# 2) Text Wireframes (ASCII)

## Projects Tab
```
┌─────────────────────────────────────────────────────────────────┐
│ [≡] Orchestrator  [Projects▼] [Sessions] [Agents] [...] [⚙]    │
├────────────────┬────────────────────────────────────────────────┤
│ PROJECTS       │ Project: ResearchBot_v2                        │
│                │ ┌──────────────────────────────────────────┐   │
│ [+ New Project]│ │ Status: ● Active   Created: 2024-01-15   │   │
│                │ │ Sessions: 12       Last Run: 2 hours ago  │   │
│ ▼ Active (3)   │ └──────────────────────────────────────────┘   │
│   • ResearchBot│                                                 │
│   • DataPipe   │ [▶ Start Session] [⚙ Configure] [📋 Clone]     │
│   • WebScraper │                                                


--- END PART 1 ---


# Orchestrator API & Build Plan Specification

## API Endpoints Specification

### Core Orchestration Endpoints

#### `/api/specify`
- **Method**: POST
- **Purpose**: Generate detailed specifications from high-level requirements
- **Request**:
```json
{
  "description": "string",
  "context": "object (optional)",
  "constraints": ["array of strings (optional)"]
}
```
- **Response**:
```json
{
  "specification": {
    "components": [],
    "interfaces": [],
    "dependencies": [],
    "implementation_notes": "string"
  },
  "session_id": "string"
}
```
- **Idempotency**: Request ID header supported

#### `/api/dry`
- **Method**: POST
- **Purpose**: Dry-run execution planning without side effects
- **Request**:
```json
{
  "specification": "object",
  "target_environment": "string (optional)",
  "validation_level": "strict|normal|loose"
}
```
- **Response**:
```json
{
  "execution_plan": [],
  "warnings": [],
  "estimated_duration": "number",
  "resource_requirements": {}
}
```

#### `/api/apply`
- **Method**: POST
- **Purpose**: Execute orchestrated changes
- **Request**:
```json
{
  "apply": true|false,
  "execution_plan": "object",
  "rollback_on_failure": true|false,
  "timeout_seconds": "number (optional)"
}
```
- **Response**:
```json
{
  "status": "success|partial|failed",
  "applied_changes": [],
  "rollback_available": true|false,
  "execution_id": "string"
}
```
- **Idempotency**: Execution ID prevents duplicate applications

### Logging & Sessions

#### `/api/logs/latest`
- **Method**: GET
- **Query Params**: 
  - `limit` (default: 100)
  - `level` (debug|info|warn|error)
  - `since` (timestamp)
- **Response**:
```json
{
  "logs": [
    {
      "timestamp": "ISO8601",
      "level": "string",
      "message": "string",
      "context": {}
    }
  ],
  "has_more": true|false
}
```

#### `/api/sessions`
- **Methods**: GET (list), GET/:id (get), POST (branch)
- **List** (GET):
  - Query: `page`, `limit`, `status` (active|completed|failed)
  - Response includes pagination metadata
- **Get** (GET/:id):
  - Returns full session state and history
- **Branch** (POST):
  - Creates new session from existing checkpoint
  - Request: `{ "parent_session_id": "string", "branch_point": "string (optional)" }`

### Agent Management

#### `/api/agents`
- **List** (GET):
  - Query: `page`, `limit`, `capability` (filter)
  - Response: paginated agent list with capabilities
- **Get** (GET/:id):
  - Returns agent configuration and state
- **Save** (POST):
  - Create/update agent configuration
  - Request includes agent


--- END PART 2 ---


# Aiden GUI Product Specification

## Phase 2 (MVP) - Core Functionality

### 1. Commands Tab
**Goal:** Enable users to execute Aiden commands through a graphical interface instead of CLI

**Inputs/Outputs:**
- Input: Command selection, parameter values, execution trigger
- Output: Command response, execution status, error messages

**Success Criteria:**
- All CLI commands accessible via GUI
- Real-time status updates during execution
- Clear parameter validation before submission
- Response formatting preserves structure (JSON/text)

**Risks/Mitigations:**
- Risk: Command timeout or hang
  - Mitigation: Implement cancellation mechanism and timeout indicators
- Risk: Malformed API requests
  - Mitigation: Client-side validation before API calls

### 2. Specs Viewer/Editor
**Goal:** View and modify Aiden specification files with syntax assistance

**Inputs/Outputs:**
- Input: File selection, text edits, save triggers
- Output: Parsed spec display, validation results, save confirmation

**Success Criteria:**
- Syntax highlighting for spec format
- Real-time validation feedback
- Diff view showing unsaved changes
- Multiple specs open in tabs

**Risks/Mitigations:**
- Risk: Concurrent edit conflicts
  - Mitigation: File lock indicators and merge conflict detection
- Risk: Invalid spec corruption
  - Mitigation: Pre-save validation and backup creation

### 3. Logs Tail
**Goal:** Monitor Aiden system logs in real-time for debugging and observability

**Inputs/Outputs:**
- Input: Log level filter, search terms, pause/resume controls
- Output: Streaming log entries, timestamp, severity levels

**Success Criteria:**
- Auto-scrolling with pause capability
- Filterable by severity level
- Searchable with highlighting
- Exportable to file

**Risks/Mitigations:**
- Risk: Log overflow affecting performance
  - Mitigation: Implement rolling buffer with configurable size
- Risk: Sensitive data exposure
  - Mitigation: Pattern-based redaction rules

### 4. Sessions List
**Goal:** Browse and manage active and historical Aiden sessions

**Inputs/Outputs:**
- Input: Filter criteria, sort preferences, session selection
- Output: Session metadata, status, duration, associated resources

**Success Criteria:**
- Sortable by date, status, duration
- Quick actions (terminate, archive, clone)
- Session detail preview on hover
- Batch operations support

**Risks/Mitigations:**
- Risk: Large session history degrading performance
  - Mitigation: Pagination and lazy loading
- Risk: Accidental session termination
  - Mitigation: Confirmation dialog with session details

### 5. Basic Agents Editor
**Goal:** Create and modify agent configurations through structured forms

**Inputs/Outputs:**
- Input: Agent parameters, capabilities, constraints
- Output: Valid agent configuration, deployment status

**Success Criteria:**
- Template-based agent creation
- Field validation with helpful errors
- Preview mode before deployment
- Import/export functionality

**Risks/Mitigations:**
- Risk: Invalid agent configuration causing system issues
  - Mitigation: Dry-run validation before apply
- Risk: Loss of work during editing
  - Mitigation: Auto-save drafts locally

## Phase 3 (Enhance) - Advanced Features

### 6. Session Time Travel
**Goal:** Navigate session history with


--- END PART 3 ---


