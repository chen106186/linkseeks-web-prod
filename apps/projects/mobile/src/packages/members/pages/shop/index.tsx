import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { getCurrentInstance, setNavigationBarTitle, pxTransform } from '@apps/mobile-services/utils/taro'
import { View } from '@tarojs/components'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { useIntl } from '@linkseeks/i18n'
import { getMemberMobileInfoApplyCondition } from '@apps/apis'
import MallTabBottom from '@/components/MallTabBottom'
import ApplyComponent from '../../components/ApplyComponent/index'
import MemberPower from '../../components/MemberPower/index'
import { usePageInit } from '@/hooks/usePageInit'
const MemberApply = () => {
  const shopInfo: any = getCurrentInstance()?.router?.params
  const arr = [2, 4, 6, 7]
  const [applyState, setApplyState] = useState<any>()
  const intl = useIntl()
  const getMemberBusinessDetail = () => {
    const param: any = {
      upperMemberId: shopInfo.memberId,
      upperRoleId: shopInfo.roleId,
    }
    getMemberMobileInfoApplyCondition(param).then((res) => {
      if (res.code === 1000) {
        setApplyState(res.data)
      } else {
        setApplyState({
          status: 0,
        })
      }
    })
  }
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({
    //   title: intl.formatMessage({ id: 'member.shop.navigationBarTitleText', defaultMessage: '店铺会员' }),
    // })
  }, [])
  useEffect(() => {
    if (shopInfo) {
      getMemberBusinessDetail()
    }
  }, [shopInfo])
  const handleUpdate = () => {
    getMemberBusinessDetail()
  }
  return (
    <MallTabBottom
      visible={shopInfo?.hasTab === 'true'}
      layoutType={shopInfo?.layoutType as LAYOUT_TYPE}
      activeUrl="members/shop"
    >
      <View
        style={{
          height: '100vh',
          backgroundColor: '#F5F6F7',
          paddingTop: pxTransform(1),
        }}
      >
        {!!applyState &&
          (!arr.includes(Number(applyState?.status)) ? (
            <ApplyComponent shopInfo={shopInfo} applyState={applyState} updateApplyState={handleUpdate} />
          ) : (
            <MemberPower upperMemberId={String(shopInfo?.memberId)} upperRoleId={String(shopInfo?.roleId)} isShop />
          ))}
      </View>
    </MallTabBottom>
  )
}
export default GlobalWrapper(MemberApply)
