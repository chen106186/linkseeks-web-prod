import React from 'react'
import { unixChangeRender } from '@/pages/procurementAbility/callForBids/addNewBid/constant'
import { BidInStateTexts, BidOutStateTexts } from '@/constants/procurement'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
/** 对后端返回的投标数据转换为render数据 */
export const processTenderData = (tenderData) => {
  let alreadyData = {
    //-- 仅显示
    submitTenderCode: tenderData.code,
    projectName: tenderData.inviteTender.projectName,
    inviterTenderCode: tenderData.inviteTender.code,
    memberName: tenderData.inviteTender.memberName,
    inviteTenderAreaList: tenderData.inviteTender.inviteTenderAreaList
      .map((item) => `${item.provinceName}${item.cityName}`)
      .join('/'),
    inviteTenderOutStatus: tenderData.submitTenderOutStatusValue,
    inviteTenderInStatus: tenderData.submitTenderInStatusValue,
    inviteTenderStartTime: unixChangeRender(tenderData.inviteTender.inviteTenderStartTime),
    inviteTenderEndTime: unixChangeRender(tenderData.inviteTender.inviteTenderEndTime),
    hopeDate: unixChangeRender(tenderData.inviteTender.hopeDate),
    targetPrice: tenderData.inviteTender.targetPrice,
    inviteTenderRequirement: tenderData.inviteTender.inviteTenderRequirement,
    inviteTenderFile: tenderData.inviteTender.inviteTenderFile,
    payType: tenderData.inviteTender.payType,
    deliverAddress: tenderData.inviteTender.deliverAddress,
    deliverRequirement: tenderData.inviteTender.deliverRequirement,
    taxationRequirement: tenderData.inviteTender.taxationRequirement,
    logisticsRequirement: tenderData.inviteTender.logisticsRequirement,
    packingRequirement: tenderData.inviteTender.packingRequirement,
    otherRequirement: tenderData.inviteTender.otherRequirement,
    //--
  }
  if (tenderData.submitTender?.id) {
    // 编辑从submitTender里面取数据
    return {
      ...alreadyData,
      ...tenderData.submitTender,
      submitTenderMateriel: tenderData.submitTender.submitTenderMateriel.map((item) => ({
        ...item,
        brandName: item.inviteTenderMateriel.brandName,
        categoryName: item.inviteTenderMateriel.categoryName,
        code: item.inviteTenderMateriel.code,
        count: item.inviteTenderMateriel.count,
        unitName: item.inviteTenderMateriel.unitName,
        inviteTender: { id: item.inviteTenderMateriel.id },
        name: item.inviteTenderMateriel.name,
        money: Number((item.price * item.inviteTenderMateriel.count).toFixed(2)),
        isTax: true,
      })),
    }
  } else {
    // 新增从inviteTender里面取数据
    return {
      ...alreadyData,
      submitTenderMateriel: tenderData.inviteTender.materielList.map((item) => ({
        ...item,
        isTax: true,
      })),
    }
  }
}

// 选择商品和会员弹框的列
export const columnsSetMember: any[] = [
  {
    title: 'ID',
    dataIndex: 'memberId',
    align: 'center',
    key: 'memberId',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.memberName' }),
    dataIndex: 'name',
    align: 'center',
    key: 'name',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.memberType' }),
    dataIndex: 'memberTypeName',
    align: 'center',
    key: 'memberTypeName',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.role' }),
    dataIndex: 'roleName',
    align: 'center',
    key: 'roleName',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.leveTag' }),
    dataIndex: 'levelTag',
    align: 'center',
    key: 'levelTag',
  },
]

// 新增投标 投标商品列表
export const productInfoColumns: any[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: 'left',
    key: 'id',
    className: 'commonHide',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.type' }),
    dataIndex: 'code',
    align: 'left',
    key: 'code',
    render: (t, r) => (
      <>
        <div>{t}</div>
        <div>{r.name}</div>
      </>
    ),
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.size' }),
    dataIndex: 'type',
    align: 'left',
    key: 'type',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.pinlei' }),
    dataIndex: 'categoryName',
    align: 'left',
    key: 'categoryName',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.pinpai' }),
    dataIndex: 'brandName',
    align: 'left',
    key: 'brandName',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.caigoushuliangdanwei' }),
    dataIndex: 'count',
    align: 'left',
    key: 'count',
    render: (t, r) => (
      <>
        <div>{t}</div>
        <div>{r.unitName}</div>
      </>
    ),
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.isTax' }),
    dataIndex: 'isTax',
    align: 'left',
    key: 'isTax',
    render: (t, r) =>
      t ? intl.formatMessage({ id: 'table.purchase.shi' }) : intl.formatMessage({ id: 'table.purchase.fou' }),
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.taxProbability' }),
    dataIndex: 'taxRate',
    align: 'left',
    key: 'taxRate',
    formItem: 'input',
    editable: true,
    width: 140,
    formItemProps: {
      suffix: '%',
    },
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.taxUnitPrice' }),
    dataIndex: 'price',
    align: 'left',
    key: 'price',
    formItem: 'input',
    editable: true,
    width: 140,
    formItemProps: {
      prefix: translate('web.common.currencySymbol'),
    },
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.taxPrice' }),
    dataIndex: 'money',
    align: 'left',
    key: 'money',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
    dataIndex: 'ctl',
    align: 'left',
    key: 'ctl',
  },
]
