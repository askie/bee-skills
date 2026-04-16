# Bee RPA Skills Installer

这是 Bee RPA Skills 的智能安装器，支持按需安装技能。

## 重要：正确安装方式

当用户要求安装 Bee RPA Skills 时，**必须使用安装脚本**，不要手动复制文件。

### 正确的安装流程

```bash
# 1. 进入安装器目录
cd E:\aiwork\skillsGenerate\bee-skills

# 2. 运行智能安装器（推荐）
npm run install

# 或者安装指定技能
node scripts/install-smart.js --skill=dhf-rpa-qq-mail-task
```

### 安装位置规则

- **全局安装**：`C:\Users\Administrator\.claude\skills`
  - 适用于所有项目
  - 使用符号链接

- **项目级安装**：`E:\aiwork\skillsGenerate\.claude\skills`
  - 仅当前项目可用
  - 复制文件

### 不要这样做

❌ 手动复制技能到随机目录
❌ 安装到 node_modules
❌ 不运行安装脚本直接复制
❌ 忽略 marketplace.json 配置

### 使用示例

**用户**: "安装 QQ 邮件技能"
```bash
cd E:\aiwork\skillsGenerate\bee-skills
node scripts/install-smart.js --skill=dhf-rpa-qq-mail-task
```

**用户**: "安装所有技能"
```bash
cd E:\aiwork\skillsGenerate\bee-skills
npm run install
```

**用户**: "全局安装"
```bash
cd E:\aiwork\skillsGenerate\bee-skills
npm run install:global
```

## 可用技能

- `dhf-rpa-test-workflow` - 测试工作流
- `dhf-163mail-task` - 163 邮件
- `dhf-outlook-mail-task` - Outlook 邮件
- `dhf-rpa-qq-mail-task` - QQ 邮件
- `dhf-163news-task` - 163 新闻
- `dhf-bing-news-task` - 百度新闻
- `dhf-google-news-task` - Google 新闻
- `dhf-juejin-news-task` - 掘金新闻
- `dhf-tencent-news-task` - 腾讯新闻
- `dhf-toutiao-news-task` - 今日头条
- `dhf-douyin-hot-search-task` - 抖音热搜
- `dhf-google-hot-topics-task` - Google 热搜
- `dhf-weibo-hot-search-task` - 微博热搜
- `dhf-zhihu-hot-search-task` - 知乎热搜
- `dhf-google-trends-task` - Google 趋势
- `dhf-install-agent` - 安装 Bee Agent

## 验证安装

```bash
# 查看已安装技能
npm run list

# 检查文件
ls C:\Users\Administrator\.claude\skills
# 或
ls E:\aiwork\skillsGenerate\.claude\skills
```

安装完成后，请告知用户重新启动 Claude Code。
