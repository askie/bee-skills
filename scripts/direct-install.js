#!/usr/bin/env node
/**
 * 直接安装脚本 - 支持非交互式安装
 * 用于：npm install bee-skills -- --skill=dhf-rpa-test-workflow
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DirectInstaller {
  constructor() {
    this.repoRoot = path.join(__dirname, '..');
    this.skillsDir = path.join(this.repoRoot, 'skills');
  }

  // 从 npm 环境变量获取参数
  getInstallArgs() {
    // npm 传递的参数在 process.env.npm_config_argv
    try {
      const argv = JSON.parse(process.env.npm_config_argv || '{}');
      const original = argv.original || [];

      // 查找 --skill= 参数
      for (const arg of original) {
        if (arg.startsWith('--skill=')) {
          const skills = arg.split('=')[1].split(',');
          return { skills, mode: this.detectMode(original) };
        }
      }
    } catch (error) {
      // 忽略错误
    }

    // 也检查 process.argv
    for (let i = 2; i < process.argv.length; i++) {
      if (process.argv[i].startsWith('--skill=')) {
        const skills = process.argv[i].split('=')[1].split(',');
        return { skills, mode: 'global' };
      }
    }

    return null;
  }

  detectMode(args) {
    if (args.includes('--project')) return 'project';
    if (args.includes('--global')) return 'global';
    return 'global'; // 默认全局
  }

  async install() {
    const args = this.getInstallArgs();

    if (!args) {
      console.log('Bee Skills Installer v1.2.0\n');
      console.log('使用方法：');
      console.log('  npm install bee-skills -- --skill=<skillId>');
      console.log('  npm install bee-skills -- --skill=dhf-rpa-test-workflow,dhf-qq-mail-task');
      console.log('\n可用技能：');
      this.listSkills();
      return;
    }

    const { skills, mode } = args;

    console.log(`\n🔧 安装 ${skills.length} 个技能（${mode === 'global' ? '全局' : '项目'}模式）...\n`);

    // 确定目标目录
    const home = process.env.HOME || process.env.USERPROFILE;
    let targetDir;

    if (mode === 'project') {
      // 查找项目根目录
      let currentDir = process.cwd();
      while (currentDir !== path.dirname(currentDir)) {
        if (fs.existsSync(path.join(currentDir, '.git')) ||
            fs.existsSync(path.join(currentDir, 'package.json'))) {
          break;
        }
        currentDir = path.dirname(currentDir);
      }
      targetDir = path.join(currentDir, '.claude', 'skills');
    } else {
      targetDir = path.join(home, '.claude', 'skills');
    }

    // 确保目录存在
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 安装技能
    for (const skillId of skills) {
      const skillPath = path.join(this.skillsDir, skillId);
      const targetPath = path.join(targetDir, skillId);

      if (!fs.existsSync(skillPath)) {
        console.log(`  ⚠️  ${skillId} - 技能不存在，跳过`);
        continue;
      }

      try {
        // 删除旧链接/目录
        if (fs.existsSync(targetPath)) {
          fs.rmSync(targetPath, { recursive: true, force: true });
        }

        // 创建符号链接或复制
        if (mode === 'global') {
          try {
            fs.symlinkSync(skillPath, targetPath, 'junction');
          } catch (error) {
            // 失败则复制
            this.copyDirectory(skillPath, targetPath);
          }
        } else {
          this.copyDirectory(skillPath, targetPath);
        }

        console.log(`  ✅ ${skillId}`);
      } catch (error) {
        console.log(`  ❌ ${skillId} - ${error.message}`);
      }
    }

    // 更新 marketplace.json
    this.updateMarketplace(skills, mode);

    console.log(`\n✅ 安装完成！位置：${targetDir}`);
    console.log('📝 请重新启动 Claude Code\n');
  }

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

  updateMarketplace(skills, mode) {
    const home = process.env.HOME || process.env.USERPROFILE;
    let pluginDir, marketplaceFile;

    if (mode === 'project') {
      // 查找项目根目录
      let currentDir = process.cwd();
      while (currentDir !== path.dirname(currentDir)) {
        if (fs.existsSync(path.join(currentDir, '.git')) ||
            fs.existsSync(path.join(currentDir, 'package.json'))) {
          break;
        }
        currentDir = path.dirname(currentDir);
      }
      pluginDir = path.join(currentDir, '.claude', 'plugins', 'marketplaces');
    } else {
      pluginDir = path.join(home, '.claude', 'plugins', 'marketplaces');
    }

    marketplaceFile = path.join(pluginDir, 'bee-skills.json');

    const marketplace = {
      name: 'bee-skills',
      owner: {
        name: 'Bee Skills Community',
        email: 'community@bee.pub'
      },
      metadata: {
        description: 'Bee Agent RPA 自动化技能包',
        version: '1.2.0'
      },
      plugins: [
        {
          name: 'bee-skills',
          description: 'Bee RPA 自动化技能',
          source: './',
          strict: true,
          skills: skills.map(id => `./skills/${id}`)
        }
      ]
    };

    if (!fs.existsSync(pluginDir)) {
      fs.mkdirSync(pluginDir, { recursive: true });
    }

    fs.writeFileSync(marketplaceFile, JSON.stringify(marketplace, null, 2));
  }

  listSkills() {
    const skills = fs.readdirSync(this.skillsDir).filter(dir => {
      const skillPath = path.join(this.skillsDir, dir);
      return fs.statSync(skillPath).isDirectory();
    });

    skills.forEach(skill => {
      console.log(`  - ${skill}`);
    });
  }
}

const installer = new DirectInstaller();
installer.install();
