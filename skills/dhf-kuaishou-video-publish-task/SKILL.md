---
name: dhf-kuaishou-video-publish-task
description: 调用 DHF Agent 任务自动发布视频到快手平台。支持标题、内容、视频路径配置
version: 1.0.0
metadata:
  tags: [dhf, kuaishou, publish, video, automation]
  categories: [automation, publishing]
  author: "DHF Community"
  license: MIT
  homepage: https://dhf.pub
  repository: https://dhf.pub
---

# dhf-kuaishou-video-publish-task

自动调用 DHF Agent **任务**，发布视频到快手平台。

## 重要：这是任务，不是工作流

**这是任务（Task），不是工作流（Workflow）！**

| 对比项 | 任务（Task） | 工作流（Workflow） |
|--------|-------------|-------------------|
| **ID 类型** | task_id | workflow_id |
| **MCP 服务** | `dhf_rpa_task` | `dhf_rpa_workflow` |
| **调用方法** | `task_market_run` | `workflow_market_run` |
| **轮询方法** | `task_run_result` | `workflow_run_result` |
| **结构** | 单个自动化流程 | 多个任务节点组成的工作流 |
| **当前使用** | ✅ **使用此任务** | ❌ 不使用 |

**当前任务 ID：** `PvAVbb`

## 功能特性

- ✅ 自动打开快手创作中心
- ✅ 上传视频文件
- ✅ 填写视频标题和内容
- ✅ 支持多个视频文件
- ✅ 支持自动发布或保存草稿

## 使用方式

```bash
# 基本发布
/dhf-kuaishou-video-publish-task --title "hello" --content "hello!" --video "./video.mp4"

# 多个视频
/dhf-kuaishou-video-publish-task --title "标题" --content "内容" --video "./v1.mp4" --video "./v2.mp4"

# 保存草稿
/dhf-kuaishou-video-publish-task --title "标题" --content "内容" --video "./video.mp4" --autoSend "N"

# 检查 DHF Agent 连接
/dhf-kuaishou-video-publish-task --check
```

## 参数说明

| 参数 | 简写 | 必填 | 说明 |
|------|------|------|------|
| `--title` | `-t` | ✅ | 视频标题 |
| `--content` | `-c` | ✅ | 视频内容/文案 |
| `--video` | `-v` | ✅ | 视频文件路径（可多次使用） |
| `--autoSend` | `-a` | ❌ | 自动发布 Y/N（默认：Y） |
| `--check` | | ❌ | 检查 DHF Agent 连接 |
| `--help` | `-h` | ❌ | 显示帮助 |

## 执行流程

```
1. 验证输入参数
   ↓
2. 检查视频文件是否存在
   ↓
3. 检查 DHF Agent MCP 服务
   ↓
4. 调用任务 (task_id: PvAVbb)
   ↓
5. 自动打开快手创作中心
   ↓
6. 上传视频文件
   ↓
7. 填写标题和内容
   ↓
8. 发布或保存草稿
```

## 前置条件

1. ✅ **DHF Agent 已安装并运行**
   - 检查：`/dhf-install-agent --status`
   - 启动：`/dhf-install-agent --open`

2. ✅ **已登录快手**
   - 首次使用建议手动登录一次
   - 登录状态会被浏览器保存

3. ✅ **视频文件准备**
   - 确保视频文件路径正确
   - 支持的格式：mp4, mov, avi 等

## 输入数据结构

```json
{
  "initialState": {
    "title": "视频标题",
    "content": "视频内容文案",
    "videos": ["C:\\path\\to\\video.mp4"],
    "autoSend": "Y"
  }
}
```

## 示例

### 示例 1：发布单个视频

```bash
/dhf-kuaishou-video-publish-task \
  --title "hello" \
  --content "hello!" \
  --video "./video.mp4"
```

### 示例 2：发布多个视频

```bash
/dhf-kuaishou-video-publish-task \
  --title "视频标题" \
  --content "视频内容..." \
  --video "./part1.mp4" \
  --video "./part2.mp4"
```

### 示例 3：保存草稿

```bash
/dhf-kuaishou-video-publish-task \
  --title "未完成的视频" \
  --content "待补充..." \
  --video "./draft.mp4" \
  --autoSend "N"
```

## 常见问题

### 问题 1：DHF Agent 未启动

**现象：** 提示 MCP 服务不可用

**解决：**
```bash
/dhf-install-agent --open
```

### 问题 2：需要登录快手

**现象：** 任务执行失败，提示需要登录

**解决：**
- 手动打开浏览器访问 kuaishou.com 并登录
- 登录状态会被浏览器保存

### 问题 3：视频文件不存在

**现象：** 提示视频文件不存在

**解决：**
- 检查视频文件路径是否正确
- 使用绝对路径或确保相对路径正确

### 问题 4：视频上传失败

**现象：** 视频上传过程中失败

**解决：**
- 检查网络连接
- 确保视频文件格式正确
- 视频文件可能过大，尝试压缩

## 配置说明

脚本内置配置：
- `TASK_ID = "PvAVbb"` - 任务 ID
- `MCP_SERVER = { host: 'localhost', port: 6869 }` - MCP 服务器地址
- `MCP_ENDPOINT = "/http/task"` - MCP 端点路径
- `POLL_INTERVAL = 5000` - 轮询间隔（毫秒）
- `MAX_POLL_TIME = 600000` - 最大轮询时间（10分钟）

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
      task_id: "PvAVbb",
      input_data: JSON.stringify({
        initialState: {
          title: "视频标题",
          content: "视频内容",
          videos: ["C:\\path\\to\\video.mp4"],
          autoSend: "Y"
        }
      })
    }
  }
}
```

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **快手网站：** https://kuaishou.com

---

**记住：这是任务，使用 `dhf_rpa_task.task_market_run`！** 📹
