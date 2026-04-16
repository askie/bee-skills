# 谷歌搜索任务使用指南

## 📋 前提条件

1. ✅ DHF Agent 软件已启动（端口 6869）
2. ✅ 谷歌搜索任务（ID: `jPIhen`）已配置
3. ✅ 有搜索关键词

## 🚀 快速开始

### 基本使用

```bash
node skills/google-search-task/scripts/task_call.js "大黄蜂科技"
```

### 带参数使用

```bash
# 搜索 3 页结果
node skills/google-search-task/scripts/task_call.js "大黄蜂科技" --pageCount 3

# 搜索最近一周的结果
node skills/google-search-task/scripts/task_call.js "大黄蜂科技" --timeRange "w"

# 详细输出模式
node skills/google-search-task/scripts/task_call.js "大黄蜂科技" -v
```

## 📊 时间范围参数

| 值 | 说明 |
|----|-----|
| `w` | 最近一周 |
| `m` | 最近一个月 |
| `y` | 最近一年 |
| 留空 | 不限时间 |

## 📥 输入参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `searchKeyword` | string | ✅ | - | 要搜索的关键词 |
| `pageCount` | number | ❌ | 5 | 要搜索的页数 |
| `currentPage` | number | ❌ | 0 | 从第几页开始 |
| `timeRange` | string | ❌ | "" | 时间范围 (w/m/y) |

## 📤 输出结果

### 控制台输出

```
========================================
   ✅ 搜索完成！
========================================

🔍 关键词: 大黄蜂科技
📄 搜索页数: 5
⏱️  耗时: 35 秒
💾 结果已保存到: google-search-results/搜索结果-大黄蜂科技-2026-04-13.json

📊 共搜索到 50 条结果

【前3条结果预览】

1. 大黄蜂科技 - 官网
   🔗 https://www.example.com
   📝 大黄蜂科技公司简介...

2. 大黄蜂科技产品介绍
   🔗 https://www.example.com/products
   📝 产品详情...

3. 大黄蜂科技新闻
   🔗 https://www.example.com/news
   📝 最新资讯...
```

### 文件保存

结果保存在 `google-search-results/` 目录下，文件名格式：
```
搜索结果-{关键词}-{时间戳}.json
```

## ⚠️ 常见问题

### Q1: 提示 "MCP 服务不可用"

**原因：** DHF Agent 软件未启动

**解决：**
1. 启动 DHF Agent 软件
2. 确认端口 6869 可用

### Q2: 搜索没有结果

**原因：**
- 关键词太生僻
- 时间范围限制过严
- 网络问题

**解决：**
1. 尝试更通用的关键词
2. 去掉 `--timeRange` 参数
3. 使用 `-v` 查看详细日志

### Q3: 时间范围参数无效

**原因：** 参数值不正确

**解决：** 使用正确的值
- `w` - 周
- `m` - 月
- `y` - 年

## 🔧 手动调用（备用）

如果脚本不可用，可以手动调用 MCP：

```bash
# 1. 准备输入数据
cat > search_input.json << EOF
{
  "searchKeyword": "大黄蜂科技",
  "pageCount": 5,
  "currentPage": 0,
  "timeRange": "w",
  "allResults": []
}
EOF

# 2. 调用任务
mcporter call dhf_rpa_task.task_run \
  task_id="jPIhen" \
  input_data@"search_input.json"

# 3. 查询结果
mcporter call dhf_rpa_task.task_run_result \
  task_id="jPIhen" \
  run_id="<run_id>"
```

## 💡 最佳实践

1. ✅ **关键词要具体** - "大黄蜂科技公司" 比 "大黄蜂" 更精确
2. ✅ **合理设置页数** - 一般 3-5 页足够
3. ✅ **使用时间过滤** - 需要最新信息时加上 `--timeRange "w"`
4. ✅ **定期清理结果** - 删除旧的搜索结果文件节省空间

---

**最后更新：** 2026-04-13
