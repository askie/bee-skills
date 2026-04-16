# Bee RPA Skills

> Bee Agent RPA 自动化技能包 - 按需安装，灵活使用

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Bee Agent](https://img.shields.io/badge/Bee-Agent-blue)](https://dhf.pub)

## 简介

这是一个为 Claude Code 定制的 Bee Agent RPA 自动化技能包，采用**按需安装**设计，你可以只选择需要的技能，避免不必要的依赖和文件。

## 特性

- ✅ **按需安装** - 只安装你需要的技能
- ✅ **统一管理** - 所有技能在一个仓库中
- ✅ **交互式安装** - 友好的命令行界面
- ✅ **符号链接** - 不复制文件，节省空间
- ✅ **动态配置** - 自动生成插件配置

## 包含的技能

> 📦 **总计 31+ 个技能**，涵盖 AI 对话、搜索、邮件、新闻、热搜等多个领域

### 🤖 AI 聊天类 (5)
| 技能 | 描述 | 命令 |
|------|------|------|
| ChatGPT | OpenAI ChatGPT AI 问答 | `/chatgpt-ai-task` |
| DeepSeek | DeepSeek AI 问答 | `/deepseek-ai-task` |
| Kimi | 月之暗面 Kimi AI 问答 | `/kimi-ai-task` |
| 通义千问 | 阿里通义千问 AI 问答 | `/qwen-ai-task` |
| Gemini | Google Gemini AI 问答 | `/gemini-ai-task` |

### 🔍 搜索引擎类 (6)
| 技能 | 描述 | 命令 |
|------|------|------|
| Google 搜索 | 谷歌搜索引擎 | `/google-search-task` |
| Bing 搜索 | 微软必应搜索 | `/bing-search-task` |
| DuckDuckGo | 隐私搜索引擎 | `/duckduckgo-search-task` |
| 搜狗微信 | 微信公众号文章搜索 | `/sogou-wechat-search-task` |
| Naver | 韩国 Naver 搜索 | `/naver-search-task` |
| Yahoo 日本 | 日本 Yahoo 搜索 | `/yahoo-japan-search-task` |

### 📧 邮件类 (6)
| 技能 | 描述 | 命令 |
|------|------|------|
| 163 邮件 | 自动化发送 163 邮件 | `/dhf-163mail-task` |
| QQ 邮件 | 自动化发送 QQ 邮件 | `/dhf-qq-mail-task` |
| Outlook | 自动化发送 Outlook 邮件 | `/dhf-outlook-mail-task` |
| 163 邮件(RPA) | RPA 工作流版本 | `/dhf-rpa-163mail-task` |
| QQ 邮件(RPA) | RPA 工作流版本 | `/dhf-rpa-qq-mail-task` |
| Outlook(RPA) | RPA 工作流版本 | `/dhf-rpa-outlook-mail-task` |

### 📰 新闻资讯类 (6)
| 技能 | 描述 | 命令 |
|------|------|------|
| 163 网易新闻 | 获取 163 网易新闻 | `/dhf-163news-task` |
| 百度新闻 | 获取百度新闻资讯 | `/dhf-bing-news-task` |
| Google 新闻 | 获取 Google 新闻 | `/dhf-google-news-task` |
| 掘金新闻 | 获取掘金技术资讯 | `/dhf-juejin-news-task` |
| 腾讯新闻 | 获取腾讯新闻资讯 | `/dhf-tencent-news-task` |
| 今日头条 | 获取今日头条资讯 | `/dhf-toutiao-news-task` |

### 🔥 热搜榜单类 (4)
| 技能 | 描述 | 命令 |
|------|------|------|
| 抖音热搜 | 获取抖音热搜榜单 | `/dhf-douyin-hot-search-task` |
| Google 热搜 | 获取 Google 热搜 | `/dhf-google-hot-topics-task` |
| 微博热搜 | 获取微博热搜榜单 | `/dhf-weibo-hot-search-task` |
| 知乎热榜 | 获取知乎热榜 | `/dhf-zhihu-hot-search-task` |

### 📈 趋势分析类 (1)
| 技能 | 描述 | 命令 |
|------|------|------|
| Google 趋势 | 获取 Google 搜索趋势 | `/dhf-google-trends-task` |

### 🛠️ 工具类 (3)
| 技能 | 描述 | 命令 |
|------|------|------|
| 测试工作流 | 测试 Bee Agent 连接 | `/dhf-rpa-test-workflow` |
| 安装 Agent | 安装 Bee Agent 浏览器插件 | `/dhf-install-agent` |
| 携程行程 | 携程行程工作流 | `/ctrip-itinerary-workflow` |

## 快速开始

### 前置要求

1. **Claude Code** - 安装最新的 Claude Code
2. **Bee Agent** - 安装并运行 Bee Agent ([获取地址](https://dhf.pub))
3. **Node.js** - 版本 >= 18.0.0

### 安装方式

#### 方式 1：使用 npm（推荐）

```bash
# 全局安装（所有项目可用）
npm install -g bee-skills
dhf-rpa-install

# 或在项目中安装
npm install bee-skills
npm run install
```

#### 方式 2：从 GitHub 克隆

```bash
# 1. 克隆仓库
git clone https://github.com/askie/bee-skills.git
cd bee-skills

# 2. 安装依赖
npm install

# 3. 运行智能安装器（自动检测全局/项目级）
npm run install

# 4. 选择你要安装的技能
# 5. 重新启动 Claude Code
```

#### 安装模式说明

**全局安装**（默认）：
- 安装位置：`C:\Users\YourUser\.claude\skills`
- 所有项目都可以使用这些技能
- 使用符号链接节省空间

**项目级安装**：
- 安装位置：`项目目录\.claude\skills`
- 仅当前项目可用
- 复制文件到项目目录

**手动指定模式**：
```bash
# 强制全局安装
npm run install:global

# 强制项目级安装
npm run install:project
```

### 查看已安装技能

```bash
npm run list
```

## 使用方法

安装技能后，在 Claude Code 中使用：

```
# AI 对话
/chatgpt-ai-task -k "你好"
/deepseek-ai-task -k "帮我写代码"

# 搜索
/google-search-task -k "关键词"
/bing-search-task -k "关键词"

# 邮件
/dhf-163mail-task
/dhf-qq-mail-task

# 新闻/热搜
/dhf-163news-task
/dhf-douyin-hot-search-task
/dhf-zhihu-hot-search-task

# 工具
/dhf-rpa-test-workflow --check
```

## 命令

| 命令 | 说明 |
|------|------|
| `npm run install` | 智能安装（自动检测全局/项目级） |
| `npm run install:global` | 强制全局安装 |
| `npm run install:project` | 强制项目级安装 |
| `npm run install:interactive` | 交互式安装（旧版） |
| `npm run uninstall` | 卸载已安装的技能 |
| `npm run list` | 查看所有技能 |
| `npm run sync` | 同步已安装的技能 |

## AI 助手安装指南

如果你是 AI 助手（Claude Code、GLM 等），请阅读 **[AI-INSTALL-GUIDE.md](AI-INSTALL-GUIDE.md)** 了解正确的安装流程。

**快速命令**：
```bash
# 安装指定技能
node scripts/install-smart.js --skill=dhf-rpa-qq-mail-task

# 静默安装（用于自动化）
node scripts/install-smart.js --silent --skill=dhf-rpa-qq-mail-task,dhf-google-news-task
```

## 项目结构

```
bee-skills/
├── skills/              # 所有技能源码
│   ├── dhf-rpa-test-workflow/
│   ├── dhf-rpa-163mail-task/
│   └── ...
├── scripts/             # 安装和工具脚本
│   ├── install.js
│   ├── uninstall.js
│   ├── list.js
│   └── sync.js
├── .claude-plugin/      # 插件配置（动态生成）
│   └── marketplace.json
├── package.json
└── README.md
```

## 开发

### 添加新技能

1. 在 `skills/` 目录创建新技能目录
2. 复制技能模板文件
3. 在 `scripts/install.js` 的 `SKILLS_REGISTRY` 中注册

详细指南：[开发文档](DEVELOPMENT.md)

## 故障排除

### AI 助手没有正确安装技能

如果你让 AI 助手安装技能，但它没有正确安装到期望的位置，请：

1. **直接运行安装脚本**：
   ```bash
   cd E:\aiwork\skillsGenerate\bee-skills
   npm run install
   ```

2. **检查安装位置**：
   - 全局：`C:\Users\Administrator\.claude\skills`
   - 项目：`E:\aiwork\skillsGenerate\.claude\skills`

3. **验证 marketplace.json**：
   ```bash
   # 全局
   cat C:\Users\Administrator\.claude\plugins\marketplaces\bee-skills.json

   # 项目
   cat E:\aiwork\skillsGenerate\.claude\plugins\marketplaces\bee-skills.json
   ```

4. **告诉 AI 使用正确命令**：
   > 请运行：`cd E:\aiwork\skillsGenerate\bee-skills && npm run install`

### 安装失败

确保：
- Node.js 版本 >= 18.0.0
- 有写入 `~/.claude/skills/` 的权限
- Windows 上可能需要管理员权限

### 技能不生效

检查：
- 已运行 `npm run install`
- 已重启 Claude Code
- `~/.claude/skills/` 或 `项目\.claude\skills/` 中存在技能链接
- marketplace.json 包含正确的技能列表

## 相关资源

- **Bee 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **帮助中心：** https://dhf.pub/en/help

## 许可证

MIT License - 详见 [LICENSE](LICENSE)

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意：** 使用时请确保遵守相关网站的服务条款。
