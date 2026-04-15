# DHF Zhihu Hot Search Task

自动调用 DHF Agent 任务获取知乎热榜。

## 功能

- ✅ 获取知乎实时热榜
- ✅ 提取热榜标题、简介、链接
- ✅ 支持自定义返回数量
- ✅ 支持保存结果到文件

## 使用方法

```bash
# 获取热榜
/dhf-zhihu-hot-search-task

# 限制返回 20 条
/dhf-zhihu-hot-search-task --limit 20

# 保存到文件
/dhf-zhihu-hot-search-task --output "./zhihu-hot.json"
```

## 参数

- `--limit, -n`: 返回热榜数量
- `--output, -o`: 输出文件路径
- `--verbose, -v`: 显示详细输出（包含简介）
- `--check`: 检查 DHF Agent 连接

## 任务信息

- **任务 ID**: 78q4hj
- **目标网站**: 知乎 (https://www.zhihu.com)
- **MCP 服务**: dhf_rpa_task

## 注意事项

⚠️ 知乎热榜任务注意事项：
1. 确保网络连接正常
2. 部分热榜可能没有简介内容（content 为 null）
3. 知乎热榜链接为问题页面链接
