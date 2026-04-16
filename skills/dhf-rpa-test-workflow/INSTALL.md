# 安装指南

## 方式一：从 GitHub 克隆（推荐）

```bash
# 1. 进入 Claude skills 目录
cd ~/.claude/skills

# 2. 克隆仓库
git clone https://github.com/你的用户名/bee-skills.git dhf-rpa-test-workflow

# 3. 安装依赖
cd dhf-rpa-test-workflow
npm install

# 4. 重新启动 Claude Code
# 重启后即可使用 /dhf-rpa-test-workflow 命令
```

## 方式二：手动下载

```bash
# 1. 下载并解压到 ~/.claude/skills/dhf-rpa-test-workflow
# 2. 进入目录
cd ~/.claude/skills/dhf-rpa-test-workflow

# 3. 安装依赖
npm install

# 4. 重新启动 Claude Code
```

## 方式三：通过 npm 安装（如果发布到 npm）

```bash
npm install -g @dhf-rpa/test-workflow
```

## 验证安装

安装完成后，在 Claude Code 中运行：

```
/dhf-rpa-test-workflow --check
```

如果显示 Bee Agent 状态信息，说明安装成功！

## 系统要求

- Node.js >= 18.0.0
- Bee Agent 已安装并运行
- Chrome/Edge 浏览器插件已连接

## 常见问题

### 1. 找不到 skills 目录

Windows: `C:\Users\你的用户名\.claude\skills`
Mac/Linux: `~/.claude/skills`

### 2. 命令不生效

确保：
- 已运行 `npm install`
- 已重启 Claude Code
- SKILL.md 文件存在且格式正确

### 3. Bee Agent 连接失败

检查：
- Bee Agent 是否正在运行
- MCP 服务是否在 localhost:6869
- 浏览器插件是否已连接
