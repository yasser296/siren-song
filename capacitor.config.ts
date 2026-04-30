import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.serensong.app',
  appName: 'Siren Song',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
