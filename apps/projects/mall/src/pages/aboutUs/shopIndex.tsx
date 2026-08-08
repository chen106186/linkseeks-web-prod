import { useLoaderData } from 'react-router-dom'
import { OwnHomeLoaderReturn } from '@/loaders/ownHomeLoader'
import { StoreProvider } from '@/context/storeProvider'
import { useGlobalConext } from '@/context/globalProvider'
import { getMemberAbilityInfoApplyCondition } from '@apps/apis'
import HelmetProvider from '@/context/helmetProvider'
import { useEffect, useMemo, useState } from 'react'
import { ApplyStateType } from '@/types/global'
import { getWebIntl } from '@/utils/locales'
import AboutUs from '.'

const ShopIndexAboutUs = () => {
  const { mallInfo, shopInfo, userInfo } = useGlobalConext()
  const [applyState, setApplyState] = useState<ApplyStateType>()
  const translate = getWebIntl()

  const getApplyState = () => {
    const param: any = {
      shopType: mallInfo?.type,
      upperMemberId: shopInfo?.memberId,
      upperRoleId: shopInfo?.roleId,
    }
    getMemberAbilityInfoApplyCondition(param).then((res) => {
      if (res.code === 1000) {
        setApplyState(res.data)
      }
    })
  }

  const updateApplyState = () => {
    getApplyState()
  }

  useEffect(() => {
    if (userInfo && shopInfo) {
      getApplyState()
    }
  }, [userInfo])

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
      <StoreProvider value={{ applyState, updateApplyState }}>
        <AboutUs shopInfo={shopInfo} />
      </StoreProvider>
    </HelmetProvider>
  )
}

export default ShopIndexAboutUs
