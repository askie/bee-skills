const fs = require('fs');
const path = require('path');
const http = require('http');
const os = require('os');

// 配置
const TASK_ID = 'zhvnm6';
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;
const POLL_INTERVAL = 5000;
const MAX_POLL_TIME = 300000; // 5分钟

const MCP_SERVER = { hostname: 'localhost', port: 6869 };

/**
 * 获取 DHF 数据目录路径
 */
function getDHFDataDir() {
  const platform = os.platform();
  if (platform === 'win32') {
    return path.join(process.env.APPDATA || '', 'dhf-agent', 'work', 'data');
  } else if (platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', 'dhf-agent', 'work', 'data');
  } else {
    return path.join(os.homedir(), '.config', 'dhf-agent', 'work', 'data');
  }
}

/**
 * 从本地文件读取运行结果（备用方案）
 */
function getLocalRunResult(taskId, runId) {
  const runDir = path.join(getDHFDataDir(), taskId, 'run');
  if (!fs.existsSync(runDir)) {
    return null;
  }

  try {
    const files = fs.readdirSync(runDir);
    // 查找匹配 run_id 的文件
    const matchingFiles = files.filter(f => f.startsWith(`${runId}.`) && f.endsWith('.000002.md'));

    if (matchingFiles.length === 0) {
      return null;
    }

    // 读取最新的匹配文件
    const filePath = path.join(runDir, matchingFiles[matchingFiles.length - 1]);
    const content = fs.readFileSync(filePath, 'utf-8');

    // 从 markdown 中解析状态
    const statusMatch = content.match(/\*\*Status\*:\*\s*`(\w+)`/);
    if (!statusMatch) {
      return null;
    }

    const status = statusMatch[1];
    if (status === 'success' || status === 'completed' || status === 'SUCCESS') {
      // 尝试提取搜索结果
      const resultMatch = content.match(/\*\*Result\*:\*\s*```json\s*([\s\S]*?)\s*```/);
      let resultData = {};
      if (resultMatch) {
        try {
          resultData = JSON.parse(resultMatch[1]);
        } catch (e) {
          // 解析失败，返回空对象
        }
      }
      return { success: true, status, data: resultData };
    } else if (status === 'failed' || status === 'error' || status === 'FAILED' || status === 'ERROR') {
      return { success: false, error: '执行失败', status };
    } else if (status === 'running') {
      return { success: false, error: '仍在运行', status };
    }

    return null;
  } catch (e) {
    return null;
  }
}

/**
 * 调用 DHF Agent 任务进行 Naver 搜索
 * @param {string} keyword - 搜索关键词
 * @param {object} options - 可选参数 { pageCount, currentPage, verbose }
 *
 * 注意：市场任务使用 task_market_run，任务自己会循环多页，allResults 会包含所有页的结果
 */
async function callSearchTask(keyword, options = {}) {
  const {
    pageCount = 5,
    currentPage = 0,
    verbose = false
  } = options;

  // 构造输入数据
  const searchData = {
    searchKeyword: keyword,
    pageCount: pageCount,
    currentPage: currentPage,
    allResults: []
  };

  if (verbose) {
    console.log('\n========================================');
    console.log('   Naver 搜索任务调用');
    console.log('========================================\n');
    console.log('🔍 搜索关键词:', keyword);
    console.log('📄 搜索页数:', pageCount);
    console.log('📅 起始页码:', currentPage);
    console.log('🎯 任务 ID:', TASK_ID);
    console.log('');
  }

  // 1. 检查 MCP 服务可用性
  try {
    await checkMCPServer();
  } catch (error) {
    console.error('❌ MCP 服务不可用:', error.message);
    console.error('   请确保 DHF Agent 软件已启动 (端口 6869)');
    process.exit(1);
  }

  if (verbose) console.log('✅ MCP 服务连接正常\n');

  const startTime = Date.now();

  // 2. 调用任务（带重试）
  let lastError;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      if (verbose) {
        console.log(`📡 调用任务...`);
      }

      const result = await callTaskAPI(searchData);

      if (result.success) {
        if (verbose) {
          console.log('✅ 任务启动成功');
          console.log('   本地任务 ID:', result.local_task_id);
          console.log('   执行 ID:', result.run_id);
        }

        // 3. 轮询执行结果
        const executionResult = await pollExecution(result.local_task_id, result.run_id, verbose);

        if (executionResult.success) {
          const duration = Date.now() - startTime;

          // 4. 保存结果到文件
          const resultFilePath = saveResult(keyword, executionResult.data);

          // 5. 输出结果摘要
          displaySummary(keyword, executionResult.data, resultFilePath, duration);

          process.exit(0);
        } else {
          throw new Error(executionResult.error || '任务执行失败');
        }
      } else {
        lastError = result.error;
        if (i < MAX_RETRIES - 1) {
          if (verbose) {
            console.log(`⚠️ 调用失败，${RETRY_DELAY / 1000} 秒后重试...`);
          }
          await sleep(RETRY_DELAY);
        }
      }
    } catch (error) {
      lastError = error;
      if (i < MAX_RETRIES - 1) {
        if (verbose) {
          console.log(`⚠️ 调用出错: ${error.message}`);
          console.log(`   ${RETRY_DELAY / 1000} 秒后重试...`);
        }
        await sleep(RETRY_DELAY);
      }
    }
  }

  // 所有重试都失败
  console.error('\n❌ 任务调用失败');
  console.error('   错误:', lastError?.message || lastError);
  console.error('   已重试', MAX_RETRIES, '次');
  process.exit(1);
}

/**
 * 检查 MCP 服务可用性
 */
async function checkMCPServer() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      ...MCP_SERVER,
      path: '/http/task',
      method: 'POST'
    }, (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject(new Error(`MCP 服务返回 ${res.statusCode}`));
      }
    }).on('error', reject);

    req.write(JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/list'
    }));
    req.end();
  });
}

/**
 * 调用 MCP 任务 API（市场任务）
 * 注意：task_market_run 返回纯文本，不是 JSON！
 * 格式：Task triggered successfully. task_id=xxx, run_id=xxx. Please call...
 */
function callTaskAPI(searchData) {
  return new Promise((resolve, reject) => {
    const requestData = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: 'task_market_run',
        arguments: {
          task_id: TASK_ID,
          input_data: JSON.stringify(searchData)
        }
      }
    };

    const postData = JSON.stringify(requestData);

    const options = {
      ...MCP_SERVER,
      path: '/http/task',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (response.error) {
            reject(new Error(response.error.message || 'API 调用失败'));
            return;
          }

          if (response.result && response.result.content && response.result.content[0]) {
            const text = response.result.content[0].text;

            // 任务返回纯文本，需要解析
            // 格式：Task triggered successfully. task_id=xxx, run_id=xxx
            const taskIdMatch = text.match(/task_id=([a-zA-Z0-9-]+)/);
            const runIdMatch = text.match(/run_id=([a-zA-Z0-9-]+)/);

            if (taskIdMatch && runIdMatch) {
              resolve({
                success: true,
                local_task_id: taskIdMatch[1],
                run_id: runIdMatch[1]
              });
            } else {
              reject(new Error('无法解析任务响应: ' + text));
            }
          } else {
            reject(new Error('无效的响应格式'));
          }
        } catch (parseError) {
          reject(new Error(`解析响应失败: ${parseError.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * 轮询执行结果
 */
async function pollExecution(taskId, runId, verbose) {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const poll = () => {
      const elapsed = Date.now() - startTime;

      // 检查超时
      if (elapsed > MAX_POLL_TIME) {
        // 超时后尝试从本地文件读取结果
        const localResult = getLocalRunResult(taskId, runId);
        if (localResult && localResult.status !== 'running') {
          if (verbose) {
            console.log(`\n📁 超时后从本地文件读取结果`);
          }
          if (localResult.success) {
            resolve({
              success: true,
              status: localResult.status,
              duration: elapsed,
              data: localResult.data
            });
          } else {
            reject(new Error(localResult.error || '任务执行失败'));
          }
        } else {
          reject(new Error(`任务执行超时 (${MAX_POLL_TIME / 1000}秒)`));
        }
        return;
      }

      const requestData = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: 'task_run_result',
          arguments: {
            task_id: taskId,
            run_id: runId
          }
        }
      };

      const postData = JSON.stringify(requestData);

      const options = {
        ...MCP_SERVER,
        path: '/http/task',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);

            if (response.error) {
              reject(new Error(response.error.message || 'API 调用失败'));
              return;
            }

            if (response.result && response.result.content && response.result.content[0]) {
              const text = response.result.content[0].text;
              const result = JSON.parse(text);

              if (verbose) {
                console.log(`   轮询状态: ${result.status} (${Math.floor(elapsed / 1000)}秒)`);
              }

              // 检查执行状态
              if (result.status === 'success' || result.status === 'SUCCESS') {
                // 注意：result.result 是一个 JSON 字符串，需要再次解析
                let resultData = {};
                if (result.result && typeof result.result === 'string') {
                  try {
                    resultData = JSON.parse(result.result);
                  } catch (e) {
                    // 如果解析失败，使用原始数据
                    resultData = result;
                  }
                } else {
                  resultData = result.result || result;
                }

                resolve({
                  success: true,
                  status: result.status,
                  duration: elapsed,
                  data: resultData
                });
              } else if (result.status === 'failed' || result.status === 'FAILED') {
                reject(new Error(result.message || '任务执行失败'));
              } else {
                // 其他状态（如 running, pending），继续轮询
                setTimeout(poll, POLL_INTERVAL);
              }
            } else {
              setTimeout(poll, POLL_INTERVAL);
            }
          } catch (parseError) {
            if (verbose) {
              console.log(`⚠️ 解析执行状态失败: ${parseError.message}`);
            }
            setTimeout(poll, POLL_INTERVAL);
          }
        });
      });

      req.on('error', (error) => {
        if (verbose) {
          console.log(`⚠️ 查询执行状态失败: ${error.message}`);
        }
        // 网络错误时尝试从本地文件读取结果
        const localResult = getLocalRunResult(taskId, runId);
        if (localResult) {
          if (verbose) {
            console.log(`📁 从本地文件读取结果`);
          }
          if (localResult.status === 'running') {
            setTimeout(poll, POLL_INTERVAL);
          } else if (localResult.success) {
            resolve({
              success: true,
              status: localResult.status,
              duration: elapsed,
              data: localResult.data
            });
          } else {
            reject(new Error(localResult.error || '任务执行失败'));
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

/**
 * 保存结果到文件
 */
function saveResult(keyword, data) {
  const resultsDir = path.join(process.cwd(), 'naver-search-results');

  // 创建结果目录
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  // 生成文件名
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const safeKeyword = keyword.replace(/[\\/:*?"<>|]/g, '-');
  const fileName = `搜索结果-${safeKeyword}-${timestamp}.json`;
  const filePath = path.join(resultsDir, fileName);

  // 保存结果（确保关键词正确）
  const resultData = {
    ...data,
    searchTime: new Date().toISOString(),
    searchKeyword: keyword  // 强制使用传入的关键词
  };

  fs.writeFileSync(filePath, JSON.stringify(resultData, null, 2), 'utf8');

  return filePath;
}

/**
 * 显示结果摘要
 */
function displaySummary(keyword, data, filePath, duration = 0) {
  console.log('\n========================================');
  console.log('   ✅ 搜索完成！');
  console.log('========================================\n');
  console.log('🔍 关键词:', keyword);
  console.log('📄 搜索页数:', data.totalPages || data.pageCount || 1);
  console.log('⏱️  耗时:', Math.round(duration / 1000), '秒');
  console.log('💾 结果已保存到:', filePath);

  // 搜索结果在 allResults 中（已累积）
  const results = data.allResults || [];

  if (results.length > 0) {
    console.log('📊 共搜索到', results.length, '条结果\n');

    console.log('【前3条结果预览】');
    const previewCount = Math.min(3, results.length);
    for (let i = 0; i < previewCount; i++) {
      const item = results[i];
      const title = item.title || item.name || '无标题';
      const url = item.link || item.url;
      const snippet = item.snippet || item.description || '';

      console.log(`\n${i + 1}. ${title}`);
      if (url) {
        console.log(`   🔗 ${url}`);
      }
      if (snippet) {
        const truncated = snippet.slice(0, 80);
        console.log(`   📝 ${truncated}${snippet.length >= 80 ? '...' : ''}`);
      }
    }

    if (results.length > 3) {
      console.log(`\n... 还有 ${results.length - 3} 条结果，请查看文件`);
    }
  } else {
    console.log('⚠️ 未找到搜索结果');
  }

  console.log('');
}

/**
 * 睡眠函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 主程序入口
const keyword = process.argv[2];
const verbose = process.argv.includes('-v') || process.argv.includes('--verbose');

// 解析可选参数
const options = {
  pageCount: parseInt(getArgValue('--pageCount')) || 5,
  currentPage: parseInt(getArgValue('--currentPage')) || 0,
  verbose
};

function getArgValue(argName) {
  const argIndex = process.argv.indexOf(argName);
  if (argIndex !== -1 && argIndex + 1 < process.argv.length) {
    return process.argv[argIndex + 1];
  }
  return null;
}

// 检查参数
if (!keyword) {
  console.error('用法: node task_call.js <搜索关键词> [选项]');
  console.error('');
  console.error('参数:');
  console.error('  搜索关键词          必填，要搜索的关键词');
  console.error('');
  console.error('选项:');
  console.error('  --pageCount <数字>  搜索页数，默认 5');
  console.error('  --currentPage <数字> 起始页码，默认 0');
  console.error('  -v, --verbose       详细输出');
  console.error('');
  console.error('示例:');
  console.error('  node task_call.js "大黄蜂科技"');
  console.error('  node task_call.js "大黄蜂科技" --pageCount 3 -v');
  process.exit(1);
}

// 执行
callSearchTask(keyword, options).catch(error => {
  console.error('\n❌ 执行失败:', error.message);
  process.exit(1);
});
