import { getCurrentPages, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { useMobileIntl } from '@apps/locales'
import { useEffect } from 'react'

const DEFAULT_PREFIX_ROUTER_KEY = 'mobile.router'
export const usePageInit = () => {
  const translate = useMobileIntl()
  useEffect(() => {
    const pages = getCurrentPages()
    const { route } = pages[pages.length - 1]
    let key = route?.split('/').join('.')
    if (key?.startsWith('packages.')) {
      // 分包路径，则自动去掉该部分，只保留分包名称后的路径
      key = key.replace('packages.', '')
    }

    if (key?.startsWith('.packages.')) {
      // 分包路径，则自动去掉该部分，只保留分包名称后的路径
      key = key.replace('.packages.', '')
    }

    if (key?.endsWith('.index')) {
      // 去掉最后的默认index
      key = key.replace(/\.index$/, '')
    }

    if (key) {
      if (key[0] !== '.') {
        key = `.${key}`
      }
      console.log(DEFAULT_PREFIX_ROUTER_KEY + key, 'key')
      /**
       * 如果是分包下的路径
       * 例如 packages.commodityMerge.pages.stocksSourcing.detail.index
       * 最终会形成 router.commodityMerge.pages.stocksSourcing.detail
       *
       * 如果是主包下的路径
       * 例如 pages.search.index
       * 最终会形成 router.pages.search
       */
      setNavigationBarTitle({
        title: translate((DEFAULT_PREFIX_ROUTER_KEY + key) as any),
      })
    }
  }, [])
}
