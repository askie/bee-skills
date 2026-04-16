# Sogou WeChat Search Task

调用 DHF Agent 任务进行搜狗微信公众号搜索。输入关键词，浏览器自动打开执行搜索。

## 快速开始

```bash
/sogou-wechat-search-task -k "大黄蜂科技"
```

## 功能特性

- 自动打开浏览器执行搜狗微信搜索
- 搜索微信公众号文章
- 支持多页搜索结果收集
- 实时显示搜索进度

## 使用示例

```bash
# 基本搜索
/sogou-wechat-search-task -k "关键词"

# 搜索3页
/sogou-wechat-search-task -k "关键词" -p 3

# 检查 DHF Agent 连接
/sogou-wechat-search-task --check
```

## 前置条件

1. DHF Agent 已启动：`/dhf-install-agent --open`
2. 浏览器可用

---

更多信息请查看 [SKILL.md](./SKILL.md)
