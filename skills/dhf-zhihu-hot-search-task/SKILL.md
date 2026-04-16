# dhf-zhihu-hot-search-task

自动调用 DHF Agent **任务**，通过浏览器获取知乎热榜。

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

**当前任务 ID：** `78q4hj`

## 功能特性

- ✅ 自动打开浏览器
- ✅ 访问知乎热榜页面
- ✅ 提取热榜标题、简介、链接
- ✅ 支持自定义返回数量
- ✅ 支持保存结果到文件

## 使用方式

```bash
# 获取热榜
/dhf-zhihu-hot-search-task

# 限制返回 20 条
/dhf-zhihu-hot-search-task --limit 20

# 保存到文件
/dhf-zhihu-hot-search-task --output "./zhihu-hot.json"

# 显示详细信息
/dhf-zhihu-hot-search-task --verbose
```

## 参数说明

| 参数 | 简写 | 必填 | 说明 |
|------|------|------|------|
| `--limit` | `-n` | ❌ | 返回热榜数量（默认：全部） |
| `--output` | `-o` | ❌ | 输出文件路径（JSON格式） |
| `--verbose` | `-v` | ❌ | 显示详细输出（包含简介） |
| `--check` | `-c` | ❌ | 检查 DHF Agent 连接 |

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
5. 调用任务 (task_id: 78q4hj)
   ↓
6. 自动打开浏览器
   ↓
7. 访问知乎热榜
   ↓
8. 提取热榜数据
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
   - 需要访问知乎

## 输入数据结构

任务无需输入参数，直接获取知乎热榜。

## 输出数据结构

任务返回以下格式的热榜数据：

```json
{
  "success": true,
  "data": [
    {
      "title": "如何看待有人通过豆包买保险...",
      "content": "有人在豆包上咨询保险，结果豆包像模像样的生成订单号...",
      "link": "https://www.zhihu.com/question/2026223211436676545"
    }
  ],
  "total": 50
}
```

**字段说明**：
- `title`: 热榜标题（必填）
- `content`: 热榜简介/描述（可能为 null）
- `link`: 知乎问题链接

## 示例

### 示例 1：基本获取

```bash
/dhf-zhihu-hot-search-task
```

### 示例 2：限制数量

```bash
/dhf-zhihu-hot-search-task --limit 10
```

### 示例 3：保存到文件

```bash
/dhf-zhihu-hot-search-task --output "./zhihu-hot.json"
```

### 示例 4：显示详细信息

```bash
/dhf-zhihu-hot-search-task --verbose
```

## 常见问题

### 问题 1：DHF Agent 未启动

**现象：** 提示 MCP 服务不可用

**解决：**
```bash
# 启动 DHF Agent
/dhf-install-agent --open
```

### 问题 2：知乎无法访问

**现象：** 任务执行失败，提示无法打开页面

**解决：**
- 检查网络连接
- 确保可以访问知乎
- 检查是否需要代理

### 问题 3：部分热榜没有简介

**现象：** 某些条目的 content 字段为空

**解决：**
- 这是正常现象，部分知乎热榜没有详细描述
- 使用 `--verbose` 参数可以看到更完整的信息

### 问题 4：热榜数据为空

**现象：** 返回空结果

**解决：**
- 等待片刻后重试
- 检查知乎网站是否可访问
- 查看浏览器是否有错误提示

## 配置说明

脚本内置配置（可在脚本中修改）：
- `TASK_ID = "78q4hj"` - **任务 ID**
- `MCP_SERVER = { host: 'localhost', port: 6869 }` - MCP 服务器地址
- `POLL_INTERVAL = 5000` - 轮询间隔（毫秒）
- `MAX_POLL_TIME = 300000` - 最大轮询时间（5分钟）
- `OUTPUT_VARIABLE = "hotlines"` - **输出变量名**
- `OUTPUT_FILE = "hotlines.json"` - **输出文件名**

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
      task_id: "78q4hj",
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
      task_id: "78q4hj",
      run_id: "<run_id>"
    }
  }
}
```

### 数据获取策略

1. **优先**：从 MCP 响应中获取热榜数据
2. **回退**：读取任务运行目录下的 `hotlines.json` 文件
3. **最终**：从 finish.md 文件中提取数据

## 数据过滤

脚本会自动过滤以下无效数据：
- 标题为空的条目
- 链接为空的条目
- 重复的条目

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **帮助中心：** https://dhf.pub/en/help
- **知乎热榜：** https://www.zhihu.com/hot

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 📊
