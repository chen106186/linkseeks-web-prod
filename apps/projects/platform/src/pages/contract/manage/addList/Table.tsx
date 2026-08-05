/**
 * 第一个内容
 */
/**
 * @param column 采购
 * @param columnsList 招标
 * @param columnsGetList  竞价
 * @param supplierColumns 会员类型
 * */

import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const column: any = [
  {
    title: intl.formatMessage({ id: 'contract.dingdanhaozhaiyao' }),
    dataIndex: 'demandNO',
    align: 'left',
    render: (text, record) => (
      <DetailAuthButton>
        <EyeAuthButton
          type={record.turn ? 'link' : 'button'}
          url={`/procurementAbility/confirmOffer/offerInquire/preview?id=${record.demandId}&turn=${record.turn}`}
        >
          {text}
        </EyeAuthButton>
        <p>{record.demandAbstract}</p>
      </DetailAuthButton>
    ),
  },
  {
    title: intl.formatMessage({ id: 'contract.rongxuqiufabushijian' }),
    dataIndex: 'demandPublishTime',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.shoubiaohuiyuan' }),
    dataIndex: 'awardName',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.shoubiaoshijian' }),
    dataIndex: 'awardTime',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.shoubiaojinehanshui' }),
    dataIndex: 'awardAmount',
    align: 'left',
  },
]

export const columnsList: any = [
  {
    title: intl.formatMessage({ id: 'contract.zhaobiaozhaiyao' }),
    dataIndex: 'inviteBidNO',
    align: 'left',
    render: (text, record) => (
      <div>
        <EyeAuthButton
          url={`/procurementAbility/callForBids/callForBidsSearch/detail?id=${record.inviteBidId}`}
          // type=""
        >
          {text}
        </EyeAuthButton>
        <p>{record.inviteBidAbstract}</p>
      </div>
    ),
  },
  {
    title: intl.formatMessage({ id: 'contract.zhaobiaofabushijian' }),
    dataIndex: 'inviteBidPublishTime',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.zhongbiaohuiyuan' }),
    dataIndex: 'bidWinnerName',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.zhongbiaotongzhishijian' }),
    dataIndex: 'bidWinnerNoticeTime',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.zhongbiaojine' }),
    dataIndex: 'bidWinnerAmount',
    align: 'left',
  },
]

export const columnsGetList: any = [
  {
    title: intl.formatMessage({ id: 'contract.jingjiadanzhaiyao' }),
    dataIndex: 'viePriceNO',
    align: 'left',
    render: (text, record) => (
      <div>
        <EyeAuthButton
          url={`/procurementAbility/purchaseBid/search/detail?id=${record.viePriceId}&number=${record.viePriceNO}`}
        >
          {text}
        </EyeAuthButton>
        <p>{record.viePriceAbstract}</p>
      </div>
    ),
  },
  {
    title: intl.formatMessage({ id: 'contract.rongxuqiufabushijian' }),
    dataIndex: 'publishTime',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.shoubiaohuiyuan' }),
    dataIndex: 'awardName',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.shoubiaoshijian' }),
    dataIndex: 'awardTime',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.shoubiaojinehanshui' }),
    dataIndex: 'awardAmount',
    align: 'left',
  },
]

// 供应会员列表列
export const supplierColumns = [
  {
    title: intl.formatMessage({ id: 'supplier.profile.supplierId' }),
    dataIndex: 'memberId',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'supplier.components.SupplierBasicInfo.name' }),
    dataIndex: 'name',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'supplier.profile.lifecycle' }),
    dataIndex: 'lifeCycleStageName',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'supplier.profile.depositTime' }),
    dataIndex: 'depositTime',
    align: 'left',
  },

  // {
  //   title: intl.formatMessage({ id: 'contract.huiyuanleixing' }),
  //   dataIndex: 'memberTypeName',
  //   align: 'left',
  // },
  // {
  //   title: intl.formatMessage({ id: 'contract.huiyuanjuese' }),
  //   dataIndex: 'roleName',
  //   align: 'left',
  // },
  // {
  //   title: intl.formatMessage({ id: 'contract.huiyuandengji' }),
  //   dataIndex: 'levelTag',
  //   align: 'left',
  // },
]

/**
 * 第二个内容
 */
export const goodcolumns: any = [
  {
    title: intl.formatMessage({ id: 'contract.purchase.materialNumber' }),
    dataIndex: 'code',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.materialName' }),
    dataIndex: 'name',
    key: 'name',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.materialGroup' }),
    dataIndex: 'group',
    key: 'group',
    align: 'left',
    render: (text, item) => item.materialGroup?.name || '',
  },
  {
    title: intl.formatMessage({ id: 'contract.guigexinghao' }),
    dataIndex: 'type',
    key: 'type',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.pinlei' }),
    dataIndex: 'customerCategory',
    key: 'customerCategory',
    align: 'left',
    render: (text, item) => item.customerCategory?.name || '',
  },
  {
    title: intl.formatMessage({ id: 'contract.pinpai' }),
    dataIndex: 'brand',
    key: 'brand',
    align: 'left',
  },
  { title: intl.formatMessage({ id: 'contract.danwei' }), dataIndex: 'unitName', align: 'left' },
]

/**
 * 请购单对应的采购物料
 */
export const purchasecolumns: any = [
  {
    title: intl.formatMessage({ id: 'contract.purchase.number' }),
    dataIndex: 'requisitionNo',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.digest' }),
    dataIndex: 'digest',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.member' }),
    dataIndex: 'vendorMemberName',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.department' }),
    dataIndex: 'department',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.people' }),
    dataIndex: 'requisitioner',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.time' }),
    dataIndex: 'advanceDeliveryDate',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.type' }),
    dataIndex: 'deliveryMethodName',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.address' }),
    dataIndex: 'deliveryAddress',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.materialNumber' }),
    dataIndex: 'productNo',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.materialName' }),
    dataIndex: 'name',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.quantity' }),
    dataIndex: 'quantity',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.surplusQuantity' }),
    dataIndex: 'surplusQuantity',
    align: 'left',
    sorter: {
      compare: (a, b) => a.surplusQuantity - b.surplusQuantity,
      multiple: 1,
    },
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.internalState' }),
    dataIndex: 'buyerInnerStatusName',
    align: 'left',
  },
]
