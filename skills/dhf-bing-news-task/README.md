# DHF Bing News Task

自动调用 DHF Agent 任务获取必应（Bing）新闻资讯。

## 功能

- ✅ 获取必应新闻热门资讯
- ✅ 提取新闻标题、链接、来源、时间
- ✅ 支持自定义返回数量
- ✅ 支持保存结果到文件

## 使用方法

```bash
# 获取热门新闻
/dhf-bing-news-task

# 限制返回 10 条
/dhf-bing-news-task --limit 10

# 保存到文件
/dhf-bing-news-task --output "./news.json"
```

## 参数

- `--limit, -n`: 返回新闻数量
- `--output, -o`: 输出文件路径
- `--verbose, -v`: 显示详细输出
- `--check`: 检查 DHF Agent 连接

## 任务信息

- **任务 ID**: GGgaYq
- **目标网站**: 必应新闻 (https://www.bing.com/news)
- **MCP 服务**: dhf_rpa_task

## 注意事项

⚠️ 必应新闻在中国大陆可能受到访问限制，如遇到问题请：
1. 检查网络连接
2. 使用可访问 Bing 的网络环境
3. 或使用其他新闻源（腾讯新闻、网易新闻）
