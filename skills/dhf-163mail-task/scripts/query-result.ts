#!/usr/bin/env bun
import { request } from "http";

// Colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function printHeader(title: string) {
  console.log();
  log("═".repeat(60), colors.cyan);
  log(`  ${title}`, colors.bright + colors.cyan);
  log("═".repeat(60), colors.cyan);
  console.log();
}

// MCP Server config
const MCP_SERVER = { host: "localhost", port: 6869 };

// Parse arguments
function parseArgs(args: string[]): { taskId: string; runId: string; interval: number; maxTime: number } {
  const taskId = args.find((_, i) => args[i - 1] === "--task" || args[i - 1] === "-t") || "";
  const runId = args.find((_, i) => args[i - 1] === "--run" || args[i - 1] === "-r") || "";
  const interval = parseInt(args.find((_, i) => args[i - 1] === "--interval" || args[i - 1] === "-i") || "5000", 10);
  const maxTime = parseInt(args.find((_, i) => args[i - 1] === "--max-time" || args[i - 1] === "-m") || "300000", 10);

  if (!taskId || !runId) {
    log("❌ 缺少必填参数", colors.red);
    console.log();
    showHelp();
    process.exit(1);
  }

  return { taskId, runId, interval, maxTime };
}

function showHelp() {
  printHeader("DHF 任务结果查询工具");
  console.log();
  log("用法:", colors.bright);
  console.log();
  log("  /query-result --task <task_id> --run <run_id> [options]", colors.cyan);
  console.log();
  log("必填参数:", colors.bright);
  console.log();
  log("  --task, -t      任务 ID", colors.cyan);
  log("  --run, -r       运行 ID (run_id)", colors.cyan);
  console.log();
  log("可选参数:", colors.bright);
  console.log();
  log("  --interval, -i  轮询间隔（毫秒）默认: 5000", colors.cyan);
  log("  --max-time, -m  最大轮询时间（毫秒）默认: 300000", colors.cyan);
  console.log();
  log("示例:", colors.bright);
  console.log();
  log("  # 查询任务结果", colors.gray);
  log("  /query-result --task fogplR --run ANeW.47396c73-dd05-419e-ad49-e01151b89815", colors.green);
  console.log();
  log("  # 自定义轮询间隔", colors.gray);
  log("  /query-result --task fogplR --run ANeW.xxx --interval 3000", colors.green);
  console.log();
}

// Query task result
function queryResult(taskId: string, runId: string): Promise<{ success: boolean; data?: any; error?: string }> {
  return new Promise((resolve) => {
    const requestData = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: "task_run_result",
        arguments: {
          task_id: taskId,
          run_id: runId,
        },
      },
    };

    const postData = JSON.stringify(requestData);

    const options = {
      ...MCP_SERVER,
      path: "/http/task",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
      timeout: 10000,
    };

    log(`📡 发送请求到: http://${MCP_SERVER.host}:${MCP_SERVER.port}${options.path}`, colors.blue);
    log(`   请求数据: ${postData.substring(0, 150)}...`, colors.gray);

    const req = request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        log(`📥 响应状态: ${res.statusCode}`, colors.blue);
        log(`   响应长度: ${data.length} 字节`, colors.gray);

        if (!data.trim()) {
          resolve({ success: false, error: "空响应" });
          return;
        }

        // Check for non-JSON response
        if (!data.trim().startsWith("{")) {
          resolve({ success: false, error: "非 JSON 响应", data });
          return;
        }

        try {
          const response = JSON.parse(data);
          if (response.error) {
            resolve({ success: false, error: response.error.message, data: response });
            return;
          }
          if (response.result?.content?.[0]) {
            const resultText = response.result.content[0].text;
            const result = JSON.parse(resultText);
            resolve({ success: true, data: result });
          } else {
            resolve({ success: false, error: "无效响应格式", data: response });
          }
        } catch (e) {
          resolve({ success: false, error: `解析失败: ${e.message}`, data });
        }
      });
    });

    req.on("error", (err) => {
      resolve({ success: false, error: err.message });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({ success: false, error: "请求超时" });
    });

    req.write(postData);
    req.end();
  });
}

// Poll task result
async function pollResult(taskId: string, runId: string, interval: number, maxTime: number) {
  printHeader("DHF 任务结果查询");
  log(`任务 ID: ${taskId}`, colors.cyan);
  log(`运行 ID: ${runId}`, colors.cyan);
  log(`轮询间隔: ${interval}ms`, colors.cyan);
  log(`最大时间: ${maxTime}ms`, colors.cyan);
  console.log();

  const startTime = Date.now();
  let pollCount = 0;

  while (true) {
    pollCount++;
    const elapsed = Date.now() - startTime;

    if (elapsed > maxTime) {
      log(`❌ 轮询超时（${Math.floor(elapsed / 1000)}秒）`, colors.red);
      process.exit(1);
    }

    const elapsedSec = Math.floor(elapsed / 1000);
    process.stdout.write(`\r⏳ [${pollCount}] 查询中... ${elapsedSec}秒`);

    const result = await queryResult(taskId, runId);

    if (result.success && result.data) {
      console.log();
      log("✅ 收到有效响应", colors.green);
      console.log();
      log("📊 响应数据:", colors.bright);
      console.log(JSON.stringify(result.data, null, 2));
      console.log();

      const status = result.data.status || "unknown";
      log(`📋 状态: ${status}`, colors.cyan);

      if (status === "completed" || status === "SUCCESS" || status === "success") {
        log("🎉 任务执行成功!", colors.green);
        process.exit(0);
      } else if (status === "failed" || status === "FAILED" || status === "error") {
        log(`❌ 任务执行失败: ${result.data.message || result.data.result || "未知错误"}`, colors.red);
        process.exit(1);
      } else if (status === "running" || status === "PENDING") {
        log("⏳ 任务仍在运行，继续轮询...", colors.yellow);
      } else {
        log(`⚠️ 未知状态: ${status}，继续轮询...`, colors.yellow);
      }
    } else {
      if (result.error) {
        console.log();
        log(`⚠️ 查询失败: ${result.error}`, colors.yellow);
        if (result.data) {
          log(`   原始数据: ${JSON.stringify(result.data).substring(0, 200)}`, colors.gray);
        }
      }
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    showHelp();
    process.exit(0);
  }

  const { taskId, runId, interval, maxTime } = parseArgs(args);

  try {
    await pollResult(taskId, runId, interval, maxTime);
  } catch (error: any) {
    log(`❌ 错误: ${error.message}`, colors.red);
    process.exit(1);
  }
}

main();
