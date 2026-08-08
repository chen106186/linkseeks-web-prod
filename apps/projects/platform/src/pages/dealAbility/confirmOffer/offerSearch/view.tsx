import React, { useRef } from 'react'
import Table from '@/components/TableLayout'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { Tag, Badge, Button, message } from 'antd'
import type { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { OFFERSEARCHSCHEMA } from './schema'
import { EXTERNALSTATE_COLOR, INTERNALSTATE_COLOR } from '@/constants/stateColor'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import {
  getTradeNotarizeEnquiryExternalStateEnum,
  getTradeNotarizeEnquiryProductQuotationList,
  getTradeNotarizeEnquiryInteriorStateEnum,
} from '@apps/apis'
// import { postMemberFeignLifecycleStageRuleCheck } from '@apps/apis'
import { authService } from '@apps/services'
import { lifecyclePhaseRules } from '@/constants/order'
const intl = getIntl()

const OfferSearch = () => {
  const reload = useRef<any>({})
  const { pathname } = useLocation()

  const handleOrder = (record) => {
    const userInfo = authService.getAuth()
    const params = {
      memberId: record.offerMemberId,
      roleId: record.offerMemberRoleId,
      subMemberId: userInfo.memberId,
      subRoleId: userInfo.memberRoleId,
      lifeCycleStageRuleId: lifecyclePhaseRules.CUSTOMER_ORDER,
    }

    history.push(`/orderAbility/purchaseOrder/readyAddB2bOrder/add?modelType=3&quotationId=${record.id}`)

    // postMemberFeignLifecycleStageRuleCheck(params, { ctlType: 'none' }).then((res) => {
    //   if (res.data) {
    //     history.push(`/orderAbility/purchaseOrder/readyAddB2bOrder/add?modelType=3&quotationId=${record.id}`)
    //   } else {
    //     message.error(intl.formatMessage({ id: 'dealAbility.tip' }))
    //   }
    // })
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiadanhao' }),
      key: 'quotationNo',
      dataIndex: 'quotationNo',
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'custom', 'offer') ? 'link' : 'button'}
          url={`/dealAbility/confirmOffer/offerSearch/offer?id=${record.id}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.xunjiadanhao' }),
      key: 'inquiryListNo',
      dataIndex: 'inquiryListNo',
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'custom', 'inquiry') ? 'link' : 'button'}
          url={`/dealAbility/confirmOffer/offerSearch/inquiry?id=${record.inquiryListId}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiadanzhaiyao' }),
      key: 'details',
      dataIndex: 'details',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiahuiyuan' }),
      key: 'offerMemberName',
      dataIndex: 'offerMemberName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiajiezhishijian' }),
      key: 'quotationAsTime',
      dataIndex: 'quotationAsTime',
      render: (text: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.danjushijian' }),
      key: 'voucherTime',
      dataIndex: 'voucherTime',
      render: (text: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.waibuzhuangtai' }),
      key: 'externalState',
      dataIndex: 'externalState',
      render: (text: any, record: any) => (
        <Tag color={EXTERNALSTATE_COLOR[text] || 'error'}>{record.externalStateName}</Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.neibuzhuangtai' }),
      key: 'interiorState',
      dataIndex: 'interiorState',
      render: (text: any, record: any) => (
        <Badge status={INTERNALSTATE_COLOR[text] || 'error'} text={record.interiorStateName} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caozuo' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (_, record) =>
        record.isShowPurchaseOrder && (
          <AddAuthButton>
            <Button type="link" onClick={() => handleOrder(record)}>
              {intl.formatMessage({ id: 'dealAbility.chuangjiancaigoudingdan' })}
            </Button>
          </AddAuthButton>
        ),
    },
  ]

  return (
    <Table
      schema={OFFERSEARCHSCHEMA}
      columns={columns}
      effects="quotationNo"
      fetch={getTradeNotarizeEnquiryProductQuotationList}
      reload={reload}
      externalStatusFetch={getTradeNotarizeEnquiryExternalStateEnum()}
      interiorStatusFetch={getTradeNotarizeEnquiryInteriorStateEnum()}
    />
  )
}

export default OfferSearch
