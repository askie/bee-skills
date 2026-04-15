# DHF Weibo Hot Search Task

自动调用 DHF Agent 任务获取微博热搜榜单。

## 功能

- ✅ 获取微博实时热搜榜单
- ✅ 提取排名、热搜词、热度值
- ✅ 支持自定义返回数量
- ✅ 支持保存结果到文件

## 使用方法

```bash
# 获取热搜榜
/dhf-weibo-hot-search-task

# 限制返回 20 条
/dhf-weibo-hot-search-task --limit 20

# 保存到文件
/dhf-weibo-hot-search-task --output "./weibo-hot.json"
```

## 参数

- `--limit, -n`: 返回热搜数量
- `--output, -o`: 输出文件路径
- `--verbose, -v`: 显示详细输出
- `--check`: 检查 DHF Agent 连接

## 任务信息

- **任务 ID**: QvgVOm
- **目标网站**: 微博热搜 (https://s.weibo.com/top/summary)
- **MCP 服务**: dhf_rpa_task

## 注意事项

⚠️ 微博热搜任务依赖 Chrome 浏览器，请确保：
1. Chrome 浏览器已安装
2. Chrome 可以正常启动
3. 网络连接正常
