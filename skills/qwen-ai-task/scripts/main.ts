#!/usr/bin/env bun
import { request } from "http";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { homedir, platform } from "os";

// Types
interface AISearchOptions {
  input?: string;
  role?: string;
  output?: string;
  check?: boolean;
}

interface AISearchInput {
  input_text: string;
  out_text: string;
  role_text: string;
}

// Constants
const TASK_ID = "RH9zxG";
const MCP_SERVER = { host: "localhost", port: 6869 };
const POLL_INTERVAL = 5000; // 5 seconds
const MAX_POLL_TIME = 300000; // 5 minutes

// Color output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
};

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function printHeader(title: string) {
  console.log();
  log("═".repeat(50), colors.cyan);
  log(`  ${title}`, colors.bright + colors.cyan);
  log("═".repeat(50), colors.cyan);
  console.log();
}

// Parse arguments
function parseArgs(args: string[]): AISearchOptions {
  const options: Partial<AISearchOptions> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case "--input":
      case "--keyword":
      case "-i":
      case "-k":
        options.input = nextArg;
        i++;
        break;
      case "--role":
      case "-r":
        options.role = nextArg;
        i++;
        break;
      case "--output":
      case "-o":
        options.output = nextArg;
        i++;
        break;
      case "--check":
      case "-c":
        options.check = true;
        break;
      case "--help":
      case "-h":
        showHelp();
        process.exit(0);
    }
  }

  return options as AISearchOptions;
}

function showHelp() {
  printHeader("Qwen AI 任务 - Qwen AI Task");
  console.log();
  log("用法:", colors.bright);
  console.log();
  log("  /qwen-ai-task [选项]", colors.cyan);
  console.log();
  log("必填参数:", colors.bright);
  console.log();
  log("  --input, --keyword, -i, -k    输入内容/问题", colors.cyan);
  console.log();
  log("可选参数:", colors.bright);
  console.log();
  log("  --role, -r         AI 角色设定", colors.cyan);
  log("  --output, -o       输出格式要求", colors.cyan);
  log("  --check, -c        检查 DHF Agent 连接", colors.cyan);
  log("  --help, -h         显示帮助", colors.cyan);
  console.log();
  log("示例:", colors.bright);
  console.log();
  log("  /qwen-ai-task -k \"你好\"", colors.green);
  log("  /qwen-ai-task -k \"帮我写代码\" -r \"资深程序员\"", colors.green);
  log("  /qwen-ai-task -k \"分析这段代码\" -r \"代码专家\" -o \"markdown\"", colors.green);
  console.log();
  log("任务信息:", colors.bright);
  console.log();
  log(`  任务 ID: ${TASK_ID}`, colors.cyan);
  log(`  MCP 服务: dhf_rpa_task`, colors.cyan);
  console.log();
}

// Get DHF data directory path
function getDHFDataDir(): string {
  const platformName = platform();
  if (platformName === "win32") {
    return join(process.env.APPDATA || "", "dhf-agent", "work", "data");
  } else if (platformName === "darwin") {
    return join(homedir(), "Library", "Application Support", "dhf-agent", "work", "data");
  } else {
    return join(homedir(), ".config", "dhf-agent", "work", "data");
  }
}

// Read local run result from filesystem
function getLocalRunResult(taskId: string, runId: string): { success: boolean; status?: string; error?: string; result?: any } | null {
  const runDir = join(getDHFDataDir(), taskId, "run");
  if (!existsSync(runDir)) {
    return null;
  }

  try {
    const files = readdirSync(runDir);
    // Find files matching the run_id pattern
    const matchingFiles = files.filter(f => f.startsWith(`${runId}.`) && f.endsWith(".000002.md"));

    if (matchingFiles.length === 0) {
      return null;
    }

    // Read the most recent matching file
    const filePath = join(runDir, matchingFiles[matchingFiles.length - 1]);
    const content = readFileSync(filePath, "utf-8");

    // Parse status from markdown
    const statusMatch = content.match(/\*\*Status:\*\*\s*`(\w+)`/);
    if (!statusMatch) {
      return null;
    }

    const status = statusMatch[1];
    if (status === "success" || status === "completed" || status === "SUCCESS") {
      // Try to extract search results from the markdown
      const resultMatch = content.match(/\*\*Result:\*\*\s*```json\s*([\s\S]*?)\s*```/);
      const result = resultMatch ? JSON.parse(resultMatch[1]) : null;
      return { success: true, status, result };
    } else if (status === "failed" || status === "error" || status === "FAILED" || status === "ERROR") {
      return { success: false, error: "执行失败", status };
    } else if (status === "running") {
      return { success: false, error: "仍在运行", status };
    }

    return null;
  } catch {
    return null;
  }
}

// Poll task execution result
function pollExecution(taskId: string, runId: string, verbose = true): Promise<{ success: boolean; status?: string; error?: string; result?: any }> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let pollCount = 0;

    const poll = () => {
      pollCount++;
      const elapsed = Date.now() - startTime;

      if (elapsed > MAX_POLL_TIME) {
        // Try reading from local filesystem as last resort
        const localResult = getLocalRunResult(taskId, runId);
        if (localResult && localResult.status !== "running") {
          if (verbose) {
            console.log();
            log(`   📁 超时后从本地文件读取结果`, colors.cyan);
          }
          resolve(localResult);
        } else {
          resolve({ success: false, error: "执行超时" });
        }
        return;
      }

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
      };

      const req = request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          // Check for non-JSON response (error message)
          if (!data.trim().startsWith("{")) {
            if (verbose && pollCount % 6 === 0) {
              // Print every 30 seconds
              const elapsedSec = Math.floor(elapsed / 1000);
              process.stdout.write(`\r   ⏳ AI 正在思考... ${elapsedSec}秒`);
            }
            setTimeout(poll, POLL_INTERVAL);
            return;
          }

          try {
            const response = JSON.parse(data);
            if (response.error) {
              resolve({ success: false, error: response.error.message });
              return;
            }
            if (response.result?.content?.[0]) {
              const resultText = response.result.content[0].text;
              const result = JSON.parse(resultText);

              if (verbose) {
                const status = result.status || "unknown";
                const elapsedSec = Math.floor(elapsed / 1000);
                process.stdout.write(`\r   状态: ${status} | ${elapsedSec}秒`);
              }

              if (result.status === "completed" || result.status === "SUCCESS") {
                if (verbose) console.log();
                resolve({ success: true, status: result.status, result: result.result });
              } else if (result.status === "failed" || result.status === "FAILED") {
                if (verbose) console.log();
                resolve({ success: false, error: result.message || "执行失败" });
              } else if (result.status === "running" || result.status === "PENDING") {
                // Still running, continue polling
                setTimeout(poll, POLL_INTERVAL);
              } else {
                // Unknown status, check if it's a final status
                if (pollCount > 5) {
                  // After several polls, if still no clear status, check result
                  if (result.result !== undefined) {
                    if (verbose) console.log();
                    resolve({ success: true, status: "completed", result: result.result });
                  } else {
                    setTimeout(poll, POLL_INTERVAL);
                  }
                } else {
                  setTimeout(poll, POLL_INTERVAL);
                }
              }
            } else {
              // Empty response, task might still be running
              setTimeout(poll, POLL_INTERVAL);
            }
          } catch (e) {
            if (verbose && pollCount % 6 === 0) {
              const elapsedSec = Math.floor(elapsed / 1000);
              process.stdout.write(`\r   ⏳ AI 正在思考... ${elapsedSec}秒`);
            }
            setTimeout(poll, POLL_INTERVAL);
          }
        });
      });

      req.on("error", (err) => {
        if (verbose) {
          console.log();
          log(`   ⚠️ 请求错误: ${err.message}`, colors.yellow);
        }
        // Try reading from local filesystem as fallback
        const localResult = getLocalRunResult(taskId, runId);
        if (localResult) {
          if (verbose) {
            log(`   📁 从本地文件读取结果`, colors.cyan);
          }
          if (localResult.status === "running") {
            setTimeout(poll, POLL_INTERVAL);
          } else {
            resolve(localResult);
          }
        } else {
          setTimeout(poll, POLL_INTERVAL);
        }
      });

      req.write(postData);
      req.end();
    };

    poll();
  });
}

// 2. 检查 DHF Agent MCP 服务
function checkMCPServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = request({
      ...MCP_SERVER,
      path: "/http/task",
      method: "POST",
      timeout: 5000,
    }, (res) => {
      if (res.statusCode === 200) resolve();
      else reject(new Error(`服务返回 ${res.statusCode}`));
    }).on("error", reject);

    req.write(JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/list",
    }));
    req.end();
  });
}

// 3. 调用任务 API
function callTaskAPI(input: AISearchInput): Promise<{ success: boolean; run_id?: string; error?: string }> {
  return new Promise((resolve) => {
    const requestData = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: "task_market_run",
        arguments: {
          task_id: TASK_ID,
          input_data: JSON.stringify(input),
        },
      },
    };

    const postData = JSON.stringify(requestData);

    const req = request({
      ...MCP_SERVER,
      path: "/http/task",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
      timeout: 30000,
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            resolve({ success: false, error: response.error.message });
            return;
          }
          if (response.result?.content?.[0]) {
            const text = response.result.content[0].text;
            const runIdMatch = text.match(/run_id=([a-zA-Z0-9-]+)/);

            if (runIdMatch) {
              resolve({ success: true, run_id: runIdMatch[1] });
            } else {
              resolve({ success: false, error: "无法解析任务响应" });
            }
          } else {
            resolve({ success: false, error: "无效响应" });
          }
        } catch (e: any) {
          resolve({ success: false, error: e.message });
        }
      });
    });

    req.on("error", (e: any) => resolve({ success: false, error: e.message }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ success: false, error: "请求超时" });
    });

    req.write(postData);
    req.end();
  });
}

// Main search function
async function search(options: AISearchOptions): Promise<void> {
  const startTime = Date.now();
  printHeader("Qwen AI 任务");

  // 1. 验证输入参数 - 显示搜索信息
  log("🤖 AI 输入信息:", colors.bright);
  log(`   输入内容: ${options.input}`, colors.cyan);
  if (options.role) log(`   AI 角色: ${options.role}`, colors.cyan);
  if (options.output) log(`   输出要求: ${options.output}`, colors.cyan);
  console.log();

  // 2. 检查 DHF Agent MCP 服务
  log("🔍 检查 DHF Agent 服务...", colors.yellow);
  try {
    await checkMCPServer();
    log("✅ DHF Agent 服务正常", colors.green);
  } catch (error: any) {
    log(`❌ DHF Agent 不可用: ${error.message}`, colors.red);
    log("   请确保 DHF Agent 正在运行", colors.yellow);
    log("   启动命令: /dhf-install-agent --open", colors.gray);
    process.exit(1);
  }
  console.log();

  // 3. 调用任务
  const taskInput: AISearchInput = {
    input_text: options.input!,
    out_text: options.output || "",
    role_text: options.role || ""
  };

  log("🚀 启动 Qwen AI 任务...", colors.yellow);
  log(`   任务 ID: ${TASK_ID}`, colors.cyan);
  console.log();

  const result = await callTaskAPI(taskInput);

  if (!result.success) {
    log(`❌ 任务启动失败: ${result.error}`, colors.red);
    process.exit(1);
  }

  // 4-5. 浏览器将自动打开并执行 AI 问答
  log("✅ AI 任务已启动!", colors.green);
  log(`   执行 ID (run_id): ${result.run_id}`, colors.cyan);
  console.log();

  // 轮询执行结果
  log("⏳ AI 正在处理，请等待...", colors.yellow);
  log("   浏览器将自动打开并执行", colors.gray);
  console.log();

  const execResult = await pollExecution(TASK_ID, result.run_id!, true);

  if (execResult.success) {
    console.log();
    log("🎉 AI 处理完成!", colors.green);
    log(`   状态: ${execResult.status}`, colors.cyan);
    log(`   用时: ${Math.floor((Date.now() - startTime) / 1000)}秒`, colors.cyan);

    // 显示 AI 结果
    if (execResult.result && typeof execResult.result === 'object') {
      const outputText = execResult.result.outputText || execResult.result.output || execResult.result.result || "";
      if (outputText) {
        console.log();
        log(`📝 AI 回复:`, colors.bright);
        console.log();
        log(String(outputText).slice(0, 1000), colors.reset);
        if (String(outputText).length > 1000) {
          log("...", colors.gray);
          log(`   (完整结果共 ${String(outputText).length} 字符)`, colors.gray);
        }
      }
    }
    console.log();
  } else {
    console.log();
    log(`❌ AI 处理失败: ${execResult.error}`, colors.red);
    process.exit(1);
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  const options = parseArgs(args);

  // Handle --check
  if (options.check) {
    printHeader("DHF Agent 连接测试");
    log("正在检查 DHF Agent 服务...", colors.yellow);

    try {
      await checkMCPServer();
      log("✅ DHF Agent 服务正常!", colors.green);
      log(`   服务地址: ${MCP_SERVER.host}:${MCP_SERVER.port}`, colors.cyan);
      log(`   任务 ID: ${TASK_ID}`, colors.cyan);
      process.exit(0);
    } catch (error: any) {
      log(`❌ DHF Agent 服务不可用`, colors.red);
      log(`   错误: ${error.message}`, colors.gray);
      console.log();
      log("请确保 DHF Agent 正在运行:", colors.yellow);
      log("  /dhf-install-agent --open", colors.gray);
      process.exit(1);
    }
  }

  // 1. 验证输入参数 - 检查必填参数
  if (!options.input) {
    log("❌ 缺少必填参数: --input / --keyword", colors.red);
    console.log();
    log("使用 --help 或 -h 查看帮助信息", colors.yellow);
    process.exit(1);
  }

  await search(options);
}

main().catch((error: any) => {
  log(`❌ 错误: ${error.message}`, colors.red);
  process.exit(1);
});
