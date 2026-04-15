# DHF RPA Skills

> DHF Agent RPA 自动化技能包 - 按需安装，灵活使用

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![DHF Agent](https://img.shields.io/badge/DHF-Agent-blue)](https://dhf.pub)

## 简介

这是一个为 Claude Code 定制的 DHF Agent RPA 自动化技能包，采用**按需安装**设计，你可以只选择需要的技能，避免不必要的依赖和文件。

## 特性

- ✅ **按需安装** - 只安装你需要的技能
- ✅ **统一管理** - 所有技能在一个仓库中
- ✅ **交互式安装** - 友好的命令行界面
- ✅ **符号链接** - 不复制文件，节省空间
- ✅ **动态配置** - 自动生成插件配置

## 包含的技能

| 技能 | 描述 | 类别 |
|------|------|------|
| dhf-rpa-test-workflow | RPA 测试工作流 | 测试 |
| dhf-163mail-task | 163 邮件发送 | 邮件 |
| dhf-outlook-mail-task | Outlook 邮件发送 | 邮件 |
| dhf-qq-mail-task | QQ 邮件发送 | 邮件 |

## 快速开始

### 前置要求

1. **Claude Code** - 安装最新的 Claude Code
2. **DHF Agent** - 安装并运行 DHF Agent ([获取地址](https://dhf.pub))
3. **Node.js** - 版本 >= 18.0.0

### 安装方式

#### 方式 1：使用 npx（推荐）

```bash
npx @zx1998/dhf-rpa-installer install
```

#### 方式 2：从 GitHub 克隆

```bash
# 1. 克隆仓库
git clone https://github.com/YOUR_USERNAME/dhf-rpa-skills.git
cd dhf-rpa-skills

# 2. 安装依赖
npm install

# 3. 运行交互式安装器
npm run install

# 4. 选择你要安装的技能
# 5. 重新启动 Claude Code
```

### 查看已安装技能

```bash
npm run list
```

## 使用方法

安装技能后，在 Claude Code 中使用：

```
/dhf-rpa-test-workflow
/dhf-163mail-task
/dhf-outlook-mail-task
/dhf-qq-mail-task
```

## 命令

| 命令 | 说明 |
|------|------|
| `npm run install` | 交互式安装技能 |
| `npm run uninstall` | 卸载已安装的技能 |
| `npm run list` | 查看所有技能 |
| `npm run sync` | 同步已安装的技能 |

## 项目结构

```
dhf-rpa-skills/
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

### 安装失败

确保：
- Node.js 版本 >= 18.0.0
- 有写入 `~/.claude/skills/` 的权限
- Windows 上可能需要管理员权限

### 技能不生效

检查：
- 已运行 `npm run install`
- 已重启 Claude Code
- `~/.claude/skills/` 中存在技能链接

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **帮助中心：** https://dhf.pub/en/help

## 许可证

MIT License - 详见 [LICENSE](LICENSE)

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意：** 使用时请确保遵守相关网站的服务条款。
