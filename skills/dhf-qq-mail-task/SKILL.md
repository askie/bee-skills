---
name: dhf-qq-mail-task
description: 调用 DHF Agent 任务市场中的 QQ 邮件发送任务 (NRxq1h)。使用 QQ 浏览器自动发送邮件，支持收件人选择、主题、正文和附件上传
version: 1.0.0
metadata:
  tags: [dhf, automation, email, qq-mail, task]
  categories: [automation, communication]
  author: "DHF Community"
  license: MIT
  homepage: https://dhf.pub
  repository: https://dhf.pub
  mcp_server: dhf_rpa_task
  mcp_port: 6869
  dependencies:
    - skill: dhf-install-agent
      condition: mcp_not_connected
      action: auto_start
---

# dhf-qq-mail-task

自动调用 DHF Agent **任务**，通过 QQ 浏览器发送 QQ 邮件。

## ⚠️ 重要：这是任务，不是工作流

**这是任务（Task），不是工作流（Workflow）！**

| 对比项 | 任务（Task） | 工作流（Workflow） |
|--------|-------------|-------------------|
| **ID 类型** | task_id | workflow_id |
| **MCP 服务** | `dhf_rpa_task` | `dhf_rpa_workflow` |
| **调用方法** | `task_market_run` | `workflow_market_run` |
| **轮询方法** | `task_run_result` | `workflow_run_result` |
| **结构** | 单个自动化流程 | 多个任务节点组成的工作流 |
| **当前使用** | ✅ **使用此任务** | ❌ 不使用 |

**当前任务 ID：** `NRxq1h`

## 功能特性

- ✅ 自动打开 QQ 浏览器
- ✅ 登录 QQ 邮箱
- ✅ 填写收件人邮箱
- ✅ 填写邮件主题
- ✅ 填写邮件正文
- ✅ 支持拖拽上传附件
- ✅ 自动发送邮件

## 使用方式

```bash
# 基本调用
/dhf-qq-mail-task --to "recipient@example.com" --subject "邮件主题" --body "邮件内容"

# 带附件
/dhf-qq-mail-task --to "recipient@example.com" --subject "邮件主题" --body "邮件内容" --attachment "/path/to/file.pdf"

# 多个收件人
/dhf-qq-mail-task --to "a@example.com,b@example.com" --subject "邮件主题" --body "邮件内容"

# 抄送
/dhf-qq-mail-task --to "recipient@example.com" --cc "cc@example.com" --subject "邮件主题" --body "邮件内容"
```

## 参数说明

| 参数 | 简写 | 必填 | 说明 |
|------|------|------|------|
| `--to` | `-t` | ✅ | 收件人邮箱地址，多个用逗号分隔 |
| `--subject` | `-s` | ✅ | 邮件主题 |
| `--body` | `-b` | ✅ | 邮件正文内容 |
| `--attachment` | `-a` | ❌ | 附件文件路径 |
| `--cc` | `-c` | ❌ | 抄送邮箱地址 |
| `--bcc` | `-B` | ❌ | 密送邮箱地址 |

## 执行流程

```
1. 验证输入参数
   ↓
2. 检查 DHF Agent MCP 服务
   ↓
3. [如果 MCP 未连接] 自动调用 /dhf-install-agent --open
   ↓
4. 等待 DHF Agent 启动完成（最多 30 秒）
   ↓
5. 调用任务 (task_id: NRxq1h)
   ↓
6. 自动打开 QQ 浏览器
   ↓
7. 登录 QQ 邮箱（如果未登录）
   ↓
8. 填写邮件信息
   ↓
9. 上传附件（如果有）
   ↓
10. 发送邮件
    ↓
11. 轮询执行结果
```

## MCP 服务自动启动

**重要**：此 skill 依赖于 DHF Agent 的 MCP 服务 (`dhf_rpa_task`)。

- **MCP 服务器**：`localhost:6869`
- **服务名称**：`dhf_rpa_task`

当检测到 MCP 服务未连接时，此 skill 会**自动调用** `/dhf-install-agent --open` 来启动 DHF Agent，无需手动干预。

## 前置条件

1. ✅ **DHF Agent 已安装**
   - 检查：`/dhf-install-agent --status`
   - 如未安装会自动提示安装

2. ✅ **已安装 QQ 浏览器**
   - QQ 浏览器用于自动化操作

3. ✅ **已登录 QQ 邮箱**
   - 首次使用需要登录

## 输入数据结构

任务接受以下参数：

```json
{
  "to": "recipient@example.com",        // 收件人
  "subject": "邮件主题",                 // 主题
  "body": "邮件正文内容",                // 正文
  "attachment": "/path/to/file.pdf",    // 附件（可选）
  "cc": "cc@example.com",               // 抄送（可选）
  "bcc": "bcc@example.com"              // 密送（可选）
}
```

## 示例

### 示例 1：发送简单邮件

```bash
/dhf-qq-mail-task \
  --to "friend@example.com" \
  --subject "周末聚会" \
  --body "你好，这周末有空一起吃饭吗？"
```

### 示例 2：发送带附件的邮件

```bash
/dhf-qq-mail-task \
  --to "colleague@example.com" \
  --subject "项目报告" \
  --body "附件是本周的项目进度报告，请查收。" \
  --attachment "/path/to/report.pdf"
```

### 示例 3：群发邮件

```bash
/dhf-qq-mail-task \
  --to "a@example.com,b@example.com,c@example.com" \
  --cc "boss@example.com" \
  --subject "团队会议通知" \
  --body "本周五下午3点召开团队会议，请准时参加。"
```

## 常见问题

### 问题 1：DHF Agent 未启动

**现象：** 提示 MCP 服务不可用

**解决：**
```bash
# 启动 DHF Agent
/dhf-install-agent --open
```

### 问题 2：QQ 浏览器未安装

**现象：** 任务执行失败，提示找不到浏览器

**解决：**
- 下载并安装 QQ 浏览器
- 确保浏览器可以被 DHF Agent 调用

### 问题 3：QQ 邮箱未登录

**现象：** 打开邮箱但无法发送

**解决：**
- 手动登录 QQ 邮箱一次
- 登录状态会被保存

### 问题 4：附件路径不存在

**现象：** 任务执行失败

**解决：**
- 检查附件路径是否正确
- 使用绝对路径
- 确保文件存在且可读

### 问题 5：收件人地址格式错误

**现象：** 邮件发送失败

**解决：**
- 确保邮箱地址格式正确
- 多个收件人用逗号分隔，不要有空格

## 配置说明

脚本内置配置（可在脚本中修改）：
- `TASK_ID = "NRxq1h"` - **任务 ID**
- `MCP_SERVER = { host: 'localhost', port: 6869 }` - MCP 服务器地址
- `POLL_INTERVAL = 5000` - 轮询间隔（毫秒）
- `MAX_POLL_TIME = 300000` - 最大轮询时间（5分钟）

## 技术细节

### MCP 调用方式

```javascript
{
  jsonrpc: "2.0",
  id: Date.now(),
  method: "tools/call",
  params: {
    name: "task_market_run",
    arguments: {
      task_id: "NRxq1h",
      inputs: JSON.stringify({
        to: "recipient@example.com",
        subject: "邮件主题",
        body: "邮件正文",
        attachment: "/path/to/file.pdf"  // 可选
      })
    }
  }
}
```

### 轮询执行结果

```javascript
{
  jsonrpc: "2.0",
  id: Date.now(),
  method: "tools/call",
  params: {
    name: "task_run_result",
    arguments: {
      task_id: "NRxq1h",
      run_id: "<run_id>"
    }
  }
}
```

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **帮助中心：** https://dhf.pub/en/help
- **MCP 文档：** `mcporter list dhf_rpa_task --schema`

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 📧
