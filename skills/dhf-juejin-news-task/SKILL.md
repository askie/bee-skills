# dhf-juejin-news-task

自动调用 DHF Agent **任务**，通过浏览器获取掘金热门文章和资讯。

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

**当前任务 ID：** `3gH8Ix`

## 功能特性

- ✅ 自动打开浏览器
- ✅ 访问掘金 (https://juejin.cn)
- ✅ 获取热门文章和资讯
- ✅ 提取文章标题、链接、作者、点赞数
- ✅ 支持获取不同分类内容
- ✅ 支持自定义返回数量
- ✅ 支持保存结果到文件

## 使用方式

```bash
# 基本使用（获取推荐文章）
/dhf-juejin-news-task

# 获取前端分类
/dhf-juejin-news-task --category "frontend"

# 获取后端分类
/dhf-juejin-news-task --category "backend"

# 限制返回数量
/dhf-juejin-news-task --limit 15

# 保存结果到文件
/dhf-juejin-news-task --output "./juejin-news.json"

# 显示详细输出
/dhf-juejin-news-task --verbose

# 检查 DHF Agent 连接
/dhf-juejin-news-task --check
```

## 参数说明

| 参数 | 简写 | 必填 | 说明 |
|------|------|------|------|
| `--category` | `-c` | ❌ | 文章分类 (默认: recommend) |
| `--limit` | `-n` | ❌ | 返回文章数量 (默认: 全部) |
| `--output` | `-o` | ❌ | 输出文件路径 (JSON格式) |
| `--verbose` | `-v` | ❌ | 显示详细输出 |
| `--check` | | ❌ | 检查 DHF Agent 连接状态 |

### 分类选项

| 分类代码 | 说明 |
|----------|------|
| recommend | 推荐 (默认) |
| frontend | 前端 |
| backend | 后端 |
| android | Android |
| ios | iOS |
| ai | 人工智能 |
| article | 专栏 |
| pin | 翻译 |

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
5. 调用任务 (task_id: 3gH8Ix)
   ↓
6. 自动打开浏览器
   ↓
7. 访问掘金
   ↓
8. 抓取热门文章数据
   ↓
9. 保存/返回结果
   ↓
10. 轮询执行结果
```

## MCP 服务自动启动

**重要**：此 skill 依赖于 DHF Agent 的 MCP 服务 (`dhf_rpa_task`)。

- **MCP 服务器**：`localhost:6869`
- **MCP 端点**: `/mcp`
- **服务名称**：`dhf_rpa_task`

当检测到 MCP 服务未连接时，此 skill 会**自动调用** `/dhf-install-agent --open` 来启动 DHF Agent，无需手动干预。

## 前置条件

1. ✅ **DHF Agent 已安装**
   - 检查：`/dhf-install-agent --status`
   - 如未安装会自动提示安装

2. ✅ **已安装浏览器**
   - Chrome 或 Edge 浏览器用于自动化操作

3. ✅ **网络连接正常**
   - 需要访问掘金

## 输入数据结构

任务接受以下参数：

```json
{
  "category": "recommend"
}
```

## 输出数据结构

任务返回以下格式的文章数据：

```json
{
  "success": true,
  "data": [
    {
      "title": "文章标题",
      "link": "https://juejin.cn/post/...",
      "author": "作者名称",
      "likes": 123,
      "views": 4567,
      "summary": "文章摘要"
    }
  ],
  "total": 20,
  "category": "recommend",
  "source": "掘金"
}
```

## 示例

### 示例 1：获取推荐文章

```bash
/dhf-juejin-news-task
```

### 示例 2：获取前端文章

```bash
/dhf-juejin-news-task --category "frontend"
```

### 示例 3：获取后端文章并保存

```bash
/dhf-juejin-news-task --category "backend" --output "./backend.json"
```

## 常见问题

### 问题 1：DHF Agent 未启动

**现象：** 提示 MCP 服务不可用

**解决：**
```bash
# 启动 DHF Agent
/dhf-install-agent --open
```

### 问题 2：掘金无法访问

**现象：** 任务执行失败，提示无法打开页面

**解决：**
- 检查网络连接
- 确保可以访问 juejin.cn
- 检查是否需要登录

### 问题 3：没有获取到文章

**现象：** 返回空结果

**解决：**
- 网络连接问题
- 掘金页面结构可能已更新
- 尝试不同的分类
- 重新运行任务尝试

### 问题 4：需要登录

**现象：** 提示需要登录掘金

**解决：**
- 部分内容可能需要登录才能查看
- 首次使用建议手动登录一次
- 登录状态会被浏览器保存

## 配置说明

脚本内置配置（可在脚本中修改）：
- `TASK_ID = "3gH8Ix"` - **任务 ID**
- `MCP_SERVER = { host: 'localhost', port: 6869 }` - MCP 服务器地址
- `MCP_ENDPOINT = "/mcp"` - **MCP 端点路径**
- `POLL_INTERVAL = 5000` - 轮询间隔（毫秒）
- `MAX_POLL_TIME = 300000` - 最大轮询时间（5分钟）
- `OUTPUT_FILE = "articles.json"` - **输出文件名**

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
      task_id: "3gH8Ix",
      input_data: JSON.stringify({
        initialState: {
          category: "recommend"
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
      task_id: "3gH8Ix",
      run_id: "<run_id>"
    }
  }
}
```

### 数据获取策略

1. **优先**：从 MCP 响应中获取文章数据
2. **回退**：读取任务运行目录下的 `articles.json` 文件
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
- **掘金网站：** https://juejin.cn

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 💎
