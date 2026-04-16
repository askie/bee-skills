#!/bin/bash

# Outlook 任务 plugin_name 修复脚本

echo "正在修复 Outlook 邮件任务的 plugin_name..."
echo ""

# 获取任务配置
TASK_DATA=$(echo '{"jsonrpc":"2.0","id":'$(date +%s)',"method":"tools/call","params":{"name":"task_market_get","arguments":{"task_id":"juHtXM"}}}' | curl -s --data @- http://localhost:6869/http/task)

# 提取任务 JSON
TASK_JSON=$(echo "$TASK_DATA" | grep -o '"task_data":{[^}]*}' | sed 's/"task_data"://')

echo "当前任务配置："
echo "$TASK_JSON" | grep "plugin_name"
echo ""

# 提示用户手动修改
echo "请按以下步骤操作："
echo "1. 打开 DHF Agent 应用"
echo "2. 找到 Outlook 邮件任务（juHtXM）"
echo "3. 编辑任务，将 plugin_name 从 \"chromeAgent\" 改为 \"\""
echo "4. 保存并测试"
echo ""
echo "或者等待自动修复脚本..."