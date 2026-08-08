import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import packageJson from './package.json'
export default defineConfig({
  build: {
    lib: {
      entry: [resolve(__dirname, './index'), resolve(__dirname, './cli'), resolve(__dirname, './Generator')],
      formats: ['cjs'],
    },
    rollupOptions: {
      output: {
        dir: 'libs',
      },
      external: [...Object.keys(packageJson.dependencies), 'path', 'fs'],
    },
  },
})
