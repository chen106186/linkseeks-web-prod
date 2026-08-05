import { PASS_CONFIG } from '@feature/paas'

/**
 * 获取paas配置
 */
export const presetPaas = async () => {
  return {
    ...PASS_CONFIG,
  }
}

export default presetPaas
