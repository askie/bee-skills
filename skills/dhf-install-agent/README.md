# dhf-install-agent

A skill for installing and managing DHF Bee Agent (Grix platform).

## What is DHF Bee Agent?

DHF Bee Agent is an OpenClaw compatible multi-agent collaboration platform that provides:

- **Browser Automation**: Automate web interactions without coding
- **AI-Powered Workflows**: Generate workflows from natural language
- **Multi-Agent Collaboration**: Coordinate multiple AI agents
- **Local-First Privacy**: All data stored locally with encryption
- **Zero Runtime Costs**: Run independently after debugging

## Installation

This skill is part of the Claude Code skills ecosystem. Add it to your skills directory:

```bash
skills/dhf-install-agent/
├── SKILL.md              # Skill metadata and documentation
├── scripts/
│   ├── main.ts          # TypeScript implementation
│   └── package.json     # Node package configuration
└── references/
    ├── installation-guide.md  # Installation guide
    └── workflow.md            # Workflow documentation
```

## Usage

```bash
# Check if DHF is installed
/dhf-install-agent --check

# Install DHF (auto-downloads and installs)
/dhf-install-agent --install

# Show installation status
/dhf-install-agent --status

# Force reinstall
/dhf-install-agent --install --force

# Open DHF application
/dhf-install-agent --open

# Show help
/dhf-install-agent --help
```

## Features

- **Automatic Download**: Downloads DHF from official servers
- **Progress Display**: Shows real-time download progress
- **Auto-Extraction**: Extracts and installs to correct location
- **Installation Detection**: Checks if DHF is already installed
- **Cross-Platform**: Supports Windows, macOS (Intel/ARM), and Linux
- **Version Detection**: Displays installed version
- **Status Reporting**: Shows installation paths and configuration

## What Gets Installed

| Platform | Location |
|----------|----------|
| Windows | `%LOCALAPPDATA%\Programs\DHF-Bee-Agent\` |
| macOS | `/Applications/DHF-Bee-Agent.app` |
| Linux | `/usr/bin/dhf-bee-agent` or `~/.local/bin/dhf-bee-agent` |

## Configuration

DHF stores configuration in:

| Platform | Config Path |
|----------|-------------|
| Windows | `%APPDATA%\DHF-Bee-Agent\` |
| macOS | `~/Library/Application Support/DHF-Bee-Agent/` |
| Linux | `~/.config/DHF-Bee-Agent/` |

## Links

- Official Website: https://dhf.pub
- Download Page: https://dhf.pub/en/download
- Help Center: https://dhf.pub/en/help
- Workflow Market: https://dhf.pub/nl/explore

## License

MIT
