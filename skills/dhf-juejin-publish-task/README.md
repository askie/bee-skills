# DHF 掘金文章发布任务

自动调用 DHF Agent 任务，将文章发布到掘金平台。

## 功能特性

- 🚀 **自动化发布** - 浏览器自动打开并填写文章信息
- 📝 **内容支持** - 支持直接输入或从文件读取 Markdown 内容
- 🏷️ **标签管理** - 支持添加多个标签
- 📂 **分类选择** - 支持掘金全部分类
- 💾 **草稿模式** - 可选择直接发布或保存为草稿
- 📄 **摘要设置** - 自动生成或手动设置摘要

## 快速开始

### 基本用法

```bash
# 发布简单文章
/dhf-juejin-publish-task -t "Hello World" -c "我的第一篇文章"

# 使用完整参数名
/dhf-juejin-publish-task --title "文章标题" --content "文章内容"
```

### 从文件发布

```bash
# 从 Markdown 文件读取内容
/dhf-juejin-publish-task --title "我的技术博客" --content-file "./article.md"
```

### 指定分类和标签

```bash
# 设置分类和多个标签
/dhf-juejin-publish-task \
  --title "Vue 3 入门" \
  --content "# Vue 3 入门\n\n..." \
  --category "前端" \
  --tags "Vue,JavaScript,前端"
```

### 保存草稿

```bash
# 不自动发布，保存为草稿
/dhf-juejin-publish-task \
  --title "未完成的文章" \
  --content "待补充..." \
  --autoSend "N"
```

## 参数说明

| 参数 | 简写 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `--title` | `-t` | ✅ | - | 文章标题 |
| `--content` | `-c` | ❌ | - | 文章内容 |
| `--content-file` | `-f` | ❌ | - | 从文件读取内容 |
| `--category` | `-C` | ❌ | 人工智能 | 文章分类 |
| `--tags` | `-T` | ❌ | 人工智能 | 标签（逗号分隔） |
| `--summary` | `-s` | ❌ | 自动截取 | 文章摘要 |
| `--autoSend` | `-a` | ❌ | Y | 是否自动发布 |
| `--check` | | ❌ | - | 检查连接 |
| `--help` | `-h` | ❌ | - | 显示帮助 |

## 文章分类

| 分类代码 | 分类名称 |
|----------|----------|
| 人工智能 | 人工智能 |
| 前端 | 前端开发 |
| 后端 | 后端开发 |
| Android | Android 开发 |
| iOS | iOS 开发 |
| 开发工具 | 开发工具 |
| 代码人生 | 代码人生 |
| 阅读 | 阅读 |

## 使用示例

### 示例 1：发布前端文章

```bash
/dhf-juejin-publish-task \
  --title "TypeScript 类型系统详解" \
  --content "# TypeScript 类型系统\n\nTypeScript 是 JavaScript 的超集..." \
  --category "前端" \
  --tags "TypeScript,JavaScript,前端"
```

### 示例 2：发布 AI 相关文章

```bash
/dhf-juejin-publish-task \
  --title "ChatGPT 提示词工程指南" \
  --content-file "./ai-prompts.md" \
  --category "人工智能" \
  --tags "AI,ChatGPT,提示词" \
  --summary "本文介绍 ChatGPT 提示词工程的最佳实践"
```

### 示例 3：批量发布草稿

```bash
# 创建一个脚本批量发布
for file in posts/*.md; do
  /dhf-juejin-publish-task \
    --title "$(basename $file .md)" \
    --content-file "$file" \
    --autoSend "N"
done
```

## 前置条件

### 1. 安装 DHF Agent

```bash
# 检查安装状态
/dhf-install-agent --status

# 如未安装，会提示安装
```

### 2. 启动 DHF Agent

```bash
/dhf-install-agent --open
```

### 3. 登录掘金

首次使用前需要手动登录掘金：
1. 打开浏览器访问 https://juejin.cn
2. 登录你的账号
3. 登录状态会被浏览器保存

## 工作流程

```
┌─────────────────────────────────────────────────────────┐
│  1. 验证输入参数（标题、内容）                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  2. 检查 DHF Agent MCP 服务                             │
│     如果未运行 → 提示启动                               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  3. 调用任务 (task_id: wpduOW)                          │
│     传递文章信息到任务                                   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  4. 浏览器自动打开                                       │
│     访问掘金编辑器                                       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  5. 自动填写信息                                         │
│     • 输入标题                                           │
│     • 输入内容                                           │
│     • 选择分类                                           │
│     • 添加标签                                           │
│     • 填写摘要                                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  6. 发布或保存草稿                                       │
│     根据 autoSend 参数决定                               │
└─────────────────────────────────────────────────────────┘
```

## 常见问题

### Q: 提示 MCP 服务不可用？

**A:** 确保 DHF Agent 正在运行：
```bash
/dhf-install-agent --open
```

### Q: 需要登录掘金？

**A:** 首次使用需要手动登录一次：
1. 打开浏览器访问 juejin.cn
2. 登录你的账号
3. 之后可以自动发布

### Q: 内容太长无法完整输入？

**A:** 使用 `--content-file` 参数从文件读取：
```bash
/dhf-juejin-publish-task --title "标题" --content-file "./article.md"
```

### Q: 如何保存草稿而不是直接发布？

**A:** 使用 `--autoSend "N"` 参数：
```bash
/dhf-juejin-publish-task --title "标题" --content "内容" --autoSend "N"
```

### Q: 标签如何分隔？

**A:** 使用逗号分隔多个标签：
```bash
--tags "Vue,React,JavaScript"
```

### Q: 摘要如何设置？

**A:** 可以手动指定，或自动从内容截取：
```bash
# 手动指定
--summary "这是文章摘要"

# 自动截取（默认行为）
# 不指定 --summary 参数，会自动从内容前100字符截取
```

## 技术细节

- **任务 ID**: `wpduOW`
- **MCP 服务**: `dhf_rpa_task`
- **目标 URL**: `https://juejin.cn/editor/drafts/new`
- **执行超时**: 5 分钟

## 相关链接

- [DHF 官网](https://dhf.pub)
- [任务市场](https://dhf.pub/nl/explore)
- [掘金网站](https://juejin.cn)

## 许可证

MIT License
