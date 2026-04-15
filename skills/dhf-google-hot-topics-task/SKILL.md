# dhf-google-hot-topics-task

自动调用 DHF Agent **任务**，通过浏览器获取 Google 热门话题（Google Trends）。

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

**当前任务 ID：** `aTGAEx`

## 功能特性

- ✅ 自动打开浏览器
- ✅ 访问 Google Trends (https://trends.google.com)
- ✅ 获取实时热门话题
- ✅ 提取话题名称、搜索量、相关查询
- ✅ 支持选择不同地区
- ✅ 支持自定义返回数量
- ✅ 支持保存结果到文件

## 使用方式

```bash
# 基本使用（默认地区）
/dhf-google-hot-topics-task

# 指定地区（美国）
/dhf-google-hot-topics-task --country "US"

# 指定地区（中国）
/dhf-google-hot-topics-task --country "CN"

# 限制返回数量
/dhf-google-hot-topics-task --limit 10

# 保存结果到文件
/dhf-google-hot-topics-task --output "./google-hot.json"

# 显示详细输出
/dhf-google-hot-topics-task --verbose

# 检查 DHF Agent 连接
/dhf-google-hot-topics-task --check
```

## 参数说明

| 参数 | 简写 | 必填 | 说明 |
|------|------|------|------|
| `--country` | `-c` | ❌ | 国家/地区代码 (默认: US) |
| `--limit` | `-n` | ❌ | 返回话题数量 (默认: 全部) |
| `--output` | `-o` | ❌ | 输出文件路径 (JSON格式) |
| `--verbose` | `-v` | ❌ | 显示详细输出 |
| `--check` | | ❌ | 检查 DHF Agent 连接状态 |

### 国家/地区代码

| 代码 | 国家/地区 |
|------|-----------|
| US | 美国 (默认) |
| CN | 中国 |
| GB | 英国 |
| JP | 日本 |
| DE | 德国 |
| FR | 法国 |
| RU | 俄罗斯 |
| BR | 巴西 |
| IN | 印度 |
| CA | 加拿大 |

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
5. 调用任务 (task_id: aTGAEx)
   ↓
6. 自动打开浏览器
   ↓
7. 访问 Google Trends
   ↓
8. 抓取热门话题数据
   ↓
9. 保存/返回结果
   ↓
10. 轮询执行结果
```

## MCP 服务自动启动

**重要**：此 skill 依赖于 DHF Agent 的 MCP 服务 (`dhf_rpa_task`)。

- **MCP 服务器**：`localhost:6869`
- **MCP 端点**: `/mcp` (不是 `/mcp/call`)
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
   - **注意**：在中国大陆可能需要特殊网络环境

## 输入数据结构

任务接受以下参数：

```json
{
  "country": "US"  // 国家代码，默认美国
}
```

## 输出数据结构

任务返回以下格式的话题数据：

```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "topic": "话题名称",
      "search_volume": "100万+",
      "related_queries": ["相关查询1", "相关查询2"],
      "link": "https://trends.google.com/..."
    }
  ],
  "total": 20,
  "country": "US",
  "source": "Google Trends"
}
```

## 示例

### 示例 1：获取美国热门话题

```bash
/dhf-google-hot-topics-task
```

### 示例 2：获取中国热门话题

```bash
/dhf-google-hot-topics-task --country "CN"
```

### 示例 3：获取日本热门话题

```bash
/dhf-google-hot-topics-task --country "JP"
```

### 示例 4：限制数量并保存

```bash
/dhf-google-hot-topics-task --country "GB" --limit 15 --output "./google-hot.json"
```

## 常见问题

### 问题 1：DHF Agent 未启动

**现象：** 提示 MCP 服务不可用

**解决：**
```bash
# 启动 DHF Agent
/dhf-install-agent --open
```

### 问题 2：Google Trends 无法访问

**现象：** 任务执行失败，提示无法打开页面

**解决：**
- 检查网络连接
- 确保可以访问 trends.google.com
- **注意**：在中国大陆可能需要特殊网络环境访问 Google

### 问题 3：没有获取到话题

**现象：** 返回空结果

**解决：**
- 网络连接问题
- Google Trends 页面结构可能已更新
- 尝试更换地区代码
- 重新运行任务尝试

### 问题 4：数据地区不准确

**现象：** 获取的话题不是指定地区的

**解决：**
- Google 可能根据 IP 自动判断地区
- 使用 VPN 切换到目标地区后再运行任务
- 某些地区可能不可用

## 配置说明

脚本内置配置（可在脚本中修改）：
- `TASK_ID = "aTGAEx"` - **任务 ID**
- `MCP_SERVER = { host: 'localhost', port: 6869 }` - MCP 服务器地址
- `MCP_ENDPOINT = "/mcp"` - **MCP 端点路径**
- `POLL_INTERVAL = 5000` - 轮询间隔（毫秒）
- `MAX_POLL_TIME = 300000` - 最大轮询时间（5分钟）
- `OUTPUT_FILE = "hot_topics.json"` - **输出文件名**

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
      task_id: "aTGAEx",
      input_data: JSON.stringify({
        initialState: {
          country: "US"
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
      task_id: "aTGAEx",
      run_id: "<run_id>"
    }
  }
}
```

### 数据获取策略

1. **优先**：从 MCP 响应中获取话题数据
2. **回退**：读取任务运行目录下的 `hot_topics.json` 文件
3. **最终**：从 finish.md 文件中提取数据

## 数据过滤

脚本会自动过滤以下无效数据：
- 话题名称为空的条目
- 重复的条目

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **帮助中心：** https://dhf.pub/en/help
- **Google Trends：** https://trends.google.com

## 特别说明

⚠️ **网络限制提示**

Google Trends 服务在中国大陆地区可能受到访问限制。如果遇到无法访问或返回空结果的情况，请：

1. 检查网络连接
2. 尝试使用可访问 Google 的网络环境
3. 或使用其他热点源（知乎热榜、微博热搜、抖音热搜）

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 🔥
