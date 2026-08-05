import { useGlobalConext } from '@/context/globalProvider'

const useLink = () => {
  const { urlPrefix } = useGlobalConext()

  /**
   * 统一处理链接前缀，区分联营和自营前缀
   * @param link 链接
   * @param prefix 链接前缀
   */
  const linkPrefix = (link?: string, prefix?: string) => {
    if (prefix) {
      return `${prefix}${link}`
    } else {
      const url = `${urlPrefix}${link || ''}`
      return url || '/'
    }
  }

  return {
    linkPrefix,
  }
}

export default useLink
