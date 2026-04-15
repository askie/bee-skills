# DHF Google News Task

自动通过浏览器获取 Google 新闻资讯的 Claude Code skill。

## 功能

- 搜索 Google 新闻
- 支持多语言/地区
- 提取新闻标题、链接、来源等信息
- 支持保存结果到 JSON 文件

## 安装

此 skill 需要安装 DHF Agent：

```bash
/dhf-install-agent --install
```

## 使用

```bash
# 基本搜索
/dhf-google-news-task --query "AI技术"

# 指定语言
/dhf-google-news-task --query "AI" --lang "en-US"

# 保存结果
/dhf-google-news-task --query "AI" --output "./news.json"
```

## 参数

- `--query` / `-q`: 搜索关键词（必填）
- `--lang` / `-l`: 语言/地区代码（默认: zh-CN）
- `--limit` / `-n`: 返回数量（默认: 全部）
- `--output` / `-o`: 输出文件路径（JSON格式）

## 任务信息

- **任务 ID**: 8q8FoZ
- **MCP 服务**: dhf_rpa_task
- **访问网站**: Google News (https://news.google.com)

## 语言代码

- `zh-CN`: 简体中文（中国）
- `zh-TW`: 繁体中文（台湾）
- `ja`: 日本语
- `ko`: 韩语
- `en-US`: 英语（美国）
- `en-GB`: 英语（英国）
