import viteConfig from 'test-config/vite.config.json'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { merge } from 'lodash'

export default merge(
  viteConfig,

  defineConfig({
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        reporter: ['text', 'json', 'html'],
      },
    },
  }),
)
