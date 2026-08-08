/**
 * @Description: 售后退货申请商品组件
 */
import React, { useState } from 'react'
import { Button, Switch, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { ORDER_TYPE_TENDER_CONTRACT } from '@/constants/order'
import { EditableColumns } from '@/components/PolymericTable/interface'
import DescProgress from '@/components/DescProgress'
import { isMaterialOrder } from '../../utils'
import AsProductList from '../AsProductList'
import ReturnInfoDrawer, { ReturnApplyInfo, PayListItem } from '../ReturnInfoDrawer'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
export type RefundProductItem = {
  /**
   * 退货详情id
   */
  returnDetailId: number
  /**
   * 退货商品id
   */
  returnGoodsId: number
  /**
   * 订单记录id
   */
  orderRecordId: number
  /**
   * 订单id
   */
  orderId: number
  /**
   * 订单号
   */
  orderNo: string
  /**
   * 商品id物料编号
   */
  productId: string
  /**
   * 商品名称物料名称、规格
   */
  productName: string
  /**
   * 品类
   */
  category: string
  /**
   * 品牌
   */
  brand: string
  /**
   * 单位
   */
  unit: string
  /**
   * skuId
   */
  skuId: number
  /**
   * sku图片
   */
  skuPic: string
  /**
   * 采购数量
   */
  purchaseCount: number
  /**
   * 采购单价
   */
  purchasePrice: number
  /**
   * 采购金额
   */
  purchaseAmount: number
  /**
   * 支付金额
   */
  payAmount: number
  /**
   * 退货数量
   */
  returnCount: number
  /**
   * 已退货发货(发货数量)
   */
  deliveryCount: number
  /**
   * 退货未发货
   */
  noDeliveryCount: number
  /**
   * 已退货收货(收货数量)
   */
  receiveCount: number
  /**
   * 差异数量
   */
  subCount: number
  /**
   * 退款金额
   */
  refundAmount: number
  /**
   * 退货原因
   */
  returnReason: string
  /**
   * 是否需要退货：0.否1.是
   */
  isNeedReturn: number
  /**
   * 是否需要退货
   */
  needReturnName: string
  /**
   * 是否含税：0-否，1-是
   */
  isHasTax: number
  /**
   * 税率
   */
  taxRate: number
  /**
   * 支付信息 ,ReturnGoodsPayVO
   */
  payList: PayListItem[]
  /**
   * 商品规格
   */
  type: string
  /**
   * 关联商品ID
   */
  associatedProductId: string
  /**
   * 关联商品名称、规格
   */
  associatedProductName: string
  /**
   * 关联商品规格
   */
  associatedType: string
  /**
   * 关联商品品类
   */
  associatedCategory: string
  /**
   * 关联商品品牌
   */
  associatedBrand: string
  /**
   * 关联商品单位
   */
  associatedUnit: string
  /**
   * 合同id
   */
  contractId: number
  /**
   * 合同编号
   */
  contractNo: string
}

interface AsRefundProductListProps {
  /**
   * 数据
   */
  dataSource: RefundProductItem[]
  /**
   * 订单类型
   */
  orderType: number
  /**
   * 订单详情路由前缀，
   */
  orderDetailedPrefix: string
  /**
   * 商品是否需要退货
   */
  onNeedReturn?: (record: any) => void
}

const AsRefundProductList: React.FC<AsRefundProductListProps> = (props: AsRefundProductListProps) => {
  const { dataSource, orderType, orderDetailedPrefix, onNeedReturn } = props

  const [applyInfo, setApplyInfo] = useState<ReturnApplyInfo>(null)
  const [visibleRefundApplyDrawer, setVisibleRefundApplyDrawer] = useState(false)

  const intl = useIntl()

  const isMateriel = isMaterialOrder(orderType)

  /**
   * 商品是否需要退货
   * @param record productItem
   */
  const handleNeedReturn = (record: RefundProductItem) => {}

  const handleVisibleReturnInfo = (flag: boolean) => {
    setVisibleRefundApplyDrawer(flag)
  }

  /**
   * 查看退货数量与退款金额
   * @param record productItem
   */
  const handleCheckRefundApplyInfo = (record: RefundProductItem) => {
    setApplyInfo({
      orderId: record.orderId,
      orderNo: record.orderNo,
      productName: record.productName,
      category: record.category,
      brand: record.brand,
      unit: record.unit,
      purchaseCount: record.purchaseCount,
      purchasePrice: record.purchasePrice,
      purchaseAmount: record.purchaseAmount,
      returnCount: record.returnCount,
      returnReason: record.returnReason,
      payList: record.payList.map((item) => ({
        ...item,
        payWayTxt: item.payWayName,
        channelTxt: item.channelName,
      })),
      orderType,
      refundAmount: record.refundAmount,
    })
    handleVisibleReturnInfo(true)
  }

  const productColumns: EditableColumns<RefundProductItem>[] = [
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.orderNo', defaultMessage: '订单号' }),
      dataIndex: 'orderNo',
      render: (text, record) => (
        <a href={`${orderDetailedPrefix}/orderDetail?id=${record.orderId}`} target="_blank">
          {text}
        </a>
      ),
    },
    ...(!isMateriel
      ? [
          {
            title: intl.formatMessage({ id: 'afterService.common.productColumns.productId', defaultMessage: '商品ID' }),
            dataIndex: 'productId',
          },
          {
            title: intl.formatMessage({
              id: 'afterService.common.productColumns.productName',
              defaultMessage: '商品名称',
            }),
            dataIndex: 'productName',
            ellipsis: true,
          },
          {
            title: intl.formatMessage({ id: 'afterService.common.productColumns.category', defaultMessage: '品类' }),
            dataIndex: 'category',
          },
          {
            title: intl.formatMessage({ id: 'afterService.common.productColumns.brand', defaultMessage: '品牌' }),
            dataIndex: 'brand',
          },
          {
            title: intl.formatMessage({ id: 'afterService.common.productColumns.unit', defaultMessage: '单位' }),
            dataIndex: 'unit',
          },
        ]
      : [
          {
            title: intl.formatMessage({
              id: 'afterService.common.productColumns.materialNo',
              defaultMessage: '物料编号',
            }),
            dataIndex: 'productId',
          },
          {
            title: `${intl.formatMessage({
              id: 'afterService.common.productColumns.materialName',
              defaultMessage: '物料名称',
            })}、${intl.formatMessage({
              id: 'afterService.common.productColumns.materialSpec',
              defaultMessage: '规格',
            })}`,
            dataIndex: 'productName',
            render: (text, record) => `${text}${record.type ? '/' + record.type : ''}`,
          },
          {
            title: intl.formatMessage({ id: 'afterService.common.productColumns.category', defaultMessage: '品类' }),
            dataIndex: 'category',
          },
          {
            title: intl.formatMessage({ id: 'afterService.common.productColumns.brand', defaultMessage: '品牌' }),
            dataIndex: 'brand',
          },
          {
            title: intl.formatMessage({ id: 'afterService.common.productColumns.unit', defaultMessage: '单位' }),
            dataIndex: 'unit',
          },
          {
            title:
              orderType !== ORDER_TYPE_TENDER_CONTRACT
                ? intl.formatMessage({
                    id: 'afterService.common.productColumns.materialMergeInfo1',
                    defaultMessage: '关联报价商品ID、名称、规格、品类、品牌',
                  })
                : intl.formatMessage({
                    id: 'afterService.common.productColumns.materialMergeInfo2',
                    defaultMessage: '关联投标商品ID、名称、规格、品类、品牌',
                  }),
            dataIndex: 'associatedProductId',
            render: (text, record) =>
              `${text || ''}/${record.associatedProductName || ''}/${record.associatedType || ''}/${
                record.associatedCategory || ''
              }/${record.associatedBrand || ''}`,
          },
        ]),
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.purchaseCount', defaultMessage: '采购数量' }),
      dataIndex: 'purchaseCount',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.purchasePrice', defaultMessage: '采购单价' }),
      dataIndex: 'purchasePrice',
      align: 'center',
    },
    !isMateriel
      ? {
          title: `${intl.formatMessage({
            id: 'afterService.common.productColumns.payAmount',
            defaultMessage: '已支付',
          })}/${intl.formatMessage({
            id: 'afterService.common.productColumns.purchaseAmount',
            defaultMessage: '采购金额',
          })}`,
          dataIndex: 'payAmount',
          render: (text, record) => (
            <DescProgress
              descriptions={[
                {
                  title: `${intl.formatMessage({
                    id: 'afterService.common.productColumns.payAmount2',
                    defaultMessage: '已支付金额',
                  })}:`,
                  value: `${translate('web.common.currencySymbol')}${text}`,
                },
                {
                  title: `${intl.formatMessage({
                    id: 'afterService.common.productColumns.purchaseAmount',
                    defaultMessage: '采购金额',
                  })}:`,
                  value: `${translate('web.common.currencySymbol')}${record.purchaseAmount}`,
                },
              ]}
              percent={(text / record.purchaseAmount) * 100}
            />
          ),
        }
      : {
          title: intl.formatMessage({
            id: 'afterService.common.productColumns.purchaseAmount',
            defaultMessage: '采购金额',
          }),
          dataIndex: 'purchaseAmount',
          align: 'center',
          render: (text) => `${translate('web.common.currencySymbol')}${text}`,
        },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.returnCount', defaultMessage: '退货数量' }),
      dataIndex: 'returnCount',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.refundAmount', defaultMessage: '退货金额' }),
      dataIndex: 'refundAmount',
      align: 'center',
    },
    {
      title: (
        <>
          <span style={{ marginRight: 8 }}>
            {intl.formatMessage({
              id: 'afterService.common.productColumns.needReturn',
              defaultMessage: '是否需要退货',
            })}
          </span>
          <Tooltip
            title={intl.formatMessage({
              id: 'afterService.common.productColumns.needReturn.tip',
              defaultMessage:
                '如果商品因为缺陷原因，无法再退回加工后重新使用，可选择不需要退货，选择后，采购方无须退回不良品。',
            })}
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </>
      ),
      dataIndex: 'needReturnName',
      align: 'center',
      render: (text, record) => (
        <>{!onNeedReturn ? text : <Switch checked={record.isNeedReturn} onChange={() => handleNeedReturn(record)} />}</>
      ),
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      dataIndex: 'option',
      align: 'center',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => handleCheckRefundApplyInfo(record)}>
            {intl.formatMessage({ id: 'afterService.common.productColumns.checkInfo', defaultMessage: '查看详情' })}
          </Button>
        </>
      ),
    },
  ] as EditableColumns[]

  return (
    <>
      <AsProductList
        rowKey="orderRecordId"
        title={intl.formatMessage({ id: 'afterService.common.return.products', defaultMessage: '退货商品' })}
        columns={productColumns}
        dataSource={dataSource}
      />
      <ReturnInfoDrawer
        visible={visibleRefundApplyDrawer}
        applyInfo={applyInfo}
        onClose={() => handleVisibleReturnInfo(false)}
      />
    </>
  )
}

export default AsRefundProductList
