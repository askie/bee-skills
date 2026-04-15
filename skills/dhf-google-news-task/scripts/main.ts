#!/usr/bin/env bun
import { readFileSync, existsSync, writeFileSync, unlinkSync } from "fs";
import { request } from "http";
import { resolve, join } from "path";
import { spawn } from "child_process";
import { platform, tmpdir, homedir } from "os";

// Types
interface NewsOptions {
  lang?: string;
  limit?: number;
  output?: string;
  check?: boolean;
  verbose?: boolean;
}

interface TaskInput {
}

interface NewsResult {
  title: string;
  link: string;
  source?: string;
  time?: string;
  publish_time?: string;
}

// Constants
const TASK_ID = "8q8FoZ";
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
const LOCK_FILE = join(tmpdir(), "dhf-google-news-task.lock");
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
      // Ignore errors when releasing lock
    }
  }
}

// Parse command line arguments
function parseArgs(args: string[]): NewsOptions {
  const options: Partial<NewsOptions> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case "--lang":
      case "-l":
        options.lang = nextArg;
        i++;
        break;
      case "--limit":
      case "-n":
        options.limit = parseInt(nextArg, 10);
        i++;
        break;
      case "--output":
      case "-o":
        options.output = nextArg;
        i++;
        break;
      case "--verbose":
      case "-v":
        options.verbose = true;
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

  // Set defaults
  if (!options.lang) options.lang = "zh-CN";

  return options as NewsOptions;
}

// Show help
function showHelp() {
  printHeader("DHF Google News Task - Google 新闻热门");
  console.log();
  log("用法:", colors.bright);
  console.log();
  log("  /dhf-google-news-task [options]", colors.cyan);
  console.log();
  log("可选参数:", colors.bright);
  console.log();
  log("  --lang, -l       语言/地区代码 (默认: zh-CN)", colors.cyan);
  log("  --limit, -n      返回新闻数量 (默认: 全部)", colors.cyan);
  log("  --output, -o     输出文件路径 (JSON格式)", colors.cyan);
  log("  --verbose, -v    显示详细输出", colors.cyan);
  log("  --check          检查 DHF Agent 连接", colors.cyan);
  console.log();
  log("说明:", colors.bright);
  console.log();
  log("  此任务获取 Google News 首页的热门新闻", colors.gray);
  log("  不支持搜索特定关键词", colors.gray);
  console.log();
  log("语言代码:", colors.bright);
  console.log();
  log("  zh-CN  简体中文（中国）", colors.gray);
  log("  zh-TW  繁体中文（台湾）", colors.gray);
  log("  ja     日本语", colors.gray);
  log("  ko     韩语", colors.gray);
  log("  en-US  英语（美国）", colors.gray);
  console.log();
  log("示例:", colors.bright);
  console.log();
  log("  # 获取中文热门新闻", colors.gray);
  log("  /dhf-google-news-task", colors.green);
  console.log();
  log("  # 获取英文热门新闻", colors.gray);
  log("  /dhf-google-news-task --lang \"en-US\"", colors.green);
  console.log();
  log("  # 保存结果", colors.gray);
  log("  /dhf-google-news-task --output \"./news.json\"", colors.green);
  console.log();
  log("任务信息:", colors.bright);
  console.log();
  log(`  任务 ID: ${TASK_ID}`, colors.cyan);
  log(`  MCP 服务: dhf_rpa_task`, colors.cyan);
  log(`  访问网站: Google News`, colors.cyan);
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
function getLocalRunResult(taskId: string, runId: string): { success: boolean; status?: string; error?: string; result?: any } | null {
  const runDir = join(getDHFDataDir(), taskId, "run");
  if (!existsSync(runDir)) {
    return null;
  }

  try {
    const fs = require("fs");
    const files = fs.readdirSync(runDir);
    const finishFiles = files.filter((f: string) => f.startsWith(`finish.${runId}.`));

    if (finishFiles.length === 0) {
      return null;
    }

    // Read the latest finish file
    const filePath = join(runDir, finishFiles[finishFiles.length - 1]);
    const content = readFileSync(filePath, "utf-8");

    const statusMatch = content.match(/\*\*Status\*:\*\s*`(\w+)`/);
    if (!statusMatch) {
      return null;
    }

    const status = statusMatch[1];
    if (status === "success" || status === "completed" || status === "SUCCESS") {
      let result: any = null;

      // First, try to read news.json file directly
      const newsJsonPath = join(runDir, "news.json");
      if (existsSync(newsJsonPath)) {
        try {
          const newsContent = readFileSync(newsJsonPath, "utf-8");
          result = JSON.parse(newsContent);
        } catch {
          // If news.json fails, try other methods
        }
      }

      // If news.json doesn't exist or failed, try to extract from finish file
      if (!result) {
        // Try to extract the news array from the output variable section
        const newsMatch = content.match(/\*\*Output Variable\*:\*\s*`news`\s*\n\s*\*\*Value\*:\*\s*`(\[.+\])`/s);
        if (newsMatch) {
          try {
            result = JSON.parse(newsMatch[1]);
          } catch {
            // If parsing fails, the value might be truncated
          }
        }

        // Still no result? Try extracting from global variables
        if (!result) {
          const varsMatch = content.match(/```json\n([\s\S]*?)\n```/);
          if (varsMatch) {
            try {
              const parsed = JSON.parse(varsMatch[1]);
              // If parsed data has news property, use it
              result = parsed.news || parsed;
            } catch {
              // Ignore parse errors
            }
          }
        }
      }

      return { success: true, status, result };
    } else if (status === "failed" || status === "error" || status === "FAILED" || status === "ERROR") {
      const errorMatch = content.match(/\*\*Error\*:\*\s*(.+?)(?:\n|$)/);
      return { success: false, error: errorMatch ? errorMatch[1] : "执行失败", status };
    }

    return null;
  } catch {
    return null;
  }
}

// Call task API
function callTaskAPI(): Promise<{ success: boolean; run_id?: string; local_task_id?: string; error?: string }> {
  return new Promise((resolve) => {
    const inputJson = JSON.stringify({});

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
function pollExecution(taskId: string, runId: string, verbose = false): Promise<{ success: boolean; status?: string; error?: string; result?: any }> {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const poll = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed > MAX_POLL_TIME) {
        const localResult = getLocalRunResult(taskId, runId);
        if (localResult && localResult.status !== "running") {
          if (verbose) {
            console.log();
            log(`   📁 超时后从本地文件读取结果`, colors.cyan);
          }
          resolve(localResult!);
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
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": Buffer.byteLength(postData, "utf8"),
        },
      };

      const req = request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          if (!data.trim().startsWith("{")) {
            if (verbose) {
              process.stdout.write(`\r   获取新闻中... ${Math.floor(elapsed / 1000)}秒`);
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

              if (result.status === "completed" || result.status === "SUCCESS" || result.status === "success") {
                if (verbose) console.log();

                // The MCP response might not include the actual news data
                // Try to get it from local files if result.result is empty
                let finalResult = result.result;
                if (!finalResult || (Array.isArray(finalResult) && finalResult.length === 0)) {
                  const localResult = getLocalRunResult(taskId, runId);
                  if (localResult && localResult.result) {
                    finalResult = localResult.result;
                  }
                }

                resolve({ success: true, status: result.status, result: finalResult });
              } else if (result.status === "failed" || result.status === "FAILED" || result.status === "error") {
                if (verbose) console.log();
                resolve({ success: false, error: result.message || result.result || "执行失败" });
              } else if (result.status === "running" || result.status === "PENDING") {
                setTimeout(poll, POLL_INTERVAL);
              } else {
                setTimeout(poll, POLL_INTERVAL);
              }
            } else {
              setTimeout(poll, POLL_INTERVAL);
            }
          } catch (e) {
            setTimeout(poll, POLL_INTERVAL);
          }
        });
      });

      req.on("error", () => {
        // Try reading from local filesystem as fallback
        const localResult = getLocalRunResult(taskId, runId);
        if (localResult && localResult.status !== "running") {
          if (verbose) {
            console.log();
            log(`   📁 从本地文件读取结果`, colors.cyan);
          }
          resolve(localResult!);
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

// Display news results
function displayNewsResults(news: NewsResult[], title: string): void {
  console.log();
  log("═══════════════════════════════════════════════════════════════════", colors.cyan);
  log(`  ${title}`, colors.bright + colors.cyan);
  log(`  找到 ${news.length} 条新闻`, colors.bright + colors.cyan);
  log("═══════════════════════════════════════════════════════════════════", colors.cyan);
  console.log();

  news.forEach((item, index) => {
    log(`${index + 1}. ${item.title}`, colors.bright + colors.green);
    log(`   链接: ${item.link}`, colors.blue);

    // Use publish_time if available, otherwise use time
    const timeInfo = item.publish_time || item.time;
    if (item.source) {
      log(`   来源: ${item.source} ${timeInfo ? '| ' + timeInfo : ''}`, colors.gray);
    } else if (timeInfo) {
      log(`   时间: ${timeInfo}`, colors.gray);
    }
    console.log();
  });
}

// Save results to file
function saveResultsToFile(news: NewsResult[], title: string, filePath: string): void {
  const output = {
    title,
    timestamp: new Date().toISOString(),
    total: news.length,
    news,
  };

  try {
    writeFileSync(filePath, JSON.stringify(output, null, 2), "utf-8");
    log(`✅ 结果已保存到: ${filePath}`, colors.green);
  } catch (error: any) {
    log(`❌ 保存文件失败: ${error.message}`, colors.red);
  }
}

// Get news
async function getNews(options: NewsOptions, verbose = false): Promise<void> {
  const startTime = Date.now();
  printHeader("Google 新闻热门");

  // Display search info
  log("📰 正在获取热门新闻...", colors.bright);
  log(`   语言: ${options.lang}`, colors.cyan);
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
      process.exit(1);
    }
  }
  console.log();

  // Call task (no input parameters needed)
  log("🚀 启动 Google 新闻任务...", colors.yellow);
  log(`   任务 ID: ${TASK_ID}`, colors.cyan);
  log(`   目标: Google News 首页`, colors.cyan);
  console.log();

  const taskResult = await callTaskAPI();

  if (!taskResult.success) {
    log(`❌ 任务启动失败: ${taskResult.error}`, colors.red);
    process.exit(1);
  }

  log("✅ 任务启动成功!", colors.green);
  log(`   执行 ID: ${taskResult.run_id}`, colors.cyan);
  console.log();

  // Poll result
  log("⏳ 正在获取新闻，请等待...", colors.yellow);
  console.log();

  const execResult = await pollExecution(taskResult.local_task_id!, taskResult.run_id!, verbose);

  if (execResult.success && execResult.result) {
    // Handle different result formats
    let news: NewsResult[] = [];

    if (Array.isArray(execResult.result)) {
      news = execResult.result;
    } else if (execResult.result.news && Array.isArray(execResult.result.news)) {
      news = execResult.result.news;
    } else if (execResult.result.articles && Array.isArray(execResult.result.articles)) {
      news = execResult.result.articles;
    }

    console.log();
    log("🎉 获取完成!", colors.green);
    log(`   找到 ${news.length} 条热门新闻`, colors.cyan);
    log(`   用时: ${Math.floor((Date.now() - startTime) / 1000)}秒`, colors.cyan);
    console.log();

    if (news.length > 0) {
      // Apply limit if specified
      const displayNews = options.limit ? news.slice(0, options.limit) : news;
      const langName = options.lang === "zh-CN" ? "中文" : options.lang === "en-US" ? "英文" : options.lang;
      displayNewsResults(displayNews, `Google ${langName}热门新闻`);

      // Save to file if output path is specified
      if (options.output) {
        saveResultsToFile(displayNews, `Google ${langName}热门新闻`, options.output);
      }
    } else {
      log("⚠️ 未获取到新闻", colors.yellow);
      log("   建议:", colors.gray);
      log("   - 检查网络连接", colors.gray);
      log("   - 尝试不同的语言/地区", colors.gray);
    }

    process.exit(0);
  } else {
    console.log();
    log(`❌ 获取失败: ${execResult.error}`, colors.red);
    console.log();
    log("可能的原因:", colors.yellow);
    log("  - Google News 页面结构可能已更新", colors.gray);
    log("  - 网络连接问题", colors.gray);
    process.exit(1);
  }
}

// Main function
async function main() {
  // Acquire lock to prevent duplicate execution
  if (!acquireLock()) {
    log("⚠️ 检测到另一个新闻任务正在运行，已跳过重复执行", colors.yellow);
    process.exit(0);
  }

  // Ensure lock is released on exit
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
    // No args - just run with defaults
    await getNews({}, false);
    return;
  }

  const options = parseArgs(args);
  const verbose = args.includes("-v") || args.includes("--verbose") || options.verbose;

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

  await getNews(options, verbose);
  releaseLock();
}

main().catch((error) => {
  log(`❌ 错误: ${error.message}`, colors.red);
  releaseLock();
  process.exit(1);
});
