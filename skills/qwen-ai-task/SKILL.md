---
name: qwen-ai-task
description: 调用 DHF Agent 任务进行 Qwen (通义千问) AI 搜索。输入问题，自动打开 Qwen 进行 AI 问答
version: 1.0.0
metadata:
  tags: [dhf, automation, ai, qwen, search, chat, tongyi]
  categories: [automation, ai]
  author: "DHF Community"
  license: MIT
  homepage: https://dhf.pub
  repository: https://dhf.pub
---

# qwen-ai-task

自动调用 DHF Agent **任务**，在 Qwen (通义千问) AI 上进行搜索/问答。

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

**当前任务 ID：** `RH9zxG`

## 功能特性

- ✅ 自动验证输入参数
- ✅ 检查 DHF Agent 服务
- ✅ 调用 Qwen AI 任务
- ✅ 浏览器自动打开执行 AI 问答
- ✅ 支持角色设定
- ✅ 支持输出格式要求
- ✅ 轮询执行结果（5分钟超时）
- ✅ 本地文件备用机制

## 使用方式

```bash
# 基本调用
/qwen-ai-task -k "你好"

# 带角色设定
/qwen-ai-task -k "帮我写代码" -r "你是一个资深程序员"

# 完整参数
/qwen-ai-task -k "分析这段代码" -r "代码专家" -o "markdown"

# 检查 DHF Agent 连接
/qwen-ai-task --check
```

## 参数说明

| 参数 | 简写 | 必填 | 说明 |
|------|------|------|------|
| `--input` / `--keyword` | `-i` / `-k` | ✅ | 输入内容/问题 |
| `--role` | `-r` | ❌ | AI 角色设定 |
| `--output` | `-o` | ❌ | 输出格式要求 |
| `--check` | `-c` | ❌ | 检查 DHF Agent 连接 |
| `--help` | `-h` | ❌ | 显示帮助 |

## 执行流程

```
1. 验证输入参数
   ↓
2. 检查 DHF Agent MCP 服务
   ↓
3. 调用任务 (task_id: RH9zxG)
   ↓
4. 自动打开浏览器
   ↓
5. 执行 Qwen AI 问答
   ↓
6. 轮询执行结果
   ↓
7. 显示 AI 回复
```

## 前置条件

1. ✅ **DHF Agent 已安装并运行**
   - 启动：`/dhf-install-agent --open`

2. ✅ **浏览器可用**
   - DHF Agent 会自动调用浏览器

3. ✅ **Qwen 可访问**
   - 确保 Qwen 网站可以正常访问

## 输入数据结构

```json
{
  "input_text": "你好",
  "out_text": "",
  "role_text": ""
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `input_text` | string | ✅ | 用户输入的问题/内容 |
| `out_text` | string | ❌ | 输出格式要求 |
| `role_text` | string | ❌ | AI 角色设定 |

## 示例

### 基本问答
```bash
/qwen-ai-task -k "你好"
```

### 代码相关
```bash
/qwen-ai-task -k "帮我写一个 Python 快速排序"
```

### 带角色设定
```bash
/qwen-ai-task -k "解释什么是闭包" -r "JavaScript 专家"
```

### 完整参数
```bash
/qwen-ai-task -k "写一篇关于 AI 的文章" -r "科技博主" -o "markdown"
```

## 本地备用机制

当网络轮询超时或失败时，会自动从 DHF Agent 本地数据目录读取结果：

| 平台 | 路径 |
|------|------|
| Windows | `%APPDATA%\dhf-agent\work\data\RH9zxG\run\` |
| macOS | `~/Library/Application Support/dhf-agent/work/data/RH9zxG/run/` |
| Linux | `~/.config/dhf-agent/work/data/RH9zxG/run/` |

## 配置说明

脚本内置配置：
- `TASK_ID = "RH9zxG"` - 任务 ID
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
      task_id: "RH9zxG",
      input_data: JSON.stringify({
        input_text: "你好",
        out_text: "",
        role_text: ""
      })
    }
  }
}
```

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **Qwen (通义千问)：** https://qwen.aliyun.com/

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 🤖
