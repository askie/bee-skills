#!/usr/bin/env bun
import { readFileSync, existsSync, writeFileSync, unlinkSync, readdirSync } from "fs";
import { request } from "http";
import { resolve, join } from "path";
import { spawn } from "child_process";
import { platform, tmpdir, homedir } from "os";

// Types
interface MailOptions {
  to?: string;
  subject?: string;
  body?: string;
  attachment?: string | string[];
  cc?: string;
  bcc?: string;
  check?: boolean;
}

interface TaskInput {
  toAddress: string;
  subject: string;
  bodyContent: string;
  attachmentPaths?: Array<{ path: string; filename: string }>;
}

// Constants
const TASK_ID = "NRxq1h";
const MCP_SERVER = { host: "localhost", port: 6869 };
const POLL_INTERVAL = 5000; // 5 seconds
const MAX_POLL_TIME = 300000; // 5 minutes

// DHF Agent paths
const getDHFPath = (): string | null => {
  const platformName = platform();
  if (platformName === "win32") {
    const localAppData = process.env.LOCALAPPDATA || "";
    const path1 = join(localAppData, "Programs", "DHF-Bee-Agent", "DHF-Bee-Agent.exe");
    const path2 = join(process.env.PROGRAMFILES || "", "DHF-Bee-Agent", "DHF-Bee-Agent.exe");
    const path3 = join(process.env.APPDATA || "", "DHF-Bee-Agent", "DHF-Bee-Agent.exe");
    if (existsSync(path1)) return path1;
    if (existsSync(path2)) return path2;
    if (existsSync(path3)) return path3;
  } else if (platformName === "darwin") {
    const path = "/Applications/DHF-Bee-Agent.app";
    if (existsSync(path)) return path;
  } else if (platformName === "linux") {
    const path = join(process.env.HOME || "", ".local", "share", "DHF-Bee-Agent", "dhf-bee-agent");
    if (existsSync(path)) return path;
  }
  return null;
};

// Color output helpers
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

// Lock file to prevent duplicate execution
const LOCK_FILE = join(tmpdir(), "dhf-qq-mail-task.lock");
const LOCK_TIMEOUT = 60000; // 60 seconds
let lockFileCreated = false;

function acquireLock(): boolean {
  try {
    if (existsSync(LOCK_FILE)) {
      const lockTime = parseInt(readFileSync(LOCK_FILE, "utf-8"), 10);
      const now = Date.now();
      if (now - lockTime < LOCK_TIMEOUT) {
        return false;
      }
      unlinkSync(LOCK_FILE);
    }
    writeFileSync(LOCK_FILE, Date.now().toString());
    lockFileCreated = true;
    return true;
  } catch {
    return false;
  }
}

function releaseLock(): void {
  if (lockFileCreated && existsSync(LOCK_FILE)) {
    try {
      unlinkSync(LOCK_FILE);
    } catch {
      // Ignore errors
    }
  }
}

// Parse command line arguments
function parseArgs(args: string[]): MailOptions {
  const options: Partial<MailOptions> = {};
  const required: (keyof MailOptions)[] = ["to", "subject", "body"];
  const attachments: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case "--to":
      case "-t":
        options.to = nextArg;
        i++;
        break;
      case "--subject":
      case "-s":
        options.subject = nextArg;
        i++;
        break;
      case "--body":
      case "-b":
        options.body = nextArg;
        i++;
        break;
      case "--attachment":
      case "-a":
        attachments.push(nextArg);
        i++;
        break;
      case "--cc":
      case "-c":
        options.cc = nextArg;
        i++;
        break;
      case "--bcc":
      case "-B":
        options.bcc = nextArg;
        i++;
        break;
      case "--check":
        options.check = true;
        break;
      case "--help":
      case "-h":
        showHelp();
        process.exit(0);
    }
  }

  // Convert attachments array to attachment field
  if (attachments.length > 0) {
    options.attachment = attachments.length === 1 ? attachments[0] : attachments;
  }

  // Check required fields (skip if --check is used)
  if (!options.check) {
    const missing = required.filter((field) => !options[field]);
    if (missing.length > 0) {
      log(`❌ 缺少必填参数: ${missing.join(", ")}`, colors.red);
      console.log();
      log("使用 --help 查看帮助信息", colors.yellow);
      process.exit(1);
    }
  }

  return options as MailOptions;
}

// Show help
function showHelp() {
  printHeader("DHF QQ Mail Task - QQ 邮件自动发送");
  console.log();
  log("用法:", colors.bright);
  console.log();
  log("  /dhf-qq-mail-task [options]", colors.cyan);
  console.log();
  log("必填参数:", colors.bright);
  console.log();
  log("  --to, -t         收件人邮箱地址（多个用逗号分隔）", colors.cyan);
  log("  --subject, -s    邮件主题", colors.cyan);
  log("  --body, -b       邮件正文内容", colors.cyan);
  console.log();
  log("可选参数:", colors.bright);
  console.log();
  log("  --attachment, -a  附件文件路径", colors.cyan);
  log("  --cc, -c         抄送邮箱地址", colors.cyan);
  log("  --bcc, -B        密送邮箱地址", colors.cyan);
  log("  --check          检查 DHF Agent 连接", colors.cyan);
  log("  -v, --verbose    显示详细输出", colors.cyan);
  console.log();
  log("示例:", colors.bright);
  console.log();
  log("  # 发送简单邮件", colors.gray);
  log("  /dhf-qq-mail-task --to \"friend@qq.com\" --subject \"聚会\" --body \"周末有空吗？\"", colors.green);
  console.log();
  log("  # 发送带附件的邮件", colors.gray);
  log("  /dhf-qq-mail-task --to \"colleague@qq.com\" --subject \"报告\" \\ ", colors.green);
  log("    --body \"附件是报告\" --attachment \"/path/to/report.pdf\"", colors.green);
  console.log();
  log("  # 群发邮件", colors.gray);
  log("  /dhf-qq-mail-task --to \"a@qq.com,b@qq.com\" --subject \"会议\" --body \"周五开会\"", colors.green);
  console.log();
  log("任务信息:", colors.bright);
  console.log();
  log(`  任务 ID: ${TASK_ID}`, colors.cyan);
  log(`  MCP 服务: dhf_rpa_task`, colors.cyan);
  console.log();
}

// Start DHF Agent
async function startDHF(): Promise<boolean> {
  const dhfPath = getDHFPath();
  if (!dhfPath) {
    log("❌ 未找到 DHF Agent 安装", colors.red);
    log("   请运行: /dhf-install-agent --install", colors.yellow);
    return false;
  }

  log("🚀 正在启动 DHF Agent...", colors.yellow);

  try {
    const platformName = platform();
    let command: string;
    let args: string[];

    if (platformName === "win32") {
      command = "start";
      args = ["", dhfPath];
    } else if (platformName === "darwin") {
      command = "open";
      args = [dhfPath];
    } else {
      command = dhfPath;
      args = [];
    }

    spawn(command, args, { shell: true, detached: true });
    log("✅ DHF Agent 启动命令已执行", colors.green);
    return true;
  } catch (error: any) {
    log(`❌ 启动失败: ${error.message}`, colors.red);
    return false;
  }
}

// Wait for MCP server to be ready
async function waitForMCPServer(maxWait = 30000): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < maxWait) {
    try {
      await checkMCPServer();
      return;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error("等待 DHF Agent 启动超时");
}

// Check MCP server availability
function checkMCPServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = request({
      ...MCP_SERVER,
      path: "/http/task",
      method: "POST",
      timeout: 5000,
    }, (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject(new Error(`服务返回 ${res.statusCode}`));
      }
    }).on("error", reject);

    req.write(
      JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/list",
      })
    );
    req.end();
  });
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
function getLocalRunResult(taskId: string, runId: string): { success: boolean; status?: string; error?: string } | null {
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
    const statusMatch = content.match(/\*\*Status\*:\*\s*`(\w+)`/);
    if (!statusMatch) {
      return null;
    }

    const status = statusMatch[1];
    if (status === "success" || status === "completed" || status === "SUCCESS") {
      return { success: true, status };
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

// Call task API
function callTaskAPI(input: any): Promise<{ success: boolean; run_id?: string; local_task_id?: string; error?: string }> {
  return new Promise((resolve) => {
    // Serialize input to JSON string (preserves Chinese)
    const inputJson = JSON.stringify(input);

    // Construct the request manually
    const postData = `{
      "jsonrpc": "2.0",
      "id": ${Date.now()},
      "method": "tools/call",
      "params": {
        "name": "task_market_run",
        "arguments": {
          "task_id": "${TASK_ID}",
          "input_data": ${JSON.stringify(inputJson)}
        }
      }
    }`;

    const options = {
      ...MCP_SERVER,
      path: "/http/task",
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(postData, "utf8"),
      },
      timeout: 30000,
    };

    const req = request(options, (res) => {
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
            const result = JSON.parse(response.result.content[0].text);
            resolve({ success: true, run_id: result.run_id, local_task_id: result.local_task_id || TASK_ID });
          } else {
            resolve({ success: false, error: "无效响应" });
          }
        } catch (e) {
          resolve({ success: false, error: e.message });
        }
      });
    });

    req.on("error", (e) => resolve({ success: false, error: e.message }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ success: false, error: "请求超时" });
    });

    req.write(postData);
    req.end();
  });
}

// Poll task execution result
function pollExecution(taskId: string, runId: string, verbose = false): Promise<{ success: boolean; status?: string; error?: string }> {
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
            if (verbose) {
              console.log();
              log(`   ⚠️ 收到非 JSON 响应: ${data.trim().substring(0, 100)}`, colors.yellow);
            }
            // Non-JSON might mean task is still running, continue polling
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
                resolve({ success: true, status: result.status });
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
                    resolve({ success: true, status: "completed" });
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
            if (verbose) {
              console.log();
              log(`   ⚠️ 解析响应失败: ${e.message}`, colors.yellow);
              log(`   响应内容: ${data.trim().substring(0, 200)}`, colors.gray);
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

// Send mail
async function sendMail(options: MailOptions, verbose = false): Promise<void> {
  const startTime = Date.now();
  printHeader("QQ 邮件发送任务");

  // Validate attachment(s) if provided
  const attachmentList = Array.isArray(options.attachment) ? options.attachment : (options.attachment ? [options.attachment] : []);
  for (const attachment of attachmentList) {
    if (!existsSync(resolve(attachment))) {
      log(`❌ 附件文件不存在: ${attachment}`, colors.red);
      process.exit(1);
    }
  }

  // Display mail info
  log("📧 邮件信息:", colors.bright);
  log(`   收件人: ${options.to}`, colors.cyan);
  log(`   主题: ${options.subject}`, colors.cyan);
  log(`   正文: ${options.body.substring(0, 50)}${options.body.length > 50 ? "..." : ""}`, colors.cyan);
  if (attachmentList.length > 0) {
    log(`   附件数量: ${attachmentList.length}`, colors.cyan);
    attachmentList.forEach((att, index) => {
      log(`     ${index + 1}. ${att}`, colors.gray);
    });
  }
  if (options.cc) log(`   ⚠️ 抄送功能可能不支持: ${options.cc}`, colors.yellow);
  if (options.bcc) log(`   ⚠️ 密送功能可能不支持: ${options.bcc}`, colors.yellow);
  console.log();

  // Check MCP server
  log("🔍 检查 DHF Agent 服务...", colors.yellow);
  try {
    await checkMCPServer();
    log("✅ DHF Agent 服务正常", colors.green);
  } catch {
    log("⚠️ DHF Agent 未运行，正在自动启动...", colors.yellow);
    console.log();

    const started = await startDHF();
    if (!started) {
      process.exit(1);
    }

    log("⏳ 等待 DHF Agent 启动...", colors.yellow);
    try {
      await waitForMCPServer(30000);
      log("✅ DHF Agent 已就绪!", colors.green);
    } catch {
      log("❌ DHF Agent 启动超时", colors.red);
      log("   请手动检查 DHF Agent 是否正常运行", colors.yellow);
      process.exit(1);
    }
  }
  console.log();

  // Prepare task input
  const taskInput: any = {
    toAddress: options.to,
    subject: options.subject,
    bodyContent: options.body,
    ...(attachmentList.length > 0 && {
      attachmentPaths: attachmentList.map(att => ({
        path: resolve(att),
        filename: att.split('/').pop() || att.split('\\').pop() || att
      }))
    })
  };

  // Call task
  log("🚀 启动 QQ 邮件发送任务...", colors.yellow);
  log(`   任务 ID: ${TASK_ID}`, colors.cyan);
  log(`   发送数据: ${JSON.stringify(taskInput.initialState, null, 2)}`, colors.gray);
  console.log();

  const taskResult = await callTaskAPI(taskInput);

  if (!taskResult.success) {
    log(`❌ 任务启动失败: ${taskResult.error}`, colors.red);
    process.exit(1);
  }

  log("✅ 任务启动成功!", colors.green);
  log(`   执行 ID: ${taskResult.run_id}`, colors.cyan);
  log(`   本地任务 ID: ${taskResult.local_task_id}`, colors.cyan);
  console.log();

  // Poll result
  log("⏳ 正在发送邮件，请等待...", colors.yellow);
  log("   QQ 浏览器将自动打开并执行发送操作", colors.gray);
  console.log();

  const execResult = await pollExecution(taskResult.local_task_id!, taskResult.run_id!, verbose);

  if (execResult.success) {
    console.log();
    log("🎉 邮件发送成功!", colors.green);
    log(`   状态: ${execResult.status}`, colors.cyan);
    log(`   用时: ${Math.floor((Date.now() - startTime) / 1000)}秒`, colors.cyan);
    process.exit(0);
  } else {
    console.log();
    log(`❌ 邮件发送失败: ${execResult.error}`, colors.red);
    process.exit(1);
  }
}

// Main function
async function main() {
  // Acquire lock to prevent duplicate execution
  if (!acquireLock()) {
    log("⚠️ 检测到另一个邮件发送任务正在运行，已跳过重复执行", colors.yellow);
    process.exit(0);
  }

  const cleanup = () => {
    releaseLock();
  };
  process.on('exit', cleanup);
  process.on('SIGINT', () => {
    cleanup();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    cleanup();
    process.exit(0);
  });

  const args = process.argv.slice(2);

  if (args.length === 0) {
    showHelp();
    releaseLock();
    process.exit(0);
  }

  const options = parseArgs(args);
  const verbose = args.includes("-v") || args.includes("--verbose");

  // Handle --check flag
  if (options.check) {
    printHeader("DHF Agent 连接测试");
    log("正在检查 DHF Agent 服务...", colors.yellow);

    try {
      await checkMCPServer();
      log("✅ DHF Agent 服务正常!", colors.green);
      log(`   服务地址: ${MCP_SERVER.host}:${MCP_SERVER.port}`, colors.cyan);
      log(`   任务 ID: ${TASK_ID}`, colors.cyan);
      releaseLock();
      process.exit(0);
    } catch (error: any) {
      log(`❌ DHF Agent 服务不可用`, colors.red);
      log(`   错误: ${error.message}`, colors.gray);
      log("", colors.reset);
      log("请确保 DHF Agent 正在运行:", colors.yellow);
      log("  /dhf-install-agent --open", colors.gray);
      releaseLock();
      process.exit(1);
    }
  }

  await sendMail(options, verbose);
  releaseLock();
}

main().catch((error) => {
  log(`❌ 错误: ${error.message}`, colors.red);
  releaseLock();
  process.exit(1);
});
