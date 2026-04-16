# dhf-rpa-test-workflow

自动调用 DHF Agent **工作流**，测试 RPA 基础功能。

## ⚠️ 重要：这是工作流，不是任务

**这是工作流（Workflow），不是任务（Task）！**

使用 `workflow_market_run` 来执行市场中的测试工作流。

| 对比项 | 任务（Task） | 工作流（Workflow） |
|--------|-------------|-------------------|
| **ID 类型** | task_id | workflow_id |
| **MCP 服务** | `dhf_rpa_task` | `dhf_rpa_workflow` |
| **调用方法** | `task_market_run` | `workflow_market_run` |
| **轮询方法** | `task_run_result` | `workflow_run_result` |
| **结构** | 单个自动化流程 | 多个任务节点组成的工作流 |
| **当前使用** | - | ✅ **使用工作流** |

**工作流 ID：** `ok8gKP` - RPA 任务测试工作流

## 功能特性

- ✅ 测试 DHF Agent 基础连接
- ✅ 验证浏览器插件状态
- ✅ 测试基本 RPA 操作（点击、输入、等待）
- ✅ 验证 MCP 服务可用性
- ✅ 返回详细测试结果
- ✅ 支持保存测试报告

## 使用方式

```bash
# 运行完整测试
/dhf-rpa-test-workflow

# 快速测试（跳过详细输出）
/dhf-rpa-test-workflow --fast

# 保存测试报告
/dhf-rpa-test-workflow --output "./test-report.json"

# 显示详细测试日志
/dhf-rpa-test-workflow --verbose

# 仅检查 DHF Agent 状态
/dhf-rpa-test-workflow --check
```

## 参数说明

| 参数 | 简写 | 必填 | 说明 |
|------|------|------|------|
| `--fast` | `-f` | ❌ | 快速测试模式 |
| `--output` | `-o` | ❌ | 输出测试报告文件路径 |
| `--verbose` | `-v` | ❌ | 显示详细测试日志 |
| `--check` | `-c` | ❌ | 仅检查 DHF Agent 状态 |

## 执行流程

```
1. 验证输入参数
   ↓
2. 检查 DHF Agent MCP 服务
   ↓
3. [如果 MCP 未连接] 提示启动 DHF Agent
   ↓
4. 测试浏览器连接
   ↓
5. 测试基本 RPA 操作
   ↓
6. 验证工作流执行
   ↓
7. 生成测试报告
   ↓
8. 返回测试结果
```

## MCP 服务依赖

此 skill 依赖于 DHF Agent 的 MCP 服务。

- **MCP 服务器**：`localhost:6869`
- **MCP 端点**: `/mcp`
- **可用服务**：
  - `task_run`: 执行 RPA 任务
  - `task_run_result`: 获取任务执行结果
  - `get_mcp_servers`: 获取 MCP 服务器配置
  - `get_settings`: 获取系统设置

## 测试项目

测试工作流会验证以下功能：

### 基础连接测试
- ✅ MCP 服务可用性
- ✅ DHF Agent 运行状态
- ✅ 浏览器插件连接

### RPA 功能测试
- ✅ 页面导航
- ✅ 元素查找
- ✅ 点击操作
- ✅ 输入操作
- ✅ 等待操作
- ✅ 数据提取

### 系统测试
- ✅ 任务执行
- ✅ 结果返回
- ✅ 错误处理

## 输出数据结构

测试成功后返回以下格式的测试报告：

```json
{
  "success": true,
  "timestamp": "2026-04-14T10:00:00Z",
  "tests": [
    {
      "name": "MCP 服务连接",
      "status": "passed",
      "duration": 50,
      "message": "MCP 服务响应正常"
    },
    {
      "name": "浏览器插件",
      "status": "passed",
      "duration": 200,
      "message": "浏览器插件已连接"
    },
    {
      "name": "基本 RPA 操作",
      "status": "passed",
      "duration": 1500,
      "message": "所有基本操作测试通过"
    }
  ],
  "summary": {
    "total": 3,
    "passed": 3,
    "failed": 0,
    "duration": 1750
  }
}
```

## 示例

### 示例 1：完整测试

```bash
/dhf-rpa-test-workflow
```

### 示例 2：快速测试

```bash
/dhf-rpa-test-workflow --fast
```

### 示例 3：保存测试报告

```bash
/dhf-rpa-test-workflow --output "./test-report.json"
```

## 测试结果说明

### 测试状态
- **passed**: 测试通过
- **failed**: 测试失败
- **skipped**: 测试跳过

### 常见失败原因

| 测试项 | 失败原因 | 解决方案 |
|--------|----------|----------|
| MCP 服务 | 服务未启动 | 启动 DHF Agent |
| 浏览器插件 | 插件未连接 | 打开浏览器并安装插件 |
| RPA 操作 | 目标页面不可用 | 检查网络连接和目标URL |

## 常见问题

### 问题 1：DHF Agent 未启动

**现象：** 提示 MCP 服务不可用

**解决：**
```bash
# 启动 DHF Agent
/dhf-install-agent --open
```

### 问题 2：浏览器插件未连接

**现象：** 浏览器插件测试失败

**解决：**
- 打开 Chrome 或 Edge 浏览器
- 安装 DHF Bee Agent 浏览器插件
- 确保插件已启用

### 问题 3：工作流执行失败

**现象：** RPA 操作测试失败

**解决：**
- 检查网络连接
- 确认目标测试页面可访问
- 查看详细错误日志

## 配置说明

脚本内置配置（可在脚本中修改）：
- `WORKFLOW_ID = "ok8gKP"` - **工作流 ID**
- `MCP_SERVER = { host: 'localhost', port: 6869 }` - MCP 服务器地址
- `MCP_ENDPOINT = "/mcp"` - **MCP 端点路径**
- `TEST_TIMEOUT = 60000` - 测试超时时间（60秒）

## 技术细节

### MCP 调用方式

```javascript
{
  jsonrpc: "2.0",
  id: Date.now(),
  method: "tools/call",
  params: {
    name: "workflow_market_run",
    arguments: {
      workflow_id: "ok8gKP"
    }
  }
}
```

### 获取测试结果

```javascript
{
  jsonrpc: "2.0",
  id: Date.now(),
  method: "tools/call",
  params: {
    name: "workflow_run_result",
    arguments: {
      workflow_id: "<local_workflow_id>",
      run_id: "<run_id>"
    }
  }
}
```

## 相关资源

- **DHF 官网：** https://dhf.pub
- **任务市场：** https://dhf.pub/nl/explore
- **帮助中心：** https://dhf.pub/en/help
- **MCP 文档：** https://modelcontextprotocol.io

---

**记住：这是 RPA 测试工作流，用于验证 DHF Agent 基础功能！** 🔧
