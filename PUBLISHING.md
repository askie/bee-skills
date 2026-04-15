# npm 发布指南

本文档介绍如何将 DHF RPA Skills 发布到 npm registry。

## 前置要求

### 1. npm 账号

```bash
# 注册 npm 账号（如果没有）
# 访问 https://www.npmjs.com/signup

# 登录 npm
npm login
```

### 2. 准备包名

建议使用 scoped 包名：

```json
{
  "name": "@zx1998/dhf-rpa-installer"
}
```

或者使用组织名：

```json
{
  "name": "@dhf-rpa/skills"
}
```

### 3. 配置 package.json

确保 `package.json` 包含以下字段：

```json
{
  "name": "@zx1998/dhf-rpa-installer",
  "version": "1.0.0",
  "description": "DHF Agent RPA 自动化技能包",
  "private": false,
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/dhf-rpa-skills.git"
  },
  "keywords": ["dhf", "rpa", "automation"],
  "files": [
    "scripts/",
    "skills/",
    "README.md",
    "LICENSE"
  ]
}
```

## 发布流程

### 步骤 1：运行发布前检查

```bash
npm run prepublishOnly
```

这会检查：
- ✅ 包可发布（private: false）
- ✅ 版本号格式正确
- ✅ 必需字段完整
- ✅ 必需文件存在
- ✅ Git 状态干净
- ✅ npm 已登录

### 步骤 2：预览发布内容

```bash
npm run publish:preview
```

这会显示将要发布的内容，但不实际发布。

### 步骤 3：正式发布

```bash
npm run publish:public
```

这会将包发布到 npm registry。

## 版本管理

### 更新版本号

```bash
# 补丁版本（1.0.0 → 1.0.1）
npm run version:patch

# 次版本（1.0.0 → 1.1.0）
npm run version:minor

# 主版本（1.0.0 → 2.0.0）
npm run version:major
```

这些命令会：
1. 更新 package.json 中的版本号
2. 创建 Git 提交
3. 创建 Git 标签
4. 推送到远程仓库

### 手动版本管理

```bash
# 1. 更新版本号
npm version patch  # 或 minor, major

# 2. 提交更改
git add .
git commit -m "chore: 版本升级到 1.0.1"

# 3. 创建标签
git tag v1.0.1

# 4. 推送到远程
git push
git push --tags

# 5. 发布到 npm
npm publish --access public
```

## 发布检查清单

发布前请确认：

- [ ] `private: false` 已设置
- [ ] 版本号已更新
- [ ] CHANGELOG.md 已更新
- [ ] 所有更改已提交到 Git
- [ ] Git 标签已创建
- [ ] npm 已登录
- [ ] 运行 `npm run prepublishOnly` 无错误
- [ ] 运行 `npm run publish:preview` 确认内容

## Scoped 包发布

### 公开发布

如果你的包名使用了 scope（如 `@username/package`），需要添加 `--access public`：

```bash
npm publish --access public
```

### 设置默认访问权限

```bash
# 设置为默认公开
npm config set access public
```

## 验证发布

发布后验证：

```bash
# 查看包信息
npm view @zx1998/dhf-rpa-installer

# 查看特定版本
npm view @zx1998/dhf-rpa-installer@1.0.0

# 在浏览器中访问
# https://www.npmjs.com/package/@zx1998/dhf-rpa-installer
```

## 用户安装方式

发布后，用户可以通过以下方式安装：

### 方式 1：全局安装

```bash
npm install -g @zx1998/dhf-rpa-installer
dhf-rpa-skills install
```

### 方式 2：本地安装

```bash
npm install @zx1998/dhf-rpa-installer
npx dhf-rpa-skills install
```

### 方式 3：npx 直接使用（推荐）

```bash
npx @zx1998/dhf-rpa-installer install
```

## 更新发布

### 发布新版本

```bash
# 1. 更新代码
git pull

# 2. 更新版本
npm version patch

# 3. 运行检查
npm run prepublishOnly

# 4. 发布
npm publish --access public

# 5. 推送标签
git push --tags
```

### 撤销发布

⚠️ **注意：** 只能撤销 24 小时内发布的版本

```bash
npm unpublish @zx1998/dhf-rpa-installer@1.0.0
```

或者撤销整个包：

```bash
npm unpublish @zx1998/dhf-rpa-installer
```

## 常见问题

### Q1: 发布失败 "403 Forbidden"

**原因：** 包名已被占用

**解决方案：**
- 使用 scoped 包名：`@zx1998/dhf-rpa-installer`
- 或更换包名

### Q2: 发布失败 "402 Payment Required"

**原因：** 发布 scoped 包需要付费

**解决方案：**
```bash
npm publish --access public
```

### Q3: 如何修改已发布的版本？

**注意：** npm 不允许修改已发布的版本

**解决方案：**
1. 发布新版本
2. 或使用 `npm deprecate` 标记旧版本

```bash
npm deprecate @zx1998/dhf-rpa-installer@"<1.0.1" "此版本存在问题，请升级到 1.0.1+"
```

### Q4: 如何转移包所有权？

```bash
# 添加维护者
npm owner add username @zx1998/dhf-rpa-installer

# 移除维护者
npm owner remove username @zx1998/dhf-rpa-installer

# 查看所有者
npm owner ls @zx1998/dhf-rpa-installer
```

## npm Scripts 快速参考

```json
{
  "scripts": {
    "prepublishOnly": "node scripts/prepare.js",
    "publish:preview": "npm publish --dry-run",
    "publish:public": "npm publish --access public",
    "version:patch": "npm version patch && git push --follow-tags",
    "version:minor": "npm version minor && git push --follow-tags",
    "version:major": "npm version major && git push --follow-tags"
  }
}
```

## 自动化发布

### GitHub Actions 自动发布

创建 `.github/workflows/publish.yml`：

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Run prepublish check
        run: npm run prepublishOnly

      - name: Publish to npm
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 配置 GitHub Secrets

1. 在 GitHub 仓库设置中添加 Secret
2. Name: `NPM_TOKEN`
3. Value: 你的 npm access token

获取 npm token：
```bash
npm token create --access=public
```

## 相关资源

- [npm 发布文档](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [Semantic Versioning](https://semver.org/)
- [npm 包命名规范](https://docs.npmjs.com/cli/v8/using-npm/package-name-guidelines)
