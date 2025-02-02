import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  base: '/canvas-editor/',
  esbuild: { legalComments: 'external' },
  plugins: [
    tsconfigPaths(),
    react(),
    tailwindcss(),
    svgr({ svgrOptions: { titleProp: true, svgProps: { className: 'icon' } } }),
  ],
});
