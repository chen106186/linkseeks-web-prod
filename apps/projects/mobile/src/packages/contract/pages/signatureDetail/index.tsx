import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useMemo, useState } from 'react'
import { setClipboardData, showToast } from '@apps/mobile-services/utils/taro'
import { Button, ScrollView, View } from '@tarojs/components'
import Router from '@/utils/router'
import {
  getContractSignatureAuthGetSignatureDetail,
  GetContractSignatureAuthGetSignatureDetailResponse,
} from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import { useMobileIntl } from '@apps/locales'
import './index.scss'
const hidePhone = (phone) => {
  return String(phone).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
const hideIdCard = (id) => {
  return String(id).replace(/(\d{4})\d+(\w{2})/, '$1****$2')
}
const SignatureDetail = () => {
  const [detailData, setDetailData] = useState<GetContractSignatureAuthGetSignatureDetailResponse>()
  const translate = useMobileIntl()

  // 申请状态: 1 :申请中 2 :申请不通过 3 :申请通过
  const statusInfo = {
    1: {
      name: translate('mobile.resource.contract.shenqingzhong'),
      color: '#5691F1',
      background: '#4887F0',
    },
    2: {
      name: translate('mobile.resource.contract.shenqingbutongguo'),
      color: '#E65A66',
      background: '#E34D59',
    },
    3: {
      name: translate('mobile.resource.contract.shenqingtongguo'),
      color: '#1CB39B',
      background: '#02AA8F',
    },
  }
  const organization = useMemo(() => detailData?.organization, [detailData])
  const getSignatureDetail = () => {
    getContractSignatureAuthGetSignatureDetail().then((res) => {
      if (res.code === 1000) {
        setDetailData(res.data)
      }
    })
  }
  useEffect(() => {
    getSignatureDetail()
  }, [])
  const clipboard = (dataText: string) => {
    setClipboardData({
      data: dataText,
      success: () => {
        showToast({
          title: translate('mobile.common.fuzhichenggong'),
          icon: 'none',
        })
      },
    })
  }
  return (
    <>
      <View>
        <View className="info-box">
          <View className="info-item1">
            <View className="info-orgName">{organization?.orgName}</View>
            {organization?.status && (
              <View
                className="info-status"
                style={{
                  background: statusInfo[organization?.status!]?.background,
                }}
              >
                {statusInfo[organization?.status!]?.name}
              </View>
            )}
          </View>
          <View className="info-item2">
            <View className="info-memberType">
              {translate('mobile.resource.contract.huiyuanleixing')}：
              {detailData?.isPersonal
                ? translate('mobile.resource.contract.geren')
                : translate('mobile.resource.contract.qiye')}
            </View>
            {/* 详情没有储存authType字段，通过比较法人和经办人得出 */}
            <View className="info-mode">
              {translate('mobile.resource.contract.renzhengfangshi')}：
              {organization?.legalRepIdCardNum === organization?.transactorList?.[0]?.transactorIdCardNum
                ? translate('mobile.resource.contract.farenrenzheng')
                : translate('mobile.resource.contract.jinbanrenrenzheng')}
            </View>
          </View>
        </View>
        <ScrollView>
          <View className="main-box">
            <MellowCard
              title={translate('mobile.resource.contract.jibenxinxi')}
              style={{
                marginBottom: '16px',
              }}
              bodyStyle={{
                padding: 0,
              }}
            >
              <Cell>
                <Cell.Item
                  title={translate('mobile.resource.contract.gongsimingcheng')}
                  value={organization?.orgName}
                />
                <Cell.Item
                  title={translate('mobile.resource.contract.tongyishehuixinyongdaima')}
                  value={organization?.orgIDCardNum}
                />
              </Cell>
            </MellowCard>
            <MellowCard
              title={translate('mobile.resource.contract.farenxinxi')}
              style={{
                marginBottom: '16px',
              }}
              bodyStyle={{
                padding: 0,
              }}
            >
              <Cell>
                <Cell.Item
                  title={translate('mobile.resource.contract.farenxingming')}
                  value={organization?.legalRepName}
                />
                <Cell.Item
                  title={translate('mobile.resource.contract.farenshenfenzhenghao')}
                  value={hideIdCard(organization?.legalRepIdCardNum)}
                />
                <Cell.Item
                  title={translate('mobile.resource.contract.farenshoujihao')}
                  value={hidePhone(organization?.legalRepMobile)}
                />
              </Cell>
            </MellowCard>
            {organization?.transactorList &&
              organization?.transactorList.map((v) => (
                <MellowCard
                  key={v.transactorIdCardNum}
                  title={translate('mobile.resource.contract.jinbanren')}
                  style={{
                    marginBottom: '16px',
                  }}
                  bodyStyle={{
                    padding: 0,
                  }}
                >
                  <Cell>
                    <Cell.Item
                      title={translate('mobile.resource.contract.jinbanrenxingming')}
                      value={v.transactorName}
                    />
                    <Cell.Item
                      title={translate('mobile.resource.contract.jinbanrenshenfenzhenghao')}
                      value={hideIdCard(v.transactorIdCardNum)}
                    />
                    <Cell.Item
                      title={translate('mobile.resource.contract.jinbanrenshoujihao')}
                      value={hidePhone(v.transactorMobile)}
                    />
                  </Cell>
                </MellowCard>
              ))}
          </View>
        </ScrollView>
      </View>
      {!(organization?.status === 3) && (
        <View className="btn-operates">
          {organization?.status === 2 && (
            <View
              className="btn-operate"
              children={translate('mobile.resource.contract.chongxinshenqing')}
              onClick={() => Router.navigateTo('contract/signatureAuth')}
            />
          )}
          {organization?.status === 1 && (
            <View
              className="btn-operate"
              children={translate('mobile.resource.contract.fuzhilianjie')}
              onClick={() => organization && clipboard(organization.authUrl)}
            />
          )}
        </View>
      )}
    </>
  )
}
export default GlobalWrapper(SignatureDetail)
