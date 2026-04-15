# DHF Installation Workflow

This document describes the complete workflow for installing DHF Bee Agent using this skill.

## Overview

```
User Input → Detect Installation → Check Force Flag → Download Page → Manual Install → Verify
```

## Detailed Steps

### Step 1: Command Parsing

**Purpose**: Parse command line arguments to determine user intent.

**Process**:
1. Read arguments from `process.argv.slice(2)`
2. Map flags to options:
   - `--check` / `-c` → Check installation status
   - `--install` / `-i` → Install DHF
   - `--force` / `-f` → Force reinstall
   - `--status` / `-s` → Show detailed status
   - `--open` / `-o` → Open DHF application
   - `--help` / `-h` → Show help

**Output**: Parsed options object

### Step 2: Installation Detection

**Purpose**: Check if DHF is already installed on the system.

**Process**:
1. Determine platform-specific paths to check
2. Test each path for existence
3. If found, attempt to get version by running `--version`
4. Return detection result with path and version

**Platform Paths**:
- **Windows**:
  - `%LOCALAPPDATA%\Programs\DHF-Bee-Agent\DHF-Bee-Agent.exe`
  - `%PROGRAMFILES%\DHF-Bee-Agent\DHF-Bee-Agent.exe`
  - `%APPDATA%\DHF-Bee-Agent\DHF-Bee-Agent.exe`

- **macOS**:
  - `/Applications/DHF-Bee-Agent.app`
  - `~/Applications/DHF-Bee-Agent.app`

- **Linux**:
  - `/usr/bin/dhf-bee-agent`
  - `~/.local/bin/dhf-bee-agent`
  - `/opt/DHF-Bee-Agent/dhf-bee-agent`

**Output**:
```typescript
{
  installed: boolean,
  path?: string,
  version?: string
}
```

### Step 3: Installation Decision

**Purpose**: Determine whether to proceed with installation.

**Logic**:
```
IF --install flag:
  IF already installed AND NOT --force:
    Show "already installed" message
    Return success
  ELSE:
    Proceed to download
ELSE IF --check flag:
  Exit with status code
ELSE IF --status flag:
  Show detailed status
ELSE IF --open flag:
  Open DHF application
```

### Step 4: Download Page

**Purpose**: Open the browser to download DHF.

**Process**:
1. Detect current platform and architecture
2. Display system information to user
3. Open browser to https://dhf.pub/download
4. Pause and wait for manual installation

**Output**: Throws `MANUAL_DOWNLOAD_REQUIRED` error

**User Message**:
```
⏸️  Installation paused.
   Please complete the following steps:

   1. Download DHF Bee Agent from the opened browser page
   2. Run the installer
   3. After installation, run this command again to verify:
      /dhf-install-agent --status
```

### Step 5: Manual Installation

**Purpose**: User completes the installation manually.

**User Actions**:
1. Download appropriate package from browser
2. Run installer with system permissions
3. Follow installation prompts
4. Wait for installation to complete

### Step 6: Verification

**Purpose**: Confirm installation was successful.

**Process**:
1. User runs `/dhf-install-agent --status`
2. Skill re-runs detection
3. Displays installation status and version

## Error Handling

| Error Type | Detection | Recovery |
|------------|-----------|----------|
| Not installed | Step 2 | Proceed to Step 4 |
| Already installed | Step 2 | Show message, exit unless --force |
| Download fails | Step 4 | Show manual download URL |
| Version check fails | Step 2 | Show as installed but unknown version |
| Open fails | Step 2 (on --open) | Show error, suggest manual launch |

## State Diagram

```
┌─────────────┐
│   Start     │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│ Parse Args  │────▶│ --help?      │────▶ Show Help
└──────┬──────┘     └──────────────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│ Detect Inst │────▶│ --check?      │────▶ Exit status
└──────┬──────┘     └──────────────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│   Status    │────▶│ --status?     │────▶ Show details
└──────┬──────┘     └──────────────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│    Open     │────▶│ --open?       │────▶ Launch app
└──────┬──────┘     └──────────────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│  Install?   │────▶│ Already?      │
└──────┬──────┘     └──────┬───────┘
       │                    │
       │            ┌───────┴────────┐
       │            ▼                ▼
       │      ┌─────────┐      ┌──────────┐
       │      │ --force │      │ Show OK  │
       │      └────┬────┘      └──────────┘
       │           │
       ▼           ▼
    ┌──────────────────────┐
    │  Open Download Page  │
    └──────────┬───────────┘
               │
               ▼
         ┌──────────┐
         │  Pause   │
         └──────────┘
```

## Examples

### Check Installation

```bash
$ /dhf-install-agent --check

✅ Installed
/Applications/DHF-Bee-Agent.app
Version: 1.0.0
```

### Install DHF

```bash
$ /dhf-install-agent --install

══════════════════════════════════════════════════════════════
  DHF Bee Agent Installation
══════════════════════════════════════════════════════════════

📋 System Information:
   Platform: darwin
   Architecture: arm64

📥 Download URL: https://dhf.pub
🌐 Opening download page in browser...
   Please download the version for your platform:
   - Platform: darwin
   - Architecture: arm64
   - Download page: https://dhf.pub/download

⏸️  Installation paused.
   Please complete the following steps:

   1. Download DHF Bee Agent from the opened browser page
   2. Run the installer
   3. After installation, run this command again to verify:
      /dhf-install-agent --status
```

### Already Installed

```bash
$ /dhf-install-agent --install

══════════════════════════════════════════════════════════════
  DHF Bee Agent Installation
══════════════════════════════════════════════════════════════

✅ DHF Bee Agent is already installed!
   Location: /Applications/DHF-Bee-Agent.app
   Version: 1.0.0
   Use --force to reinstall
```

### Show Status

```bash
$ /dhf-install-agent --status

══════════════════════════════════════════════════════════════
  DHF Bee Agent Status
══════════════════════════════════════════════════════════════

✅ DHF Bee Agent is installed
   Location: /Applications/DHF-Bee-Agent.app
   Version: 1.0.0
   Config: /Users/xxx/Library/Application Support/DHF-Bee-Agent
```

### Not Installed

```bash
$ /dhf-install-agent --status

══════════════════════════════════════════════════════════════
  DHF Bee Agent Status
══════════════════════════════════════════════════════════════

❌ DHF Bee Agent is not installed
   Run /dhf-install-agent --install to install
```

### Force Reinstall

```bash
$ /dhf-install-agent --install --force

══════════════════════════════════════════════════════════════
  DHF Bee Agent Installation
══════════════════════════════════════════════════════════════

🔄 Force reinstall requested...
📋 System Information:
   Platform: darwin
   Architecture: arm64

...
```
