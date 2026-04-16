# dhf-google-trends-task

自动调用 DHF Agent **任务**，通过浏览器获取 Google 热搜趋势资讯。

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

**当前任务 ID：** `Rt7Hpy`

## 功能特性

- ✅ 自动打开浏览器
- ✅ 访问 Google Trends (热搜)
- ✅ 获取当前热门搜索趋势
- ✅ 提取相关新闻文章
- ✅ 包含标题、链接、发布时间、来源

## 使用方式

```bash
# 获取当前热搜
/dhf-google-trends-task

# 保存结果到文件
/dhf-google-trends-task --output "./trends.json"

# 显示详细输出
/dhf-google-trends-task --verbose
```

## 参数说明

| 参数 | 简写 | 必填 | 说明 |
|------|------|------|------|
| `--limit` | `-n` | ❌ | 返回新闻数量（默认: 全部） |
| `--output` | `-o` | ❌ | 输出文件路径（JSON格式） |
| `--verbose` | `-v` | ❌ | 显示详细执行信息 |

## 执行流程

```
1. 检查 DHF Agent MCP 服务
   ↓
2. [如果 MCP 未连接] 自动调用 /dhf-install-agent --open
   ↓
3. 等待 DHF Agent 启动完成（最多 30 秒）
   ↓
4. 调用任务 (task_id: Rt7Hpy)
   ↓
5. 自动打开浏览器
   ↓
6. 访问 Google Trends
   ↓
7. 获取热搜数据
   ↓
8. 提取新闻信息
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
   - 需要访问 Google Trends

## 输出数据结构

任务返回以下格式的热搜数据：

```json
{
  "success": true,
  "data": [
    {
      "title": "热搜标题",
      "link": "https://...",
      "publish_time": "3小时前 ● 媒体名称",
      "source": "媒体来源"
    }
  ],
  "timestamp": "2026-04-14T08:43:43+08:00",
  "total": 10
}
```

## 示例

### 示例 1：获取当前热搜

```bash
/dhf-google-trends-task
```

### 示例 2：保存到文件

```bash
/dhf-google-trends-task --output "./trends.json"
```

### 示例 3：显示详细输出

```bash
/dhf-google-trends-task --verbose
```

## 返回数据说明

每条热搜新闻包含以下字段：

| 字段 | 说明 |
|------|------|
| `title` | 新闻标题 |
| `link` | 新闻链接 |
| `publish_time` | 发布时间（如"3小时前 ● NBC News"） |
| `source` | 新闻来源媒体 |

## 常见问题

### 问题 1：DHF Agent 未启动

**现象：** 提示 MCP 服务不可用

**解决：**
```bash
# 启动 DHF Agent
/dhf-install-agent --open
```

### 问题 2：无法访问 Google Trends

**现象：** 任务执行失败，提示无法打开页面

**解决：**
- 检查网络连接
- 确保可以访问 Google
- 检查是否需要代理

### 问题 3：元素等待超时

**现象：** 提示等待元素超时

**解决：**
- 等待一段时间后重试
- 检查网络连接是否稳定
- Google Trends 页面可能正在更新

### 问题 4：返回空结果

**现象：** 没有获取到热搜数据

**解决：**
- 尝试重新执行
- 检查 Google Trends 是否可访问
- 可能是地区限制问题

## 配置说明

脚本内置配置（可在脚本中修改）：
- `TASK_ID = "Rt7Hpy"` - **任务 ID**
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
      task_id: "Rt7Hpy",
      input_data: JSON.stringify({
        initialState: {}
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
      task_id: "Rt7Hpy",
      run_id: "<run_id>"
    }
  }
}
```

## Google Trends 说明

**Google Trends（谷歌趋势）** 是 Google 提供的一项服务，用于显示：
- 实时搜索趋势
- 热门搜索话题
- 相关新闻文章
- 搜索量变化

此 skill 通过浏览器自动化访问 Google Trends 并提取热搜相关新闻。

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **帮助中心：** https://dhf.pub/en/help
- **Google Trends：** https://trends.google.com

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 📈
