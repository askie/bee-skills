# QQ 邮件发送任务使用指南

本指南详细说明如何使用 `dhf-qq-mail-task` skill 调用 DHF Agent 任务市场的 QQ 邮件发送任务。

## 任务概述

**任务 ID**: `NRxq1h`
**任务名称**: QQ 邮件发送任务
**MCP 服务**: `dhf_rpa_task`
**调用方法**: `task_market_run`

此任务通过 QQ 浏览器自动化，实现 QQ 邮件的自动发送功能。

## 前置条件

### 1. 安装 DHF Agent

```bash
# 检查安装状态
/dhf-install-agent --status

# 如果未安装，执行安装
/dhf-install-agent --install
```

### 2. 启动 DHF Agent

```bash
# 启动 DHF Agent
/dhf-install-agent --open
```

### 3. 安装 QQ 浏览器

下载并安装 QQ 浏览器：https://browser.qq.com/

### 4. 登录 QQ 邮箱

首次使用时需要手动登录 QQ 邮箱，登录状态会被保存。

## 快速开始

### 发送第一封邮件

```bash
/dhf-qq-mail-task \
  --to "yourfriend@qq.com" \
  --subject "测试邮件" \
  --body "这是一封测试邮件。"
```

### 发送带附件的邮件

```bash
/dhf-qq-mail-task \
  --to "colleague@qq.com" \
  --subject "项目报告" \
  --body "附件是本周的项目报告。" \
  --attachment "/path/to/report.pdf"
```

### 群发邮件

```bash
/dhf-qq-mail-task \
  --to "a@qq.com,b@qq.com,c@qq.com" \
  --subject "团队通知" \
  --body "本周五下午3点召开团队会议。"
```

## 参数详解

### 必填参数

#### `--to` / `-t`：收件人邮箱

- **类型**: 字符串
- **必填**: 是
- **说明**: 收件人邮箱地址，多个收件人用逗号分隔
- **示例**:
  - 单个收件人: `--to "friend@qq.com"`
  - 多个收件人: `--to "a@qq.com,b@qq.com,c@qq.com"`

#### `--subject` / `-s`：邮件主题

- **类型**: 字符串
- **必填**: 是
- **说明**: 邮件的主题行
- **示例**: `--subject "会议通知"`

#### `--body` / `-b`：邮件正文

- **类型**: 字符串
- **必填**: 是
- **说明**: 邮件的正文内容
- **示例**: `--body "请查收附件中的报告。"`

### 可选参数

#### `--attachment` / `-a`：附件文件

- **类型**: 文件路径
- **必填**: 否
- **说明**: 要附加的文件路径，建议使用绝对路径
- **示例**: `--attachment "/home/user/report.pdf"`

#### `--cc` / `-c`：抄送

- **类型**: 字符串
- **必填**: 否
- **说明**: 抄送收件人邮箱地址
- **示例**: `--cc "manager@qq.com"`

#### `--bcc` / `-B`：密送

- **类型**: 字符串
- **必填**: 否
- **说明**: 密送收件人邮箱地址（其他收件人看不到）
- **示例**: `--bcc "hr@qq.com"`

## 使用场景

### 场景 1：发送会议通知

```bash
/dhf-qq-mail-task \
  --to "team@company.com" \
  --cc "manager@company.com" \
  --subject "【会议通知】项目进度汇报会" \
  --body "各位同事：

本周五下午3点将在会议室A召开项目进度汇报会，请准时参加。

议程：
1. 各模块进度汇报
2. 问题讨论
3. 下周计划

请准备好相关材料。"
```

### 场景 2：发送文件给客户

```bash
/dhf-qq-mail-task \
  --to "client@customer.com" \
  --subject "产品报价单" \
  --body "尊敬的客户：

附件是我们最新产品的报价单，请查收。

如有任何问题，欢迎随时联系我们。

祝好！
销售部" \
  --attachment "/home/sales/price_list.pdf"
```

### 场景 3：批量发送通知

```bash
/dhf-qq-mail-task \
  --to "emp1@company.com,emp2@company.com,emp3@company.com" \
  --bcc "hr@company.com" \
  --subject "【重要】节假日放假通知" \
  --body "全体员工：

根据国家法定节假日安排，公司将于下周一开始放假3天。

请各位同事提前安排好工作。

行政部"
```

### 场景 4：发送日报

```bash
/dhf-qq-mail-task \
  --to "supervisor@company.com" \
  --subject "【日报】2026-04-13 工作汇报" \
  --body "今日工作：
1. 完成了用户模块的开发
2. 修复了3个bug
3. 参加了技术评审会议

明日计划：
1. 继续开发订单模块
2. 编写单元测试" \
  --attachment "/home/user/daily_report.docx"
```

## 执行过程说明

当执行命令后，系统会：

1. **验证参数**：检查必填参数是否完整
2. **检查服务**：验证 DHF Agent 是否运行
3. **启动任务**：调用 DHF Agent 的任务市场
4. **打开浏览器**：QQ 浏览器自动打开
5. **登录邮箱**：如果未登录，会提示登录
6. **填写邮件**：自动填写收件人、主题、正文
7. **上传附件**：如果有附件，会自动上传
8. **发送邮件**：点击发送按钮
9. **返回结果**：报告发送状态

整个过程大约需要 10-30 秒，取决于网络速度和附件大小。

## 常见问题

### Q1: 提示"DHF Agent 服务不可用"

**原因**: DHF Agent 未启动

**解决方案**:
```bash
/dhf-install-agent --open
```

### Q2: QQ 浏览器没有自动打开

**原因**:
1. QQ 浏览器未安装
2. QQ 浏览器路径不正确

**解决方案**:
1. 安装 QQ 浏览器
2. 检查浏览器是否可以被 DHF Agent 调用

### Q3: 邮箱没有自动登录

**原因**: 首次使用需要手动登录

**解决方案**:
1. 等待 QQ 邮箱页面打开
2. 手动扫码或账号密码登录
3. 登录状态会被保存

### Q4: 附件上传失败

**原因**:
1. 附件文件不存在
2. 附件路径不正确
3. 文件过大（QQ 邮箱限制）

**解决方案**:
1. 检查文件路径是否正确
2. 使用绝对路径
3. 检查文件大小（QQ 邮箱限制 50MB）

### Q5: 收件人地址格式错误

**原因**: 邮箱地址格式不正确

**解决方案**:
- 确保邮箱地址格式正确：`user@domain.com`
- 多个收件人用逗号分隔，不要有空格：`a@qq.com,b@qq.com`
- 检查是否有拼写错误

### Q6: 发送超时

**原因**:
1. 网络问题
2. 附件过大
3. QQ 邮箱响应慢

**解决方案**:
1. 检查网络连接
2. 减小附件大小
3. 增加超时时间（修改脚本配置）

## 进阶技巧

### 技巧 1：使用脚本批量发送

创建一个 bash 脚本批量发送邮件：

```bash
#!/bin/bash
# batch_send.sh

recipients=("a@qq.com" "b@qq.com" "c@qq.com")
subject="月度报告"
body="附件是本月的销售报告。"
attachment="/home/user/monthly_report.pdf"

for recipient in "${recipients[@]}"; do
  /dhf-qq-mail-task \
    --to "$recipient" \
    --subject "$subject" \
    --body "$body" \
    --attachment "$attachment"
  sleep 5
done
```

### 技巧 2：从文件读取邮件列表

```bash
#!/bin/bash
# send_from_list.sh

while IFS=',' read -r to subject body; do
  /dhf-qq-mail-task \
    --to "$to" \
    --subject "$subject" \
    --body "$body"
  sleep 5
done < email_list.txt
```

### 技巧 3：结合其他工具生成邮件内容

```bash
# 使用命令生成邮件正文
body=$(cat report.txt | head -20)

/dhf-qq-mail-task \
  --to "recipient@qq.com" \
  --subject "自动报告" \
  --body "$body"
```

## 配置修改

如果需要修改默认配置，编辑 `scripts/main.ts`：

```typescript
// 任务 ID
const TASK_ID = "NRxq1h";

// MCP 服务器地址
const MCP_SERVER = { host: "localhost", port: 6869 };

// 轮询间隔（毫秒）
const POLL_INTERVAL = 5000;

// 最大轮询时间（毫秒）
const MAX_POLL_TIME = 300000;
```

## 相关资源

- **DHF 官网**: https://dhf.pub
- **任务市场**: https://dhf.pub/nl/explore
- **帮助中心**: https://dhf.pub/en/help
- **MCP 文档**: `mcporter list dhf_rpa_task --schema`

---

如有问题，请访问 DHF 官网获取帮助。
