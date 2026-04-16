# DHF Douyin Hot Search Task

自动调用 DHF Agent 任务获取抖音热搜榜单。

## 功能

- ✅ 获取抖音实时热搜榜单
- ✅ 提取热搜词、热度值、链接
- ✅ 支持自定义返回数量
- ✅ 支持保存结果到文件

## 使用方法

```bash
# 获取热搜榜
/dhf-douyin-hot-search-task

# 限制返回 20 条
/dhf-douyin-hot-search-task --limit 20

# 保存到文件
/dhf-douyin-hot-search-task --output "./douyin-hot.json"
```

## 参数

- `--limit, -n`: 返回热搜数量
- `--output, -o`: 输出文件路径
- `--verbose, -v`: 显示详细输出
- `--check`: 检查 DHF Agent 连接

## 任务信息

- **任务 ID**: Zigru1
- **目标网站**: 抖音 (https://www.douyin.com)
- **MCP 服务**: dhf_rpa_task

## 注意事项

⚠️ 抖音热搜任务注意事项：
1. 确保网络连接正常
2. 可能需要登录抖音账号
3. 第一条热搜通常为置顶内容，热度值可能为空
