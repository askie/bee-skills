---
name: dhf-install-agent
description: Install DHF Bee Agent (Grix platform) - an OpenClaw compatible multi-agent collaboration platform for browser automation and workflow execution
version: 1.0.0
metadata:
  tags: [automation, agent, workflow, dhf, grix, installer]
  categories: [development, tools]
  author: "DHF Community"
  license: MIT
  homepage: https://dhf.pub
  repository: https://dhf.pub
---

# dhf-install-agent

Automatically install and configure DHF Bee Agent, a powerful AI-driven browser automation and workflow execution platform.

## Overview

DHF Bee Agent (Grix platform) is an OpenClaw compatible multi-agent collaboration platform that enables:
- **Browser Automation**: Automate web interactions without coding
- **AI-Powered Workflows**: Generate workflows from natural language descriptions
- **Multi-Agent Collaboration**: Coordinate multiple AI agents for complex tasks
- **Local-First Privacy**: All data stored locally with encryption
- **Zero Runtime Costs**: Run workflows independently after debugging

## Features

- **Automatic Download**: Fetches the latest DHF Bee Agent from official servers
- **Progress Display**: Shows real-time download progress
- **Auto-Extraction**: Extracts and installs files to the correct location
- **Installation Detection**: Checks if DHF is already installed
- **Version Verification**: Ensures the installed version is working
- **Running Status Detection**: Checks if DHF is currently running with PID and uptime
- **Health Check**: Verifies process, config, and memory status
- **Smart Open**: Activates window if already running, launches if not
- **Cross-Platform**: Supports Windows, macOS (Intel/Apple Silicon), and Linux
- **Force Reinstall**: Reinstalls with the `--force` flag

## Usage

```bash
# Check if DHF is installed
/dhf-install-agent --check

# Install DHF (auto-downloads and installs)
/dhf-install-agent --install

# Force reinstall even if already installed
/dhf-install-agent --install --force

# Show DHF version and status (including running state and health)
/dhf-install-agent --status

# Check if DHF is currently running
/dhf-install-agent --running

# Perform health check
/dhf-install-agent --health

# Open DHF (auto-install if not found, activate if already running)
/dhf-install-agent --open
```

## Installation Details

The skill automatically:
1. Detects your OS and architecture
2. Downloads the correct version (v3.0.9) from `https://dhf.pub/downloads/`
3. Shows download progress
4. Extracts the ZIP archive
5. Installs to the appropriate location:
   - **Windows**: `%LOCALAPPDATA%\Programs\DHF-Bee-Agent\`
   - **macOS**: `/Applications/DHF-Bee-Agent.app`
   - **Linux**: `~/.local/share/DHF-Bee-Agent/` with symlink in `~/.local/bin/`

## Post-Installation

After installation, DHF Bee Agent will:
1. Launch the main application window
2. Create the default workspace directory
3. Install browser extension for automation
4. Configure local storage for workflows

## Configuration

DHF stores configuration in:
- **Windows**: `%APPDATA%\DHF-Bee-Agent\`
- **macOS**: `~/Library/Application Support/DHF-Bee-Agent/`
- **Linux**: `~/.config/DHF-Bee-Agent/`

## Troubleshooting

### Installation Fails
- Check internet connection
- Verify write permissions
- Try `--force` flag to reinstall

### Browser Extension Not Installing
- Manually install from browser extension store
- Check browser compatibility (Chrome/Edge recommended)

### Workflow Execution Issues
- Verify browser extension is enabled
- Check DHF is running in background
- Review logs in configuration directory

## Links

- Official Website: https://dhf.pub
- Download Page: https://dhf.pub/en/download
- Help Center: https://dhf.pub/en/help
- Workflow Market: https://dhf.pub/nl/explore
