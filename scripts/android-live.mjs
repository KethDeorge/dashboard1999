import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const defaultJavaHome = '/opt/homebrew/opt/openjdk@21';
const defaultAndroidHome = '/opt/homebrew/share/android-commandlinetools';
const javaHome = process.env.JAVA_HOME || defaultJavaHome;
const androidHome = process.env.ANDROID_HOME || defaultAndroidHome;
const adb = resolve(androidHome, 'platform-tools', 'adb');
const cap = resolve(projectRoot, 'node_modules', '.bin', 'cap');

if (!existsSync(resolve(javaHome, 'bin', 'java'))) {
  console.error(`找不到 Java：${javaHome}`);
  console.error('请安装 JDK 21，或设置 JAVA_HOME 后重试。');
  process.exit(1);
}

if (!existsSync(adb)) {
  console.error(`找不到 adb：${adb}`);
  console.error('请安装 Android Platform Tools，或设置 ANDROID_HOME 后重试。');
  process.exit(1);
}

const env = {
  ...process.env,
  JAVA_HOME: javaHome,
  ANDROID_HOME: androidHome,
  PATH: `${resolve(javaHome, 'bin')}:${resolve(androidHome, 'platform-tools')}:${process.env.PATH ?? ''}`,
};

const adbResult = spawnSync(adb, ['devices'], { encoding: 'utf8', env });
if (adbResult.status !== 0) {
  console.error(adbResult.stderr || 'ADB 启动失败。');
  process.exit(1);
}

const deviceLines = adbResult.stdout
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(line => line && !line.startsWith('List of devices'));
const readyDevices = deviceLines
  .filter(line => /\tdevice$/.test(line))
  .map(line => line.split(/\s+/)[0]);

if (readyDevices.length === 0) {
  if (deviceLines.some(line => /\tunauthorized$/.test(line))) {
    console.error('手机尚未授权。请解锁手机并在“允许 USB 调试”弹窗中点允许，然后重试。');
  } else {
    console.error('没有检测到 Android 手机。请连接 USB，并开启“开发者选项 → USB 调试”。');
  }
  process.exit(1);
}

const target = process.env.ANDROID_SERIAL || readyDevices[0];
if (!readyDevices.includes(target)) {
  console.error(`指定的设备 ${target} 当前不可用。`);
  process.exit(1);
}

console.log(`已连接设备：${target}`);
console.log('正在启动实时预览服务…');

const vite = spawn(
  'npm',
  ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173', '--strictPort'],
  { cwd: projectRoot, env, stdio: 'inherit' },
);

let capacitor;
let stopping = false;

const stop = () => {
  if (stopping) return;
  stopping = true;
  capacitor?.kill('SIGTERM');
  vite.kill('SIGTERM');
};

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

const waitForVite = async () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:5173/', { cache: 'no-store' });
      if (response.ok) return;
    } catch {
      // Vite is still starting.
    }
    await new Promise(resolveDelay => setTimeout(resolveDelay, 200));
  }
  throw new Error('Vite 启动超时。请确认 5173 端口没有被其他程序占用。');
};

try {
  await waitForVite();
  console.log('正在安装并启动 Live Reload App…');
  capacitor = spawn(
    cap,
    [
      'run', 'android',
      '--target', target,
      '--live-reload',
      '--host', '127.0.0.1',
      '--port', '5173',
      '--forwardPorts', '5173:5173',
    ],
    { cwd: projectRoot, env, stdio: 'inherit' },
  );

  const exitCode = await new Promise(resolveExit => capacitor.once('exit', code => resolveExit(code ?? 1)));
  if (exitCode !== 0) throw new Error(`Capacitor 启动失败，退出码 ${exitCode}。`);

  console.log('\nLive Reload 已就绪。保存代码后手机会自动刷新。');
  console.log('按 Control+C 结束。\n');
  await new Promise(resolveExit => vite.once('exit', resolveExit));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  stop();
  process.exitCode = 1;
}
