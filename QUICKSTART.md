# 快速开始

## 三步安装 DHF RPA Skills

### 步骤 1：克隆仓库

```bash
git clone https://github.com/zx1998/dhf-rpa-skills.git
cd dhf-rpa-skills
```

### 步骤 2：环境检查

```bash
npm run setup
```

这会检查：
- ✅ Node.js 版本（需要 >= 18.0.0）
- ✅ Claude skills 目录
- ✅ 文件权限
- ✅ 依赖安装

### 步骤 3：安装技能

```bash
npm run install
```

选择你需要的技能，确认安装。

## 完成安装

安装完成后：

1. **重启 Claude Code**
2. **使用技能命令**

```
/dhf-rpa-test-workflow
/dhf-163mail-task
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run setup` | 环境检查和设置 |
| `npm run install` | 交互式安装技能 |
| `npm run list` | 查看所有技能 |
| `npm run uninstall` | 卸载技能 |
| `npm run sync` | 同步技能 |

## 视频教程

[观看 5 分钟快速安装教程](https://example.com/video)

## 需要帮助？

- 查看 [完整安装指南](INSTALL.md)
- 提交 [GitHub Issues](https://github.com/zx1998/dhf-rpa-skills/issues)
- 访问 [DHF 帮助中心](https://dhf.pub/en/help)
