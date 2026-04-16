# 必应搜索任务使用指南

## 📋 前提条件

1. ✅ DHF Agent 软件已启动（端口 6869）
2. ✅ 必应搜索任务（ID: `6pylNP`）已配置
3. ✅ 有搜索关键词

## 🚀 快速开始

### 基本使用

```bash
node skills/bing-search-task/scripts/task_call.js "大黄蜂"
```

### 带参数使用

```bash
# 搜索 3 页结果
node skills/bing-search-task/scripts/task_call.js "大黄蜂" --pageCount 3

# 搜索最近一周的结果
node skills/bing-search-task/scripts/task_call.js "大黄蜂" --timeRange "week"

# 详细输出模式
node skills/bing-search-task/scripts/task_call.js "大黄蜂" -v

# 组合使用
node skills/bing-search-task/scripts/task_call.js "大黄蜂" --pageCount 2 --timeRange "month" -v
```

## 📊 工作流程

```
┌─────────────────┐
│ 1. 接收关键词    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. 构造搜索数据  │
│    (JSON格式)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. 调用 MCP API │
│ task_market_run │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. 轮询执行结果  │
│  task_run_result│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 5. 保存到文件    │
│    + 输出摘要    │
└─────────────────┘
```

## 📥 输入参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `searchKeyword` | string | ✅ | - | 要搜索的关键词 |
| `pageCount` | number | ❌ | 5 | 要搜索的页数 |
| `currentPage` | number | ❌ | 0 | 从第几页开始 |
| `timeRange` | string | ❌ | "" | 时间范围限制 |

### 时间范围选项
- `week` - 最近一周
- `month` - 最近一个月
- `year` - 最近一年
- 留空 - 不限时间

## 📤 输出结果

### 控制台输出

```
========================================
   ✅ 搜索完成！
========================================

🔍 关键词: 大黄蜂
💾 结果已保存到: bing-search-results/搜索结果-大黄蜂-2026-04-13-153045.json

📊 搜索到 15 条结果

【前3条结果预览】

1. 大黄蜂 - 百度百科
   🔗 https://baike.baidu.com/item/大黄蜂
   📝 大黄蜂，变形金刚系列中的角色...

2. 大黄峰电视剧大全_大黄峰电视剧全集在线观看
   🔗 https://www.xxx.com
   📝 大黄蜂电视剧相关视频...

3. 大黄蜂(2018) - 豆瓣电影
   🔗 https://movie.douban.com/subject/26658878/
   📝 导演:特拉维斯·奈特...
```

### 文件保存

结果保存在 `bing-search-results/` 目录下，文件名格式：
```
搜索结果-{关键词}-{时间戳}.json
```

### JSON 格式

```json
{
  "searchKeyword": "大黄蜂",
  "searchTime": "2026-04-13T15:30:45.123Z",
  "pageCount": 5,
  "timeRange": "",
  "allResults": [
    {
      "title": "结果标题",
      "url": "https://example.com",
      "snippet": "结果摘要描述...",
      "publishDate": "2026-04-10"
    }
  ]
}
```

## ⚠️ 常见问题

### Q1: 提示 "MCP 服务不可用"

**原因：** DHF Agent 软件未启动

**解决：**
1. 启动 DHF Agent 软件
2. 确认端口 6869 可用
3. 检查服务：`mcporter list`

### Q2: 搜索没有结果

**原因：**
- 关键词太生僻
- 时间范围限制过严
- 网络问题

**解决：**
1. 尝试更通用的关键词
2. 去掉 `--timeRange` 参数
3. 使用 `-v` 查看详细日志

### Q3: 任务超时

**原因：** 搜索耗时过长（默认最多等 5 分钟）

**解决：**
1. 减少搜索页数 `--pageCount`
2. 检查网络连接
3. 查看任务是否在 DHF Agent 中卡住

### Q4: JSON 文件在哪里？

**位置：** 项目根目录下的 `bing-search-results/` 文件夹

**查看：**
```bash
# 列出所有搜索结果
ls bing-search-results/

# 查看最新结果
cat "$(ls -t bing-search-results/*.json | head -1)"
```

## 🔧 手动调用（备用）

如果脚本不可用，可以手动调用 MCP：

```bash
# 1. 准备输入数据
cat > search_input.json << EOF
{
  "searchKeyword": "大黄蜂",
  "pageCount": 5,
  "currentPage": 0,
  "timeRange": "",
  "allResults": []
}
EOF

# 2. 调用市场任务
mcporter call dhf_rpa_task.task_market_run \
  task_id="6pylNP" \
  inputs@"search_input.json"

# 3. 查询结果（如果有返回 run_id）
mcporter call dhf_rpa_task.task_run_result \
  task_id="6pylNP" \
  run_id="<run_id>"
```

## 📚 相关文档

- **Skill 说明：** `skill.md`
- **任务 MCP 工具：** `mcporter list dhf_rpa_task --schema`

## 💡 最佳实践

1. ✅ **关键词要具体** - "大黄蜂变形金刚" 比 "大黄蜂" 更精确
2. ✅ **合理设置页数** - 一般 3-5 页足够，太多会超时
3. ✅ **使用时间过滤** - 需要最新信息时加上 `--timeRange "week"`
4. ✅ **定期清理结果** - 删除旧的搜索结果文件节省空间

---

**最后更新：** 2026-04-13
