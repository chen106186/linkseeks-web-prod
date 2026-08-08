import { useMemo } from 'react'
import { useGlobalConext } from '@/context/globalProvider'
import HelmetProvider from '@/context/helmetProvider'
import { getWebIntl } from '@/utils/locales'
import AboutUs from '.'

const ShopAboutUs = () => {
  const { shopInfo } = useGlobalConext()
  const translate = getWebIntl()

  const seoInfo = useMemo(() => {
    if (shopInfo) {
      if (shopInfo.aboutUs) {
        return {
          title: shopInfo.aboutUs.title,
          keyword: shopInfo.aboutUs.keywords,
          description: shopInfo.aboutUs.description,
        }
      }
      return {
        title: shopInfo.memberName,
        keyword: shopInfo.memberName,
        description: shopInfo.describe,
      }
    }
    return {
      title: translate('web.resource.mall.aboutus'),
      keyword: translate('web.resource.mall.aboutus'),
      description: translate('web.resource.mall.aboutus'),
    }
  }, [shopInfo])

  return (
    <HelmetProvider {...seoInfo}>
      <AboutUs shopInfo={shopInfo} />
    </HelmetProvider>
  )
}

export default ShopAboutUs
