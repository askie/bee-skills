# AI Installation Guide for Bee RPA Skills

This guide is for AI assistants (Claude Code, GLM, etc.) to properly install Bee RPA Skills.

## Quick Installation Commands

### Install All Skills (Auto-detect Mode)

```bash
cd E:\aiwork\skillsGenerate\bee-skills
npm run install
```

### Install Specific Skills

```bash
node scripts/install-smart.js --skill=dhf-rpa-qq-mail-task,dhf-google-news-task
```

### Force Global Installation

```bash
node scripts/install-smart.js --global
```

### Force Project Installation

```bash
node scripts/install-smart.js --project
```

## Installation Rules

### 1. Global Installation
**Target Directory**: `C:\Users\Administrator\.claude\skills`

Use this when:
- User wants skills available across all projects
- User explicitly requests global installation
- No project-specific `.claude` directory exists

**Skills are installed as**: Symbolic links (on Windows) to save space

### 2. Project-Level Installation
**Target Directory**: `E:\aiwork\skillsGenerate\.claude\skills`

Use this when:
- Installing within a specific project
- Project has `.claude` directory structure
- User wants skills only for this project

**Skills are installed as**: File copies (not symbolic links)

### 3. OpenClaw Installation
**Target Directory**: Workspace directory's `skills/` folder

Use this when:
- User mentions "OpenClaw"
- Working in an OpenClaw workspace environment

## What NOT to Do

❌ **DO NOT** manually copy skills to random directories
❌ **DO NOT** install to `node_modules` directory
❌ **DO NOT** create symbolic links without using the installer script
❌ **DO NOT** modify skills after installation
❌ **DO NOT** install skills without updating marketplace.json

## Correct Installation Flow

1. **Always run the installer script first**:
   ```bash
   npm run install
   ```

2. **Let the script detect the correct installation mode** (global vs project)

3. **Select skills interactively** or use `--skill` flag for specific skills

4. **Verify installation**:
   ```bash
   npm run list
   ```

## Verification

After installation, verify:

### Global Installation
```bash
ls C:\Users\Administrator\.claude\skills
```

### Project Installation
```bash
ls E:\aiwork\skillsGenerate\.claude\skills
```

### Marketplace Configuration
Check that `marketplace.json` exists and contains installed skills:
- Global: `C:\Users\Administrator\.claude\plugins\marketplaces\bee-skills.json`
- Project: `E:\aiwork\skillsGenerate\.claude\plugins\marketplaces\bee-skills.json`

## Silent Installation (For AI Automation)

```bash
node scripts/install-smart.js --silent --skill=dhf-rpa-qq-mail-task
```

This will:
- Auto-detect installation mode
- Install specified skills without prompts
- Update marketplace.json
- Return success/failure status

## Example Usage

### User: "Install the QQ mail skill"
**AI Response**:
```bash
cd E:\aiwork\skillsGenerate\bee-skills
node scripts/install-smart.js --skill=dhf-rpa-qq-mail-task
```

### User: "Install all skills globally"
**AI Response**:
```bash
cd E:\aiwork\skillsGenerate\bee-skills
node scripts/install-smart.js --global
```

### User: "Install skills for this project"
**AI Response**:
```bash
cd E:\aiwork\skillsGenerate\bee-skills
node scripts/install-smart.js --project
```

## Troubleshooting

### Issue: Skills not appearing in Claude Code
**Solution**:
1. Check marketplace.json exists
2. Restart Claude Code
3. Verify skills in correct directory

### Issue: "Command not found" error
**Solution**:
- Ensure marketplace.json is properly formatted
- Check skill ID matches command name
- Restart Claude Code

### Issue: Permission errors
**Solution**:
- Run as administrator (Windows)
- Check directory permissions
- Use project mode instead of global mode

## Available Skills

- **Testing**: dhf-rpa-test-workflow
- **Mail**: dhf-163mail-task, dhf-outlook-mail-task, dhf-rpa-qq-mail-task
- **News**: dhf-163news-task, dhf-bing-news-task, dhf-google-news-task, dhf-juejin-news-task, dhf-tencent-news-task, dhf-toutiao-news-task
- **Search**: dhf-douyin-hot-search-task, dhf-google-hot-topics-task, dhf-weibo-hot-search-task, dhf-zhihu-hot-search-task
- **Trends**: dhf-google-trends-task
- **Tools**: dhf-install-agent

## Support

For issues or questions:
- Email: social@dhf.pub
- Package: @zx1998/dhf-rpa-installer
