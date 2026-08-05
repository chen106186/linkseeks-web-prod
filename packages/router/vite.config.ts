import viteConfig from 'test-config/vite.config.json'
import { defineConfig } from 'vitest/config'
import { merge } from 'lodash'

export default merge(
  viteConfig,

  defineConfig({}),
)
