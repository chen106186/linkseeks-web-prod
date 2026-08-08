import { useTranslation } from '@linkseeks/i18n'
// import { useRootModule } from './context'

/**
 * 所有从preset中实现的provider 都可以通过该hook获取对应的值
 */
export const useCore = () => {
  const i18n = useTranslation('translation')
  // const rootCtx = useRootModule()

  return {
    i18n,
    // rootCtx,
  }
}
