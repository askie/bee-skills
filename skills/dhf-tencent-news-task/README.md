# DHF Tencent News Task

自动调用 DHF Agent 任务获取腾讯新闻资讯。

## 功能

- ✅ 获取腾讯新闻热门资讯
- ✅ 提取新闻标题、链接、来源、时间
- ✅ 支持自定义返回数量
- ✅ 支持保存结果到文件

## 使用方法

```bash
# 获取热门新闻
/dhf-tencent-news-task

# 限制返回 10 条
/dhf-tencent-news-task --limit 10

# 保存到文件
/dhf-tencent-news-task --output "./news.json"
```

## 参数

- `--limit, -n`: 返回新闻数量
- `--output, -o`: 输出文件路径
- `--verbose, -v`: 显示详细输出
- `--check`: 检查 DHF Agent 连接

## 任务信息

- **任务 ID**: 9B24v5
- **目标网站**: 腾讯新闻 (https://news.qq.com)
- **MCP 服务**: dhf_rpa_task
