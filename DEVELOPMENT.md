# 开发指南

## 添加新技能

### 1. 创建技能目录

```bash
mkdir -p skills/dhf-rpa-your-skill/scripts
cd skills/dhf-rpa-your-skill
```

### 2. 创建技能文件

创建以下文件：

```
dhf-rpa-your-skill/
├── SKILL.md          # 技能文档（必需）
├── package.json      # 技能配置（必需）
├── README.md         # 技能说明（必需）
└── scripts/
    ├── cli.js        # CLI 入口（可选）
    └── main.ts       # 主要逻辑（可选）
```

### 3. SKILL.md 模板

```markdown
---
name: dhf-rpa-your-skill
description: 你的技能描述
version: 1.0.0
author: Bee RPA Community
license: MIT
tags: [tag1, tag2, tag3]
category: 分类
dependencies: []
---

# 技能名称

## 功能描述

详细描述你的技能功能...

## 使用方法

```
/your-skill-command
```

## 参数说明

- `param1`: 参数说明
- `param2`: 参数说明

## 示例

### 示例 1

```bash
/your-skill-command --param1 value1
```

## 注意事项

- 注意事项 1
- 注意事项 2
```

### 4. package.json 模板

```json
{
  "name": "dhf-rpa-your-skill",
  "version": "1.0.0",
  "description": "你的技能描述",
  "type": "module",
  "main": "scripts/main.js",
  "bin": {
    "dhf-rpa-your": "scripts/cli.js"
  },
  "scripts": {
    "start": "node scripts/cli.js",
    "test": "node scripts/cli.js --check"
  },
  "keywords": ["dhf", "rpa", "your-keywords"],
  "author": "Bee RPA Community",
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.4"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 5. 注册技能

在 `scripts/install.js` 的 `SKILLS_REGISTRY` 中添加：

```javascript
{
  id: 'dhf-rpa-your-skill',
  name: '你的技能名称',
  description: '技能描述',
  category: '分类',
  version: '1.0.0',
  dependencies: [],
  size: '2MB',
  tags: ['tag1', 'tag2'],
  command: 'your-command'
}
```

同时在以下文件中注册：
- `scripts/uninstall.js`
- `scripts/list.js`

## 测试技能

### 本地测试

```bash
# 1. 创建符号链接
cd ~/.claude/skills
ln -s /path/to/bee-skills/skills/dhf-rpa-your-skill .

# 2. 重启 Claude Code

# 3. 测试命令
/your-skill-command
```

### 调试模式

```bash
# 直接运行脚本
cd skills/dhf-rpa-your-skill
node scripts/cli.js --help
```

## 发布技能

### 1. 更新版本

```bash
# 更新 package.json 中的版本号
npm version patch  # 或 minor, major
```

### 2. 提交更改

```bash
git add .
git commit -m "feat: 添加新技能 your-skill"
git push
```

### 3. 创建 Release

在 GitHub 上创建新的 Release。

## 代码规范

### TypeScript/JavaScript

- 使用 ES6+ 语法
- 使用 async/await
- 添加适当的错误处理
- 使用有意义的变量名

### 文档

- SKILL.md：详细的技能文档
- README.md：技能使用说明
- 代码注释：复杂逻辑需要注释

## 示例技能

查看现有技能作为参考：

- `dhf-rpa-test-workflow` - 基础测试技能
- `dhf-163mail-task` - 邮件发送技能

## 技能分类

建议的分类：

- **测试** - 测试和验证
- **邮件** - 邮件相关
- **表单** - 表单处理
- **数据** - 数据处理
- **网页** - 网页操作
- **文件** - 文件操作
- **其他** - 其他功能

## 最佳实践

### 1. 技能设计

- ✅ 单一职责：一个技能只做一件事
- ✅ 可配置：提供参数选项
- ✅ 错误处理：优雅处理错误
- ✅ 日志输出：清晰的进度提示

### 2. 用户体验

- ✅ 友好的错误提示
- ✅ 进度反馈
- ✅ 使用示例
- ✅ 参数验证

### 3. 性能

- ✅ 避免不必要的等待
- ✅ 复用已建立的连接
- ✅ 合理使用缓存

## 常见问题

### Q: 技能不显示在列表中？

A: 检查：
1. SKILL.md 格式是否正确
2. 是否在 SKILLS_REGISTRY 中注册
3. 是否创建了符号链接

### Q: 命令无法执行？

A: 检查：
1. scripts/cli.js 是否存在
2. 是否有执行权限
3. package.json 配置是否正确

### Q: 如何共享代码？

A: 将共享代码放在 `packages/` 目录：
```json
// packages/shared/package.json
{
  "name": "@dhf-rpa/shared",
  "version": "1.0.0",
  "main": "index.js"
}
```

然后在技能中引用：
```json
{
  "dependencies": {
    "@dhf-rpa/shared": "*"
  }
}
```

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 资源

- [Bee 官方文档](https://dhf.pub/help)
- [Claude Code 文档](https://github.com/anthropics/claude-code)
- [MCP 协议](https://modelcontextprotocol.io)
