import { useEffect, useMemo, useState } from 'react'
import { message } from 'antd'
import { isEmpty } from 'lodash'
import { hasAddressCase } from '@/utils/address'
import { getOrderBuyerChangeVersion } from '@apps/apis'
import { OrderKindType } from '@/constants/order'
import { authService } from '@apps/services'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
/**
 * 变更数据重组
 */
const versionDataCase = (res: any) => {
  const beforeInvoice = res.data?.detailBO?.beforeInvoice || {}
  const afterInvoice = res.data?.detailBO?.afterInvoice || {}
  const beforeConsignee = res.data?.detailBO?.beforeConsignee || {}
  const afterConsignee = res.data?.detailBO?.afterConsignee || {}
  const _data = {
    ...res.data,
    detailBO: {
      ...res.data.detailBO,
      beforeInvoice: {
        ...beforeInvoice,
        hasInvoice: beforeInvoice?.invoiceId ? translate('web.common.shi') : translate('web.common.fou'),
      },
      afterInvoice: {
        ...afterInvoice,
        hasInvoice: afterInvoice?.invoiceId ? translate('web.common.shi') : translate('web.common.fou'),
      },
      beforeConsignee: {
        ...beforeConsignee,
        hasAddress: hasAddressCase(beforeConsignee),
      },
      afterConsignee: {
        ...afterConsignee,
        hasAddress: hasAddressCase(afterConsignee),
      },
    },
  }
  return _data
}

const TabListData = ({ versionContext, formContext }) => {
  const orderKindType = formContext?.data?.orderKind
  // formContext?.data?.orderKind === OrderKindType.PURCHASE_ORDER ||
  // formContext?.data?.orderKind === OrderKindType.SRM_ORDER ||
  // formContext?.data?.orderKind === OrderKindType.REQUISITION_ORDER
  const userInfo: any = authService.getAuth() || {}
  const ht_show = userInfo.memberRoleId === 9 && formContext.data?.innerStatus > 100

  return [
    ...(!versionContext ? [{ key: 'auditProcess', label: translate('web.resource.order.liuchengjindu') }] : []),
    { key: 'basicInfo', label: translate('web.resource.order.jibenxinxi') },
    ...((formContext?.data?.orderKind === OrderKindType.SRM_ORDER ||
      formContext?.data?.orderKind === OrderKindType.REQUISITION_ORDER) &&
    (!versionContext ||
      versionContext?.detailBO?.currencyNameChangeStatus ||
      versionContext?.detailBO?.paymentTypeNameChangeStatus)
      ? [{ key: 'paymentInfo', label: translate('web.resource.order.fukuanxinxi') }]
      : []),
    ...(!versionContext || versionContext?.detailBO?.productsChangeStatus
      ? [
          {
            key: 'orderMaterials',
            label: orderKindType
              ? translate('web.resource.order.dingdanwuliao')
              : translate('web.resource.order.dingdanshangpin'),
          },
        ]
      : []),
    ...(formContext?.data?.orderKind !== OrderKindType.SRM_ORDER &&
    formContext?.data?.orderKind !== OrderKindType.REQUISITION_ORDER &&
    !versionContext
      ? [{ key: 'paymentInfoCard', label: translate('web.resource.order.zhifuxinxi') }]
      : []),
    ...(!versionContext ||
    versionContext?.detailBO?.consigneeChangeStatus ||
    versionContext?.detailBO?.deliverDateChangeStatus
      ? [{ key: 'deliveryInfo', label: translate('web.resource.order.songhuoxinxi') }]
      : []),
    ...((orderKindType || ht_show) &&
    (!versionContext || versionContext?.detailBO?.contractTextChangeStatus) &&
    formContext?.data?.hasContract
      ? [{ key: 'contractInfo', label: translate('web.resource.order.hetongwenben') }]
      : []),
    ...(!versionContext || versionContext?.detailBO?.invoiceChangeStatus
      ? [{ key: 'invoiceInfo', label: translate('web.resource.order.fapiaoxinxi') }]
      : []),
    ...(!versionContext || versionContext?.detailBO?.remarkChangeStatus || versionContext?.detailBO?.packChangeStatus
      ? [{ key: 'otherInfo', label: translate('web.resource.order.qitaxinxi') }]
      : []),
    ...(!versionContext
      ? [
          { key: 'shippingDetails', label: translate('web.resource.order.shouhuoxinxi') },
          { key: 'recordInfo', label: translate('web.resource.order.liuzhuanjilu') },
        ]
      : []),
  ]
}
/**
 * 变更操作
 */
const useVersion = ({ id, formContext, isVersion = false }) => {
  const [versionContext, setVersionContext] = useState<any>()
  const [showSubmit, setShowSubmit] = useState<boolean>(true)

  /** 切换变更版本 */
  const handleChangeVersion = (version) => {
    if (version) {
      getOrderBuyerChangeVersion({ orderId: id + '', version }).then((res) => {
        if (res.code !== 1000) {
          message.error(res.message)
          return
        }
        setShowSubmit(false)
        const _data = versionDataCase(res)
        setVersionContext(_data)
      })
      return
    }
    setShowSubmit(true)
    setVersionContext(null)
  }

  /** 锚点列表 */
  const TabList = useMemo(() => {
    return TabListData?.({ formContext, versionContext })
  }, [formContext, versionContext])

  /** 有变更默认选择最新 */
  useEffect(() => {
    if (!isEmpty(formContext?.data?.versions) && isVersion) {
      const { version } = formContext?.data?.versions[formContext?.data?.versions.length - 1]
      handleChangeVersion(version)
    }
  }, [formContext?.data, isVersion])

  return {
    TabList,
    showSubmit,
    versionContext,
    handleChangeVersion,
  }
}

export default useVersion
