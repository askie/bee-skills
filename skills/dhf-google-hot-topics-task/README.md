# DHF Google Hot Topics Task

自动调用 DHF Agent 任务获取 Google 热门话题（Google Trends）。

## 功能

- ✅ 获取 Google 实时热门话题
- ✅ 提取话题名称、搜索量、相关查询
- ✅ 支持选择不同国家/地区
- ✅ 支持自定义返回数量
- ✅ 支持保存结果到文件

## 使用方法

```bash
# 获取热门话题（默认美国）
/dhf-google-hot-topics-task

# 指定地区
/dhf-google-hot-topics-task --country "CN"

# 限制返回 10 条
/dhf-google-hot-topics-task --limit 10

# 保存到文件
/dhf-google-hot-topics-task --output "./google-hot.json"
```

## 参数

- `--country, -c`: 国家/地区代码 (US, CN, GB, JP, etc.)
- `--limit, -n`: 返回话题数量
- `--output, -o`: 输出文件路径
- `--verbose, -v`: 显示详细输出
- `--check`: 检查 DHF Agent 连接

## 任务信息

- **任务 ID**: aTGAEx
- **目标网站**: Google Trends (https://trends.google.com)
- **MCP 服务**: dhf_rpa_task
- **MCP 端点**: /mcp

## 国家/地区代码

| 代码 | 国家/地区 |
|------|-----------|
| US | 美国 (默认) |
| CN | 中国 |
| GB | 英国 |
| JP | 日本 |
| DE | 德国 |
| FR | 法国 |
| RU | 俄罗斯 |
| BR | 巴西 |
| IN | 印度 |

## 注意事项

⚠️ Google 热门话题任务注意事项：
1. 确保网络连接正常
2. Google Trends 在中国大陆可能需要特殊网络环境
3. 不同地区的热门话题差异较大
4. 话题数据包含名称和搜索量信息
