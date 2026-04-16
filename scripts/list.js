#!/usr/bin/env node
/**
 * Bee RPA Skills 列表查看脚本
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 技能注册表
const SKILLS_REGISTRY = [  { id: 'dhf-rpa-test-workflow', name: 'RPA 测试工作流', description: '测试 Bee Agent 基础连接和 RPA 操作', category: '测试' },  { id: 'dhf-163mail-task', name: '163 邮件发送', description: '自动化发送 163 邮件', category: '邮件' },  { id: 'dhf-outlook-mail-task', name: 'Outlook 邮件发送', description: '自动化发送 Outlook 邮件', category: '邮件' },  { id: 'dhf-qq-mail-task', name: 'QQ 邮件发送', description: '自动化发送 QQ 邮件', category: '邮件' },  { id: 'dhf-163news-task', name: '163 网易新闻', description: '获取 163 网易新闻资讯', category: '新闻' },  { id: 'dhf-bing-news-task', name: '百度新闻', description: '获取百度新闻资讯', category: '新闻' },  { id: 'dhf-google-news-task', name: 'Google 新闻', description: '获取 Google 新闻资讯', category: '新闻' },  { id: 'dhf-juejin-news-task', name: '掘金新闻', description: '获取掘金新闻资讯', category: '新闻' },  { id: 'dhf-tencent-news-task', name: '腾讯新闻', description: '获取腾讯新闻资讯', category: '新闻' },  { id: 'dhf-toutiao-news-task', name: '今日头条新闻', description: '获取今日头条资讯', category: '新闻' },  { id: 'dhf-douyin-hot-search-task', name: '抖音热搜', description: '获取抖音热搜榜单', category: '搜索' },  { id: 'dhf-google-hot-topics-task', name: 'Google 热搜', description: '获取 Google 热搜榜单', category: '搜索' },  { id: 'dhf-weibo-hot-search-task', name: '微博热搜', description: '获取微博热搜榜单', category: '搜索' },  { id: 'dhf-zhihu-hot-search-task', name: '知乎热搜', description: '获取知乎热榜', category: '搜索' },  { id: 'dhf-google-trends-task', name: 'Google 趋势', description: '获取 Google 搜索趋势', category: '趋势' },  { id: 'dhf-install-agent', name: '安装 Bee Agent', description: '安装 Bee Bee Agent 浏览器插件', category: '工具' }];

class SkillLister {
  constructor() {
    this.repoRoot = path.join(__dirname, '..');
    this.skillsDir = path.join(this.repoRoot, 'skills');
    this.pluginDir = path.join(this.repoRoot, '.claude-plugin');
    this.marketplaceFile = path.join(this.pluginDir, 'marketplace.json');
  }

  getInstalledSkills() {
    if (!fs.existsSync(this.marketplaceFile)) {
      return [];
    }
    try {
      const marketplace = JSON.parse(fs.readFileSync(this.marketplaceFile, 'utf-8'));
      const plugin = marketplace.plugins?.find(p => p.name === 'bee-skills');
      if (!plugin?.skills) return [];
      return plugin.skills.map(s => path.basename(s));
    } catch (error) {
      return [];
    }
  }

  getAvailableSkills() {
    return SKILLS_REGISTRY.filter(skill => {
      const skillPath = path.join(this.skillsDir, skill.id);
      return fs.existsSync(skillPath);
    });
  }

  displayTable() {
    const installed = this.getInstalledSkills();
    const available = this.getAvailableSkills();

    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║          Bee RPA Skills - 技能列表                         ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    console.log(`📦 可用技能: ${available.length} | ✅ 已安装: ${installed.length}\n`);

    const categories = {};
    available.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category].push(skill);
    });

    for (const [category, skills] of Object.entries(categories)) {
      console.log(`\n📂 ${category}`);
      console.log('─'.repeat(70));

      skills.forEach(skill => {
        const isInstalled = installed.includes(skill.id);
        const status = isInstalled ? '✅ 已安装' : '⬜ 未安装';
        const command = skill.command || skill.id;

        console.log(`\n  ${skill.name}`);
        console.log(`    描述: ${skill.description}`);
        console.log(`    命令: /${command}`);
        console.log(`    状态: ${status}`);
        console.log(`    版本: ${skill.version}`);
      });
    }

    console.log('\n' + '─'.repeat(70));
    console.log('\n💡 使用方法:');
    console.log('  npm run install    - 安装新技能');
    console.log('  npm run uninstall  - 卸载技能');
    console.log('  npm run sync       - 同步已安装技能\n');
  }

  list() {
    this.displayTable();
  }
}

const lister = new SkillLister();
lister.list();
