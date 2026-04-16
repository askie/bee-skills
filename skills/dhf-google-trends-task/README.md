# DHF Google Trends Task

自动通过浏览器获取 Google 热搜趋势资讯的 Claude Code skill。

## 功能

- 获取 Google Trends 实时热搜
- 提取相关新闻文章
- 包含标题、链接、发布时间、来源
- 支持保存结果到 JSON 文件

## 安装

此 skill 需要安装 DHF Agent：

```bash
/dhf-install-agent --install
```

## 使用

```bash
# 获取当前热搜
/dhf-google-trends-task

# 保存结果
/dhf-google-trends-task --output "./trends.json"

# 详细输出
/dhf-google-trends-task --verbose
```

## 参数

- `--limit` / `-n`: 返回数量（默认: 全部）
- `--output` / `-o`: 输出文件路径（JSON格式）
- `--verbose` / `-v`: 显示详细执行信息

## 任务信息

- **任务 ID**: Rt7Hpy
- **MCP 服务**: dhf_rpa_task
- **访问网站**: Google Trends (https://trends.google.com)

## 输出示例

```
════════════════════════════════════════════════════════════
  Google 热搜趋势
════════════════════════════════════════════════════════════
  找到 6 条热搜新闻
════════════════════════════════════════════════════════════

1. 新闻标题
   链接: https://...
   来源: 媒体名称 | 时间: 3小时前
```
