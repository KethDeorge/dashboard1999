
# DeskBoard 1999 - Mobile App

Based on React + Vite + Tailwind CSS.

## 1. Development
Install dependencies and run locally:
```bash
npm install
npm run dev
```

## 2. Build Android APK (Capacitor)

The repository now includes a native Android project. With JDK 21 and Android
SDK 36 installed, build a debug APK with:

```bash
JAVA_HOME=/opt/homebrew/opt/openjdk@21 \
ANDROID_HOME=/opt/homebrew/share/android-commandlinetools \
npm run android:apk
```

The APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`.

### USB Live Reload（类似 Expo Go 的开发体验）

第一次使用前：

1. 在 Android 手机中开启“开发者选项”。
2. 开启“USB 调试”；部分品牌还需要开启“通过 USB 安装应用”。
3. 用 USB 连接手机与电脑，并在手机的授权弹窗中选择“允许”。
4. 在项目根目录运行：

```bash
npm run android:live
```

该命令会自动检测手机、启动 Vite、通过 USB 转发 5173 端口、构建并安装
调试 App，然后保持 Live Reload 运行。修改并保存 React/TypeScript/CSS 文件后，
手机中的 App 会自动刷新。手机与电脑不需要连接同一个 Wi-Fi。

结束调试时，在终端按 `Control+C`。

常见问题：

- 提示“没有检测到 Android 手机”：确认数据线支持传输数据，并重新开启 USB 调试。
- 提示“手机尚未授权”：解锁手机，在“允许 USB 调试”弹窗中点“允许”，再运行命令。
- 第一次启动较慢属于正常情况，因为需要执行 Android 构建；后续网页代码更新无需重新生成 APK。
- 修改原生插件、Android 权限或 `capacitor.config.ts` 后，需要停止命令并重新运行。

The app is locked to landscape. Web assets and Tailwind CSS are bundled into
the APK, so the interface works offline. Audio files are not included in this
repository; add the filenames listed in `constants.ts` to `public/music/`
before building if music playback is required.

The Android build uses immersive full-screen mode. Battery/charging and network
state come from the device; weather comes from Open-Meteo using the phone's
location. Location permission is requested on first launch. Values that the
device cannot expose are shown as `N/A` rather than simulated.

## 3. Legacy HBuilderX Packaging

To package this as an Android/iOS app using HBuilderX:

### Step 1: Configure Vite Base Path
Open `vite.config.ts` (if it exists, or create it) and ensure the base path is relative so it works in the local file system of the phone:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // IMPORTANT: This makes assets load correctly in HBuilderX
})
```

### Step 2: Build the Project
Run the build command to generate the static files:
```bash
npm run build
```
This will create a `dist` folder.

### Step 3: HBuilderX Packaging
1. Open **HBuilderX**.
2. **File** -> **Open Directory** -> Select the `dist` folder you just created.
3. Select the project in the left sidebar.
4. Right-click the project -> **Convert to Mobile App** (This adds a manifest.json for HBuilder).
5. Open the `manifest.json` (HBuilder's version) to configure:
   - **App Name**: DeskBoard 1999
   - **App ID**: (Click "Get" or generate one)
   - **Orientation**: Select **Landscape** (Ensure it is locked to Landscape if you don't want the auto-rotate logic, though the code handles rotation).
6. **Run on Phone**:
   - Connect phone via USB.
   - Click **Run** -> **Run to Phone**.
7. **Generate APK**:
   - Click **Publish** -> **Native App-Cloud Packaging**.
   - Select "Android" (or iOS if you have certs).
   - Use DCloud certificate for testing.
   - Click **Pack**.

## 4. Controls (Touch)
- **Swipe Left/Right**: Switch Pages (Time / Focus / Tasks / Music).
- **Swipe Up**: Open Configuration (Add Task, Adjust Timer, Track Info).
- **Swipe Down**: Enter Sleep Mode (Stasis).
- **Swipe Up (from Sleep)**: Wake up.
