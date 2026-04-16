---
name: duckduckgo-search-task
description: 调用 DHF Agent 任务进行 DuckDuckGo 搜索。输入关键词，浏览器自动打开执行搜索
version: 1.0.0
metadata:
  tags: [dhf, automation, search, duckduckgo, task]
  categories: [automation, search]
  author: "DHF Community"
  license: MIT
  homepage: https://dhf.pub
  repository: https://dhf.pub
---

# duckduckgo-search-task

自动调用 DHF Agent **任务**，在 DuckDuckGo 搜索中查找关键词。

## ⚠️ 重要：这是任务，不是工作流

**这是任务（Task），不是工作流（Workflow）！**

| 对比项 | 任务（Task） | 工作流（Workflow） |
|--------|-------------|-------------------|
| **ID 类型** | task_id | workflow_id |
| **MCP 服务** | `dhf_rpa_task` | `dhf_rpa_workflow` |
| **调用方法** | `task_market_run` | `workflow_market_run` |
| **轮询方法** | `task_run_result` | `workflow_run_result` |
| **结构** | 单个自动化流程 | 多个任务节点组成的工作流 |
| **当前使用** | ✅ **使用此任务** | ❌ 不使用 |

**当前任务 ID：** `y8iZde`

## 功能特性

- ✅ 自动验证输入参数
- ✅ 检查 DHF Agent 服务
- ✅ 调用 DuckDuckGo 搜索任务
- ✅ 浏览器自动打开执行搜索
- ✅ 轮询执行结果（5分钟超时）
- ✅ 本地文件备用机制
- ✅ 显示搜索进度和结果

## 使用方式

```bash
# 基本调用
/duckduckgo-search-task -k "大黄蜂科技"

# 指定搜索页数
/duckduckgo-search-task -k "大黄蜂科技" -p 3

# 检查 DHF Agent 连接
/duckduckgo-search-task --check
```

## 参数说明

| 参数 | 简写 | 必填 | 说明 |
|------|------|------|------|
| `--keyword` | `-k` | ✅ | 搜索关键词 |
| `--pageCount` | `-p` | ❌ | 搜索页数，默认 5 |
| `--check` | `-c` | ❌ | 检查 DHF Agent 连接 |
| `--help` | `-h` | ❌ | 显示帮助 |

## 执行流程

```
1. 验证输入参数
   ↓
2. 检查 DHF Agent MCP 服务
   ↓
3. 调用任务 (task_id: y8iZde)
   ↓
4. 自动打开浏览器
   ↓
5. 执行 DuckDuckGo 搜索
   ↓
6. 轮询执行结果
   ↓
7. 显示搜索结果
```

## 前置条件

1. ✅ **DHF Agent 已安装并运行**
   - 启动：`/dhf-install-agent --open`

2. ✅ **浏览器可用**
   - DHF Agent 会自动调用浏览器

## 输入数据结构

```json
{
  "searchKeyword": "大黄蜂",
  "pageCount": 5,
  "currentPage": 0,
  "allResults": []
}
```

## 示例

### 基本搜索
```bash
/duckduckgo-search-task -k "大黄蜂科技"
```

### 搜索指定页数
```bash
/duckduckgo-search-task -k "大黄蜂科技" -p 3
```

## 本地备用机制

当网络轮询超时或失败时，会自动从 DHF Agent 本地数据目录读取结果：

| 平台 | 路径 |
|------|------|
| Windows | `%APPDATA%\dhf-agent\work\data\y8iZde\run\` |
| macOS | `~/Library/Application Support/dhf-agent/work/data/y8iZde/run/` |
| Linux | `~/.config/dhf-agent/work/data/y8iZde/run/` |

## 配置说明

脚本内置配置：
- `TASK_ID = "y8iZde"` - 任务 ID
- `MCP_SERVER = { host: 'localhost', port: 6869 }` - MCP 服务器地址
- `POLL_INTERVAL = 5000` - 轮询间隔（5秒）
- `MAX_POLL_TIME = 300000` - 最大轮询时间（5分钟）

## 技术细节

### MCP 调用方式

```javascript
{
  jsonrpc: "2.0",
  id: Date.now(),
  method: "tools/call",
  params: {
    name: "task_market_run",
    arguments: {
      task_id: "y8iZde",
      input_data: JSON.stringify({
        searchKeyword: "大黄蜂",
        pageCount: 5,
        currentPage: 0,
        allResults: []
      })
    }
  }
}
```

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **帮助中心：** https://dhf.pub/en/help

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 🔍
