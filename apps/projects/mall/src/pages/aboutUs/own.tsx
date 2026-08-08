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

const OwnAboutUs = () => {
  const { ownInfo } = useLoaderData() as OwnHomeLoaderReturn
  const { mallInfo } = useGlobalConext()
  const [applyState, setApplyState] = useState<ApplyStateType>()
  const translate = getWebIntl()

  const getApplyState = () => {
    const param: any = {
      shopType: mallInfo?.type,
      upperMemberId: mallInfo?.memberId,
      upperRoleId: mallInfo?.memberRoleId,
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
    getApplyState()
  }, [])

  const seoInfo = useMemo(() => {
    if (ownInfo) {
      if (ownInfo.aboutUs) {
        return {
          title: ownInfo.aboutUs.title,
          keyword: ownInfo.aboutUs.keywords,
          description: ownInfo.aboutUs.description,
        }
      }
      return {
        title: ownInfo.memberName,
        keyword: ownInfo.memberName,
        description: ownInfo.describe,
      }
    }
    return {
      title: translate('web.resource.mall.aboutus'),
      keyword: translate('web.resource.mall.aboutus'),
      description: translate('web.resource.mall.aboutus'),
    }
  }, [ownInfo])

  return (
    <HelmetProvider {...seoInfo}>
      <StoreProvider value={{ applyState, updateApplyState }}>
        <AboutUs shopInfo={ownInfo} />
      </StoreProvider>
    </HelmetProvider>
  )
}

export default OwnAboutUs
