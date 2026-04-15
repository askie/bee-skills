#!/usr/bin/env bun
import { spawn } from "child_process";
import { createReadStream, createWriteStream, existsSync, mkdirSync, rmSync, renameSync } from "fs";
import { arch, homedir, platform, tmpdir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream/promises";
import { promisify } from "util";
import { execSync } from "child_process";

const exec = promisify(execSync);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Types
interface Options {
  check?: boolean;
  install?: boolean;
  force?: boolean;
  status?: boolean;
  open?: boolean;
  help?: boolean;
}

interface InstallResult {
  success: boolean;
  message: string;
  path?: string;
  version?: string;
}

// Constants
const DHF_VERSION = "3.0.9";
const DHF_DOWNLOAD_BASE = "https://dhf.pub/downloads";
const DHF_HOMEPAGE = "https://dhf.pub";

// Download URLs for version 3.0.9
const DOWNLOAD_URLS = {
  "win32-x64": `${DHF_DOWNLOAD_BASE}/dhf-agent-v${DHF_VERSION}-windows-amd64.zip`,
  "darwin-arm64": `${DHF_DOWNLOAD_BASE}/dhf-agent-v${DHF_VERSION}-darwin-arm64.zip`,
  "darwin-x64": `${DHF_DOWNLOAD_BASE}/dhf-agent-v${DHF_VERSION}-darwin-amd64.zip`,
  "linux-x64": `${DHF_DOWNLOAD_BASE}/dhf-agent-v${DHF_VERSION}-linux-amd64.zip`,
};

// Platform-specific installation paths
const INSTALL_PATHS = {
  win32: {
    installDir: join(process.env.LOCALAPPDATA || "", "Programs", "DHF-Bee-Agent"),
    executable: "DHF-Bee-Agent.exe",
    check: [
      join(process.env.LOCALAPPDATA || "", "Programs", "DHF-Bee-Agent", "DHF-Bee-Agent.exe"),
      join(process.env.PROGRAMFILES || "", "DHF-Bee-Agent", "DHF-Bee-Agent.exe"),
      join(process.env.APPDATA || "", "DHF-Bee-Agent", "DHF-Bee-Agent.exe"),
    ],
    config: join(process.env.APPDATA || "", "DHF-Bee-Agent"),
  },
  darwin: {
    installDir: "/Applications",
    executable: "DHF-Bee-Agent.app",
    check: [
      "/Applications/DHF-Bee-Agent.app",
      join(homedir(), "Applications", "DHF-Bee-Agent.app"),
    ],
    config: join(homedir(), "Library", "Application Support", "DHF-Bee-Agent"),
  },
  linux: {
    installDir: join(homedir(), ".local", "share", "DHF-Bee-Agent"),
    executable: "dhf-bee-agent",
    check: [
      "/usr/bin/dhf-bee-agent",
      join(homedir(), ".local", "bin", "dhf-bee-agent"),
      "/opt/DHF-Bee-Agent/dhf-bee-agent",
    ],
    config: join(homedir(), ".config", "DHF-Bee-Agent"),
  },
};

// Color output helpers
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function printHeader(title: string) {
  console.log();
  log("═".repeat(60), colors.cyan);
  log(`  ${title}`, colors.bright + colors.cyan);
  log("═".repeat(60), colors.cyan);
  console.log();
}

// Parse command line arguments
function parseArgs(args: string[]): Options {
  const options: Options = {};
  for (const arg of args) {
    switch (arg) {
      case "--check":
      case "-c":
        options.check = true;
        break;
      case "--install":
      case "-i":
        options.install = true;
        break;
      case "--force":
      case "-f":
        options.force = true;
        break;
      case "--status":
      case "-s":
        options.status = true;
        break;
      case "--open":
      case "-o":
        options.open = true;
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
    }
  }
  return options;
}

// Detect DHF installation
async function detectInstallation(): Promise<{ installed: boolean; path?: string; version?: string }> {
  const platformKey = platform() as keyof typeof INSTALL_PATHS;
  const paths = INSTALL_PATHS[platformKey];

  if (!paths) {
    return { installed: false };
  }

  for (const checkPath of paths.check) {
    if (existsSync(checkPath)) {
      const version = await getVersion(checkPath);
      return { installed: true, path: checkPath, version };
    }
  }

  return { installed: false };
}

// Get DHF version
async function getVersion(execPath: string): Promise<string | undefined> {
  return new Promise((resolve) => {
    const proc = spawn(execPath, ["--version"], { shell: true });
    let output = "";

    proc.stdout.on("data", (data) => {
      output += data.toString();
    });

    proc.on("close", (code) => {
      if (code === 0 && output) {
        const match = output.match(/(\d+\.\d+\.\d+)/);
        resolve(match ? match[1] : undefined);
      } else {
        resolve(undefined);
      }
    });

    proc.on("error", () => {
      resolve(undefined);
    });

    setTimeout(() => {
      proc.kill();
      resolve(undefined);
    }, 5000);
  });
}

// Get download URL for current platform
function getDownloadURL(): string {
  const platformKey = platform();
  const archKey = arch();
  const key = `${platformKey}-${archKey}` as keyof typeof DOWNLOAD_URLS;

  if (key in DOWNLOAD_URLS) {
    return DOWNLOAD_URLS[key];
  }

  throw new Error(`Unsupported platform: ${platformKey}-${archKey}`);
}

// Download file with progress
async function downloadFile(url: string, destPath: string): Promise<void> {
  log(`📥 Downloading from:`, colors.cyan);
  log(`   ${url}`, colors.gray);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  const contentLength = response.headers.get("content-length");
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  let downloaded = 0;

  log(`📦 Total size: ${(total / 1024 / 1024).toFixed(2)} MB`, colors.cyan);

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const fileStream = createWriteStream(destPath);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    downloaded += value.length;
    fileStream.write(value);

    if (total > 0) {
      const progress = Math.round((downloaded / total) * 100);
      process.stdout.write(`\r   Progress: ${progress}% [${"█".repeat(Math.floor(progress / 2))}${" ".repeat(50 - Math.floor(progress / 2))}]`);
    }
  }

  fileStream.close();
  console.log();
  log("✅ Download complete!", colors.green);
}

// Extract ZIP file
async function extractZip(zipPath: string, destDir: string): Promise<void> {
  log("📂 Extracting files...", colors.cyan);

  // Use bun's unzip or system unzip
  const platformKey = platform();
  let extractCmd: string;

  if (platformKey === "win32") {
    // Use PowerShell to extract
    extractCmd = `Expand-Archive -Path "${zipPath}" -DestinationPath "${destDir}" -Force`;
    await exec(`powershell -Command "${extractCmd}"`, { encoding: "utf-8" });
  } else {
    // Use unzip on Unix-like systems
    extractCmd = `unzip -o "${zipPath}" -d "${destDir}"`;
    await exec(extractCmd, { encoding: "utf-8" });
  }

  log("✅ Extraction complete!", colors.green);
}

// Install DHF
async function installDHF(options: Options): Promise<InstallResult> {
  printHeader("DHF Bee Agent Installation");

  // Check if already installed
  const detection = await detectInstallation();
  if (detection.installed && !options.force) {
    log("✅ DHF Bee Agent is already installed!", colors.green);
    log(`   Location: ${detection.path}`, colors.cyan);
    if (detection.version) {
      log(`   Version: ${detection.version}`, colors.cyan);
    }
    log("   Use --force to reinstall", colors.yellow);
    return {
      success: true,
      message: "Already installed",
      path: detection.path,
      version: detection.version,
    };
  }

  if (detection.installed && options.force) {
    log("🔄 Force reinstall requested...", colors.yellow);
  }

  const platformKey = platform() as keyof typeof INSTALL_PATHS;
  const paths = INSTALL_PATHS[platformKey];

  if (!paths) {
    return {
      success: false,
      message: `Unsupported platform: ${platformKey}`,
    };
  }

  log("📋 System Information:", colors.bright);
  log(`   Platform: ${platformKey}`, colors.cyan);
  log(`   Architecture: ${arch()}`, colors.cyan);
  log(`   Version: ${DHF_VERSION}`, colors.cyan);
  console.log();

  try {
    // Get download URL
    const downloadUrl = getDownloadURL();
    log(`📥 Download URL: ${downloadUrl}`, colors.blue);

    // Create temp directory
    const tempDir = join(tmpdir(), "dhf-install");
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true });
    }

    const zipPath = join(tempDir, "dhf-agent.zip");

    // Download
    await downloadFile(downloadUrl, zipPath);

    // Create installation directory
    log(`📁 Installing to: ${paths.installDir}`, colors.cyan);
    if (!existsSync(paths.installDir)) {
      mkdirSync(paths.installDir, { recursive: true });
    }

    // Extract
    const extractDir = join(tempDir, "extracted");
    if (!existsSync(extractDir)) {
      mkdirSync(extractDir, { recursive: true });
    }

    await extractZip(zipPath, extractDir);

    // Move files to installation directory
    log("🚀 Installing files...", colors.cyan);

    if (platformKey === "darwin") {
      // macOS: Move .app bundle to Applications
      const appSource = join(extractDir, "DHF-Bee-Agent.app");
      const appDest = "/Applications/DHF-Bee-Agent.app";

      // Remove existing installation if force reinstall
      if (existsSync(appDest) && options.force) {
        await exec(`rm -rf "${appDest}"`, { encoding: "utf-8" });
      }

      await exec(`mv "${appSource}" "${appDest}"`, { encoding: "utf-8" });
      log("✅ Application installed to /Applications", colors.green);

      // Set executable permissions
      await exec(`chmod +x "${appDest}/Contents/MacOS/DHF-Bee-Agent"`, { encoding: "utf-8" });

    } else if (platformKey === "linux") {
      // Linux: Move to ~/.local/share and create symlink
      const sourceDir = join(extractDir, "DHF-Bee-Agent");

      // Copy files
      await exec(`cp -r "${sourceDir}"/* "${paths.installDir}/"`, { encoding: "utf-8" });

      // Create symlink in ~/.local/bin
      const binDir = join(homedir(), ".local", "bin");
      if (!existsSync(binDir)) {
        mkdirSync(binDir, { recursive: true });
      }

      const executablePath = join(paths.installDir, paths.executable);
      const symlinkPath = join(binDir, "dhf-bee-agent");

      if (existsSync(symlinkPath)) {
        await exec(`rm "${symlinkPath}"`, { encoding: "utf-8" });
      }

      await exec(`ln -sf "${executablePath}" "${symlinkPath}"`, { encoding: "utf-8" });
      await exec(`chmod +x "${executablePath}"`, { encoding: "utf-8" });

      log("✅ Application installed successfully", colors.green);
      log(`   Executable: ${executablePath}`, colors.cyan);
      log(`   Symlink: ${symlinkPath}`, colors.cyan);

    } else {
      // Windows: Copy to Programs directory
      const sourceDir = join(extractDir, "DHF-Bee-Agent");

      // Remove existing installation if force reinstall
      if (existsSync(paths.installDir) && options.force) {
        await exec(`rd /s /q "${paths.installDir}"`, { shell: true, windowsHide: true });
      }

      // Create directory
      if (!existsSync(paths.installDir)) {
        mkdirSync(paths.installDir, { recursive: true });
      }

      // Copy files
      await exec(`xcopy "${sourceDir}" "${paths.installDir}" /E /I /Y`, {
        shell: true,
        windowsHide: true,
        encoding: "utf-8",
      });

      log("✅ Application installed successfully", colors.green);
      log(`   Location: ${paths.installDir}`, colors.cyan);
    }

    // Cleanup
    log("🧹 Cleaning up...", colors.cyan);
    await exec(`rm -rf "${tempDir}"`, { shell: true, encoding: "utf-8" });

    // Verify installation
    const newDetection = await detectInstallation();
    if (newDetection.installed) {
      console.log();
      log("🎉 Installation successful!", colors.green);
      log(`   Location: ${newDetection.path}`, colors.cyan);

      // Ask if user wants to open the app
      if (options.open) {
        await openDHF();
      } else {
        log("", colors.reset);
        log("💡 To open DHF Bee Agent, run:", colors.yellow);
        log(`   /dhf-install-agent --open`, colors.green);
      }

      return {
        success: true,
        message: "Installation successful",
        path: newDetection.path,
        version: DHF_VERSION,
      };
    } else {
      throw new Error("Installation verification failed");
    }

  } catch (error: any) {
    log(`❌ Installation failed: ${error.message}`, colors.red);
    return {
      success: false,
      message: error.message,
    };
  }
}

// Show DHF status
async function showStatus(): Promise<void> {
  printHeader("DHF Bee Agent Status");

  const detection = await detectInstallation();

  if (detection.installed) {
    log("✅ DHF Bee Agent is installed", colors.green);
    log(`   Location: ${detection.path}`, colors.cyan);
    if (detection.version) {
      log(`   Version: ${detection.version}`, colors.cyan);
    }

    // Check if configuration exists
    const platformKey = platform() as keyof typeof INSTALL_PATHS;
    const configPath = INSTALL_PATHS[platformKey]?.config;
    if (configPath && existsSync(configPath)) {
      log(`   Config: ${configPath}`, colors.cyan);
    }
  } else {
    log("❌ DHF Bee Agent is not installed", colors.red);
    log("   Run /dhf-install-agent --install to install", colors.yellow);
  }
}

// Check installation only
async function checkInstallation(): Promise<void> {
  const detection = await detectInstallation();

  if (detection.installed) {
    log("✅ Installed", colors.green);
    if (detection.path) {
      log(detection.path, colors.cyan);
    }
    if (detection.version) {
      log(`Version: ${detection.version}`, colors.cyan);
    }
  } else {
    log("❌ Not installed", colors.red);
    process.exit(1);
  }
}

// Open DHF application
async function openDHF(): Promise<void> {
  const detection = await detectInstallation();

  if (!detection.installed) {
    log("⚠️ DHF Bee Agent 未安装，正在自动安装...", colors.yellow);
    console.log();

    // Auto-install and then open
    const result = await installDHF({ install: true, force: false });
    if (!result.success) {
      log("❌ 自动安装失败", colors.red);
      process.exit(1);
    }

    // Re-detect after installation
    const newDetection = await detectInstallation();
    if (newDetection.installed && newDetection.path) {
      log("🚀 启动 DHF Bee Agent...", colors.green);
      const platformKey = platform();
      const openCommand = platformKey === "win32" ? "start" :
                          platformKey === "darwin" ? "open" : "xdg-open";

      spawn(openCommand, [newDetection.path], { shell: true, detached: true });
      log("✅ DHF Bee Agent 已启动!", colors.green);
      return;
    }
  }

  log("🚀 正在启动 DHF Bee Agent...", colors.green);
  const platformKey = platform();
  const openCommand = platformKey === "win32" ? "start" :
                      platformKey === "darwin" ? "open" : "xdg-open";

  spawn(openCommand, [detection.path!], { shell: true, detached: true });
  log("✅ DHF Bee Agent 已启动!", colors.green);
}

// Show help
function showHelp(): void {
  printHeader("DHF Bee Agent Installation Skill");
  console.log();
  log("Usage:", colors.bright);
  console.log();
  log("  /dhf-install-agent [options]", colors.cyan);
  console.log();
  log("Options:", colors.bright);
  console.log();
  log("  --check, -c      Check if DHF is installed", colors.cyan);
  log("  --install, -i    Install DHF Bee Agent (auto-download)", colors.cyan);
  log("  --force, -f      Force reinstall", colors.cyan);
  log("  --status, -s     Show installation status", colors.cyan);
  log("  --open, -o       Open DHF application (auto-install if needed)", colors.cyan);
  log("  --help, -h       Show this help message", colors.cyan);
  console.log();
  log("Examples:", colors.bright);
  console.log();
  log("  /dhf-install-agent --check", colors.green);
  log("  /dhf-install-agent --install", colors.green);
  log("  /dhf-install-agent --install --open", colors.green);
  log("  /dhf-install-agent --status", colors.green);
  log("  /dhf-install-agent --install --force", colors.green);
  log("  /dhf-install-agent --open", colors.green);
  console.log();
  log("Links:", colors.bright);
  console.log();
  log(`  Website: ${DHF_HOMEPAGE}`, colors.cyan);
  log(`  Version: ${DHF_VERSION}`, colors.cyan);
  console.log();
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help || args.length === 0) {
    showHelp();
    return;
  }

  if (options.check) {
    await checkInstallation();
    return;
  }

  if (options.status) {
    await showStatus();
    return;
  }

  if (options.open) {
    await openDHF();
    return;
  }

  if (options.install) {
    await installDHF(options);
    return;
  }

  // Default: show status
  await showStatus();
}

main().catch((error) => {
  log(`❌ Error: ${error.message}`, colors.red);
  process.exit(1);
});
