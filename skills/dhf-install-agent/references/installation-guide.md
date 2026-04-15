# DHF Bee Agent Installation Guide

This guide explains how to use the `dhf-install-agent` skill to install and manage DHF Bee Agent.

## Quick Start

```bash
# Check if DHF is already installed
/dhf-install-agent --check

# Install DHF (opens download page)
/dhf-install-agent --install

# Verify installation
/dhf-install-agent --status

# Open DHF application
/dhf-install-agent --open
```

## What is DHF Bee Agent?

DHF Bee Agent (Grix platform) is an OpenClaw compatible multi-agent collaboration platform that provides:

- **Browser Automation**: Automate web interactions without writing code
- **AI-Powered Workflows**: Generate workflows from natural language descriptions
- **Multi-Agent Collaboration**: Coordinate multiple AI agents for complex tasks
- **Local-First Privacy**: All data stored locally with encryption
- **Zero Runtime Costs**: Run workflows independently after AI-assisted debugging

## Installation Process

### Step 1: Run Installation Command

```bash
/dhf-install-agent --install
```

This will:
1. Detect your operating system and architecture
2. Open the DHF download page in your browser
3. Display instructions for completing installation

### Step 2: Download and Install

1. From the download page, select the version for your operating system:
   - **Windows**: Standalone executable (.exe)
   - **macOS**: Application bundle (.dmg or .app)
   - **Linux**: AppImage, DEB, or RPM package

2. Run the installer with appropriate permissions:
   - **Windows**: Double-click the installer
   - **macOS**: Drag to Applications folder
   - **Linux**: Install using package manager or make AppImage executable

### Step 3: Verify Installation

```bash
/dhf-install-agent --status
```

Expected output:
```
══════════════════════════════════════════════════════════════
  DHF Bee Agent Status
══════════════════════════════════════════════════════════════

✅ DHF Bee Agent is installed
   Location: /Applications/DHF-Bee-Agent.app
   Version: 1.0.0
   Config: /Users/xxx/Library/Application Support/DHF-Bee-Agent
```

## Installation Paths

### Windows
- **Executable**: `%LOCALAPPDATA%\Programs\DHF-Bee-Agent\DHF-Bee-Agent.exe`
- **Config**: `%APPDATA%\DHF-Bee-Agent\`

### macOS
- **Application**: `/Applications/DHF-Bee-Agent.app`
- **Config**: `~/Library/Application Support/DHF-Bee-Agent/`

### Linux
- **Executable**: `/usr/bin/dhf-bee-agent` or `~/.local/bin/dhf-bee-agent`
- **Config**: `~/.config/DHF-Bee-Agent/`

## Post-Installation Setup

After installing DHF Bee Agent:

1. **Launch the Application**
   ```bash
   /dhf-install-agent --open
   ```

2. **Install Browser Extension**
   - Chrome/Edge: Install from the Chrome Web Store
   - Required for browser automation features

3. **Create Your First Workflow**
   - Use the AI assistant to describe your automation task
   - DHF will generate a workflow automatically
   - Test and debug visually

## Command Reference

| Command | Alias | Description |
|---------|-------|-------------|
| `--check` | `-c` | Check if DHF is installed |
| `--install` | `-i` | Install DHF Bee Agent |
| `--force` | `-f` | Force reinstall |
| `--status` | `-s` | Show installation status |
| `--open` | `-o` | Open DHF application |
| `--help` | `-h` | Show help message |

## Troubleshooting

### Installation Fails

**Problem**: Download page doesn't open

**Solution**:
- Manually visit https://dhf.pub/en/download
- Check internet connection
- Try a different browser

**Problem**: Installation fails

**Solution**:
- Ensure write permissions
- On Linux: Use `sudo` if installing to `/usr/bin`
- On Windows: Run as Administrator
- On macOS: Allow installation in System Preferences

### DHF Not Detected After Installation

**Problem**: `--status` shows "not installed"

**Solution**:
1. Verify installation path
2. Check file permissions
3. Restart terminal/IDE
4. Use `--force` to reinstall

### Browser Extension Issues

**Problem**: Automation features not working

**Solution**:
- Install the DHF browser extension
- Enable the extension in your browser
- Grant necessary permissions
- Check browser compatibility (Chrome/Edge recommended)

## Advanced Usage

### Force Reinstall

```bash
/dhf-install-agent --install --force
```

### Automated Installation

For automated setups, you can script the installation:

```bash
#!/bin/bash
# Install DHF and open
/dhf-install-agent --install
# Manually complete installation, then:
/dhf-install-agent --status
/dhf-install-agent --open
```

### Integration with Other Tools

DHF supports MCP (Model Context Protocol) for integration with:
- n8n
- Dify
- Other automation platforms

## Links

- **Official Website**: https://dhf.pub
- **Download Page**: https://dhf.pub/en/download
- **Help Center**: https://dhf.pub/en/help
- **Workflow Market**: https://dhf.pub/nl/explore
- **OpenClaw Protocol**: https://openclaw.org

## Support

For issues or questions:
- Visit the help center: https://dhf.pub/en/help
- Check the workflow market for examples: https://dhf.pub/nl/explore
