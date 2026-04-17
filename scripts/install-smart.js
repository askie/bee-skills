#!/usr/bin/env node
/**
 * Bee Skills 智能安装器
 * 支持全局安装和项目级安装
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
    size: '2MB',
    command: 'dhf-rpa-test-workflow'
  },
  // 邮件类
  {
    id: 'dhf-163mail-task',
    name: '163 邮件发送',
    description: '自动化发送 163 邮件',
    category: '邮件',
    version: '1.0.0',
    size: '1.5MB',
    command: 'dhf-163mail-task'
  },
  {
    id: 'dhf-outlook-mail-task',
    name: 'Outlook 邮件发送',
    description: '自动化发送 Outlook 邮件',
    category: '邮件',
    version: '1.0.0',
    size: '1.5MB',
    command: 'dhf-outlook-mail-task'
  },
  {
    id: 'dhf-rpa-qq-mail-task',
    name: 'QQ 邮件发送',
    description: '自动化发送 QQ 邮件',
    category: '邮件',
    version: '1.0.0',
    size: '1.5MB',
    command: 'dhf-rpa-qq-mail-task'
  },
  // 新闻资讯类
  {
    id: 'dhf-163news-task',
    name: '163 网易新闻',
    description: '获取 163 网易新闻资讯',
    category: '新闻',
    version: '1.0.0',
    size: '2MB',
    command: 'dhf-163news-task'
  },
  {
    id: 'dhf-bing-news-task',
    name: '百度新闻',
    description: '获取百度新闻资讯',
    category: '新闻',
    version: '1.0.0',
    size: '2MB',
    command: 'dhf-bing-news-task'
  },
  {
    id: 'dhf-google-news-task',
    name: 'Google 新闻',
    description: '获取 Google 新闻资讯',
    category: '新闻',
    version: '1.0.0',
    size: '2MB',
    command: 'dhf-google-news-task'
  },
  {
    id: 'dhf-juejin-news-task',
    name: '掘金新闻',
    description: '获取掘金新闻资讯',
    category: '新闻',
    version: '1.0.0',
    size: '2MB',
    command: 'dhf-juejin-news-task'
  },
  {
    id: 'dhf-tencent-news-task',
    name: '腾讯新闻',
    description: '获取腾讯新闻资讯',
    category: '新闻',
    version: '1.0.0',
    size: '2MB',
    command: 'dhf-tencent-news-task'
  },
  {
    id: 'dhf-toutiao-news-task',
    name: '今日头条新闻',
    description: '获取今日头条资讯',
    category: '新闻',
    version: '1.0.0',
    size: '2MB',
    command: 'dhf-toutiao-news-task'
  },
  // 内容发布类
  {
    id: 'dhf-juejin-publish-task',
    name: '掘金文章发布',
    description: '自动发布文章到掘金平台',
    category: '发布',
    version: '1.0.0',
    size: '2MB',
    command: 'dhf-juejin-publish-task'
  },
  {
    id: 'dhf-zhihu-video-publish-task',
    name: '知乎视频发布',
    description: '自动发布视频笔记到知乎平台',
    category: '发布',
    version: '1.0.0',
    size: '2MB',
    command: 'dhf-zhihu-video-publish-task'
  },
  // 搜索类
  {
    id: 'dhf-douyin-hot-search-task',
    name: '抖音热搜',
    description: '获取抖音热搜榜单',
    category: '搜索',
    version: '1.0.0',
    size: '2MB',
    command: 'dhf-douyin-hot-search-task'
  },
  {
    id: 'dhf-google-hot-topics-task',
    name: 'Google 热搜',
    description: '获取 Google 热搜榜单',
    category: '搜索',
    version: '1.0.0',
    size: '2MB',
    command: 'dhf-google-hot-topics-task'
  },
  {
    id: 'dhf-weibo-hot-search-task',
    name: '微博热搜',
    description: '获取微博热搜榜单',
    category: '搜索',
    version: '1.0.0',
    size: '2MB',
    command: 'dhf-weibo-hot-search-task'
  },
  {
    id: 'dhf-zhihu-hot-search-task',
    name: '知乎热搜',
    description: '获取知乎热榜',
    category: '搜索',
    version: '1.0.0',
    size: '2MB',
    command: 'dhf-zhihu-hot-search-task'
  },
  // 趋势类
  {
    id: 'dhf-google-trends-task',
    name: 'Google 趋势',
    description: '获取 Google 搜索趋势',
    category: '趋势',
    version: '1.0.0',
    size: '2MB',
    command: 'dhf-google-trends-task'
  },
  // 工具类
  {
    id: 'dhf-install-agent',
    name: '安装 Bee Agent',
    description: '安装 Bee Bee Agent 浏览器插件',
    category: '工具',
    version: '1.0.0',
    size: '1MB',
    command: 'dhf-install-agent'
  }
];

class SmartSkillInstaller {
  constructor(options = {}) {
    this.repoRoot = path.join(__dirname, '..');
    this.skillsDir = path.join(this.repoRoot, 'skills');
    this.installMode = options.mode || null; // 'global' | 'project' | null (auto-detect)
    this.targetDir = null;
    this.pluginDir = null;
    this.marketplaceFile = null;
    this.silent = options.silent || false;
  }

  log(message, type = 'info') {
    if (this.silent) return;
    const colors = {
      info: '\x1b[36m',    // cyan
      success: '\x1b[32m', // green
      warning: '\x1b[33m', // yellow
      error: '\x1b[31m'    // red
    };
    const reset = '\x1b[0m';
    console.log(`${colors[type]}${message}${reset}`);
  }

  // 检测当前是否在项目目录中
  detectProjectMode() {
    const currentDir = process.cwd();
    const parentDir = path.dirname(currentDir);

    // 检查是否在项目的 node_modules 中
    if (currentDir.includes('node_modules')) {
      // 检查项目根目录是否有 .claude 目录
      const projectRoot = path.dirname(currentDir.split('node_modules')[0]);
      const projectClaudeDir = path.join(projectRoot, '.claude', 'skills');

      if (fs.existsSync(projectClaudeDir) || this.hasProjectMarkers(projectRoot)) {
        return {
          mode: 'project',
          targetDir: projectClaudeDir,
          pluginDir: path.join(projectRoot, '.claude', 'plugins', 'marketplaces'),
          marketplaceFile: path.join(projectRoot, '.claude', 'plugins', 'marketplaces', 'bee-skills.json')
        };
      }
    }

    // 默认全局模式
    const home = process.env.HOME || process.env.USERPROFILE;
    return {
      mode: 'global',
      targetDir: path.join(home, '.claude', 'skills'),
      pluginDir: path.join(home, '.claude', 'plugins', 'marketplaces'),
      marketplaceFile: path.join(home, '.claude', 'plugins', 'marketplaces', 'bee-skills.json')
    };
  }

  // 检查项目标志
  hasProjectMarkers(dir) {
    const markers = ['.git', 'package.json', '.claude'];
    return markers.some(marker => fs.existsSync(path.join(dir, marker)));
  }

  // 初始化安装模式
  init() {
    const detected = this.detectProjectMode();

    if (this.installMode) {
      // 用户指定了模式
      if (this.installMode === 'global') {
        const home = process.env.HOME || process.env.USERPROFILE;
        this.targetDir = path.join(home, '.claude', 'skills');
        this.pluginDir = path.join(home, '.claude', 'plugins', 'marketplaces');
        this.marketplaceFile = path.join(this.pluginDir, 'bee-skills.json');
      } else if (this.installMode === 'project') {
        // 查找项目根目录
        let currentDir = process.cwd();
        while (currentDir !== path.dirname(currentDir)) {
          if (this.hasProjectMarkers(currentDir)) {
            break;
          }
          currentDir = path.dirname(currentDir);
        }
        this.targetDir = path.join(currentDir, '.claude', 'skills');
        this.pluginDir = path.join(currentDir, '.claude', 'plugins', 'marketplaces');
        this.marketplaceFile = path.join(this.pluginDir, 'bee-skills.json');
      }
    } else {
      // 自动检测
      this.installMode = detected.mode;
      this.targetDir = detected.targetDir;
      this.pluginDir = detected.pluginDir;
      this.marketplaceFile = detected.marketplaceFile;
    }

    this.log(`安装模式: ${this.installMode === 'global' ? '全局' : '项目级'}`, 'info');
    this.log(`目标目录: ${this.targetDir}`, 'info');
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
      return plugin.skills.map(s => path.basename(s));
    } catch (error) {
      return [];
    }
  }

  // 检查技能是否存在
  skillExists(skillId) {
    const skillPath = path.join(this.skillsDir, skillId);
    return fs.existsSync(skillPath);
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

  // 显示欢迎信息
  showWelcome() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║          Bee RPA Skills - 智能安装器                        ║');
    console.log(`║          安装模式: ${this.installMode === 'global' ? '全局' : '项目级'}${' '.repeat(40)}║`);
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
  }

  // 用户选择技能
  async selectSkills(skillIds = null) {
    // 如果指定了技能ID，直接返回
    if (skillIds && skillIds.length > 0) {
      return skillIds;
    }

    const categories = this.categorizeSkills();
    const installed = this.getInstalledSkills();

    const choices = [];
    for (const [category, skills] of Object.entries(categories)) {
      choices.push(new inquirer.Separator(`\n📦 ${category}`));
      skills.forEach(skill => {
        const isInstalled = installed.includes(skill.id);
        const exists = this.skillExists(skill.id);
        if (!exists) return;

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
    if (this.silent) return true;

    const skills = SKILLS_REGISTRY.filter(s => selectedSkills.includes(s.id));
    const totalSize = skills.reduce((sum, s) => sum + (parseFloat(s.size) || 0), 0);

    console.log('\n📋 即将安装以下技能:\n');
    skills.forEach(skill => {
      console.log(`  • ${skill.name} (${skill.size})`);
    });
    console.log(`\n  总计: ${skills.length} 个技能，约 ${totalSize.toFixed(1)}MB`);
    console.log(`  安装位置: ${this.targetDir}\n`);

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
    const targetPath = path.join(this.targetDir, skillId);

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

    // 创建符号链接（全局模式）或复制（项目模式）
    try {
      if (this.installMode === 'global') {
        fs.symlinkSync(skillPath, targetPath, 'junction');
      } else {
        // 项目模式：复制文件
        this.copyDirectory(skillPath, targetPath);
      }
    } catch (error) {
      if (process.platform === 'win32' && this.installMode === 'global') {
        this.log(`  ⚠️  无法创建符号链接，正在复制文件...`, 'warning');
        this.copyDirectory(skillPath, targetPath);
      } else {
        throw error;
      }
    }

    // 安装依赖
    const packageJsonPath = path.join(skillPath, 'package.json');
    if (fs.existsSync(packageJsonPath) && this.installMode === 'global') {
      try {
        const originalDir = process.cwd();
        process.chdir(skillPath);
        execSync('npm install', { stdio: 'pipe' });
        process.chdir(originalDir);
      } catch (error) {
        this.log(`  ⚠️  依赖安装失败: ${error.message}`, 'warning');
      }
    }

    this.log(`  ✓ ${skillId}`, 'success');
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
        version: '1.1.0'
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
    this.log(`✓ marketplace.json 已更新`, 'success');
  }

  // 执行安装
  async install(skillIds = null) {
    try {
      this.init();

      if (!this.silent) {
        this.showWelcome();
      }

      // 选择技能
      const selectedSkills = await this.selectSkills(skillIds);
      if (selectedSkills.length === 0) {
        this.log('❌ 未选择任何技能，安装取消。', 'error');
        return;
      }

      // 确认安装
      const confirmed = await this.confirmInstallation(selectedSkills);
      if (!confirmed) {
        this.log('❌ 安装已取消。', 'error');
        return;
      }

      // 确保目标目录存在
      if (!fs.existsSync(this.targetDir)) {
        fs.mkdirSync(this.targetDir, { recursive: true });
      }

      // 保存当前目录
      const originalDir = process.cwd();

      // 安装技能
      if (!this.silent) {
        console.log('\n🔧 开始安装...\n');
      }
      for (const skillId of selectedSkills) {
        await this.installSkill(skillId);
      }

      // 恢复当前目录
      process.chdir(originalDir);

      // 更新 marketplace.json
      this.updateMarketplace(selectedSkills);

      if (!this.silent) {
        console.log('\n✅ 安装完成！');
        console.log('\n📝 提示:');
        console.log(`  • 安装模式: ${this.installMode === 'global' ? '全局' : '项目级'}`);
        console.log(`  • 安装位置: ${this.targetDir}`);
        console.log('  • 请重新启动 Claude Code');
        console.log(`  • 使用 /xxx 命令调用技能\n`);
      }

      return {
        success: true,
        mode: this.installMode,
        targetDir: this.targetDir,
        skills: selectedSkills
      };

    } catch (error) {
      this.log(`❌ 安装失败: ${error.message}`, 'error');
      if (!this.silent) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
}

// CLI 入口
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options = {};

  // 解析参数
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--global') {
      options.mode = 'global';
    } else if (args[i] === '--project') {
      options.mode = 'project';
    } else if (args[i] === '--silent') {
      options.silent = true;
    } else if (args[i].startsWith('--skill=')) {
      options.skillIds = args[i].split('=')[1].split(',');
    }
  }

  const installer = new SmartSkillInstaller(options);
  installer.install(options.skillIds);
}

export default SmartSkillInstaller;
