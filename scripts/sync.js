#!/usr/bin/env node
/**
 * Bee RPA Skills 同步脚本
 * 同步已安装的技能到最新版本
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SkillSyncer {
  constructor() {
    this.repoRoot = path.join(__dirname, '..');
    this.skillsDir = path.join(this.repoRoot, 'skills');
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

  syncSkill(skillId) {
    const skillPath = path.join(this.skillsDir, skillId);
    const targetPath = path.join(this.claudeSkillsDir, skillId);

    if (!fs.existsSync(skillPath)) {
      console.warn(`  ⚠️  ${skillId} 源目录不存在，跳过`);
      return;
    }

    try {
      // 删除旧的链接或目录
      if (fs.existsSync(targetPath)) {
        const stats = fs.lstatSync(targetPath);
        if (stats.isSymbolicLink()) {
          fs.unlinkSync(targetPath);
        } else {
          fs.rmSync(targetPath, { recursive: true, force: true });
        }
      }

      // 创建新的符号链接
      fs.symlinkSync(skillPath, targetPath, 'junction');

      // 更新依赖
      const packageJsonPath = path.join(skillPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        process.chdir(skillPath);
        try {
          execSync('npm install', { stdio: 'pipe' });
        } catch (error) {
          console.warn(`  ⚠️  依赖更新失败: ${error.message}`);
        }
      }

      console.log(`  ✓ ${skillId}`);
    } catch (error) {
      console.error(`  ✗ ${skillId}: ${error.message}`);
    }
  }

  sync() {
    console.log('\n🔄 Bee RPA Skills 同步工具\n');

    const installed = this.getInstalledSkills();

    if (installed.length === 0) {
      console.log('❌ 没有已安装的技能。');
      console.log('   运行 "npm run install" 安装技能。\n');
      return;
    }

    console.log(`📦 同步 ${installed.length} 个技能...\n`);

    const originalDir = process.cwd();

    for (const skillId of installed) {
      this.syncSkill(skillId);
    }

    process.chdir(originalDir);

    console.log('\n✅ 同步完成！');
    console.log('\n📝 提示:');
    console.log('  1. 请重新启动 Claude Code');
    console.log('  2. 运行 "npm run list" 查看技能状态\n');
  }
}

const syncer = new SkillSyncer();
syncer.sync();
