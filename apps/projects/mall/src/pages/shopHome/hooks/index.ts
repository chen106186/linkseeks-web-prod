import { useMemo } from 'react'
import { useGlobalConext } from '@/context/globalProvider'

const useShopHome = () => {
  const { shopInfo, mallInfo } = useGlobalConext()

  const seoTitle = useMemo(() => {
    if (shopInfo?.homePage) {
      return `${shopInfo.homePage.title}-${mallInfo?.name}`
    }
    return `${shopInfo?.name}-${mallInfo?.name}`
  }, [shopInfo])

  const seoDescription = useMemo(() => {
    if (shopInfo?.homePage) {
      return shopInfo.homePage.description
    }
    return `${shopInfo?.describe}`
  }, [shopInfo])

  const seoKeyword = useMemo(() => {
    if (shopInfo?.homePage) {
      return shopInfo.homePage.keywords
    }
    return `${shopInfo?.name}-${mallInfo?.name}`
  }, [shopInfo])

  return {
    seoTitle,
    seoDescription,
    seoKeyword,
  }
}

export default useShopHome
