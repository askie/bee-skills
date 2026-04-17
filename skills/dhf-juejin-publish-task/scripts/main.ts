#!/usr/bin/env bun
/**
 * DHF Juejin Publish Task
 *
 * 自动调用 DHF Agent 任务发布文章到掘金平台
 */

import { join } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";

// ==================== 配置常量 ====================

const TASK_ID = "wpduOW";
const MCP_ENDPOINT = "/mcp";

const MCP_SERVER = {
  host: 'localhost',
  port: 6869
};

const POLL_INTERVAL = 5000; // 5秒
const MAX_POLL_TIME = 300000; // 5分钟

// ==================== 类型定义 ====================

interface PublishOptions {
  title?: string;
  content?: string;
  contentFile?: string;
  category?: string;
  tags?: string[];
  summary?: string;
  autoSend?: string;
  check?: boolean;
}

interface TaskInput {
  initialState: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    summary: string;
    autoSend: string;
  };
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

function log(message: string, color: string = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

function logError(message: string) {
  console.error(`${colors.red}${message}${colors.reset}`);
}

function logSuccess(message: string) {
  console.log(`${colors.green}${message}${colors.reset}`);
}

function logWarning(message: string) {
  console.log(`${colors.yellow}${message}${colors.reset}`);
}

function printHeader(title: string) {
  console.log();
  log("═".repeat(50), colors.cyan);
  log(`  ${title}`, colors.bright + colors.cyan);
  log("═".repeat(50), colors.cyan);
  console.log();
}

/**
 * 从文件读取内容
 */
function readContentFromFile(filePath: string): string {
  if (!existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }
  try {
    return readFileSync(filePath, "utf-8");
  } catch (e) {
    throw new Error(`读取文件失败: ${e}`);
  }
}

/**
 * 生成摘要（从内容截取）
 */
function generateSummary(content: string, maxLength: number = 100): string {
  // 移除 Markdown 标记
  let summary = content
    .replace(/^#+\s+/gm, '') // 移除标题标记
    .replace(/\*\*/g, '')    // 移除粗体标记
    .replace(/\*/g, '')      // 移除斜体标记
    .replace(/`/g, '')       // 移除代码标记
    .replace(/\n/g, ' ');    // 换行替换为空格

  // 截取指定长度
  if (summary.length > maxLength) {
    summary = summary.substring(0, maxLength);
    // 确保在完整单词处截断
    const lastSpace = summary.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      summary = summary.substring(0, lastSpace);
    }
    summary += '...';
  }

  return summary.trim();
}

/**
 * 解析命令行参数
 */
function parseArgs(): PublishOptions {
  const args = process.argv.slice(2);
  const options: PublishOptions = {
    category: "人工智能",
    tags: ["人工智能"],
    autoSend: "Y"
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case "--title":
      case "-t":
        options.title = nextArg;
        i++;
        break;
      case "--content":
      case "-c":
        options.content = nextArg;
        i++;
        break;
      case "--content-file":
      case "-f":
        options.contentFile = nextArg;
        i++;
        break;
      case "--category":
      case "-C":
        options.category = nextArg;
        i++;
        break;
      case "--tags":
      case "-T":
        if (nextArg) {
          options.tags = nextArg.split(',').map(t => t.trim());
        }
        i++;
        break;
      case "--summary":
      case "-s":
        options.summary = nextArg;
        i++;
        break;
      case "--autoSend":
      case "-a":
        options.autoSend = nextArg || "Y";
        i++;
        break;
      case "--check":
        options.check = true;
        break;
      case "--help":
      case "-h":
        showHelp();
        process.exit(0);
      default:
        if (arg.startsWith("--")) {
          logError(`未知参数: ${arg}`);
          console.log("\n使用 --help 或 -h 查看帮助信息");
          process.exit(1);
        }
    }
  }

  return options;
}

function showHelp() {
  printHeader("掘金文章发布任务 - Juejin Publish Task");
  console.log();
  log("用法:", colors.bright);
  console.log();
  log("  /dhf-juejin-publish-task [选项]", colors.cyan);
  console.log();
  log("必填参数:", colors.bright);
  console.log();
  log("  --title, -t       文章标题", colors.cyan);
  log("  --content, -c     文章内容", colors.cyan);
  log("  --content-file, -f 从文件读取内容", colors.cyan);
  console.log();
  log("可选参数:", colors.bright);
  console.log();
  log("  --category, -C    文章分类 (默认: 人工智能)", colors.cyan);
  log("  --tags, -T        标签，逗号分隔 (默认: 人工智能)", colors.cyan);
  log("  --summary, -s     文章摘要 (默认: 自动生成)", colors.cyan);
  log("  --autoSend, -a    自动发布 Y/N (默认: Y)", colors.cyan);
  log("  --check           检查 DHF Agent 连接", colors.cyan);
  log("  --help, -h        显示帮助", colors.cyan);
  console.log();
  log("分类选项:", colors.bright);
  console.log();
  log("  人工智能, 前端, 后端, Android, iOS, 开发工具, 代码人生, 阅读", colors.cyan);
  console.log();
  log("示例:", colors.bright);
  console.log();
  log("  /dhf-juejin-publish-task -t \"标题\" -c \"内容\"", colors.green);
  log("  /dhf-juejin-publish-task -t \"标题\" -f \"./article.md\"", colors.green);
  log("  /dhf-juejin-publish-task -t \"标题\" -c \"内容\" -C \"前端\" -T \"Vue,React\"", colors.green);
  log("  /dhf-juejin-publish-task -t \"标题\" -c \"内容\" -a \"N\"", colors.green);
  console.log();
  log("任务信息:", colors.bright);
  console.log();
  log(`  任务 ID: ${TASK_ID}`, colors.cyan);
  log(`  MCP 服务: dhf_rpa_task`, colors.cyan);
  console.log();
}

// ==================== MCP 客户端操作 ====================

/**
 * 检查 MCP 服务是否可用
 */
async function checkMCPService(): Promise<boolean> {
  try {
    const response = await fetch(`http://${MCP_SERVER.host}:${MCP_SERVER.port}${MCP_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/list",
        params: {}
      }),
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
  const url = `http://${MCP_SERVER.host}:${MCP_SERVER.port}${MCP_ENDPOINT}`;
  const response = await fetch(url, {
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

  // 从嵌套的 content 中提取实际结果
  if (result.result && result.result.content && result.result.content[0]) {
    const text = result.result.content[0].text;
    const parsed = JSON.parse(text);
    return parsed;
  }

  return result.result;
}

/**
 * 启动发布任务
 */
async function startPublishTask(input: TaskInput): Promise<string> {
  log(`\n🚀 启动掘金发布任务 (ID: ${TASK_ID})...`, colors.cyan);
  log(`   📝 标题: ${input.initialState.title}`, colors.gray);
  log(`   📂 分类: ${input.initialState.category}`, colors.gray);
  log(`   🏷️  标签: ${input.initialState.tags.join(', ')}`, colors.gray);
  log(`   📤 自动发布: ${input.initialState.autoSend === 'Y' ? '是' : '否 (草稿)'}`, colors.gray);

  const result = await callMCPTool("task_market_run", {
    task_id: TASK_ID,
    input_data: JSON.stringify(input)
  });

  if (result.success) {
    logSuccess(`✅ 任务已启动，run_id: ${result.run_id}`);
    return result.run_id;
  } else {
    throw new Error(`任务启动失败: ${result.error || result.message || "未知错误"}`);
  }
}

/**
 * 轮询任务执行结果
 */
async function pollExecution(runId: string): Promise<{ success: boolean; status?: string; error?: string }> {
  const startTime = Date.now();
  let lastStatus = "";

  log(`\n⏳ 正在发布，浏览器将自动打开...`, colors.cyan);
  log(`   请等待任务完成...`, colors.gray);

  while (Date.now() - startTime < MAX_POLL_TIME) {
    try {
      const result = await callMCPTool("task_run_result", {
        task_id: TASK_ID,
        run_id: runId
      });

      const message = result.message || "";
      let status = "running";

      if (message.includes("completed successfully") || message.includes("Task completed")) {
        status = "success";
      } else if (message.includes("failed") || message.includes("error")) {
        status = "failed";
      }

      if (status !== lastStatus) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        log(`   状态: ${status} (${elapsed}秒)`, colors.blue);
        lastStatus = status;
      }

      if (status === "success") {
        return { success: true, status: "success" };
      }

      if (status === "failed") {
        return { success: false, error: result.message || "任务执行失败" };
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (!errorMsg.includes("fetch")) {
        logWarning(`⚠️  轮询出错: ${errorMsg}`);
      }
    }

    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
  }

  return { success: false, error: "任务执行超时" };
}

// ==================== 主函数 ====================

async function main() {
  const options = parseArgs();

  printHeader("掘金文章发布任务 v1.0.0");

  // 检查模式
  if (options.check) {
    log(`\n🔍 检查 DHF Agent MCP 服务...`, colors.cyan);
    const isAvailable = await checkMCPService();
    if (isAvailable) {
      logSuccess(`✅ DHF Agent MCP 服务可用 (${MCP_SERVER.host}:${MCP_SERVER.port}${MCP_ENDPOINT})`);
      log(`\n任务信息:`, colors.bright);
      log(`  任务 ID: ${TASK_ID}`, colors.cyan);
      log(`  目标: 掘金文章发布`, colors.cyan);
      process.exit(0);
    } else {
      logError(`❌ DHF Agent MCP 服务不可用`);
      logError(`   请先启动 DHF Agent: /dhf-install-agent --open`);
      process.exit(1);
    }
  }

  // 验证必填参数
  if (!options.title) {
    logError(`❌ 缺少必填参数: --title`);
    console.log();
    log("使用 --help 或 -h 查看帮助信息", colors.yellow);
    process.exit(1);
  }

  // 获取内容
  let content = options.content || "";
  if (options.contentFile) {
    if (content) {
      logWarning(`⚠️  同时指定了 --content 和 --content-file，将使用文件内容`);
    }
    try {
      content = readContentFromFile(options.contentFile);
      log(`📄 从文件读取内容: ${options.contentFile}`, colors.gray);
    } catch (e) {
      logError(`❌ ${e}`);
      process.exit(1);
    }
  }

  if (!content) {
    logError(`❌ 缺少文章内容: 请使用 --content 或 --content-file`);
    console.log();
    log("使用 --help 或 -h 查看帮助信息", colors.yellow);
    process.exit(1);
  }

  // 生成摘要（如果未提供）
  let summary = options.summary || "";
  if (!summary) {
    summary = generateSummary(content);
  }

  // 检查 MCP 服务
  log(`\n🔍 检查 DHF Agent MCP 服务...`, colors.cyan);
  const isMCPAvailable = await checkMCPService();
  if (!isMCPAvailable) {
    logError(`❌ DHF Agent MCP 服务不可用`);
    log(`   请先启动 DHF Agent: /dhf-install-agent --open`, colors.yellow);
    process.exit(1);
  }
  logSuccess(`✅ DHF Agent MCP 服务可用`);

  try {
    // 构建任务输入
    const taskInput: TaskInput = {
      initialState: {
        title: options.title!,
        content: content,
        category: options.category || "人工智能",
        tags: options.tags || ["人工智能"],
        summary: summary,
        autoSend: options.autoSend || "Y"
      }
    };

    // 启动任务
    const runId = await startPublishTask(taskInput);

    // 轮询结果
    const execResult = await pollExecution(runId);

    console.log();
    if (execResult.success) {
      logSuccess(`🎉 发布成功！`);
      log(`   标题: ${options.title}`, colors.cyan);
      log(`   分类: ${options.category}`, colors.cyan);
      if (options.autoSend === "Y") {
        log(`   状态: 已发布`, colors.green);
      } else {
        log(`   状态: 已保存为草稿`, colors.yellow);
        log(`   提示: 请到掘金后台查看并手动发布`, colors.gray);
      }
      console.log();
    } else {
      logError(`❌ 发布失败: ${execResult.error}`);
      console.log();
      process.exit(1);
    }

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logError(`\n❌ 错误: ${errorMsg}`);
    process.exit(1);
  }
}

// 运行主函数
main().catch((error) => {
  logError(`❌ 未处理的错误: ${error}`);
  process.exit(1);
});
