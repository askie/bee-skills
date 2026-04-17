# 掘金文章发布任务 - 详细使用指南

## 目录

- [概述](#概述)
- [前置条件](#前置条件)
- [执行流程](#执行流程)
- [数据结构](#数据结构)
- [MCP 调用](#mcp-调用)
- [常见问题](#常见问题)

## 概述

本任务通过 DHF Agent 自动化平台，将文章发布到掘金（https://juejin.cn）。

### 任务信息

| 项目 | 值 |
|------|-----|
| 任务 ID | `wpduOW` |
| MCP 服务 | `dhf_rpa_task` |
| 目标 URL | `https://juejin.cn/editor/drafts/new` |
| 执行超时 | 5 分钟 |

### 支持的操作

- ✅ 自动打开掘金编辑器
- ✅ 输入文章标题
- ✅ 输入文章内容（支持 Markdown）
- ✅ 选择文章分类
- ✅ 添加文章标签
- ✅ 设置文章摘要
- ✅ 自动发布或保存草稿

## 前置条件

### 1. DHF Agent 安装

```bash
# 检查安装状态
/dhf-install-agent --status

# 如未安装，按提示安装
```

### 2. DHF Agent 运行

```bash
# 启动 DHF Agent
/dhf-install-agent --open

# 验证 MCP 服务
/dhf-juejin-publish-task --check
```

### 3. 掘金登录

首次使用前需要登录掘金：

1. 打开浏览器访问 https://juejin.cn
2. 点击右上角"登录"按钮
3. 使用手机号/邮箱或其他方式登录
4. 登录状态会被浏览器保存

## 执行流程

```
┌─────────────────────────────────────────────────────────────┐
│                        开始                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  1. 参数验证                                                 │
│     • 检查标题是否提供                                       │
│     • 检查内容是否提供（直接或文件）                          │
│     • 设置默认值（分类、标签、autoSend）                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. MCP 服务检查                                             │
│     • 检查 localhost:6869 是否可访问                         │
│     • 如果不可用，提示启动 DHF Agent                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. 调用任务启动 API                                         │
│     • task_market_run                                       │
│     • 传递 task_id: wpduOW                                   │
│     • 传递 initialState 数据                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. 获取 run_id                                              │
│     • 任务启动成功后返回 run_id                              │
│     • 用于后续轮询执行结果                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  5. 浏览器自动化执行                                         │
│     • DHF Agent 打开浏览器                                   │
│     • 访问掘金编辑器                                         │
│     • 自动填写表单                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  6. 轮询执行结果                                             │
│     • 每 5 秒查询一次状态                                    │
│     • 最多轮询 5 分钟                                        │
│     • 检测任务完成或失败                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  7. 返回结果                                                 │
│     • 成功：显示发布完成消息                                 │
│     • 失败：显示错误信息                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                        结束                                  │
└─────────────────────────────────────────────────────────────┘
```

## 数据结构

### 输入数据（initialState）

```json
{
  "initialState": {
    "title": "文章标题",
    "content": "文章内容，支持 Markdown",
    "category": "人工智能",
    "tags": ["人工智能", "AI"],
    "summary": "文章摘要",
    "autoSend": "Y"
  }
}
```

### 字段说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| title | string | ✅ | - | 文章标题 |
| content | string | ✅ | - | 文章内容 |
| category | string | ❌ | "人工智能" | 文章分类 |
| tags | string[] | ❌ | ["人工智能"] | 标签数组 |
| summary | string | ❌ | 自动截取 | 文章摘要 |
| autoSend | string | ❌ | "Y" | Y=发布，N=草稿 |

### 分类枚举

| 值 | 显示名称 |
|----|----------|
| 人工智能 | 人工智能 |
| 前端 | 前端 |
| 后端 | 后端 |
| Android | Android |
| iOS | iOS |
| 开发工具 | 开发工具 |
| 代码人生 | 代码人生 |
| 阅读 | 阅读 |

## MCP 调用

### 启动任务

```javascript
// HTTP POST to http://localhost:6869/mcp
{
  "jsonrpc": "2.0",
  "id": 1713312345678,
  "method": "tools/call",
  "params": {
    "name": "task_market_run",
    "arguments": {
      "task_id": "wpduOW",
      "input_data": JSON.stringify({
        "initialState": {
          "title": "我的文章标题",
          "content": "# 这是文章内容\n\n支持 Markdown 格式",
          "category": "前端",
          "tags": ["Vue", "JavaScript"],
          "summary": "这是一篇关于 Vue 的文章",
          "autoSend": "Y"
        }
      })
    }
  }
}
```

### 响应示例

```json
{
  "result": {
    "content": [
      {
        "text": "Market task triggered successfully. task_id=wpduOW, run_id=abc123-def456-ghi789. Please call task_run_result with task_id and run_id to poll for final result.",
        "type": "text"
      }
    ]
  }
}
```

### 轮询结果

```javascript
// HTTP POST to http://localhost:6869/mcp
{
  "jsonrpc": "2.0",
  "id": 1713312345679,
  "method": "tools/call",
  "params": {
    "name": "task_run_result",
    "arguments": {
      "task_id": "wpduOW",
      "run_id": "abc123-def456-ghi789"
    }
  }
}
```

### 状态值

| 状态 | 说明 |
|------|------|
| pending | 任务正在执行 |
| success | 任务执行成功 |
| failed | 任务执行失败 |

## 常见问题

### Q1: MCP 服务不可用

**问题描述：**
```
❌ DHF Agent MCP 服务不可用
```

**解决方案：**

1. 检查 DHF Agent 是否运行：
```bash
/dhf-install-agent --status
```

2. 如果未运行，启动它：
```bash
/dhf-install-agent --open
```

3. 等待服务启动完成（约 10 秒）

### Q2: 需要登录掘金

**问题描述：**
任务执行失败，浏览器提示需要登录

**解决方案：**

1. 手动打开浏览器访问 https://juejin.cn
2. 登录你的账号
3. 登录后，重新运行发布任务

### Q3: 内容输入不完整

**问题描述：**
长文章内容没有完全输入到编辑器

**解决方案：**

1. 使用 `--content-file` 参数从文件读取
2. 确保文件编码为 UTF-8
3. 文件大小建议不超过 1MB

```bash
/dhf-juejin-publish-task \
  --title "标题" \
  --content-file "./article.md"
```

### Q4: 标签未正确添加

**问题描述：**
标签显示不正确或未添加

**解决方案：**

1. 使用逗号分隔多个标签：
```bash
--tags "Vue,React,JavaScript"
```

2. 避免使用特殊字符

3. 标签名称不要太长

### Q5: 如何批量发布

**问题描述：**
需要一次发布多篇文章

**解决方案：**

创建一个批处理脚本：

```bash
#!/bin/bash
# batch-publish.sh

for file in posts/*.md; do
  title=$(basename "$file" .md)
  /dhf-juejin-publish-task \
    --title "$title" \
    --content-file "$file" \
    --autoSend "Y"
  sleep 30  # 等待 30 秒再发布下一篇
done
```

### Q6: 执行超时

**问题描述：**
任务执行超过 5 分钟未完成

**解决方案：**

1. 检查网络连接
2. 检查浏览器是否正常响应
3. 尝试减少文章内容长度
4. 先保存为草稿，手动检查后再发布

```bash
/dhf-juejin-publish-task \
  --title "标题" \
  --content "内容" \
  --autoSend "N"  # 保存为草稿
```

## 高级用法

### 使用环境变量

```bash
# 设置默认值
export JUEJIN_CATEGORY="前端"
export JUEJIN_AUTO_SEND="Y"

# 使用环境变量
/dhf-juejin-publish-task \
  --title "标题" \
  --content "内容"
```

### 与其他工具集成

```bash
# 从 AI 生成的内容发布
ai-generate --topic "Vue 3" | \
  /dhf-juejin-publish-task \
    --title "Vue 3 介绍" \
    --content-file -
```

### 配置文件

创建 `juejin.config.json`:

```json
{
  "category": "前端",
  "tags": ["JavaScript", "Vue"],
  "autoSend": "Y"
}
```

## 技术支持

- **DHF 官网**: https://dhf.pub
- **任务市场**: https://dhf.pub/nl/explore
- **帮助中心**: https://dhf.pub/en/help

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 💎
