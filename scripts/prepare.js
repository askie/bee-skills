#!/usr/bin/env node
/**
 * npm 发布前准备脚本
 * 检查环境、版本、文件完整性等
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PublishPreparer {
  constructor() {
    this.repoRoot = path.join(__dirname, '..');
    this.packageJson = JSON.parse(
      fs.readFileSync(path.join(this.repoRoot, 'package.json'), 'utf-8')
    );
    this.errors = [];
    this.warnings = [];
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',    // cyan
      success: '\x1b[32m', // green
      warning: '\x1b[33m', // yellow
      error: '\x1b[31m',   // red
      reset: '\x1b[0m'
    };
    const color = colors[type] || colors.info;
    console.log(`${color}${message}${colors.reset}`);
  }

  checkNotPrivate() {
    this.log('\n📌 检查包发布状态...');

    if (this.packageJson.private === true) {
      this.errors.push('package.json 中 "private" 字段为 true，无法发布');
      this.log('  ❌ private: true', 'error');
      return false;
    }

    this.log(`  ✅ 包可发布: ${this.packageJson.name}`, 'success');
    return true;
  }

  checkVersion() {
    this.log('\n📌 检查版本...');

    const version = this.packageJson.version;
    this.log(`  当前版本: ${version}`, 'info');

    // 检查是否符合 semver 规范
    const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
    if (!semverRegex.test(version)) {
      this.errors.push(`版本号不符合 semver 规范: ${version}`);
      this.log('  ❌ 版本号格式错误', 'error');
      return false;
    }

    this.log('  ✅ 版本号格式正确', 'success');
    return true;
  }

  checkRequiredFields() {
    this.log('\n📌 检查必需字段...');

    const required = ['name', 'version', 'description', 'author', 'license'];
    const missing = required.filter(field => !this.packageJson[field]);

    if (missing.length > 0) {
      this.errors.push(`缺少必需字段: ${missing.join(', ')}`);
      this.log(`  ❌ 缺少字段: ${missing.join(', ')}`, 'error');
      return false;
    }

    this.log('  ✅ 所有必需字段存在', 'success');
    return true;
  }

  checkRepository() {
    this.log('\n📌 检查仓库配置...');

    if (!this.packageJson.repository) {
      this.warnings.push('未配置 repository 字段');
      this.log('  ⚠️  未配置 repository', 'warning');
      return true;
    }

    this.log(`  ✅ 仓库: ${this.packageJson.repository.url}`, 'success');
    return true;
  }

  checkFiles() {
    this.log('\n📌 检查必需文件...');

    const requiredFiles = [
      'README.md',
      'LICENSE',
      'package.json'
    ];

    const missing = requiredFiles.filter(file => {
      return !fs.existsSync(path.join(this.repoRoot, file));
    });

    if (missing.length > 0) {
      this.errors.push(`缺少必需文件: ${missing.join(', ')}`);
      this.log(`  ❌ 缺少文件: ${missing.join(', ')}`, 'error');
      return false;
    }

    this.log('  ✅ 所有必需文件存在', 'success');

    // 检查 skills 目录
    const skillsDir = path.join(this.repoRoot, 'skills');
    if (!fs.existsSync(skillsDir)) {
      this.errors.push('缺少 skills 目录');
      this.log('  ❌ 缺少 skills 目录', 'error');
      return false;
    }

    const skills = fs.readdirSync(skillsDir);
    this.log(`  ✅ 包含 ${skills.length} 个技能`, 'success');

    return true;
  }

  checkGitStatus() {
    this.log('\n📌 检查 Git 状态...');

    try {
      const status = execSync('git status --porcelain', {
        cwd: this.repoRoot,
        encoding: 'utf-8'
      });

      if (status.trim()) {
        this.warnings.push('存在未提交的更改');
        this.log('  ⚠️  存在未提交的更改', 'warning');
        this.log('\n未提交的文件:', 'warning');
        console.log(status);
        return false;
      }

      this.log('  ✅ 工作目录干净', 'success');
      return true;
    } catch (error) {
      this.warnings.push('无法检查 Git 状态');
      this.log('  ⚠️  无法检查 Git 状态', 'warning');
      return true;
    }
  }

  checkGitTag() {
    this.log('\n📌 检查 Git 标签...');

    try {
      const version = this.packageJson.version;
      const tags = execSync(`git tag -l "v${version}"`, {
        cwd: this.repoRoot,
        encoding: 'utf-8'
      });

      if (tags.trim()) {
        this.log(`  ✅ 标签 v${version} 已存在`, 'success');
        return true;
      } else {
        this.warnings.push(`标签 v${version} 不存在`);
        this.log(`  ⚠️  标签 v${version} 不存在，发布前需要创建标签`, 'warning');
        return false;
      }
    } catch (error) {
      this.warnings.push('无法检查 Git 标签');
      this.log('  ⚠️  无法检查 Git 标签', 'warning');
      return true;
    }
  }

  checkNpmRegistry() {
    this.log('\n📌 检查 npm registry...');

    try {
      const registry = execSync('npm config get registry', {
        encoding: 'utf-8'
      }).trim();

      this.log(`  当前 registry: ${registry}`, 'info');

      if (registry.includes('npmjs.org') || registry.includes('registry.npmjs.org')) {
        this.log('  ✅ 使用官方 npm registry', 'success');
        return true;
      } else {
        this.warnings.push(`非官方 registry: ${registry}`);
        this.log(`  ⚠️  使用自定义 registry`, 'warning');
        return true;
      }
    } catch (error) {
      this.warnings.push('无法检查 npm registry');
      this.log('  ⚠️  无法检查 npm registry', 'warning');
      return true;
    }
  }

  checkNpmUser() {
    this.log('\n📌 检查 npm 用户...');

    try {
      const user = execSync('npm whoami', {
        encoding: 'utf-8'
      }).trim();

      this.log(`  ✅ 当前用户: ${user}`, 'success');
      return true;
    } catch (error) {
      this.errors.push('未登录 npm');
      this.log('  ❌ 未登录 npm，请运行 npm login', 'error');
      return false;
    }
  }

  checkPackageName() {
    this.log('\n📌 检查包名...');

    const name = this.packageJson.name;

    // 检查是否使用 scope
    if (name.startsWith('@')) {
      this.log(`  ✅ 使用 scoped 包名: ${name}`, 'success');

      // 检查包是否已存在
      try {
        execSync(`npm view ${name} version`, { encoding: 'utf-8', stdio: 'pipe' });
        this.warnings.push(`包名 ${name} 已存在于 npm registry`);
        this.log('  ⚠️  包名已存在，发布时会更新现有包', 'warning');
      } catch (error) {
        // 包不存在，可以正常发布
        this.log('  ✅ 包名可用', 'success');
      }
    } else {
      this.warnings.push('建议使用 scoped 包名 (如 @dhf-rpa/skills)');
      this.log('  ⚠️  建议使用 scoped 包名', 'warning');
    }

    return true;
  }

  async run() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║          npm 发布前检查                                      ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');

    // 运行所有检查
    this.checkNotPrivate();
    this.checkVersion();
    this.checkRequiredFields();
    this.checkRepository();
    this.checkFiles();
    this.checkGitStatus();
    this.checkGitTag();
    this.checkNpmRegistry();
    this.checkNpmUser();
    this.checkPackageName();

    // 显示结果
    console.log('\n' + '─'.repeat(60));
    console.log('\n📊 检查结果:\n');

    if (this.errors.length > 0) {
      this.log(`❌ 发现 ${this.errors.length} 个错误:`, 'error');
      this.errors.forEach(err => this.log(`  • ${err}`, 'error'));
    }

    if (this.warnings.length > 0) {
      this.log(`\n⚠️  ${this.warnings.length} 个警告:`, 'warning');
      this.warnings.forEach(warn => this.log(`  • ${warn}`, 'warning'));
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      this.log('\n✅ 所有检查通过，可以发布！', 'success');
      console.log('\n📝 发布命令:');
      console.log('  npm run publish:preview  - 预览发布内容');
      console.log('  npm run publish:public   - 正式发布到 npm\n');
      return true;
    } else if (this.errors.length === 0) {
      this.log('\n✅ 可以发布，但有警告需要注意', 'success');
      console.log('\n📝 发布命令:');
      console.log('  npm run publish:preview  - 预览发布内容');
      console.log('  npm run publish:public   - 正式发布到 npm\n');
      return true;
    } else {
      this.log('\n❌ 无法发布，请修复上述错误', 'error');
      console.log('\n💡 建议:');
      console.log('  1. 修复错误字段');
      console.log('  2. 运行 git add . && git commit');
      console.log('  3. 创建 Git 标签: git tag v1.0.0');
      console.log('  4. 运行 npm login');
      console.log('  5. 重新运行 npm run prepublishOnly\n');
      return false;
    }
  }
}

const preparer = new PublishPreparer();
preparer.run().then(success => {
  process.exit(success ? 0 : 1);
});
