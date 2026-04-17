#!/usr/bin/env bun
/**
 * DHF Douyin Video Publish Task
 *
 * 自动调用 DHF Agent 任务发布视频到抖音平台
 */

import { request } from "http";
import { normalize } from "node:path";
import { existsSync } from "node:fs";

// ==================== 配置常量 ====================

const TASK_ID = "BK7uNW";
const MCP_SERVER = { host: "localhost", port: 6869 };
const MCP_ENDPOINT = "/http/task";

const POLL_INTERVAL = 5000; // 5秒
const MAX_POLL_TIME = 600000; // 10分钟（视频上传需要更长时间）

// ==================== 类型定义 ====================

interface VideoPublishOptions {
  title?: string;
  content?: string;
  videos?: string[];
  autoSend?: string;
  check?: boolean;
}

interface TaskInput {
  initialState: {
    title: string;
    content: string;
    videos: string[];
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
 * 验证视频文件是否存在
 */
function validateVideoFiles(videoPaths: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const path of videoPaths) {
    // 规范化路径
    const normalizedPath = normalize(path);
    if (existsSync(normalizedPath)) {
      valid.push(normalizedPath);
    } else {
      invalid.push(path);
    }
  }

  return { valid, invalid };
}

/**
 * 解析命令行参数
 */
function parseArgs(): VideoPublishOptions {
  const args = process.argv.slice(2);
  const options: VideoPublishOptions = {
    videos: [],
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
      case "--video":
      case "-v":
        if (nextArg) {
          options.videos!.push(nextArg);
        }
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
  printHeader("抖音视频发布任务 - Douyin Video Publish Task");
  console.log();
  log("用法:", colors.bright);
  console.log();
  log("  /dhf-douyin-video-publish-task [选项]", colors.cyan);
  console.log();
  log("必填参数:", colors.bright);
  console.log();
  log("  --title, -t       视频标题", colors.cyan);
  log("  --content, -c     视频内容文案", colors.cyan);
  log("  --video, -v       视频文件路径（可多次使用）", colors.cyan);
  console.log();
  log("可选参数:", colors.bright);
  console.log();
  log("  --autoSend, -a    自动发布 Y/N (默认: Y)", colors.cyan);
  log("  --check           检查 DHF Agent 连接", colors.cyan);
  log("  --help, -h        显示帮助", colors.cyan);
  console.log();
  log("示例:", colors.bright);
  console.log();
  log("  /dhf-douyin-video-publish-task -t \"标题\" -c \"内容\" -v \"./video.mp4\"", colors.green);
  log("  /dhf-douyin-video-publish-task -t \"标题\" -c \"内容\" -v \"./v1.mp4\" -v \"./v2.mp4\"", colors.green);
  log("  /dhf-douyin-video-publish-task -t \"标题\" -c \"内容\" -v \"./video.mp4\" -a \"N\"", colors.green);
  console.log();
  log("任务信息:", colors.bright);
  console.log();
  log(`  任务 ID: ${TASK_ID}`, colors.cyan);
  log(`  MCP 服务: dhf_rpa_task`, colors.cyan);
  console.log();
}

// ==================== HTTP 客户端操作 ====================

/**
 * 检查 MCP 服务是否可用
 */
function checkMCPServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = request({
      ...MCP_SERVER,
      path: MCP_ENDPOINT,
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

/**
 * 调用任务 API
 */
function callTaskAPI(toolName: string, arguments_: Record<string, any>): Promise<any> {
  return new Promise((resolve, reject) => {
    const requestData = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: toolName,
        arguments: arguments_
      },
    };

    const postData = JSON.stringify(requestData);

    const options = {
      ...MCP_SERVER,
      path: MCP_ENDPOINT,
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
            reject(new Error(response.error.message));
            return;
          }
          if (response.result?.content?.[0]) {
            const resultText = response.result.content[0].text;
            const result = JSON.parse(resultText);
            resolve(result);
          } else {
            resolve(response.result);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", (e: any) => reject(new Error(e.message)));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("请求超时"));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * 启动发布任务
 */
async function startPublishTask(input: TaskInput): Promise<string> {
  log(`\n🚀 启动抖音视频发布任务 (ID: ${TASK_ID})...`, colors.cyan);
  log(`   📝 标题: ${input.initialState.title}`, colors.gray);
  log(`   📹 视频数量: ${input.initialState.videos.length}`, colors.gray);
  log(`   📤 自动发布: ${input.initialState.autoSend === 'Y' ? '是' : '否 (草稿)'}`, colors.gray);

  const result = await callTaskAPI("task_market_run", {
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

  log(`\n⏳ 正在上传视频，浏览器将自动打开...`, colors.cyan);
  log(`   视频上传可能需要较长时间，请耐心等待...`, colors.gray);

  while (Date.now() - startTime < MAX_POLL_TIME) {
    try {
      const result = await callTaskAPI("task_run_result", {
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
      // 忽略轮询中的临时错误
    }

    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
  }

  return { success: false, error: "任务执行超时" };
}

// ==================== 主函数 ====================

async function main() {
  const options = parseArgs();

  printHeader("抖音视频发布任务 v1.0.0");

  // 检查模式
  if (options.check) {
    log(`\n🔍 检查 DHF Agent MCP 服务...`, colors.cyan);
    try {
      await checkMCPServer();
      logSuccess(`✅ DHF Agent MCP 服务可用 (${MCP_SERVER.host}:${MCP_SERVER.port}${MCP_ENDPOINT})`);
      log(`\n任务信息:`, colors.bright);
      log(`  任务 ID: ${TASK_ID}`, colors.cyan);
      log(`  目标: 抖音发布`, colors.cyan);
      process.exit(0);
    } catch (error: any) {
      logError(`❌ DHF Agent MCP 服务不可用: ${error.message}`);
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

  if (!options.content) {
    logError(`❌ 缺少必填参数: --content`);
    console.log();
    log("使用 --help 或 -h 查看帮助信息", colors.yellow);
    process.exit(1);
  }

  if (!options.videos || options.videos.length === 0) {
    logError(`❌ 缺少必填参数: --video`);
    console.log();
    log("使用 --help 或 -h 查看帮助信息", colors.yellow);
    process.exit(1);
  }

  // 验证视频文件
  log(`\n🔍 检查视频文件...`, colors.cyan);
  const { valid, invalid } = validateVideoFiles(options.videos);

  if (invalid.length > 0) {
    logError(`❌ 以下视频文件不存在:`);
    invalid.forEach(path => logError(`   - ${path}`, colors.red));
    process.exit(1);
  }

  logSuccess(`✅ 所有视频文件验证通过 (${valid.length} 个)`);
  valid.forEach(path => log(`   📹 ${path}`, colors.gray));

  // 检查 MCP 服务
  log(`\n🔍 检查 DHF Agent MCP 服务...`, colors.cyan);
  try {
    await checkMCPServer();
    logSuccess(`✅ DHF Agent MCP 服务可用`);
  } catch (error: any) {
    logError(`❌ DHF Agent MCP 服务不可用`);
    log(`   请先启动 DHF Agent: /dhf-install-agent --open`, colors.yellow);
    process.exit(1);
  }

  try {
    // 构建任务输入
    const taskInput: TaskInput = {
      initialState: {
        title: options.title!,
        content: options.content!,
        videos: valid,
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
      log(`   视频: ${valid.length} 个`, colors.cyan);
      if (options.autoSend === "Y") {
        log(`   状态: 已发布`, colors.green);
      } else {
        log(`   状态: 已保存为草稿`, colors.yellow);
        log(`   提示: 请到抖音后台查看并手动发布`, colors.gray);
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
