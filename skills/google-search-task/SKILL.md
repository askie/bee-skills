---
name: google-search-task
description: 调用 DHF Agent 任务进行谷歌搜索。输入关键词，浏览器自动打开执行搜索
version: 1.0.0
metadata:
  tags: [dhf, automation, search, google, task]
  categories: [automation, search]
  author: "DHF Community"
  license: MIT
  homepage: https://dhf.pub
  repository: https://dhf.pub
---

# google-search-task

自动调用 DHF Agent **任务**，在谷歌搜索中查找关键词。

## ⚠️ 重要：这是任务，不是工作流

**这是任务（Task），不是工作流（Workflow）！**

| 对比项 | 任务（Task） | 工作流（Workflow） |
|--------|-------------|-------------------|
| **ID 类型** | task_id | workflow_id |
| **MCP 服务** | `dhf_rpa_task` | `dhf_rpa_workflow` |
| **调用方法** | `task_market_run` | `workflow_market_run` |
| **结构** | 单个自动化流程 | 多个任务节点组成的工作流 |
| **当前使用** | ✅ **使用此任务** | ❌ 不使用 |

**当前任务 ID：** `jPIhen`

## 功能特性

- ✅ 验证输入参数
- ✅ 检查 DHF Agent 服务
- ✅ 调用谷歌搜索任务
- ✅ 浏览器自动打开执行搜索

## 使用方式

```bash
# 基本调用
/google-search-task -k "大黄蜂科技"

# 指定搜索页数
/google-search-task -k "大黄蜂科技" -p 3

# 指定时间范围
/google-search-task -k "大黄蜂科技" -t "week"

# 检查 DHF Agent 连接
/google-search-task --check
```

## 参数说明

| 参数 | 简写 | 必填 | 说明 |
|------|------|------|------|
| `--keyword` | `-k` | ✅ | 搜索关键词 |
| `--pageCount` | `-p` | ❌ | 搜索页数，默认 5 |
| `--timeRange` | `-t` | ❌ | 时间范围（week/month/year） |
| `--check` | `-c` | ❌ | 检查 DHF Agent 连接 |
| `--help` | `-h` | ❌ | 显示帮助 |

### 时间范围选项

- `week` - 最近一周
- `month` - 最近一个月
- `year` - 最近一年
- 留空 - 不限时间

## 执行流程

```
1. 验证输入参数
   ↓
2. 检查 DHF Agent MCP 服务
   ↓
3. 调用任务 (task_id: jPIhen)
   ↓
4. 自动打开浏览器
   ↓
5. 执行谷歌搜索
```

## 前置条件

1. ✅ **DHF Agent 已安装并运行**
   - 启动：`/dhf-install-agent --open`

2. ✅ **浏览器可用**
   - DHF Agent 会自动调用浏览器

## 输入数据结构

```json
{
  "searchKeyword": "大黄蜂科技",
  "pageCount": 5,
  "currentPage": 0,
  "timeRange": "",
  "allResults": []
}
```

## 示例

### 基本搜索
```bash
/google-search-task -k "大黄蜂科技"
```

### 搜索指定页数
```bash
/google-search-task -k "大黄蜂科技" -p 3
```

### 搜索最近一周的结果
```bash
/google-search-task -k "大黄蜂科技" -t "week"
```

### 组合使用
```bash
/google-search-task -k "大黄蜂科技" -p 2 -t "month"
```

## 常见问题

### 问题 1：DHF Agent 未启动

**现象：** 提示 MCP 服务不可用

**解决：**
```bash
/dhf-install-agent --open
```

### 问题 2：任务启动失败

**现象：** 提示任务启动失败

**解决：**
- 检查网络连接
- 确认任务 ID `jPIhen` 存在
- 查看DHF Agent 日志

## 配置说明

脚本内置配置：
- `TASK_ID = "jPIhen"` - 任务 ID
- `MCP_SERVER = { host: 'localhost', port: 6869 }` - MCP 服务器地址

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
      task_id: "jPIhen",
      input_data: JSON.stringify({
        searchKeyword: "大黄蜂科技",
        pageCount: 5,
        currentPage: 0,
        timeRange: ""
      })
    }
  }
}
```

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 🔍
