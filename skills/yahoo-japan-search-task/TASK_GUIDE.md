# 日本雅虎搜索任务使用指南

## 📋 前提条件

1. ✅ DHF Agent 软件已启动（端口 6869）
2. ✅ 日本雅虎搜索任务（ID: `sRtiOl`）已配置
3. ✅ 有搜索关键词

## 🚀 快速开始

### 基本使用

```bash
node skills/yahoo-japan-search-task/scripts/task_call.js "大黄蜂科技"
```

### 带参数使用

```bash
# 搜索 3 页结果
node skills/yahoo-japan-search-task/scripts/task_call.js "大黄蜂科技" --pageCount 3

# 详细输出模式
node skills/yahoo-japan-search-task/scripts/task_call.js "大黄蜂科技" -v
```

## 📥 输入参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `searchKeyword` | string | ✅ | - | 要搜索的关键词 |
| `pageCount` | number | ❌ | 5 | 要搜索的页数 |
| `currentPage` | number | ❌ | 0 | 从第几页开始 |

## 📤 输出结果

### 控制台输出

```
========================================
   ✅ 搜索完成！
========================================

🔍 关键词: 大黄蜂科技
📄 搜索页数: 5
⏱️  耗时: 25 秒
💾 结果已保存到: yahoo-japan-search-results/搜索结果-大黄蜂科技-2026-04-13.json

📊 共搜索到 50 条结果

【前3条结果预览】

1. 大黄蜂科技公司 - 官网
   🔗 https://www.example.com
   📝 公司简介...

2. 大黄蜂科技产品
   🔗 https://www.example.com/products
   📝 产品详情...

3. 大黄蜂科技新闻
   🔗 https://www.example.com/news
   📝 最新资讯...
```

### 文件保存

结果保存在 `yahoo-japan-search-results/` 目录下，文件名格式：
```
搜索结果-{关键词}-{时间戳}.json
```

## ⚠️ 常见问题

### Q1: 提示 "MCP 服务不可用"

**原因：** DHF Agent 软件未启动

**解决：** 启动 DHF Agent 软件

### Q2: 搜索没有结果

**原因：** 关键词在日本雅虎中没有匹配内容

**解决：** 尝试使用日语关键词或更通用的词汇

### Q3: 结果全是日文

**原因：** 这是日本雅虎搜索，结果主要是日文内容

**解决：** 使用日语关键词搜索可获得更准确结果

## 🔧 手动调用（备用）

```bash
# 1. 准备输入数据
cat > search_input.json << EOF
{
  "searchKeyword": "大黄蜂科技",
  "pageCount": 5,
  "currentPage": 0,
  "allResults": []
}
EOF

# 2. 调用市场任务
mcporter call dhf_rpa_task.task_market_run \
  task_id="sRtiOl" \
  inputs@"search_input.json"

# 3. 查询结果
mcporter call dhf_rpa_task.task_run_result \
  task_id="<返回的本地task_id>" \
  run_id="<run_id>"
```

## 💡 最佳实践

1. ✅ **使用日语关键词** - "テクノロジー" 比中文搜索结果更多
2. ✅ **合理设置页数** - 一般 3-5 页足够
3. ✅ **注意语言差异** - 结果主要是日文内容

---

**最后更新：** 2026-04-13
