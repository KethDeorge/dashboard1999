
# DeskBoard 1999 - Mobile App

Based on React + Vite + Tailwind CSS.

## 1. Development
Install dependencies and run locally:
```bash
npm install
npm run dev
```

## 2. Build for HBuilderX (APK)

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

## 3. Controls (Touch)
- **Swipe Left/Right**: Switch Pages (Time / Focus / Tasks / Music).
- **Swipe Up**: Open Configuration (Add Task, Adjust Timer, Track Info).
- **Swipe Down**: Enter Sleep Mode (Stasis).
- **Swipe Up (from Sleep)**: Wake up.
