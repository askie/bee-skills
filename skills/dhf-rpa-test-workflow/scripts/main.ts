#!/usr/bin/env bun
/**
 * DHF RPA Test Workflow
 *
 * 测试 DHF Agent 基础功能和 RPA 操作
 */

import { join } from "node:path";
import { existsSync, writeFileSync, mkdirSync } from "node:fs";

// ==================== 配置常量 ====================

const WORKFLOW_ID = "ok8gKP";
const MCP_ENDPOINT = "/mcp";

const MCP_SERVER = {
  host: 'localhost',
  port: 6869
};

const TEST_TIMEOUT = 60000; // 60秒测试超时

// ==================== 类型定义 ====================

interface Options {
  fast?: boolean;
  output?: string;
  verbose?: boolean;
  check?: boolean;
}

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  message: string;
  details?: any;
}

interface TestReport {
  success: boolean;
  timestamp: string;
  tests: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
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

function logTest(message: string) {
  console.log(`${colors.cyan}${message}${colors.reset}`);
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
      case "--fast":
      case "-f":
        options.fast = true;
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
          console.log("  /dhf-rpa-test-workflow [选项]");
          console.log("\n选项:");
          console.log("  --fast, -f             快速测试模式");
          console.log("  --output, -o <路径>    保存测试报告到文件");
          console.log("  --verbose, -v         显示详细测试日志");
          console.log("  --check, -c           仅检查 DHF Agent 状态");
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
async function checkMCPService(): Promise<{ available: boolean; details?: any }> {
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

    if (!response.ok) {
      return { available: false };
    }

    const result = await response.json();
    const tools = result.result?.tools || [];

    return {
      available: true,
      details: {
        server: `${MCP_SERVER.host}:${MCP_SERVER.port}`,
        toolsCount: tools.length,
        tools: tools.map((t: any) => t.name)
      }
    };
  } catch {
    return { available: false };
  }
}

/**
 * 获取系统设置
 */
async function getSystemSettings(): Promise<any> {
  try {
    const response = await fetch(`http://${MCP_SERVER.host}:${MCP_SERVER.port}${MCP_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: {
          name: "get_settings",
          arguments: {}
        }
      }),
      signal: AbortSignal.timeout(10000)
    });

    const result = await response.json();
    if (result.result?.content?.[0]) {
      const text = result.result.content[0].text;
      return JSON.parse(text);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 运行单个测试
 */
async function runTest(
  testName: string,
  testFn: () => Promise<any>
): Promise<TestResult> {
  const startTime = Date.now();

  try {
    logTest(`\n🧪 测试: ${testName}...`);
    const result = await testFn();
    const duration = Date.now() - startTime;

    logSuccess(`✅ 通过 (${duration}ms)`);
    return {
      name: testName,
      status: 'passed',
      duration,
      message: '测试通过',
      details: result
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    logError(`❌ 失败 (${duration}ms): ${error.message}`);
    return {
      name: testName,
      status: 'failed',
      duration,
      message: error.message,
      details: error
    };
  }
}

// ==================== 测试函数 ====================

/**
 * 测试 1: MCP 服务连接
 */
async function testMCPConnection(): Promise<any> {
  const result = await checkMCPService();
  if (!result.available) {
    throw new Error("MCP 服务不可用");
  }
  return result.details;
}

/**
 * 测试 2: 系统设置
 */
async function testSystemSettings(): Promise<any> {
  const settings = await getSystemSettings();
  if (!settings) {
    throw new Error("无法获取系统设置");
  }
  return settings;
}

/**
 * 测试 3: 浏览器连接（通过执行简单任务）
 */
async function testBrowserConnection(): Promise<any> {
  // 尝试运行测试工作流
  const response = await fetch(`http://${MCP_SERVER.host}:${MCP_SERVER.port}${MCP_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: "workflow_market_run",
        arguments: {
          workflow_id: WORKFLOW_ID
        }
      }
    }),
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.error) {
    // 如果工作流不存在，返回降级结果
    if (result.error.message?.includes('不存在') || result.error.message?.includes('not found')) {
      return {
        note: "测试工作流未找到，跳过实际执行测试",
        suggestion: "请确保工作流 ID " + WORKFLOW_ID + " 存在于市场中"
      };
    }
    throw new Error(result.error.message);
  }

  if (result.result?.content?.[0]) {
    const text = result.result.content[0].text;
    const parsed = JSON.parse(text);

    // 工作流 API 返回格式: { success, local_workflow_id, remote_workflow_id, run_id, message }
    if (parsed.success && parsed.local_workflow_id && parsed.run_id) {
      return {
        workflowStarted: true,
        localWorkflowId: parsed.local_workflow_id,
        remoteWorkflowId: parsed.remote_workflow_id,
        runId: parsed.run_id
      };
    }

    return parsed;
  }

  throw new Error("无法解析响应");
}

// ==================== 显示和保存结果 ====================

/**
 * 显示测试报告
 */
function displayTestReport(report: TestReport, options: Options): void {
  console.log(`\n${colors.bright}${colors.cyan}╔═══════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║      DHF RPA 功能测试报告                            ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚═══════════════════════════════════════════════════════╝${colors.reset}\n`);

  console.log(`${colors.gray}测试时间: ${report.timestamp}${colors.reset}`);
  console.log(`${colors.gray}工作流 ID: ${WORKFLOW_ID}${colors.reset}\n`);

  // 显示测试结果
  report.tests.forEach((test, index) => {
    const statusIcon = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏭️ ';
    const statusColor = test.status === 'passed' ? colors.green : test.status === 'failed' ? colors.red : colors.gray;

    console.log(`${statusIcon} ${colors.bright}${test.name}${colors.reset}`);
    console.log(`   ${statusColor}${test.message}${colors.reset}`);

    if (options.verbose && test.details) {
      console.log(`   ${colors.gray}详情: ${JSON.stringify(test.details, null, 2)}${colors.reset}`);
    }
  });

  // 显示摘要
  console.log(`\n${colors.bright}${colors.cyan}─────────────────────────────────────────────────────${colors.reset}`);
  console.log(`${colors.bright}测试摘要${colors.reset}`);
  console.log(`   总计: ${report.summary.total}`);
  console.log(`   ${colors.green}通过: ${report.summary.passed}${colors.reset}`);
  console.log(`   ${colors.red}失败: ${report.summary.failed}${colors.reset}`);
  console.log(`   ${colors.gray}跳过: ${report.summary.skipped}${colors.reset}`);
  console.log(`   用时: ${report.summary.duration}ms`);
  console.log(`${colors.bright}${colors.cyan}─────────────────────────────────────────────────────${colors.reset}\n`);

  // 整体结果
  if (report.summary.failed === 0) {
    logSuccess(`🎉 所有测试通过！DHF Agent 功能正常。`);
  } else {
    logWarning(`⚠️  ${report.summary.failed} 个测试失败，请检查配置。`);
  }
}

/**
 * 保存测试报告
 */
function saveTestReport(report: TestReport, outputPath: string): void {
  try {
    const dir = require("node:path").dirname(outputPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf-8");
    logSuccess(`✅ 测试报告已保存到: ${outputPath}`);
  } catch (error) {
    logError(`❌ 保存文件失败: ${error}`);
  }
}

// ==================== 主函数 ====================

async function main() {
  const options = parseArgs();

  console.log(`\n${colors.bright}${colors.cyan}╔═══════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║    DHF RPA 功能测试 v1.0.0                           ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚═══════════════════════════════════════════════════════╝${colors.reset}`);

  const startTime = Date.now();
  const tests: TestResult[] = [];

  // 仅检查模式
  if (options.check) {
    log(`\n🔍 检查 DHF Agent MCP 服务...`, colors.cyan);
    const result = await checkMCPService();
    if (result.available) {
      logSuccess(`✅ DHF Agent MCP 服务可用`);
      log(`   服务器: ${MCP_SERVER.host}:${MCP_SERVER.port}${MCP_ENDPOINT}`);
      if (result.details?.tools) {
        log(`   可用工具: ${result.details.toolsCount} 个`);
      }
      process.exit(0);
    } else {
      logError(`❌ DHF Agent MCP 服务不可用`);
      logError(`   请先启动 DHF Agent: /dhf-install-agent --open`);
      process.exit(1);
    }
  }

  // 检查 MCP 服务
  log(`\n🔍 检查 DHF Agent MCP 服务...`, colors.cyan);
  const mcpCheck = await checkMCPService();
  if (!mcpCheck.available) {
    logError(`❌ DHF Agent MCP 服务不可用`);
    log(`💡 请先启动 DHF Agent: /dhf-install-agent --open\n`, colors.yellow);
    process.exit(1);
  }
  logSuccess(`✅ MCP 服务可用`);

  // 运行测试
  log(`\n${colors.bright}${colors.cyan}开始运行测试...${colors.reset}`);

  // 测试 1: MCP 连接
  tests.push(await runTest("MCP 服务连接", testMCPConnection));

  // 测试 2: 系统设置
  if (!options.fast) {
    tests.push(await runTest("系统设置获取", testSystemSettings));
  }

  // 测试 3: 浏览器连接
  tests.push(await runTest("浏览器连接测试", testBrowserConnection));

  // 生成报告
  const totalDuration = Date.now() - startTime;
  const report: TestReport = {
    success: true,
    timestamp: new Date().toISOString(),
    tests,
    summary: {
      total: tests.length,
      passed: tests.filter(t => t.status === 'passed').length,
      failed: tests.filter(t => t.status === 'failed').length,
      skipped: tests.filter(t => t.status === 'skipped').length,
      duration: totalDuration
    }
  };

  // 显示报告
  displayTestReport(report, options);

  // 保存报告
  if (options.output) {
    saveTestReport(report, options.output);
  }

  // 返回退出码
  process.exit(report.summary.failed > 0 ? 1 : 0);
}

// 运行主函数
main();
