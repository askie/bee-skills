# Bee RPA Skills

> 汇集 30+ 个 RPA 自动化技能，涵盖 AI 对话、搜索引擎、邮件发送、新闻资讯、内容发布、热搜榜单等常用场景。

每个技能都是独立的工作流或任务，可按需安装使用。基于 Bee Agent 执行层，支持与 Claude Code、Cursor 等 AI 工具协作。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bee Agent](https://img.shields.io/badge/Bee-Agent-blue)](https://dhf.pub)

---

## 技能速查

### 🤖 AI 对话

| 技能     | 描述                   | 命令                          |
| -------- | ---------------------- | ----------------------------- |
| ChatGPT  | OpenAI ChatGPT AI 问答 | `/chatgpt-ai-task -k "问题"`  |
| DeepSeek | DeepSeek AI 问答       | `/deepseek-ai-task -k "问题"` |
| Kimi     | 月之暗面 Kimi AI 问答  | `/kimi-ai-task -k "问题"`     |
| 通义千问 | 阿里通义千问 AI 问答   | `/qwen-ai-task -k "问题"`     |
| Gemini   | Google Gemini AI 问答  | `/gemini-ai-task -k "问题"`   |

### 🔍 搜索引擎

| 技能       | 描述               | 命令                                    |
| ---------- | ------------------ | --------------------------------------- |
| Google     | 谷歌搜索           | `/google-search-task -k "关键词"`       |
| Bing       | 微软必应搜索       | `/bing-search-task -k "关键词"`         |
| DuckDuckGo | 隐私搜索           | `/duckduckgo-search-task -k "关键词"`   |
| 搜狗微信   | 微信公众号文章搜索 | `/sogou-wechat-search-task -k "关键词"` |
| Naver      | 韩国搜索引擎       | `/naver-search-task -k "关键词"`        |
| Yahoo 日本 | 日本搜索引擎       | `/yahoo-japan-search-task -k "关键词"`  |

### 📧 邮件发送

| 技能     | 描述                    | 命令                     |
| -------- | ----------------------- | ------------------------ |
| 163 邮件 | 自动化发送 163 邮件     | `/dhf-163mail-task`      |
| QQ 邮件  | 自动化发送 QQ 邮件      | `/dhf-qq-mail-task`      |
| Outlook  | 自动化发送 Outlook 邮件 | `/dhf-outlook-mail-task` |

### 📰 新闻资讯

| 技能         | 描述              | 命令                     |
| ------------ | ----------------- | ------------------------ |
| 163 网易新闻 | 获取 163 网易新闻 | `/dhf-163news-task`      |
| 百度新闻     | 获取百度新闻资讯  | `/dhf-bing-news-task`    |
| Google 新闻  | 获取 Google 新闻  | `/dhf-google-news-task`  |
| 掘金         | 获取掘金技术资讯  | `/dhf-juejin-news-task`  |
| 腾讯新闻     | 获取腾讯新闻资讯  | `/dhf-tencent-news-task` |
| 今日头条     | 获取今日头条资讯  | `/dhf-toutiao-news-task` |

### 📝 内容发布

| 技能           | 描述                  | 命令                                                   |
| -------------- | --------------------- | ------------------------------------------------------ |
| 掘金发布       | 自动发布文章到掘金     | `/dhf-juejin-publish-task -t "标题" -c "内容"`            |
| 知乎视频发布   | 自动发布视频到知乎     | `/dhf-zhihu-video-publish-task -t "标题" -v "视频"`     |
| 小红书视频发布 | 自动发布视频到小红书   | `/dhf-xiaohongshu-video-publish-task -t "标题" -v "视频"` |
| 头条视频发布   | 自动发布视频到今日头条 | `/dhf-toutiao-video-publish-task -t "标题" -v "视频"`   |
| 微博视频发布   | 自动发布视频到微博     | `/dhf-weibo-video-publish-task -t "标题" -v "视频"`     |
| 快手视频发布   | 自动发布视频到快手     | `/dhf-kuaishou-video-publish-task -t "标题" -v "视频"` |

### 🔥 热搜榜单

| 技能        | 描述             | 命令                          |
| ----------- | ---------------- | ----------------------------- |
| 抖音热搜    | 获取抖音热搜榜单 | `/dhf-douyin-hot-search-task` |
| Google 热搜 | 获取 Google 热搜 | `/dhf-google-hot-topics-task` |
| 微博热搜    | 获取微博热搜榜单 | `/dhf-weibo-hot-search-task`  |
| 知乎热榜    | 获取知乎热榜     | `/dhf-zhihu-hot-search-task`  |

### 📈 趋势分析

| 技能        | 描述                 | 命令                                  |
| ----------- | -------------------- | ------------------------------------- |
| Google 趋势 | 获取 Google 搜索趋势 | `/dhf-google-trends-task -k "关键词"` |

### 🛠️ 工具

| 技能       | 描述                      | 命令                             |
| ---------- | ------------------------- | -------------------------------- |
| 测试工作流 | 测试 Bee Agent 连接       | `/dhf-rpa-test-workflow --check` |
| 安装 Agent | 安装 Bee Agent 浏览器插件 | `/dhf-install-agent`             |

---

## 快速开始

### 1. 前置要求

- **Bee Agent** - 技能执行依赖，从 [dhf.pub](https://dhf.pub) 获取
- **Node.js** - 版本 >= 18.0.0

### 2. 安装

**方式一：npm 全局安装（推荐）**

```bash
npm install -g @dhfpub/bee-skills
```

**方式二：从 GitHub 克隆**

```bash
git clone https://github.com/askie/bee-skills.git
cd bee-skills
npm install
npm run install
```

### 3. 使用技能

安装完成后，在 AI 工具中直接调用：

```
/chatgpt-ai-task -k "帮我写代码"
/bing-search-task -k "最新科技新闻"
/dhf-163mail-task
/dhf-douyin-hot-search-task
```

---

## 安装

### 安装命令

| 命令                      | 说明                            |
| ------------------------- | ------------------------------- |
| `npm run install`         | 智能安装（自动检测全局/项目级） |
| `npm run install:global`  | 强制全局安装                    |
| `npm run install:project` | 强制项目级安装                  |
| `npm run uninstall`       | 卸载已安装的技能                |
| `npm run list`            | 查看所有技能                    |

### 安装位置

- **全局安装**：`~/.claude/skills/` - 所有项目可用
- **项目级安装**：`项目目录/.claude/skills/` - 仅当前项目可用

---

## 常见问题

### AI 工具找不到技能？

确保已运行 `npm run install` 并重启 AI 工具。

### 技能不生效？

检查 Bee Agent 是否正在运行。

### 安装失败？

确保 Node.js 版本 >= 18.0.0，Windows 可能需要管理员权限。

---

## 相关资源

- **DHF 官网**：https://dhf.pub
- **任务市场**：https://dhf.pub/nl/explore
- **帮助中心**：https://dhf.pub/zh/help

---

## 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

**注意**：使用时请遵守相关网站的服务条款。
