# DHF Toutiao News Task

自动调用 DHF Agent 任务获取今日头条热门新闻。

## 功能

- ✅ 获取今日头条实时热门新闻
- ✅ 提取新闻标题、链接、时间、来源
- ✅ 支持自定义返回数量
- ✅ 支持保存结果到文件

## 使用方法

```bash
# 获取热门新闻
/dhf-toutiao-news-task

# 限制返回 10 条
/dhf-toutiao-news-task --limit 10

# 保存到文件
/dhf-toutiao-news-task --output "./news.json"
```

## 参数

- `--limit, -n`: 返回新闻数量
- `--output, -o`: 输出文件路径
- `--verbose, -v`: 显示详细输出
- `--check, -c`: 检查 DHF Agent 连接

## 任务信息

- **任务 ID**: GmURwo
- **目标网站**: 今日头条 (https://www.toutiao.com)
- **MCP 服务**: dhf_rpa_task

## 注意事项

⚠️ 今日头条热门新闻任务注意事项：
1. 确保网络连接正常
2. 首次使用可能需要登录今日头条账号
3. 新闻数据包含标题、链接、来源和时间信息
