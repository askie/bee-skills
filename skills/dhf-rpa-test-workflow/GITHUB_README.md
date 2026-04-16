# Bee RPA Skills for Claude Code

> Bee Agent RPA 自动化技能包 - 让 Claude Code 通过 Bee Agent 实现浏览器自动化

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Bee Agent](https://img.shields.io/badge/Bee-Agent-blue)](https://dhf.pub)

## 简介

这是一系列为 Claude Code 定制的 Bee Agent RPA 自动化技能包。通过这些 skills，你可以让 Claude Code 执行各种浏览器自动化任务，包括表单填写、数据抓取、邮件发送等。

## 包含的 Skills

### 🧪 Bee RPA Test Workflow (`dhf-rpa-test-workflow`)

自动调用 Bee Agent 工作流测试 RPA 基础功能。

**功能特性：**
- ✅ 测试 Bee Agent 基础连接
- ✅ 验证浏览器插件状态
- ✅ 测试基本 RPA 操作（点击、输入、等待）
- ✅ 验证 MCP 服务可用性
- ✅ 返回详细测试结果

**使用示例：**
```bash
# 运行完整测试
/dhf-rpa-test-workflow

# 快速测试
/dhf-rpa-test-workflow --fast

# 保存测试报告
/dhf-rpa-test-workflow --output "./test-report.json"
```

## 快速开始

### 前置要求

1. **Claude Code** - 安装最新的 Claude Code
2. **Bee Agent** - 安装并运行 Bee Agent ([获取地址](https://dhf.pub))
3. **浏览器插件** - 安装 Bee Agent 浏览器插件
4. **Node.js** - 版本 >= 18.0.0

### 安装步骤

#### 方式一：从 GitHub 克隆（推荐）

```bash
# 1. 进入 Claude skills 目录
cd ~/.claude/skills

# 2. 克隆仓库
git clone https://github.com/你的用户名/bee-skills.git dhf-rpa-test-workflow

# 3. 安装依赖
cd dhf-rpa-test-workflow
npm install

# 4. 重新启动 Claude Code
```

#### 方式二：手动下载

1. 下载并解压到 `~/.claude/skills/dhf-rpa-test-workflow`
2. 进入目录并运行 `npm install`
3. 重新启动 Claude Code

### 验证安装

安装完成后，在 Claude Code 中运行：

```
/dhf-rpa-test-workflow --check
```

如果显示 Bee Agent 状态信息，说明安装成功！

## 文档

- 📖 [安装指南](INSTALL.md)
- 🚀 [发布指南](PUBLISHING.md)
- 📚 [Skill 文档](SKILL.md)

## 系统架构

```
Claude Code
    ↓
Skill (CLI)
    ↓
Bee Agent MCP
    ↓
浏览器插件
    ↓
Chrome/Edge 浏览器
```

## 工作流 ID

| Skill | Workflow ID | 描述 |
|-------|------------|------|
| dhf-rpa-test-workflow | `ok8gKP` | RPA 基础功能测试 |

## 依赖关系

```json
{
  "@modelcontextprotocol/sdk": "^1.0.4"
}
```

## 开发

### 项目结构

```
dhf-rpa-test-workflow/
├── scripts/
│   ├── cli.js          # CLI 入口
│   └── main.ts         # 主要逻辑
├── package.json        # 包配置
├── SKILL.md           # Skill 文档
├── README.md          # 项目说明
├── INSTALL.md         # 安装指南
├── PUBLISHING.md      # 发布指南
└── .gitignore         # Git 忽略配置
```

### 添加新的 Skill

1. 在仓库中创建新的 skill 目录
2. 复制并修改 `package.json`
3. 创建对应的 `SKILL.md`
4. 在根目录 README.md 中添加文档

## 故障排除

### 问题 1：Bee Agent 未启动

**现象：** 提示 MCP 服务不可用

**解决：**
```bash
# 启动 Bee Agent
/dhf-install-agent --open
```

### 问题 2：浏览器插件未连接

**现象：** 浏览器插件测试失败

**解决：**
- 打开 Chrome 或 Edge 浏览器
- 安装 Bee Bee Agent 浏览器插件
- 确保插件已启用

### 问题 3：命令不生效

**检查清单：**
- [ ] 已运行 `npm install`
- [ ] 已重启 Claude Code
- [ ] SKILL.md 文件存在且格式正确
- [ ] Skill 在正确的目录中

## 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加某个功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 路线图

- [ ] 添加更多邮件发送 skills
- [ ] 添加网页抓取 skill
- [ ] 添加表单填充 skill
- [ ] 添加数据验证 skill
- [ ] 添加定时任务 skill

## 相关资源

- **Bee 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **帮助中心：** https://dhf.pub/en/help
- **Claude Code：** https://claude.ai/code

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 作者

Bee RPA Skills

## 致谢

- [Bee Agent](https://dhf.pub) - 强大的 RPA 自动化平台
- [Claude Code](https://claude.ai/code) - Anthropic 的 AI 编程助手
- [Model Context Protocol](https://modelcontextprotocol.io) - AI 应用的开放标准

---

**注意：** 这是一个开源项目，使用时请确保遵守相关网站的服务条款。
