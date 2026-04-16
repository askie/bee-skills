---
name: yahoo-japan-search-task
description: 调用 DHF Agent 任务进行日本雅虎搜索。输入关键词，自动搜索并返回结果
---

# Yahoo Japan Search Task
调用 DHF Agent **任务（Task）**，在日本雅虎搜索中查找关键词并返回结果。

## ⚠️ 重要：这是任务，不是工作流

**这是任务（Task），不是工作流（Workflow）！**

| 对比项 | 任务（Task） | 工作流（Workflow） |
|--------|-------------|-------------------|
| **ID 类型** | task_id | workflow_id |
| **MCP 服务** | `dhf_rpa_task` | `dhf_rpa_workflow` |
| **调用方法** | `task_market_run` | `workflow_run` |
| **轮询方法** | `task_run_result` | `workflow_run_result` |
| **HTTP 端点** | `/http/task` | `/http/workflow` |
| **结构** | 单个自动化流程 | 多个任务节点组成的工作流 |
| **当前使用** | ✅ **使用此任务** | ❌ 不使用 |

**当前任务 ID：** `sRtiOl` （公共市场任务）
**任务名称：** 日本雅虎搜索任务

## 🚀 使用方式

### 基本调用
```bash
node skills/yahoo-japan-search-task/scripts/task_call.js "大黄蜂科技"
```

### 带参数调用
```bash
# 指定搜索页数
node skills/yahoo-japan-search-task/scripts/task_call.js "大黄蜂科技" --pageCount 3

# 详细输出
node skills/yahoo-japan-search-task/scripts/task_call.js "大黄蜂科技" -v
```

## 📥 输入参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `searchKeyword` | string | ✅ | - | 搜索关键词 |
| `pageCount` | number | ❌ | 5 | 搜索页数 |
| `currentPage` | number | ❌ | 0 | 起始页码 |

## 📤 输出结果

搜索结果会自动保存到 `yahoo-japan-search-results/` 目录：
```
yahoo-japan-search-results/
└── 搜索结果-大黄蜂科技-2026-04-13-153045.json
```

## 触发条件

当用户说以下内容时触发：
- "日本雅虎搜索 [关键词]"
- "Yahoo Japan 搜索 [关键词]"
- "用雅虎日本搜 [关键词]"

## 注意事项

1. **使用市场任务** - 必须使用 `task_market_run`
2. **DHF Agent 必须运行** - 确保端口 6869 可用
3. **关键词必填** - 必须提供搜索关键词

## 📚 相关文档

- **任务 MCP 工具：** `mcporter list dhf_rpa_task --schema`
- **使用指南：** `TASK_GUIDE.md`

---

**记住：这是公共市场任务，使用 `dhf_rpa_task.task_market_run`！** 🔍
