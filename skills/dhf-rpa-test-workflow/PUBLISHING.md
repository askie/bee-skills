# 发布指南

## 发布到 GitHub

### 第一步：准备仓库

```bash
# 1. 初始化 Git 仓库（如果还没有）
cd E:\aiwork\skillsGenerate\.claude\skills\dhf-rpa-test-workflow
git init

# 2. 创建 .gitignore 文件
cat > .gitignore << 'EOF'
node_modules/
*.log
.DS_Store
.env
dist/
*.tsbuildinfo
EOF

# 3. 添加文件到 Git
git add .

# 4. 创建首次提交
git commit -m "feat: 初始化 Bee RPA 测试工作流 skill"
```

### 第二步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建新仓库，命名为 `bee-skills` 或类似名称
3. **不要**初始化 README（我们已经有了）
4. 选择 Public 或 Private（Public 让其他人可以找到）

### 第三步：推送到 GitHub

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/bee-skills.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 第四步：设置仓库

在 GitHub 仓库页面添加：

1. **Repository Description**：
   ```
   Bee Agent RPA Automation Skills for Claude Code
   ```

2. **Topics**（标签）：
   - `claude-code`
   - `dhf-agent`
   - `rpa`
   - `automation`
   - `workflow`
   - `browser-automation`

3. **Repository Website**（可选）：
   ```
   https://dhf.pub
   ```

## 发布到 npm（可选）

如果你想发布到 npm registry：

```bash
# 1. 登录 npm
npm login

# 2. 发布包
npm publish --access public

# 3. 用户可以通过以下方式安装
npm install -g @dhf-rpa/test-workflow
```

## 版本管理

发布新版本时：

```bash
# 1. 更新 package.json 中的版本号
npm version patch  # 或 minor, major

# 2. 提交变更
git add .
git commit -m "chore: 版本升级到 1.0.1"

# 3. 推送到 GitHub
git push

# 4. 创建 GitHub Release
# 在 GitHub 网页上：Releases -> Create new release
```

## 添加更多 Skills

你可以将多个 skills 放在同一个仓库中：

```
bee-skills/
├── packages/
│   ├── test-workflow/     # 测试工作流
│   ├── mail-sender/       # 邮件发送
│   ├── web-scraper/       # 网页抓取
│   └── form-filler/       # 表单填充
├── README.md              # 总体说明
└── INSTALL.md             # 安装指南
```

## 推广你的 Skills

1. **在 Claude Code 文档中提交**
   - 访问 https://github.com/anthropics/claude-code
   - 提交 PR 添加到社区 skills 列表

2. **在 Bee 社区分享**
   - Bee 官方论坛
   - Bee 用户群组

3. **写博客文章**
   - 介绍你的 skills
   - 提供使用示例

4. **创建示例视频**
   - 演示如何安装和使用
   - 展示实际效果

## 许可证建议

- **MIT License**：最宽松，推荐用于开源项目
- **Apache 2.0**：提供专利保护
- **GPL**：要求衍生作品也开源

## 持续维护

- 定期更新依赖
- 修复 bug
- 添加新功能
- 回应用户 issues
- 更新文档
