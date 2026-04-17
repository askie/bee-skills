#!/usr/bin/env node
/**
 * Bee RPA Skills 交互式安装器
 */

import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 技能注册表
const SKILLS_REGISTRY = [
  // 测试类
  {
    id: 'dhf-rpa-test-workflow',
    name: 'RPA 测试工作流',
    description: '测试 Bee Agent 基础连接和 RPA 操作',
    category: '测试',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['test', 'workflow', '基础'],
    command: 'dhf-rpa-test-workflow'
  },
  // 邮件类
  {
    id: 'dhf-163mail-task',
    name: '163 邮件发送',
    description: '自动化发送 163 邮件',
    category: '邮件',
    version: '1.0.0',
    dependencies: [],
    size: '1.5MB',
    tags: ['mail', '163', 'email'],
    command: 'dhf-163mail-task'
  },
  {
    id: 'dhf-outlook-mail-task',
    name: 'Outlook 邮件发送',
    description: '自动化发送 Outlook 邮件',
    category: '邮件',
    version: '1.0.0',
    dependencies: [],
    size: '1.5MB',
    tags: ['mail', 'outlook', 'email'],
    command: 'dhf-outlook-mail-task'
  },
  {
    id: 'dhf-qq-mail-task',
    name: 'QQ 邮件发送',
    description: '自动化发送 QQ 邮件',
    category: '邮件',
    version: '1.0.0',
    dependencies: [],
    size: '1.5MB',
    tags: ['mail', 'qq', 'email'],
    command: 'dhf-qq-mail-task'
  },
  // 新闻资讯类
  {
    id: 'dhf-163news-task',
    name: '163 网易新闻',
    description: '获取 163 网易新闻资讯',
    category: '新闻',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['news', '163', '资讯'],
    command: 'dhf-163news-task'
  },
  {
    id: 'dhf-bing-news-task',
    name: '百度新闻',
    description: '获取百度新闻资讯',
    category: '新闻',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['news', 'baidu', '资讯'],
    command: 'dhf-bing-news-task'
  },
  {
    id: 'dhf-google-news-task',
    name: 'Google 新闻',
    description: '获取 Google 新闻资讯',
    category: '新闻',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['news', 'google', '资讯'],
    command: 'dhf-google-news-task'
  },
  {
    id: 'dhf-juejin-news-task',
    name: '掘金新闻',
    description: '获取掘金新闻资讯',
    category: '新闻',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['news', 'juejin', '资讯'],
    command: 'dhf-juejin-news-task'
  },
  {
    id: 'dhf-tencent-news-task',
    name: '腾讯新闻',
    description: '获取腾讯新闻资讯',
    category: '新闻',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['news', 'tencent', '资讯'],
    command: 'dhf-tencent-news-task'
  },
  {
    id: 'dhf-toutiao-news-task',
    name: '今日头条新闻',
    description: '获取今日头条资讯',
    category: '新闻',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['news', 'toutiao', '资讯'],
    command: 'dhf-toutiao-news-task'
  },
  // 内容发布类
  {
    id: 'dhf-juejin-publish-task',
    name: '掘金文章发布',
    description: '自动发布文章到掘金平台',
    category: '发布',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['publish', 'juejin', '文章'],
    command: 'dhf-juejin-publish-task'
  },
  {
    id: 'dhf-zhihu-video-publish-task',
    name: '知乎视频发布',
    description: '自动发布视频笔记到知乎平台',
    category: '发布',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['publish', 'zhihu', '视频'],
    command: 'dhf-zhihu-video-publish-task'
  },
  {
    id: 'dhf-xiaohongshu-video-publish-task',
    name: '小红书视频发布',
    description: '自动发布视频笔记到小红书平台',
    category: '发布',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['publish', 'xiaohongshu', '视频'],
    command: 'dhf-xiaohongshu-video-publish-task'
  },
  {
    id: 'dhf-toutiao-video-publish-task',
    name: '头条视频发布',
    description: '自动发布视频笔记到今日头条平台',
    category: '发布',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['publish', 'toutiao', '视频'],
    command: 'dhf-toutiao-video-publish-task'
  },
  // 搜索类
  {
    id: 'dhf-douyin-hot-search-task',
    name: '抖音热搜',
    description: '获取抖音热搜榜单',
    category: '搜索',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['search', 'douyin', '热搜'],
    command: 'dhf-douyin-hot-search-task'
  },
  {
    id: 'dhf-google-hot-topics-task',
    name: 'Google 热搜',
    description: '获取 Google 热搜榜单',
    category: '搜索',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['search', 'google', '热搜'],
    command: 'dhf-google-hot-topics-task'
  },
  {
    id: 'dhf-weibo-hot-search-task',
    name: '微博热搜',
    description: '获取微博热搜榜单',
    category: '搜索',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['search', 'weibo', '热搜'],
    command: 'dhf-weibo-hot-search-task'
  },
  {
    id: 'dhf-zhihu-hot-search-task',
    name: '知乎热搜',
    description: '获取知乎热榜',
    category: '搜索',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['search', 'zhihu', '热榜'],
    command: 'dhf-zhihu-hot-search-task'
  },
  // 趋势类
  {
    id: 'dhf-google-trends-task',
    name: 'Google 趋势',
    description: '获取 Google 搜索趋势',
    category: '趋势',
    version: '1.0.0',
    dependencies: [],
    size: '2MB',
    tags: ['trends', 'google', '趋势'],
    command: 'dhf-google-trends-task'
  },
  // 工具类
  {
    id: 'dhf-install-agent',
    name: '安装 Bee Agent',
    description: '安装 Bee Bee Agent 浏览器插件',
    category: '工具',
    version: '1.0.0',
    dependencies: [],
    size: '1MB',
    tags: ['install', 'agent', '工具'],
    command: 'dhf-install-agent'
  }
];

class SkillInstaller {
  constructor() {
    this.repoRoot = path.join(__dirname, '..');
    this.skillsDir = path.join(this.repoRoot, 'skills');
    this.claudeSkillsDir = this.getClaudeSkillsDir();
    this.pluginDir = path.join(this.repoRoot, '.claude-plugin');
    this.marketplaceFile = path.join(this.pluginDir, 'marketplace.json');
  }

  // 获取 Claude skills 目录
  getClaudeSkillsDir() {
    const home = process.env.HOME || process.env.USERPROFILE;
    return path.join(home, '.claude', 'skills');
  }

  // 获取已安装的技能
  getInstalledSkills() {
    if (!fs.existsSync(this.marketplaceFile)) {
      return [];
    }
    try {
      const marketplace = JSON.parse(fs.readFileSync(this.marketplaceFile, 'utf-8'));
      const plugin = marketplace.plugins?.find(p => p.name === 'bee-skills');
      if (!plugin?.skills) return [];
      return plugin.skills.map(s => {
        const name = path.basename(s);
        return name;
      });
    } catch (error) {
      return [];
    }
  }

  // 检查技能是否存在
  skillExists(skillId) {
    const skillPath = path.join(this.skillsDir, skillId);
    return fs.existsSync(skillPath);
  }

  // 显示欢迎信息
  showWelcome() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║          Bee RPA Skills - 交互式安装器                      ║');
    console.log('║          按需选择你需要的技能                               ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
  }

  // 按分类显示技能
  categorizeSkills() {
    const categories = {};
    SKILLS_REGISTRY.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category].push(skill);
    });
    return categories;
  }

  // 用户选择技能
  async selectSkills() {
    const categories = this.categorizeSkills();
    const installed = this.getInstalledSkills();

    const choices = [];
    for (const [category, skills] of Object.entries(categories)) {
      choices.push(new inquirer.Separator(`\n📦 ${category}`));
      skills.forEach(skill => {
        const isInstalled = installed.includes(skill.id);
        const exists = this.skillExists(skill.id);
        if (!exists) return; // 跳过不存在的技能

        const status = isInstalled ? '✓' : ' ';
        choices.push({
          name: `${status} ${skill.name.padEnd(20)} - ${skill.description} [${skill.size}]`,
          value: skill.id,
          checked: isInstalled,
          short: skill.name
        });
      });
    }

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message: '选择要安装的技能 (空格选择/取消，回车确认):',
        choices: choices,
        pageSize: 20
      }
    ]);

    return answers.selected;
  }

  // 确认安装
  async confirmInstallation(selectedSkills) {
    const skills = SKILLS_REGISTRY.filter(s => selectedSkills.includes(s.id));
    const totalSize = skills.reduce((sum, s) => {
      const size = parseFloat(s.size) || 0;
      return sum + size;
    }, 0);

    console.log('\n📋 即将安装以下技能:\n');
    skills.forEach(skill => {
      console.log(`  • ${skill.name} (${skill.size})`);
    });
    console.log(`\n  总计: ${skills.length} 个技能，约 ${totalSize.toFixed(1)}MB\n`);

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: '确认安装这些技能？',
        default: true
      }
    ]);

    return answers.confirm;
  }

  // 安装单个技能
  async installSkill(skillId) {
    const skillPath = path.join(this.skillsDir, skillId);
    const targetPath = path.join(this.claudeSkillsDir, skillId);

    // 检查技能目录是否存在
    if (!fs.existsSync(skillPath)) {
      throw new Error(`技能目录不存在: ${skillPath}`);
    }

    // 删除旧的链接或目录
    if (fs.existsSync(targetPath)) {
      try {
        const stats = fs.lstatSync(targetPath);
        if (stats.isSymbolicLink()) {
          fs.unlinkSync(targetPath);
        } else {
          fs.rmSync(targetPath, { recursive: true, force: true });
        }
      } catch (error) {
        // 忽略错误
      }
    }

    // 创建符号链接
    try {
      fs.symlinkSync(skillPath, targetPath, 'junction');
    } catch (error) {
      // Windows 上可能需要管理员权限，尝试复制
      if (process.platform === 'win32') {
        console.warn(`  ⚠️  无法创建符号链接，正在复制文件...`);
        this.copyDirectory(skillPath, targetPath);
      } else {
        throw error;
      }
    }

    // 安装依赖
    const packageJsonPath = path.join(skillPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        process.chdir(skillPath);
        execSync('npm install', { stdio: 'pipe' });
      } catch (error) {
        console.warn(`  ⚠️  依赖安装失败: ${error.message}`);
      }
    }

    console.log(`  ✓ ${skillId}`);
  }

  // 递归复制目录
  copyDirectory(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  // 更新 marketplace.json
  updateMarketplace(installedSkills) {
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
          skills: installedSkills.map(id => `./skills/${id}`)
        }
      ]
    };

    // 确保目录存在
    if (!fs.existsSync(this.pluginDir)) {
      fs.mkdirSync(this.pluginDir, { recursive: true });
    }

    fs.writeFileSync(this.marketplaceFile, JSON.stringify(marketplace, null, 2));
  }

  // 执行安装
  async install() {
    try {
      this.showWelcome();

      // 选择技能
      const selectedSkills = await this.selectSkills();
      if (selectedSkills.length === 0) {
        console.log('\n❌ 未选择任何技能，安装取消。');
        return;
      }

      // 确认安装
      const confirmed = await this.confirmInstallation(selectedSkills);
      if (!confirmed) {
        console.log('\n❌ 安装已取消。');
        return;
      }

      // 确保目标目录存在
      if (!fs.existsSync(this.claudeSkillsDir)) {
        fs.mkdirSync(this.claudeSkillsDir, { recursive: true });
      }

      // 保存当前目录
      const originalDir = process.cwd();

      // 安装技能
      console.log('\n🔧 开始安装...\n');
      for (const skillId of selectedSkills) {
        await this.installSkill(skillId);
      }

      // 恢复当前目录
      process.chdir(originalDir);

      // 更新 marketplace.json
      this.updateMarketplace(selectedSkills);

      console.log('\n✅ 安装完成！');
      console.log('\n📝 提示:');
      console.log('  1. 请重新启动 Claude Code');
      console.log('  2. 使用 /xxx 命令调用技能');
      console.log('  3. 运行 "npm run list" 查看已安装技能\n');

    } catch (error) {
      console.error('\n❌ 安装失败:', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }
}

// 运行安装器
const installer = new SkillInstaller();
installer.install();
