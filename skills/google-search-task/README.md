# Google Search Task

调用 DHF Agent 任务进行谷歌搜索。输入关键词，浏览器自动打开执行搜索。

## 快速开始

```bash
/google-search-task -k "大黄蜂科技"
```

## 功能特性

- 自动打开浏览器执行谷歌搜索
- 支持多页搜索结果收集
- 支持时间范围过滤（周/月/年）
- 实时显示搜索进度

## 使用示例

```bash
# 基本搜索
/google-search-task -k "关键词"

# 搜索3页
/google-search-task -k "关键词" -p 3

# 搜索最近一周结果
/google-search-task -k "关键词" -t "week"

# 检查 DHF Agent 连接
/google-search-task --check
```

## 前置条件

1. DHF Agent 已启动：`/dhf-install-agent --open`
2. 浏览器可用

---

更多信息请查看 [SKILL.md](./SKILL.md)
