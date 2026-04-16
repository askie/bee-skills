# DHF RPA Test Workflow

自动调用 DHF Agent 工作流测试 RPA 基础功能。

## 功能

- ✅ 测试 DHF Agent 基础连接
- ✅ 验证浏览器插件状态
- ✅ 测试基本 RPA 操作
- ✅ 返回详细测试结果
- ✅ 支持保存测试报告

## 使用方法

```bash
# 运行完整测试
/dhf-rpa-test-workflow

# 快速测试
/dhf-rpa-test-workflow --fast

# 保存测试报告
/dhf-rpa-test-workflow --output "./test-report.json"

# 仅检查状态
/dhf-rpa-test-workflow --check
```

## 参数

- `--fast, -f`: 快速测试模式
- `--output, -o`: 输出测试报告文件路径
- `--verbose, -v`: 显示详细测试日志
- `--check, -c`: 仅检查 DHF Agent 状态

## 任务信息

- **工作流 ID**: ok8gKP
- **类型**: RPA 测试工作流
- **MCP 服务**: dhf_rpa_task
- **MCP 端点**: /mcp

## 测试项目

1. MCP 服务连接测试
2. 浏览器插件连接测试
3. 基本 RPA 操作测试（点击、输入、等待）
4. 数据提取测试
5. 错误处理测试

## 注意事项

⚠️ RPA 测试工作流注意事项：
1. 确保 DHF Agent 已启动
2. 确保浏览器插件已连接
3. 确保网络连接正常
4. 某些测试可能需要访问特定网页
