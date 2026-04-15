# 安装指南

## 系统要求

- **Node.js** >= 18.0.0
- **DHF Agent** 已安装并运行
- **Claude Code** 最新版本
- **操作系统**：Windows / macOS / Linux

## 安装步骤

### 1. 克隆仓库

```bash
git clone https://github.com/zx1998-code/dhf-rpa-skills.git
cd dhf-rpa-skills
```

### 2. 安装依赖

```bash
npm install
```

### 3. 运行安装器

```bash
npm run install
```

### 4. 选择技能

使用方向键和空格键选择要安装的技能：

```
╔══════════════════════════════════════════════════════════════╗
║          DHF RPA Skills - 交互式安装器                      ║
║          按需选择你需要的技能                               ║
╚══════════════════════════════════════════════════════════════╝

? 选择要安装的技能 (空格选择/取消，回车确认):
❯ ◯ RPA 测试工作流       - 测试 DHF Agent 基础连接和 RPA 操作 [2MB]
  ◯ 163 邮件发送         - 自动化发送 163 邮件 [1.5MB]
  ◯ Outlook 邮件发送     - 自动化发送 Outlook 邮件 [1.5MB]
  ◯ QQ 邮件发送          - 自动化发送 QQ 邮件 [1.5MB]
```

### 5. 确认安装

```
📋 即将安装以下技能:

  • RPA 测试工作流 (2MB)
  • 163 邮件发送 (1.5MB)

  总计: 2 个技能，约 3.5MB

? 确认安装这些技能？ (Y/n)
```

### 6. 等待安装完成

```
🔧 开始安装...

  ✓ dhf-rpa-test-workflow
  ✓ dhf-rpa-163mail-task

✅ 安装完成！

📝 提示:
  1. 请重新启动 Claude Code
  2. 使用 /xxx 命令调用技能
  3. 运行 "npm run list" 查看已安装技能
```

### 7. 重启 Claude Code

完全退出并重新启动 Claude Code。

## 验证安装

在 Claude Code 中运行：

```
/dhf-rpa-test-workflow --check
```

如果显示 DHF Agent 状态信息，说明安装成功！

## 常用命令

### 查看所有技能

```bash
npm run list
```

输出示例：

```
╔══════════════════════════════════════════════════════════════╗
║          DHF RPA Skills - 技能列表                         ║
╚══════════════════════════════════════════════════════════════╝

📦 可用技能: 4 | ✅ 已安装: 2


📂 测试
──────────────────────────────────────────────────────────────

  RPA 测试工作流
    描述: 测试 DHF Agent 基础连接和 RPA 操作
    命令: /dhf-rpa-test-workflow
    状态: ✅ 已安装
    版本: 1.0.0


📂 邮件
──────────────────────────────────────────────────────────────

  163 邮件发送
    描述: 自动化发送 163 邮件
    命令: /dhf-163mail-task
    状态: ✅ 已安装
    版本: 1.0.0
```

### 卸载技能

```bash
npm run uninstall
```

### 同步技能

更新仓库后，同步已安装的技能：

```bash
npm run sync
```

## 技能目录

技能会安装到以下位置：

| 系统 | 技能目录 |
|------|----------|
| Windows | `C:\Users\zx1998\.claude\skills\` |
| macOS | `~/.claude/skills/` |
| Linux | `~/.claude/skills/` |

## 常见问题

### 1. 找不到 Claude skills 目录

**解决方案：**

手动创建目录：
```bash
# Windows
mkdir C:\Users\zx1998\.claude\skills

# macOS/Linux
mkdir -p ~/.claude/skills
```

### 2. 符号链接创建失败（Windows）

**现象：** 提示权限不足

**解决方案：**

以管理员身份运行终端：
1. 右键点击 CMD/PowerShell
2. 选择"以管理员身份运行"
3. 重新运行 `npm run install`

### 3. 命令不生效

**检查清单：**

- [ ] 已运行 `npm install`
- [ ] 已运行 `npm run install`（安装技能）
- [ ] 已重启 Claude Code
- [ ] 技能在 `~/.claude/skills/` 目录中

### 4. DHF Agent 连接失败

**检查：**

- DHF Agent 是否正在运行
- MCP 服务是否在 localhost:6869
- 浏览器插件是否已连接

## 卸载

完全卸载 DHF RPA Skills：

```bash
# 1. 卸载所有技能
npm run uninstall

# 2. 删除仓库
cd ..
rm -rf dhf-rpa-skills

# 3. 手动删除技能目录（如果有残留）
# Windows: C:\Users\zx1998\.claude\skills\
# macOS/Linux: ~/.claude/skills/
```

## 更新

更新到最新版本：

```bash
# 1. 更新仓库
cd dhf-rpa-skills
git pull

# 2. 同步已安装的技能
npm run sync

# 3. 重启 Claude Code
```

## 需要帮助？

- 查看 [README.md](README.md)
- 提交 [GitHub Issues](https://github.com/zx1998-code/dhf-rpa-skills/issues)
- 访问 [DHF 帮助中心](https://dhf.pub/en/help)
