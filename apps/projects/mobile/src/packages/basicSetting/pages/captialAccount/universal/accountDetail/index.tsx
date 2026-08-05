import GlobalWrapper from '@/components/GlobalWrapper'
import PageInitLayout from '@/components/PageInitLayout'
import { useEAccountMemberInfo } from '@apps/services/eAccount/hooks/useEAccountMemberInfo'
import React, { useEffect } from 'react'
import styles from './index.module.scss'
import { StandardForm, Text, View } from '@apps/mobile-ui'
import LineCard, { STATUS_ENUM } from '../../components/LineCard'
import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { USER_INFO } from '@/constants/storage'
import { getStorageSync, navigateToMiniProgram, preload } from '@apps/mobile-services/utils/taro'
import { postPayAllInPaySignContractQuery } from '@apps/apis'
import Router from '@/utils/router'
import { IS_WEB } from '@/constants'
const AccountDetail = () => {
  const { memberInfo, payMemberInfoLoading, isSelf, isEnterprise } = useEAccountMemberInfo({
    isRefresh: true,
  })
  const goNo = async () => {
    const { data } = await postPayAllInPaySignContractQuery(
      {
        jumpUrl: 'packages/basicSetting/pages/captialAccount/universal/accountDetail/index',
        jumpPageType: IS_WEB ? 1 : 2,
        // 企业会员就传3，否则是个人会员就传1
        accountType: isEnterprise ? 3 : 1,
      },
      {
        ctlType: 'none',
      },
    )
    console.log(data)
    if (IS_WEB) {
      preload('params', {
        url: data,
      })
      Router.navigateTo('basicSetting/webInfo')
    } else {
      navigateToMiniProgram({
        appId: 'wxc46c6d2eed27ca0a',
        path: 'pages/merchantAddress/merchantAddress',
        extraData: {
          targetUrl: data,
        },
      })
    }
  }
  return (
    <PageInitLayout loading={payMemberInfoLoading}>
      <View className={styles.page}>
        {isEnterprise && (
          <StandardForm>
            <LineCard title="认证信息">
              <StandardForm.Item label="企业名称">
                <Text>{memberInfo?.companyName}</Text>
              </StandardForm.Item>
              <StandardForm.Item label="统一社会信用代码">
                <Text>{memberInfo?.uniCredit}</Text>
              </StandardForm.Item>
              <StandardForm.Item label="法人姓名">
                <Text>{memberInfo?.legalName}</Text>
              </StandardForm.Item>
              <StandardForm.Item label="法人手机号">
                <Text>{memberInfo?.legalPhone}</Text>
              </StandardForm.Item>
              <StandardForm.Item label="证件类型">
                <Text>身份证</Text>
              </StandardForm.Item>
              <StandardForm.Item label="法人证件号">
                <Text>{memberInfo?.legalIds}</Text>
              </StandardForm.Item>
              <StandardForm.Item label="企业对公账户">
                <Text>{memberInfo?.accountNo}</Text>
              </StandardForm.Item>
              <StandardForm.Item label="开户银行名称">
                <Text>{memberInfo?.bankName}</Text>
              </StandardForm.Item>
              <StandardForm.Item label="开户行支行名称">
                <Text>{memberInfo?.branchName}</Text>
              </StandardForm.Item>
              <StandardForm.Item label="支行行号">
                <Text>{memberInfo?.unionBank}</Text>
              </StandardForm.Item>
            </LineCard>

            <LineCard title="提现协议签署" status={STATUS_ENUM.SUCCESS}>
              <StandardForm.Item label="电子协议签约">
                {/* onClick={goNo} */}
                <Text>查看协议 - {memberInfo?.acctProtocolNo}</Text>
              </StandardForm.Item>
            </LineCard>
          </StandardForm>
        )}

        {isSelf && (
          <StandardForm>
            <LineCard title="基本信息">
              <StandardForm.Item label="姓名">
                <Text>{memberInfo?.name}</Text>
              </StandardForm.Item>
              <StandardForm.Item label="证件类型">
                <Text>身份证</Text>
              </StandardForm.Item>
              <StandardForm.Item label="证件号">
                <Text>{memberInfo?.identityCardNo}</Text>
              </StandardForm.Item>
              <StandardForm.Item label="手机号">
                <Text>{memberInfo?.phone}</Text>
              </StandardForm.Item>
            </LineCard>

            <LineCard title="银行卡信息">
              <StandardForm.Item label="银行卡号">
                <Text>{memberInfo?.bankNo}</Text>
              </StandardForm.Item>
            </LineCard>

            <LineCard title="提现协议签署" status={STATUS_ENUM.SUCCESS} statusText="已签署">
              <StandardForm.Item label="电子协议签约">
                {/* onClick={goNo} */}
                <Text>查看协议-{memberInfo?.acctProtocolNo}</Text>
              </StandardForm.Item>
            </LineCard>
          </StandardForm>
        )}
      </View>
    </PageInitLayout>
  )
}
export default GlobalWrapper(AccountDetail)
