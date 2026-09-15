import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.deskboard1999.app',
  appName: 'DeskBoard 1999',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
