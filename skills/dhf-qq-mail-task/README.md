# dhf-qq-mail-task

A skill for automatically sending QQ emails using DHF Agent tasks.

## Features

- **Automatic Email Sending**: Opens QQ Browser and sends emails automatically
- **Attachment Support**: Upload files via drag-and-drop automation
- **Multiple Recipients**: Send to multiple email addresses at once
- **CC/BCC Support**: Carbon copy and blind carbon copy
- **Real-time Status**: Polls task execution status

## Installation

This skill is part of the Claude Code skills ecosystem.

```bash
skills/dhf-qq-mail-task/
├── SKILL.md              # Skill metadata and documentation
├── scripts/
│   ├── main.ts          # TypeScript implementation
│   └── package.json     # Package configuration
└── references/
    └── task-guide.md    # Task usage guide
```

## Prerequisites

1. **DHF Agent installed**
   ```bash
   /dhf-install-agent --status
   ```

2. **DHF Agent running**
   ```bash
   /dhf-install-agent --open
   ```

3. **QQ Browser installed**
   - Required for automation

4. **QQ Mail logged in**
   - First-time use requires manual login

## Usage

### Basic Email

```bash
/dhf-qq-mail-task \
  --to "friend@example.com" \
  --subject "Meeting" \
  --body "Let's meet tomorrow at 2pm."
```

### Email with Attachment

```bash
/dhf-qq-mail-task \
  --to "colleague@example.com" \
  --subject "Report" \
  --body "Please find the attached report." \
  --attachment "/path/to/report.pdf"
```

### Multiple Recipients

```bash
/dhf-qq-mail-task \
  --to "a@example.com,b@example.com,c@example.com" \
  --subject "Team Update" \
  --body "Weekly team meeting this Friday."
```

### With CC and BCC

```bash
/dhf-qq-mail-task \
  --to "recipient@example.com" \
  --cc "cc@example.com" \
  --bcc "bcc@example.com" \
  --subject "Project Update" \
  --body "Project status update attached."
```

## Parameters

| Parameter | Short | Required | Description |
|-----------|-------|----------|-------------|
| `--to` | `-t` | ✅ | Recipient email(s), comma-separated |
| `--subject` | `-s` | ✅ | Email subject |
| `--body` | `-b` | ✅ | Email body content |
| `--attachment` | `-a` | ❌ | Attachment file path |
| `--cc` | `-c` | ❌ | CC recipient |
| `--bcc` | `-B` | ❌ | BCC recipient |

## Task Information

- **Task ID**: `NRxq1h`
- **MCP Service**: `dhf_rpa_task`
- **Method**: `task_market_run`
- **Market**: DHF Task Market

## Execution Flow

```
1. Validate input parameters
   ↓
2. Check DHF Agent MCP service
   ↓
3. Call task (task_id: NRxq1h)
   ↓
4. Open QQ Browser automatically
   ↓
5. Login to QQ Mail (if needed)
   ↓
6. Fill email information
   ↓
7. Upload attachment (if provided)
   ↓
8. Send email
   ↓
9. Poll execution result
```

## Troubleshooting

### DHF Agent Not Running

**Problem**: MCP service unavailable

**Solution**:
```bash
/dhf-install-agent --open
```

### QQ Browser Not Installed

**Problem**: Task execution fails

**Solution**: Install QQ Browser for automation

### QQ Mail Not Logged In

**Problem**: Opens mail but can't send

**Solution**: Log in to QQ Mail manually once

### Attachment Not Found

**Problem**: Task execution fails

**Solution**:
- Check attachment path
- Use absolute path
- Ensure file exists and is readable

## Links

- Official Website: https://dhf.pub
- Task Market: https://dhf.pub/nl/explore
- Help Center: https://dhf.pub/en/help

## License

MIT
