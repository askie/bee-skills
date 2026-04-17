---
name: dhf-juejin-publish-task
description: 调用 DHF Agent 任务自动发布文章到掘金平台。支持标题、内容、分类、标签、摘要配置
version: 1.0.0
metadata:
  tags: [dhf, juejin, publish, automation, article]
  categories: [automation, publishing]
  author: "DHF Community"
  license: MIT
  homepage: https://dhf.pub
  repository: https://dhf.pub
---

# dhf-juejin-publish-task

自动调用 DHF Agent **任务**，发布文章到掘金平台。

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

**当前任务 ID：** `wpduOW`

## 功能特性

- ✅ 自动打开掘金编辑器
- ✅ 自动输入文章标题和内容
- ✅ 支持选择文章分类
- ✅ 支持添加多个标签
- ✅ 支持设置文章摘要
- ✅ 支持自动发布或保存草稿
- ✅ 从文件读取文章内容

## 使用方式

```bash
# 基本发布
/dhf-juejin-publish-task --title "文章标题" --content "文章内容"

# 指定分类和标签
/dhf-juejin-publish-task --title "标题" --content "内容" --category "前端" --tags "Vue,React"

# 保存为草稿（不自动发布）
/dhf-juejin-publish-task --title "标题" --content "内容" --autoSend "N"

# 从文件读取内容
/dhf-juejin-publish-task --title "标题" --content-file "./article.md"

# 检查 DHF Agent 连接
/dhf-juejin-publish-task --check
```

## 参数说明

| 参数 | 简写 | 必填 | 说明 |
|------|------|------|------|
| `--title` | `-t` | ✅ | 文章标题 |
| `--content` | `-c` | ❌ | 文章内容（与 --content-file 二选一） |
| `--content-file` | `-f` | ❌ | 从文件读取内容 |
| `--category` | `-C` | ❌ | 文章分类（默认：人工智能） |
| `--tags` | `-T` | ❌ | 标签，逗号分隔（默认：人工智能） |
| `--summary` | `-s` | ❌ | 文章摘要 |
| `--autoSend` | `-a` | ❌ | 自动发布 Y/N（默认：Y） |
| `--check` | | ❌ | 检查 DHF Agent 连接 |
| `--help` | `-h` | ❌ | 显示帮助 |

## 分类选项

| 分类 | 说明 |
|------|------|
| 人工智能 | AI 相关 |
| 前端 | 前端开发 |
| 后端 | 后端开发 |
| Android | Android 开发 |
| iOS | iOS 开发 |
| 开发工具 | 开发工具 |
| 代码人生 | 代码人生 |
| 阅读 | 阅读 |

## 执行流程

```
1. 验证输入参数
   ↓
2. 检查 DHF Agent MCP 服务
   ↓
3. 调用任务 (task_id: wpduOW)
   ↓
4. 自动打开掘金编辑器
   ↓
5. 填写标题、内容、分类、标签
   ↓
6. 发布或保存草稿
```

## 前置条件

1. ✅ **DHF Agent 已安装并运行**
   - 检查：`/dhf-install-agent --status`
   - 启动：`/dhf-install-agent --open`

2. ✅ **已登录掘金**
   - 首次使用建议手动登录一次
   - 登录状态会被浏览器保存

3. ✅ **网络连接正常**
   - 需要访问 juejin.cn

## 输入数据结构

```json
{
  "initialState": {
    "title": "文章标题",
    "content": "文章内容",
    "category": "人工智能",
    "tags": ["人工智能"],
    "summary": "文章摘要",
    "autoSend": "Y"
  }
}
```

## 示例

### 示例 1：发布简单文章

```bash
/dhf-juejin-publish-task -t "Hello World" -c "我的第一篇文章"
```

### 示例 2：发布完整文章

```bash
/dhf-juejin-publish-task \
  --title "TypeScript 入门指南" \
  --content "# TypeScript 入门\n\n这是一篇关于 TypeScript 的文章..." \
  --category "前端" \
  --tags "TypeScript,前端,JavaScript" \
  --summary "TypeScript 是 JavaScript 的超集..."
```

### 示例 3：从文件发布

```bash
/dhf-juejin-publish-task \
  --title "我的技术博客" \
  --content-file "./posts/article.md" \
  --category "后端" \
  --tags "Go,微服务"
```

### 示例 4：保存草稿

```bash
/dhf-juejin-publish-task \
  --title "未完成的文章" \
  --content "待补充..." \
  --autoSend "N"
```

## 常见问题

### 问题 1：DHF Agent 未启动

**现象：** 提示 MCP 服务不可用

**解决：**
```bash
/dhf-install-agent --open
```

### 问题 2：需要登录掘金

**现象：** 任务执行失败，提示需要登录

**解决：**
- 手动打开浏览器访问 juejin.cn 并登录
- 登录状态会被浏览器保存
- 之后可以自动发布

### 问题 3：内容太长无法输入

**现象：** 内容没有完全输入

**解决：**
- 使用 `--content-file` 参数从文件读取
- 确保文件编码为 UTF-8

### 问题 4：标签没有正确添加

**现象：** 标签显示不正确

**解决：**
- 使用逗号分隔多个标签：`--tags "Vue,React,前端"`
- 避免使用特殊字符

## 配置说明

脚本内置配置：
- `TASK_ID = "wpduOW"` - 任务 ID
- `MCP_SERVER = { host: 'localhost', port: 6869 }` - MCP 服务器地址
- `MCP_ENDPOINT = "/mcp"` - MCP 端点路径
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
      task_id: "wpduOW",
      input_data: JSON.stringify({
        initialState: {
          title: "文章标题",
          content: "文章内容",
          category: "人工智能",
          tags: ["人工智能"],
          summary: "摘要",
          autoSend: "Y"
        }
      })
    }
  }
}
```

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **掘金网站：** https://juejin.cn

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 💎
