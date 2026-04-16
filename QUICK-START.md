# 快速开始 - Bee RPA Skills

## 我是这个包的发布者

是的，我是这个包的发布者（zx1998）。

## GitHub 仓库

目前还没有创建 GitHub 仓库。这个包是通过 npm 分发的，不需要 GitHub 仓库也能使用。

## 非交互式安装（推荐）

### 方法 1：直接安装指定技能

```bash
# 安装单个技能
npm install bee-skills -- --skill=dhf-rpa-test-workflow

# 安装多个技能
npm install bee-skills -- --skill=dhf-rpa-test-workflow,dhf-qq-mail-task
```

### 方法 2：使用 npx（需要安装后）

```bash
# 全局安装
npm install -g bee-skills

# 然后使用命令
bee-skills --skill=dhf-rpa-test-workflow
```

### 方法 3：克隆本地仓库（如果没有 npm）

```bash
# 如果你有本地仓库
cd E:\aiwork\skillsGenerate\bee-skills

# 安装指定技能
node cli.js --skill=dhf-rpa-test-workflow

# 或使用交互式安装
npm run install
```

## 手动安装技能

如果以上方法都不行，可以直接复制技能文件：

```bash
# 1. 全局安装位置
# 技能目录：C:\Users\<YourUser>\.claude\skills\

# 2. 复制技能（以 dhf-rpa-test-workflow 为例）
# 从：E:\aiwork\skillsGenerate\bee-skills\skills\dhf-rpa-test-workflow
# 到：C:\Users\<YourUser>\.claude\skills\dhf-rpa-test-workflow

# Windows 命令
xcopy "E:\aiwork\skillsGenerate\bee-skills\skills\dhf-rpa-test-workflow" "C:\Users\<YourUser>\.claude\skills\dhf-rpa-test-workflow\" /E /I /H /Y
```

## 可用技能列表

### 测试
- dhf-rpa-test-workflow - 测试工作流

### 邮件
- dhf-163mail-task - 163 邮件
- dhf-outlook-mail-task - Outlook 邮件
- dhf-rpa-qq-mail-task - QQ 邮件

### 新闻
- dhf-163news-task - 163 新闻
- dhf-bing-news-task - 百度新闻
- dhf-google-news-task - Google 新闻
- dhf-juejin-news-task - 掘金新闻
- dhf-tencent-news-task - 腾讯新闻
- dhf-toutiao-news-task - 今日头条

### 搜索
- dhf-douyin-hot-search-task - 抖音热搜
- dhf-google-hot-topics-task - Google 热搜
- dhf-weibo-hot-search-task - 微博热搜
- dhf-zhihu-hot-search-task - 知乎热搜

### 趋势
- dhf-google-trends-task - Google 趋势

### 工具
- dhf-install-agent - 安装 Bee Agent

## 验证安装

```bash
# 检查技能是否安装
ls C:\Users\<YourUser>\.claude\skills\

# 或在 Claude Code 中使用
/dhf-rpa-test-workflow
```

## 故障排除

1. **权限问题**：以管理员身份运行终端
2. **找不到目录**：手动创建 `.claude\skills` 目录
3. **npm install 失败**：使用 `--legacy-peer-deps` 参数

## 联系方式

- Email: social@dhf.pub
- npm: https://www.npmjs.com/package/bee-skills
