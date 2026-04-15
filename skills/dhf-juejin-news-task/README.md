# DHF Juejin News Task

自动调用 DHF Agent 任务获取掘金热门文章。

## 功能

- ✅ 获取掘金实时热门文章
- ✅ 提取文章标题、链接、作者、互动数据
- ✅ 支持选择不同分类
- ✅ 支持自定义返回数量
- ✅ 支持保存结果到文件

## 使用方法

```bash
# 获取推荐文章
/dhf-juejin-news-task

# 获取前端分类
/dhf-juejin-news-task --category "frontend"

# 获取后端分类
/dhf-juejin-news-task --category "backend"

# 限制返回 15 条
/dhf-juejin-news-task --limit 15

# 保存到文件
/dhf-juejin-news-task --output "./juejin.json"
```

## 参数

- `--category, -c`: 文章分类 (recommend/frontend/backend/android/ios/ai)
- `--limit, -n`: 返回文章数量
- `--output, -o`: 输出文件路径
- `--verbose, -v`: 显示详细输出
- `--check`: 检查 DHF Agent 连接

## 任务信息

- **任务 ID**: 3gH8Ix
- **目标网站**: 掘金 (https://juejin.cn)
- **MCP 服务**: dhf_rpa_task
- **MCP 端点**: /mcp

## 分类说明

| 分类 | 说明 |
|------|------|
| recommend | 推荐 (默认) |
| frontend | 前端开发 |
| backend | 后端开发 |
| android | Android 开发 |
| ios | iOS 开发 |
| ai | 人工智能 |

## 注意事项

⚠️ 掘金新闻任务注意事项：
1. 确保网络连接正常
2. 部分内容可能需要登录掘金账号
3. 不同分类的文章内容差异较大
4. 文章数据包含标题、作者、点赞数等信息
