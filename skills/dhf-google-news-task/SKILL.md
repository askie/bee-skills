# dhf-google-news-task

自动调用 DHF Agent **任务**，通过浏览器获取 Google 新闻资讯。

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

**当前任务 ID：** `8q8FoZ`

## 功能特性

- ✅ 自动打开浏览器
- ✅ 访问 Google News
- ✅ 搜索指定关键词的新闻
- ✅ 支持不同语言/地区版本
- ✅ 提取新闻标题、链接、时间、来源

## 使用方式

```bash
# 基本搜索
/dhf-google-news-task --query "AI技术"

# 指定语言/地区
/dhf-google-news-task --query "AI技术" --lang "zh-CN"

# 保存结果到文件
/dhf-google-news-task --query "AI" --output "./news.json"
```

## 参数说明

| 参数 | 简写 | 必填 | 说明 |
|------|------|------|------|
| `--query` | `-q` | ✅ | 搜索关键词 |
| `--lang` | `-l` | ❌ | 语言/地区代码 (默认: zh-CN) |
| `--limit` | `-n` | ❌ | 返回新闻数量 (默认: 全部) |
| `--output` | `-o` | ❌ | 输出文件路径 (JSON格式) |

### 语言/地区代码

| 代码 | 说明 |
|------|------|
| zh-CN | 简体中文（中国） |
| zh-TW | 繁体中文（台湾） |
| ja | 日本语 |
| ko | 韩语 |
| en-US | 英语（美国） |
| en-GB | 英语（英国） |

## 执行流程

```
1. 验证输入参数
   ↓
2. 检查 DHF Agent MCP 服务
   ↓
3. [如果 MCP 未连接] 自动调用 /dhf-install-agent --open
   ↓
4. 等待 DHF Agent 启动完成（最多 30 秒）
   ↓
5. 调用任务 (task_id: 8q8FoZ)
   ↓
6. 自动打开浏览器
   ↓
7. 访问 Google 新闻
   ↓
8. 搜索关键词
   ↓
9. 提取新闻数据
   ↓
10. 保存/返回结果
   ↓
11. 轮询执行结果
```

## MCP 服务自动启动

**重要**：此 skill 依赖于 DHF Agent 的 MCP 服务 (`dhf_rpa_task`)。

- **MCP 服务器**：`localhost:6869`
- **服务名称**：`dhf_rpa_task`

当检测到 MCP 服务未连接时，此 skill 会**自动调用** `/dhf-install-agent --open` 来启动 DHF Agent，无需手动干预。

## 前置条件

1. ✅ **DHF Agent 已安装**
   - 检查：`/dhf-install-agent --status`
   - 如未安装会自动提示安装

2. ✅ **已安装浏览器**
   - Chrome 或 Edge 浏览器用于自动化操作

3. ✅ **网络连接正常**
   - 需要访问 Google 新闻

## 输入数据结构

任务接受以下参数：

```json
{
  "query": "AI技术",              // 搜索关键词
  "lang": "zh-CN"                 // 语言/地区
}
```

## 输出数据结构

任务返回以下格式的新闻数据：

```json
{
  "success": true,
  "data": [
    {
      "title": "新闻标题",
      "link": "https://...",
      "source": "来源媒体",
      "time": "2小时前",
      "snippet": "新闻摘要..."
    }
  ],
  "total": 10,
  "query": "AI技术"
}
```

## 示例

### 示例 1：基本搜索

```bash
/dhf-google-news-task --query "人工智能"
```

### 示例 2：英文新闻

```bash
/dhf-google-news-task --query "ChatGPT" --lang "en-US"
```

### 示例 3：保存结果

```bash
/dhf-google-news-task --query "AI" --output "./news.json"
```

## 常见问题

### 问题 1：DHF Agent 未启动

**现象：** 提示 MCP 服务不可用

**解决：**
```bash
# 启动 DHF Agent
/dhf-install-agent --open
```

### 问题 2：Google 新闻无法访问

**现象：** 任务执行失败，提示无法打开页面

**解决：**
- 检查网络连接
- 确保可以访问 Google
- 检查是否需要代理

### 问题 3：没有找到相关新闻

**现象：** 返回空结果

**解决：**
- 尝试更换关键词
- 尝试不同的语言/地区

## 配置说明

脚本内置配置（可在脚本中修改）：
- `TASK_ID = "8q8FoZ"` - **任务 ID**
- `MCP_SERVER = { host: 'localhost', port: 6869 }` - MCP 服务器地址
- `POLL_INTERVAL = 5000` - 轮询间隔（毫秒）
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
      task_id: "8q8FoZ",
      input_data: JSON.stringify({
        initialState: {
          query: "搜索关键词",
          lang: "zh-CN"
        }
      })
    }
  }
}
```

### 轮询执行结果

```javascript
{
  jsonrpc: "2.0",
  id: Date.now(),
  method: "tools/call",
  params: {
    name: "task_run_result",
    arguments: {
      task_id: "8q8FoZ",
      run_id: "<run_id>"
    }
  }
}
```

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **帮助中心：** https://dhf.pub/en/help
- **Google 新闻：** https://news.google.com

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 📰
