# dhf-weibo-hot-search-task

自动调用 DHF Agent **任务**，通过浏览器获取微博热搜榜单。

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

**当前任务 ID：** `QvgVOm`

## 功能特性

- ✅ 自动打开浏览器
- ✅ 访问微博热搜 (https://s.weibo.com/top/summary)
- ✅ 获取实时热搜榜单
- ✅ 提取排名、热搜词、热度值、分类

## 使用方式

```bash
# 基本使用
/dhf-weibo-hot-search-task

# 限制返回数量
/dhf-weibo-hot-search-task --limit 20

# 保存结果到文件
/dhf-weibo-hot-search-task --output "./weibo-hot.json"

# 显示详细输出
/dhf-weibo-hot-search-task --verbose

# 检查 DHF Agent 连接
/dhf-weibo-hot-search-task --check
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
5. 调用任务 (task_id: QvgVOm)
   ↓
6. 自动打开浏览器
   ↓
7. 访问微博热搜
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
   - 需要访问微博

4. ✅ **Chrome 浏览器环境**
   - 微博热搜任务依赖 Chrome 浏览器
   - 确保 Chrome 已正确安装

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
      "rank": 1,
      "title": "热搜词或标题",
      "hot": "热度值",
      "category": "分类",
      "link": "链接"
    }
  ],
  "total": 50,
  "update_time": "更新时间"
}
```

## 示例

### 示例 1：获取热搜榜

```bash
/dhf-weibo-hot-search-task
```

### 示例 2：获取前20名

```bash
/dhf-weibo-hot-search-task --limit 20
```

### 示例 3：保存结果

```bash
/dhf-weibo-hot-search-task --output "./weibo-hot.json"
```

## 常见问题

### 问题 1：DHF Agent 未启动

**现象：** 提示 MCP 服务不可用

**解决：**
```bash
# 启动 DHF Agent
/dhf-install-agent --open
```

### 问题 2：微博热搜无法访问

**现象：** 任务执行失败，提示无法打开页面

**解决：**
- 检查网络连接
- 确保可以访问 s.weibo.com
- 检查是否需要登录微博

### 问题 3：Chrome 浏览器问题

**现象：** 提示 Chrome 相关错误

**解决：**
- 确保 Chrome 浏览器已安装
- 检查 Chrome 是否可以正常启动
- 尝试重启 Chrome 浏览器

### 问题 4：返回空结果

**现象：** 任务成功但返回 0 条热搜

**解决：**
- 可能需要登录微博账号
- 检查微博页面是否正常访问
- 重新运行任务尝试

## 配置说明

脚本内置配置（可在脚本中修改）：
- `TASK_ID = "QvgVOm"` - **任务 ID**
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
      task_id: "QvgVOm",
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
      task_id: "QvgVOm",
      run_id: "<run_id>"
    }
  }
}
```

## 微博热搜说明

微博热搜是反映当前社会热点话题的重要指标，包含：

### 热搜分类

- **热**: 全站热门话题
- **新**: 新晋热搜话题
- **文**: 娱乐类话题
- **综**: 综合类话题

### 热度计算

- 基于用户搜索量
- 考虑讨论活跃度
- 实时更新变化

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **帮助中心：** https://dhf.pub/en/help
- **微博热搜：** https://s.weibo.com/top/summary

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 🔥
