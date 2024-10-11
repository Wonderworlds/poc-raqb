import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, UserConfigFn } from 'vite';

const config: UserConfigFn = ({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    define: {
      global: 'globalThis',

      process: {},
      'process.env': environment,
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: './dist',
      sourcemap: false,
      manifest: false,
      rollupOptions: {
        external: ['react-device-frameset/dist/styles/marvel-devices.min.css'],
      },
    },
  });
};

export default config;
