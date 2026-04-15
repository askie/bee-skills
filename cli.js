#!/usr/bin/env node
/**
 * DHF RPA Skills CLI
 * 快速安装命令
 */

import SmartSkillInstaller from './scripts/install-smart.js';

const args = process.argv.slice(2);
const options = {};

// 解析参数
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--global') {
    options.mode = 'global';
  } else if (arg === '--project') {
    options.mode = 'project';
  } else if (arg === '--silent') {
    options.silent = true;
  } else if (arg.startsWith('--skill=')) {
    options.skillIds = arg.split('=')[1].split(',');
  } else if (arg === '--help' || arg === '-h') {
    console.log(`
DHF RPA Skills 智能安装器

用法:
  npm run install                    交互式安装
  npm run install:global            全局安装
  npm run install:project           项目级安装
  node cli.js --skill=<skillId>     安装指定技能

选项:
  --global                          强制全局安装
  --project                         强制项目级安装
  --silent                          静默模式
  --skill=<skill1,skill2>          指定要安装的技能

示例:
  node cli.js --skill=dhf-rpa-qq-mail-task
  node cli.js --global --skill=dhf-google-news-task
  node cli.js --project --silent --skill=dhf-163mail-task,dhf-outlook-mail-task

可用技能:
  dhf-rpa-test-workflow             测试工作流
  dhf-163mail-task                  163 邮件
  dhf-outlook-mail-task             Outlook 邮件
  dhf-rpa-qq-mail-task              QQ 邮件
  dhf-163news-task                  163 新闻
  dhf-bing-news-task                百度新闻
  dhf-google-news-task              Google 新闻
  dhf-juejin-news-task              掘金新闻
  dhf-tencent-news-task             腾讯新闻
  dhf-toutiao-news-task             今日头条
  dhf-douyin-hot-search-task        抖音热搜
  dhf-google-hot-topics-task        Google 热搜
  dhf-weibo-hot-search-task         微博热搜
  dhf-zhihu-hot-search-task         知乎热搜
  dhf-google-trends-task            Google 趋势
  dhf-install-agent                 安装 DHF Agent

更多信息: npm run list
    `);
    process.exit(0);
  }
}

const installer = new SmartSkillInstaller(options);
installer.install(options.skillIds);
