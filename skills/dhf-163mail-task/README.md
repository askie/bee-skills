# DHF 163 Mail Task

自动调用 DHF Agent 任务市场中的 163 邮件发送任务。

## 功能说明

这个技能通过调用 DHF Agent 中的 163 邮件发送任务（任务 ID: `fogplR`），实现自动化发送 163 邮箱的功能。

### 主要特性

- ✅ 自动打开浏览器访问 163 邮箱
- ✅ 自动填写收件人、主题、正文
- ✅ 支持上传附件
- ✅ 支持抄送和密送
- ✅ 完整的 UTF-8 编码支持，中文不会乱码

## 使用方法

### 基本用法

```bash
/dhf-163mail-task --to "recipient@163.com" --subject "邮件主题" --body "邮件内容"
```

### 带附件

```bash
/dhf-163mail-task \
  --to "recipient@163.com" \
  --subject "项目报告" \
  --body "附件是本周的项目进度报告" \
  --attachment "/path/to/report.pdf"
```

### 多个收件人

```bash
/dhf-163mail-task \
  --to "a@163.com,b@163.com,c@163.com" \
  --subject "团队会议" \
  --body "本周五下午3点召开团队会议"
```

### 检查连接

```bash
/dhf-163mail-task --check
```

## 前置要求

1. **DHF Agent 已安装并运行**
   ```bash
   /dhf-install-agent --status
   /dhf-install-agent --open
   ```

2. **已登录 163 邮箱**
   - 首次使用时需要在浏览器中登录一次
   - 登录状态会被保存

3. **安装了支持的浏览器**
   - Chrome 或 Edge 浏览器

## 技术细节

- **任务 ID**: `fogplR`
- **MCP 服务**: `dhf_rpa_task`
- **编码**: UTF-8
- **超时时间**: 5 分钟

## 相关链接

- [DHF 官网](https://dhf.pub)
- [任务市场](https://dhf.pub/nl/explore)
- [DHF Install Agent](../dhf-install-agent/)
