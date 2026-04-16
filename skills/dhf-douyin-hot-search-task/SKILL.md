# dhf-douyin-hot-search-task

自动调用 DHF Agent **任务**，通过浏览器获取抖音热搜榜单。

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

**当前任务 ID：** `Zigru1`

## 功能特性

- ✅ 自动打开浏览器
- ✅ 访问抖音热搜 (https://www.douyin.com)
- ✅ 获取实时热搜榜单
- ✅ 提取热搜词、热度值、链接

## 使用方式

```bash
# 基本使用
/dhf-douyin-hot-search-task

# 限制返回数量
/dhf-douyin-hot-search-task --limit 20

# 保存结果到文件
/dhf-douyin-hot-search-task --output "./douyin-hot.json"

# 显示详细输出
/dhf-douyin-hot-search-task --verbose

# 检查 DHF Agent 连接
/dhf-douyin-hot-search-task --check
```

## 参数说明

| 参数 | 简写 | 必填 | 说明 |
|------|------|------|------|
| `--limit` | `-n` | ❌ | 返回热搜数量 (默认: 全部50条) |
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
5. 调用任务 (task_id: Zigru1)
   ↓
6. 自动打开浏览器
   ↓
7. 访问抖音热搜
   ↓
8. 抓取热搜榜单数据
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
   - 需要访问抖音

## 输入数据结构

任务无需输入参数：

```json
{}
```

## 输出数据结构

任务返回以下格式的热搜数据：

```json
{
  "success": true,
  "data": [
    {
      "title": "热搜词或标题",
      "heat": "热度值",
      "link": "链接路径"
    }
  ],
  "total": 50,
  "source": "抖音热搜"
}
```

## 示例

### 示例 1：获取热搜榜

```bash
/dhf-douyin-hot-search-task
```

### 示例 2：获取前20名

```bash
/dhf-douyin-hot-search-task --limit 20
```

### 示例 3：保存结果

```bash
/dhf-douyin-hot-search-task --output "./douyin-hot.json"
```

## 常见问题

### 问题 1：DHF Agent 未启动

**现象：** 提示 MCP 服务不可用

**解决：**
```bash
# 启动 DHF Agent
/dhf-install-agent --open
```

### 问题 2：抖音热搜无法访问

**现象：** 任务执行失败，提示无法打开页面

**解决：**
- 检查网络连接
- 确保可以访问 www.douyin.com
- 检查是否需要登录抖音账号

### 问题 3：返回空结果

**现象：** 任务成功但返回 0 条热搜

**解决：**
- 可能需要登录抖音账号
- 检查抖音页面是否正常访问
- 重新运行任务尝试

### 问题 4：热度值显示异常

**现象：** 某些条目的热度值显示为 null

**解决：**
- 这是正常现象，抖音热搜榜单第一条通常是置顶内容，不显示热度值
- 其他条目会正常显示热度值

## 配置说明

脚本内置配置（可在脚本中修改）：
- `TASK_ID = "Zigru1"` - **任务 ID**
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
      task_id: "Zigru1",
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
      task_id: "Zigru1",
      run_id: "<run_id>"
    }
  }
}
```

## 抖音热搜说明

抖音热搜是反映当前社会热点话题和流行趋势的重要指标，包含：

### 热度值说明

- 热度值以"万"为单位
- 表示该话题的讨论热度
- 实时更新变化
- 第一条通常为置顶内容，热度值可能为空

### 内容类型

- 娱乐八卦
- 社会热点
- 体育赛事
- 综艺节目
- 时政新闻
- 生活方式

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **帮助中心：** https://dhf.pub/en/help
- **抖音官网：** https://www.douyin.com

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 🎵
