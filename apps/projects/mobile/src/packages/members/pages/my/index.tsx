import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useRouter, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { getMemberMobileInfoApplyCondition } from '@apps/apis'
import Header from '@/components/NavBar'
import ApplyComponent from '../../components/ApplyComponent/index'
import MemberPower from '../../components/MemberPower/index'
import { THEME_COLORS } from '@/constants/theme'
type RouteParams = {
  upperMemberId: string
  upperRoleId: string
}
const MemberApply = () => {
  const {
    params: { upperMemberId, upperRoleId },
  } = useRouter<RouteParams>()
  const [applyState, setApplyState] = useState<any>()
  const intl = useIntl()
  const arr = [0, 1, 3, 5, 8]
  const getMemberBusinessDetail = () => {
    const param: any = {
      upperMemberId,
      upperRoleId,
    }
    getMemberMobileInfoApplyCondition(param).then((res) => {
      if (res.code === 1000) {
        setApplyState(res.data)
      } else {
        setApplyState({
          status: 2,
        })
      }
    })
  }
  useEffect(() => {
    if (upperMemberId && upperRoleId) {
      getMemberBusinessDetail()
    } else {
      setApplyState({
        status: 2,
      })
    }
  }, [])
  return (
    <View
      style={{
        height: '100vh',
        backgroundColor: THEME_COLORS.page,
      }}
    >
      {arr.includes(Number(applyState?.status)) && (
        <Header
          title={
            <Text
              style={{
                lineHeight: pxTransform(60),
                fontSize: pxTransform(16),
                textAlign: 'center',
              }}
            >
              {intl.formatMessage({
                id: 'member.my.title',
                defaultMessage: '会员中心',
              })}
            </Text>
          }
        />
      )}
      {!!applyState &&
        (arr.includes(Number(applyState?.status)) ? (
          <ApplyComponent
            shopInfo={{
              memberId: Number(upperMemberId),
              roleId: Number(upperRoleId),
            }}
            applyState={applyState}
            noShop
          />
        ) : (
          <MemberPower upperMemberId={upperMemberId} upperRoleId={upperRoleId} needHead />
        ))}
    </View>
  )
}
export default GlobalWrapper(MemberApply)
