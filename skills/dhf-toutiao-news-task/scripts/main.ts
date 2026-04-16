#!/usr/bin/env bun
/**
 * DHF Toutiao News Task
 *
 * 自动调用 DHF Agent 任务获取今日头条热门新闻
 */

import { join } from "node:path";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";

// ==================== 配置常量 ====================

const TASK_ID = "GmURwo";
const OUTPUT_FILE = "news.json";

const MCP_SERVER = {
  host: 'localhost',
  port: 6869
};

const POLL_INTERVAL = 5000; // 5秒
const MAX_POLL_TIME = 300000; // 5分钟

// ==================== 类型定义 ====================

interface Options {
  limit?: number;
  output?: string;
  verbose?: boolean;
  check?: boolean;
}

interface ToutiaoNewsResult {
  title: string;
  link: string;
  source?: string;
  publish_time?: string;
}

interface ToutiaoNewsResponse {
  success: boolean;
  data: ToutiaoNewsResult[];
  total: number;
  source: string;
}

// ==================== ANSI 颜色代码 ====================

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  white: "\x1b[37m"
};

// ==================== 工具函数 ====================

/**
 * 带颜色的日志输出
 */
function log(message: string, color: string = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * 错误日志
 */
function logError(message: string) {
  console.error(`${colors.red}${message}${colors.reset}`);
}

/**
 * 成功日志
 */
function logSuccess(message: string) {
  console.log(`${colors.green}${message}${colors.reset}`);
}

/**
 * 警告日志
 */
function logWarning(message: string) {
  console.log(`${colors.yellow}${message}${colors.reset}`);
}

/**
 * 获取 DHF Agent 数据目录
 */
function getDHFDataDir(): string {
  const platform = process.platform;
  if (platform === "win32") {
    return join(process.env.APPDATA || "", "dhf-agent", "work", "data");
  } else if (platform === "darwin") {
    return join(homedir(), "Library", "Application Support", "dhf-agent", "work", "data");
  } else {
    return join(homedir(), ".local", "share", "dhf-agent", "work", "data");
  }
}

/**
 * 从本地文件读取任务运行结果
 */
function getLocalRunResult(runId: string): ToutiaoNewsResult[] | null {
  const dataDir = getDHFDataDir();
  const runDir = join(dataDir, TASK_ID, "run");

  log(`\n📂 尝试从本地读取结果...`, colors.cyan);

  // 方法1: 直接读取 news.json 文件
  const newsJsonPath = join(runDir, OUTPUT_FILE);
  if (existsSync(newsJsonPath)) {
    try {
      const content = readFileSync(newsJsonPath, "utf-8");
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) {
        log(`✅ 成功从 ${OUTPUT_FILE} 读取到 ${data.length} 条新闻`, colors.green);
        return data;
      }
    } catch (e) {
      logWarning(`⚠️  读取 ${OUTPUT_FILE} 失败: ${e}`);
    }
  }

  // 方法2: 尝试其他可能的文件名
  const possibleFiles = ["hot_news.json", "toutiao_news.json", "result.json"];
  for (const fileName of possibleFiles) {
    const resultPath = join(runDir, fileName);
    if (existsSync(resultPath)) {
      try {
        const resultContent = readFileSync(resultPath, "utf-8");
        const parsed = JSON.parse(resultContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          log(`✅ 成功从 ${fileName} 读取到 ${parsed.length} 条新闻`, colors.green);
          return parsed;
        }
      } catch {
        continue;
      }
    }
  }

  // 方法3: 从 finish.md 文件中提取
  const finishDir = join(runDir, `finish.${runId}`);
  if (existsSync(finishDir)) {
    const finishFiles = require("node:fs").readdirSync(finishDir).filter((f: string) => f.endsWith(".md"));
    if (finishFiles.length > 0) {
      const finishPath = join(finishDir, finishFiles[0]);
      try {
        const finishContent = readFileSync(finishPath, "utf-8");
        // 尝试提取 JSON 数据
        const jsonMatch = finishContent.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          if (Array.isArray(data) && data.length > 0) {
            log(`✅ 成功从 finish.md 读取到 ${data.length} 条新闻`, colors.green);
            return data;
          }
        }
      } catch (e) {
        logWarning(`⚠️  从 finish.md 提取数据失败: ${e}`);
      }
    }
  }

  logError(`❌ 无法从本地文件读取新闻数据`);
  return null;
}

/**
 * 解析命令行参数
 */
function parseArgs(): Options {
  const args = process.argv.slice(2);
  const options: Options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--limit":
      case "-n":
        options.limit = parseInt(args[++i]);
        break;
      case "--output":
      case "-o":
        options.output = args[++i];
        break;
      case "--verbose":
      case "-v":
        options.verbose = true;
        break;
      case "--check":
      case "-c":
        options.check = true;
        break;
      default:
        if (arg.startsWith("--")) {
          logError(`未知参数: ${arg}`);
          console.log("\n使用方法:");
          console.log("  /dhf-toutiao-news-task [选项]");
          console.log("\n选项:");
          console.log("  --limit, -n <数量>     限制返回的新闻数量");
          console.log("  --output, -o <路径>    保存结果到文件");
          console.log("  --verbose, -v          显示详细输出");
          console.log("  --check, -c            检查 DHF Agent 连接");
          process.exit(1);
        }
    }
  }

  return options;
}

// ==================== MCP 客户端操作 ====================

/**
 * 检查 MCP 服务是否可用
 */
async function checkMCPService(): Promise<boolean> {
  try {
    const response = await fetch(`http://${MCP_SERVER.host}:${MCP_SERVER.port}/`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * 通过 MCP 调用工具
 */
async function callMCPTool(toolName: string, arguments_: Record<string, any>): Promise<any> {
  const response = await fetch(`http://${MCP_SERVER.host}:${MCP_SERVER.port}/mcp/call`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: toolName,
        arguments: arguments_
      }
    }),
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    throw new Error(`MCP 调用失败: ${response.status}`);
  }

  const result = await response.json();

  if (result.error) {
    throw new Error(`MCP 错误: ${result.error.message}`);
  }

  return result.result;
}

/**
 * 启动 DHF Agent 任务
 */
async function startTask(): Promise<string> {
  log(`\n🚀 启动今日头条新闻任务 (ID: ${TASK_ID})...`, colors.cyan);

  const result = await callMCPTool("task_market_run", {
    task_id: TASK_ID,
    input_data: JSON.stringify({
      initialState: {}
    })
  });

  if (result.success) {
    logSuccess(`✅ 任务已启动，run_id: ${result.run_id}`);
    return result.run_id;
  } else {
    throw new Error(`任务启动失败: ${result.error || "未知错误"}`);
  }
}

/**
 * 轮询任务执行结果
 */
async function pollExecution(runId: string, options: Options): Promise<ToutiaoNewsResult[]> {
  const startTime = Date.now();
  let lastStatus = "";

  log(`\n⏳ 轮询任务执行状态...`, colors.cyan);

  while (Date.now() - startTime < MAX_POLL_TIME) {
    try {
      const result = await callMCPTool("task_run_result", {
        task_id: TASK_ID,
        run_id: runId
      });

      const status = result.status || "running";

      if (status !== lastStatus) {
        log(`📊 状态: ${status}`, colors.blue);
        lastStatus = status;
      }

      if (status === "success") {
        logSuccess(`✅ 任务执行成功`);

        // 尝试从 MCP 响应中获取新闻数据
        let news: ToutiaoNewsResult[] | undefined;

        if (result.output && typeof result.output === "object") {
          // 检查 output 是否直接包含新闻数组
          if (Array.isArray(result.output)) {
            news = result.output;
          }
          // 检查 output.data 是否包含新闻数组
          else if (result.output.data && Array.isArray(result.output.data)) {
            news = result.output.data;
          }
          // 检查 output.news 是否包含新闻数组
          else if (result.output.news && Array.isArray(result.output.news)) {
            news = result.output.news;
          }
        }

        if (news && news.length > 0) {
          log(`📦 从 MCP 响应获取到 ${news.length} 条新闻`, colors.green);
          return news;
        } else {
          logWarning(`⚠️  MCP 响应未包含新闻数据，尝试从本地文件读取...`);
          const localResult = getLocalRunResult(runId);
          if (localResult) {
            return localResult;
          }
          return [];
        }
      }

      if (status === "failed" || status === "error") {
        logError(`❌ 任务执行失败`);
        if (result.error) {
          logError(`   错误信息: ${result.error}`);

          // 尝试从本地文件读取
          if (result.error.includes("completed") || result.error.includes("finished")) {
            logWarning(`⚠️  任务可能已完成，尝试从本地文件读取...`);
            const localResult = getLocalRunResult(runId);
            if (localResult) {
              return localResult;
            }
          }
        }
        throw new Error(result.error || "任务执行失败");
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logWarning(`⚠️  轮询出错: ${errorMsg}`);

      // 如果任务已完成但轮询失败，尝试从本地读取
      if (errorMsg.includes("completed") || errorMsg.includes("finished")) {
        const localResult = getLocalRunResult(runId);
        if (localResult) {
          return localResult;
        }
      }
    }

    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
  }

  // 超时后尝试从本地读取
  logWarning(`⏱️  轮询超时，尝试从本地文件读取...`);
  const localResult = getLocalRunResult(runId);
  if (localResult) {
    return localResult;
  }

  throw new Error("任务执行超时");
}

// ==================== 显示和保存结果 ====================

/**
 * 显示新闻结果
 */
function displayResults(news: ToutiaoNewsResult[], options: Options): void {
  const limit = options.limit || news.length;
  const displayList = news.slice(0, limit);

  console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}          今日头条热门新闻${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

  if (displayList.length === 0) {
    logError("❌ 没有找到新闻数据");
    return;
  }

  displayList.forEach((item, index) => {
    const rank = index + 1;

    // 排名颜色
    let rankColor = colors.gray;
    if (rank === 1) rankColor = colors.bright + colors.red;
    else if (rank === 2) rankColor = colors.bright + colors.yellow;
    else if (rank === 3) rankColor = colors.bright + colors.blue;
    else if (rank <= 10) rankColor = colors.bright + colors.magenta;

    // 排名显示
    const rankDisplay = rank <= 10
      ? `${rankColor}[${rank.toString().padStart(2, '0')}]${colors.reset} `
      : `${colors.gray}[${rank.toString().padStart(2, '0')}]${colors.reset} `;

    // 标题
    console.log(`${rankDisplay}${colors.bright}${colors.white}${item.title}${colors.reset}`);

    // 来源和时间（verbose 模式）
    if (options.verbose && (item.source || item.publish_time)) {
      const metaParts = [];
      if (item.source) metaParts.push(`${colors.cyan}${item.source}${colors.reset}`);
      if (item.publish_time) metaParts.push(`${colors.yellow}${item.publish_time}${colors.reset}`);
      if (metaParts.length > 0) {
        console.log(`    ${metaParts.join(`${colors.gray} | ${colors.reset}`)}`);
      }
    }

    console.log();
  });

  console.log(`${colors.gray}共获取 ${news.length} 条新闻，显示前 ${limit} 条${colors.reset}\n`);
}

/**
 * 保存结果到文件
 */
function saveResults(news: ToutiaoNewsResult[], outputPath: string): void {
  try {
    const dir = require("node:path").dirname(outputPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const response: ToutiaoNewsResponse = {
      success: true,
      data: news,
      total: news.length,
      source: "今日头条"
    };

    writeFileSync(outputPath, JSON.stringify(response, null, 2), "utf-8");
    logSuccess(`✅ 结果已保存到: ${outputPath}`);
  } catch (error) {
    logError(`❌ 保存文件失败: ${error}`);
  }
}

// ==================== 主函数 ====================

async function main() {
  const options = parseArgs();

  console.log(`\n${colors.bright}${colors.cyan}╔═══════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║      DHF 今日头条新闻任务 v1.0.0                  ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚═══════════════════════════════════════════════════════╝${colors.reset}`);

  // 检查模式
  if (options.check) {
    log(`\n🔍 检查 DHF Agent MCP 服务...`, colors.cyan);
    const isAvailable = await checkMCPService();
    if (isAvailable) {
      logSuccess(`✅ DHF Agent MCP 服务可用 (${MCP_SERVER.host}:${MCP_SERVER.port})`);
      process.exit(0);
    } else {
      logError(`❌ DHF Agent MCP 服务不可用`);
      logError(`   请先启动 DHF Agent: /dhf-install-agent --open`);
      process.exit(1);
    }
  }

  // 检查 MCP 服务
  const isMCPAvailable = await checkMCPService();
  if (!isMCPAvailable) {
    logWarning(`⚠️  DHF Agent MCP 服务未运行`);
    log(`💡 正在尝试启动 DHF Agent...`, colors.cyan);
    log(`   请手动运行: /dhf-install-agent --open\n`, colors.gray);
    process.exit(1);
  }

  try {
    // 启动任务
    const runId = await startTask();

    // 轮询结果
    let news = await pollExecution(runId, options);

    // 过滤无效数据
    news = news.filter((item: any) =>
      item && item.title && item.link
    );

    // 显示结果
    displayResults(news, options);

    // 保存结果
    if (options.output) {
      saveResults(news, options.output);
    }

    logSuccess(`✅ 任务完成！`);

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logError(`\n❌ 错误: ${errorMsg}`);
    process.exit(1);
  }
}

// 运行主函数
main();
