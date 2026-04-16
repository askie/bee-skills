# bing-search-task

A skill for automatically searching Bing using DHF Agent tasks.

## Features

- **Automatic Search**: Opens browser and searches Bing automatically
- **Multi-Page Support**: Configure number of pages to search
- **Time Range Filtering**: Filter results by week/month/year
- **JSON Export**: Results saved to structured JSON files
- **Result Preview**: Displays top 3 results in terminal

## Installation

This skill is part of the Claude Code skills ecosystem.

```bash
skills/bing-search-task/
├── SKILL.md              # Skill metadata and documentation
├── README.md             # This file
├── scripts/
│   ├── main.ts          # TypeScript implementation
│   └── package.json     # Package configuration
└── TASK_GUIDE.md        # Detailed usage guide
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

3. **Browser available**
   - DHF Agent will automatically invoke browser

## Usage

### Basic Search

```bash
/bing-search-task -k "大黄蜂"
```

### Search with Page Count

```bash
/bing-search-task -k "大黄蜂" -p 3
```

### Search with Time Range

```bash
/bing-search-task -k "大黄蜂" -t "week"
```

### Combined Options

```bash
/bing-search-task -k "大黄蜂" -p 2 -t "month" -v
```

### Check Connection

```bash
/bing-search-task --check
```

## Parameters

| Parameter | Short | Required | Description |
|-----------|-------|----------|-------------|
| `--keyword` | `-k` | ✅ | Search keyword |
| `--pageCount` | `-p` | ❌ | Number of pages, default 5 |
| `--timeRange` | `-t` | ❌ | Time range (week/month/year) |
| `--verbose` | `-v` | ❌ | Verbose output |
| `--check` | `-c` | ❌ | Check DHF Agent connection |
| `--help` | `-h` | ❌ | Show help |

## Task Information

- **Task ID**: `6pylNP`
- **MCP Service**: `dhf_rpa_task`
- **Method**: `task_market_run`
- **Market**: DHF Task Market

## Execution Flow

```
1. Validate input parameters
   ↓
2. Check DHF Agent MCP service
   ↓
3. Call task (task_id: 6pylNP)
   ↓
4. Open browser automatically
   ↓
5. Execute Bing search
   ↓
6. Collect search results
   ↓
7. Save to JSON file
   ↓
8. Display result summary
```

## Output

Search results are saved to `bing-search-results/` directory:

```
bing-search-results/
└── 搜索结果-大黄蜂-2026-04-13-153045.json
```

JSON format:

```json
{
  "searchKeyword": "大黄蜂",
  "pageCount": 5,
  "timeRange": "",
  "allResults": [
    {
      "title": "Result Title",
      "url": "https://...",
      "snippet": "Description..."
    }
  ],
  "searchTime": "2026-04-13T15:30:45.123Z"
}
```

## Troubleshooting

### DHF Agent Not Running

**Problem**: MCP service unavailable

**Solution**:
```bash
/dhf-install-agent --open
```

### No Search Results

**Problem**: Empty result list

**Solution**:
- Try more general keywords
- Remove `--timeRange` parameter
- Use `-v` for detailed logs

### Task Timeout

**Problem**: Execution timeout

**Solution**:
- Reduce page count `-p`
- Check network connection
- Verify task status in DHF Agent

### Can't Find JSON File

**Problem**: Can't locate search results

**Solution**:
- Results saved in `bing-search-results/` folder at project root
- Use `-v` to display full save path

## Links

- Official Website: https://dhf.pub
- Task Market: https://dhf.pub/nl/explore
- Help Center: https://dhf.pub/en/help

## License

MIT
