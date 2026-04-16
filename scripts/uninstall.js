#!/usr/bin/env node
/**
 * Bee RPA Skills 卸载脚本
 */

import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 技能注册表（与 install.js 保持一致）
const SKILLS_REGISTRY = [  { id: 'dhf-rpa-test-workflow', name: 'RPA 测试工作流', description: '测试 Bee Agent 基础连接和 RPA 操作', category: '测试' },  { id: 'dhf-163mail-task', name: '163 邮件发送', description: '自动化发送 163 邮件', category: '邮件' },  { id: 'dhf-outlook-mail-task', name: 'Outlook 邮件发送', description: '自动化发送 Outlook 邮件', category: '邮件' },  { id: 'dhf-qq-mail-task', name: 'QQ 邮件发送', description: '自动化发送 QQ 邮件', category: '邮件' },  { id: 'dhf-163news-task', name: '163 网易新闻', description: '获取 163 网易新闻资讯', category: '新闻' },  { id: 'dhf-bing-news-task', name: '百度新闻', description: '获取百度新闻资讯', category: '新闻' },  { id: 'dhf-google-news-task', name: 'Google 新闻', description: '获取 Google 新闻资讯', category: '新闻' },  { id: 'dhf-juejin-news-task', name: '掘金新闻', description: '获取掘金新闻资讯', category: '新闻' },  { id: 'dhf-tencent-news-task', name: '腾讯新闻', description: '获取腾讯新闻资讯', category: '新闻' },  { id: 'dhf-toutiao-news-task', name: '今日头条新闻', description: '获取今日头条资讯', category: '新闻' },  { id: 'dhf-douyin-hot-search-task', name: '抖音热搜', description: '获取抖音热搜榜单', category: '搜索' },  { id: 'dhf-google-hot-topics-task', name: 'Google 热搜', description: '获取 Google 热搜榜单', category: '搜索' },  { id: 'dhf-weibo-hot-search-task', name: '微博热搜', description: '获取微博热搜榜单', category: '搜索' },  { id: 'dhf-zhihu-hot-search-task', name: '知乎热搜', description: '获取知乎热榜', category: '搜索' },  { id: 'dhf-google-trends-task', name: 'Google 趋势', description: '获取 Google 搜索趋势', category: '趋势' },  { id: 'dhf-install-agent', name: '安装 Bee Agent', description: '安装 Bee Bee Agent 浏览器插件', category: '工具' }];

class SkillUninstaller {
  constructor() {
    this.repoRoot = path.join(__dirname, '..');
    this.claudeSkillsDir = this.getClaudeSkillsDir();
    this.pluginDir = path.join(this.repoRoot, '.claude-plugin');
    this.marketplaceFile = path.join(this.pluginDir, 'marketplace.json');
  }

  getClaudeSkillsDir() {
    const home = process.env.HOME || process.env.USERPROFILE;
    return path.join(home, '.claude', 'skills');
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

  showWelcome() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║          Bee RPA Skills - 卸载技能                          ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
  }

  async selectSkills() {
    const installed = this.getInstalledSkills();

    if (installed.length === 0) {
      console.log('❌ 没有已安装的技能。');
      return [];
    }

    const skills = SKILLS_REGISTRY.filter(s => installed.includes(s.id));

    const choices = skills.map(skill => ({
      name: `🗑️  ${skill.name} - ${skill.description}`,
      value: skill.id,
      short: skill.name
    }));

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message: '选择要卸载的技能 (空格选择，回车确认):',
        choices: choices,
        pageSize: 15
      }
    ]);

    return answers.selected;
  }

  async confirmUninstallation(selectedSkills) {
    const skills = SKILLS_REGISTRY.filter(s => selectedSkills.includes(s.id));

    console.log('\n📋 即将卸载以下技能:\n');
    skills.forEach(skill => {
      console.log(`  • ${skill.name}`);
    });
    console.log(`\n  总计: ${skills.length} 个技能\n`);

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: '确认卸载这些技能？',
        default: false
      }
    ]);

    return answers.confirm;
  }

  uninstallSkill(skillId) {
    const targetPath = path.join(this.claudeSkillsDir, skillId);

    if (!fs.existsSync(targetPath)) {
      console.warn(`  ⚠️  ${skillId} 不存在，跳过`);
      return;
    }

    try {
      const stats = fs.lstatSync(targetPath);
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(targetPath);
      } else {
        fs.rmSync(targetPath, { recursive: true, force: true });
      }
      console.log(`  ✓ ${skillId}`);
    } catch (error) {
      console.warn(`  ⚠️  卸载 ${skillId} 失败: ${error.message}`);
    }
  }

  updateMarketplace(remainingSkills) {
    if (remainingSkills.length === 0) {
      // 没有剩余技能，删除 marketplace.json
      if (fs.existsSync(this.marketplaceFile)) {
        fs.unlinkSync(this.marketplaceFile);
      }
      return;
    }

    const marketplace = {
      name: 'bee-skills',
      owner: {
        name: 'Bee RPA Community',
        email: 'social@dhf.pub'
      },
      metadata: {
        description: 'Bee Agent RPA 自动化技能包',
        version: '1.0.0'
      },
      plugins: [
        {
          name: 'bee-skills',
          description: 'Bee RPA 自动化技能',
          source: './',
          strict: true,
          skills: remainingSkills.map(id => `./skills/${id}`)
        }
      ]
    };

    fs.writeFileSync(this.marketplaceFile, JSON.stringify(marketplace, null, 2));
  }

  async uninstall() {
    try {
      this.showWelcome();

      const selectedSkills = await this.selectSkills();
      if (selectedSkills.length === 0) {
        return;
      }

      const confirmed = await this.confirmUninstallation(selectedSkills);
      if (!confirmed) {
        console.log('\n❌ 卸载已取消。');
        return;
      }

      console.log('\n🔧 开始卸载...\n');
      for (const skillId of selectedSkills) {
        this.uninstallSkill(skillId);
      }

      const installed = this.getInstalledSkills().filter(id => !selectedSkills.includes(id));
      this.updateMarketplace(installed);

      console.log('\n✅ 卸载完成！');
      console.log('\n📝 提示:');
      console.log('  1. 请重新启动 Claude Code');
      console.log('  2. 运行 "npm run list" 查看剩余技能\n');

    } catch (error) {
      console.error('\n❌ 卸载失败:', error.message);
      process.exit(1);
    }
  }
}

const uninstaller = new SkillUninstaller();
uninstaller.uninstall();
