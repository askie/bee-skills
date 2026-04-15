# dhf-tencent-news-task

自动调用 DHF Agent **任务**，通过浏览器获取腾讯新闻资讯。

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

**当前任务 ID：** `9B24v5`

## 功能特性

- ✅ 自动打开浏览器
- ✅ 访问腾讯新闻 (https://news.qq.com)
- ✅ 获取热门新闻资讯
- ✅ 提取新闻标题、链接、时间、来源

## 使用方式

```bash
# 基本使用
/dhf-tencent-news-task

# 限制返回数量
/dhf-tencent-news-task --limit 10

# 保存结果到文件
/dhf-tencent-news-task --output "./news.json"

# 显示详细输出
/dhf-tencent-news-task --verbose

# 检查 DHF Agent 连接
/dhf-tencent-news-task --check
```

## 参数说明

| 参数 | 简写 | 必填 | 说明 |
|------|------|------|------|
| `--limit` | `-n` | ❌ | 返回新闻数量 (默认: 全部) |
| `--output` | `-o` | ❌ | 输出文件路径 (JSON格式) |
| `--verbose` | `-v` | ❌ | 显示详细输出 |
| `--check` | | ❌ | 检查 DHF Agent 连接状态 |

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
5. 调用任务 (task_id: 9B24v5)
   ↓
6. 自动打开浏览器
   ↓
7. 访问腾讯新闻
   ↓
8. 抓取热门新闻数据
   ↓
9. 保存/返回结果
   ↓
10. 轮询执行结果
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
   - 需要访问腾讯新闻

## 输入数据结构

任务无需输入参数：

```json
{}
```

## 输出数据结构

任务返回以下格式的新闻数据：

```json
{
  "success": true,
  "data": [
    {
      "title": "新闻标题",
      "link": "https://news.qq.com/...",
      "source": "来源媒体",
      "publish_time": "1小时前"
    }
  ],
  "total": 20,
  "source": "腾讯新闻"
}
```

## 示例

### 示例 1：获取热门新闻

```bash
/dhf-tencent-news-task
```

### 示例 2：限制返回数量

```bash
/dhf-tencent-news-task --limit 10
```

### 示例 3：保存结果

```bash
/dhf-tencent-news-task --output "./tencent-news.json"
```

## 常见问题

### 问题 1：DHF Agent 未启动

**现象：** 提示 MCP 服务不可用

**解决：**
```bash
# 启动 DHF Agent
/dhf-install-agent --open
```

### 问题 2：腾讯新闻无法访问

**现象：** 任务执行失败，提示无法打开页面

**解决：**
- 检查网络连接
- 确保可以访问 news.qq.com
- 检查是否需要代理

### 问题 3：没有获取到新闻

**现象：** 返回空结果

**解决：**
- 网络连接问题
- 腾讯新闻页面结构可能已更新
- 重新运行任务尝试

## 配置说明

脚本内置配置（可在脚本中修改）：
- `TASK_ID = "9B24v5"` - **任务 ID**
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
      task_id: "9B24v5",
      input_data: JSON.stringify({})
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
      task_id: "9B24v5",
      run_id: "<run_id>"
    }
  }
}
```

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **帮助中心：** https://dhf.pub/en/help
- **腾讯新闻：** https://news.qq.com

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 📰
