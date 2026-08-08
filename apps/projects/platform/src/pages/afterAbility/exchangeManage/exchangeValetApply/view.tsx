/*
 * @Author: XieZhiXiong
 * @Date: 2021-12-02 14:11:49
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-02 17:56:44
 * @Description: 代客申请换货
 */
import React, { useState, useMemo } from 'react'
import { Button, Card, Spin, Badge, message, Upload } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { ArrayTable } from '@apps/formily'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import moment from 'moment'
import { formatTimeString } from '@/utils'
import { findLastIndex, debounce } from 'lodash'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined, PlusOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { getOrderCommonAgentAfterSalePage } from '@apps/apis'
import { postAftersalesReplaceGoodsAgentSave } from '@apps/apis'
import { getMemberManageOrderAgentMembers, GetMemberManageOrderAgentMembersResponse } from '@apps/apis'
import { FileData } from '@/utils'
import { authService } from '@apps/services'
import { ORDER_TYPE2_POINTS, ORDER_TYPE2_CHANNEL_POINTS, ORDER_TYPE_STORE_PURCHASE } from '@/constants/order'
import ReturnEle from '@/components/ReturnEle'
import StatusTag from '@/components/StatusTag'
import NiceForm from '@/components/NiceForm'
import GoodsDrawer from '../../components/GoodsDrawer'
import { OrderListRes } from '../../components/GoodsDrawer/interface'
import { addSchema } from './schema'
import { createEffects } from './effects'
import { EXCHANGE_OUTER_STATUS_TAG_MAP, EXCHANGE_INNER_STATUS_BADGE_MAP } from '../../constants'
import { isMaterialOrder } from '../../utils'
import { AuthButton } from '@apps/components'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { fetchOrderTypes } from '@/pages/orderAbility/utils/orderTypes'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
const addSchemaAction = createFormActions()
const { onFormInputChange$, onFormInit$, onFieldInputChange$ } = FormEffectHooks

interface BillsFormProps {}

type ReplaceGoodsListItemType = {
  /**
   * 订单号
   */
  orderNo: string
  /**
   * 商品id
   */
  productId: string
  /**
   * 商品名称
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
   * 采购数量
   */
  purchaseCount: number
  /**
   * 物料编号
   */
  associatedProductId: string
  /**
   * 物料名称、规格
   */
  associatedProductName: string
  /**
   * 物料品类
   */
  associatedCategory: string
  /**
   * 物料品牌
   */
  associatedBrand: string
  /**
   * 物料单位
   */
  associatedUnit: string
  /**
   * 关联报价商品ID、名称、规格、品类、品牌
   */
  associated: string
  /**
   * 采购单价
   */
  purchasePrice: number
  /**
   * 采购金额
   */
  purchaseAmount: number
  /**
   * 换货数量
   */
  replaceCount: number
  /**
   * 换货理由
   */
  replaceReason: string
  /**
   * 额外的数据
   */
  extraData: { [key: string]: any }
}

interface DetailInfo {
  applyTime: string
  proofFileList?: FileData[]
  deliveryAddress?: { [key: string]: any }
  shippingAddress?: { [key: string]: any }
  pickupAddress?: { [key: string]: any }
  supplierMember?: {}
  outerStatus?: number
  outerStatusName?: string
  innerStatus?: number
  innerStatusName?: string
  deliveryType?: number
  /**
   * 订单编号
   */
  orderNo?: string
  /**
   * 订单类型
   */
  orderType?: number
  /**
   * 商品数据
   */
  replaceGoodsList?: ReplaceGoodsListItemType[]
}

interface OrderNoProps {
  value: any
  name: string
}

const OrderNo = (props: OrderNoProps) => {
  const { value, name } = props
  const extraData = addSchemaAction.getFieldValue(
    FormPath.transform(name, /\d/, ($1) => {
      return `replaceGoodsList.${$1}.extraData`
    }),
  )
  return (
    <a href={`/afterAbility/returnApplication/returnPrSubmit/orderDetail?id=${extraData?.orderId}`} target="_blank">
      {value}
    </a>
  )
}
OrderNo.isFieldComponent = true

const ExchangeValetApply: React.FC<BillsFormProps> = () => {
  const [detailInfo] = useState<DetailInfo>({
    applyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    orderType: ORDER_TYPE_STORE_PURCHASE,
  })
  const [unsaved, setUnsaved] = useState(false)
  const [goodsValue, setGoodsValue] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [visibleGoodsDrawer, setVisibleGoodsDrawer] = useState(false)
  const [orderTypeValue, setOrderTypeValue] = useState(ORDER_TYPE_STORE_PURCHASE)

  const isPointsOrder = orderTypeValue === ORDER_TYPE2_POINTS || orderTypeValue === ORDER_TYPE2_CHANNEL_POINTS
  const isMateriel = isMaterialOrder(orderTypeValue)

  const intl = useIntl()
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  const tableColumn: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.orderNo', defaultMessage: '订单号' }),
      dataIndex: 'orderNo',
      render: (text, record) => (
        <a href={`/afterAbility/exchangeApplication/exchangePrSubmit/orderDetail?id=${record.orderId}`} target="_blank">
          {text}
        </a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.digest', defaultMessage: '订单摘要' }),
      dataIndex: 'digest',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.vendorMemberName', defaultMessage: '供应会员' }),
      dataIndex: 'vendorMemberName',
    },
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.createTime', defaultMessage: '下单时间' }),
      dataIndex: 'createTime',
    },
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.outerStatusName', defaultMessage: '订单状态' }),
      dataIndex: 'outerStatusName',
    },
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.orderTypeName', defaultMessage: '订单类型' }),
      dataIndex: 'orderTypeName',
    },
    isMateriel
      ? {
          title: intl.formatMessage({ id: 'afterService.order.query.column.contractNo', defaultMessage: '合同编号' }),
          dataIndex: 'contractNo',
          render: (text, record) => (
            <a href={`/contract/manage/QueryList/QueryListdetails?contractId=${record.contractId}`} target="_blank">
              {text}
            </a>
          ),
        }
      : null,
  ].filter(Boolean) as ColumnType<any>[]

  const childTableColumn: ColumnType<any>[] = [
    !isMateriel
      ? {
          title: intl.formatMessage({ id: 'afterService.order.query.column.productNo', defaultMessage: '商品ID' }),
          dataIndex: 'productNo',
        }
      : {
          title: intl.formatMessage({ id: 'afterService.order.query.column.materialNo', defaultMessage: '物料编号' }),
          dataIndex: 'productNo',
        },
    !isMateriel
      ? {
          title: intl.formatMessage({ id: 'afterService.order.query.column.name', defaultMessage: '商品名称' }),
          dataIndex: 'name',
          ellipsis: true,
        }
      : {
          title: `${intl.formatMessage({
            id: 'afterService.order.query.column.materialName',
            defaultMessage: '物料名称',
          })}、${intl.formatMessage({ id: 'afterService.order.query.column.quotedSpec', defaultMessage: '规格' })}`,
          dataIndex: 'name',
          render: (text, record) => `${text}/${record.quotedSpec}`,
        },
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.category', defaultMessage: '品类' }),
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.brand', defaultMessage: '品牌' }),
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.unit', defaultMessage: '单位' }),
      dataIndex: 'unit',
    },
    {
      title: !isPointsOrder
        ? intl.formatMessage({ id: 'afterService.order.query.column.quantity', defaultMessage: '订单数量' })
        : intl.formatMessage({
            id: 'afterService.common.productColumns.purchaseCount-integral',
            defaultMessage: '兑换数量',
          }),
      dataIndex: 'quantity',
    },
    {
      title: !isPointsOrder
        ? intl.formatMessage({ id: 'afterService.order.query.column.price', defaultMessage: '单价' })
        : intl.formatMessage({
            id: 'afterService.common.productColumns.purchasePrice-integral',
            defaultMessage: '所需积分',
          }),
      dataIndex: 'price',
    },
    {
      title: !isPointsOrder
        ? intl.formatMessage({ id: 'afterService.common.productColumns.purchaseAmount', defaultMessage: '采购金额' })
        : intl.formatMessage({
            id: 'afterService.common.productColumns.purchaseAmount-integral',
            defaultMessage: '所需积分小计',
          }),
      dataIndex: 'amount',
      render: (text) => `${translate('web.common.currencySymbol')} ${text}`,
    },
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.exchangeCount', defaultMessage: '已换货数量' }),
      dataIndex: 'exchangeCount',
    },
  ]

  // 根据采购会员获取订单列表
  const getOrderList = (params): Promise<OrderListRes> => {
    const purchaserValue = addSchemaAction.getFieldValue('purchaser')
    const purchaserOriginData: GetMemberManageOrderAgentMembersResponse = addSchemaAction.getFieldState(
      'purchaser',
      (fieldState) => fieldState.originData,
    )
    const current = purchaserOriginData.find((item) => item.id === purchaserValue)

    if (!current) {
      return Promise.reject()
    }

    const { startDate = null, endDate = null } = params
    const payload = { ...params }

    if (startDate) {
      payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
    }
    if (endDate) {
      payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
    }

    return new Promise((resolve, reject) => {
      getOrderCommonAgentAfterSalePage({
        ...payload,
        buyerMemberId: current.memberId,
        buyerRoleId: current.roleId,
        orderType: orderTypeValue,
        afterSalesType: 2, // 换货
        orderNo: detailInfo.orderNo ? detailInfo.orderNo : params.orderNo || undefined,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  const handleAddGoods = () => {
    const purchaserVal = addSchemaAction.getFieldValue('purchaser')
    const orderTypeVal = addSchemaAction.getFieldValue('orderType')

    if (!purchaserVal) {
      message.error(
        intl.formatMessage({ id: 'afterService.apply.purchaser.nothing', defaultMessage: '请先选择采购会员' }),
      )
      return
    }
    if (!orderTypeVal) {
      message.error(
        intl.formatMessage({ id: 'afterService.apply.orderType.nothing', defaultMessage: '请先选择售后订单类型' }),
      )
      return
    }
    setVisibleGoodsDrawer(true)
  }

  const TableAddButton = (
    <Button icon={<PlusOutlined />} onClick={handleAddGoods} type="dashed" block>
      {!isMateriel
        ? intl.formatMessage({ id: 'afterService.apply.product.add.replace.normal', defaultMessage: '选择换货商品' })
        : intl.formatMessage({ id: 'afterService.apply.product.add.replace.material', defaultMessage: '选择换货物料' })}
    </Button>
  )

  const handleSubmit = (value) => {
    const {
      purchaser,
      supplierMember,
      deliveryType,
      shippingAddress = {},
      pickupAddress = {},
      deliveryAddress = {},
      proofFileList = [],
      replaceGoodsList = [],

      outerStatus,
      outerStatusName,
      innerStatus,
      innerStatusName,
      applyNo,
      applyTime,

      orderNo,
      ...rest
    } = value

    setSubmitLoading(true)

    const purchaserOriginData: GetMemberManageOrderAgentMembersResponse = addSchemaAction.getFieldState(
      'purchaser',
      (fieldState) => fieldState.originData,
    )
    const current = purchaserOriginData.find((item) => item.id === purchaser)

    const userInfo = authService.getAuth()

    const payload = {
      ...rest,
      replaceId: 0,
      memberId: current.memberId,
      memberRoleId: current.roleId,
      company: current.name,
      supplierMemberId: userInfo.memberId,
      supplierRoleId: userInfo.memberRoleId,
      supplierMemberName: userInfo.memberName,
      replaceGoodsAddress: {
        receiveAddress: deliveryAddress.fullAddress || '',
        receiveUserName: deliveryAddress.name || '',
        receiveUserTel: deliveryAddress.phone || '',
        receiveId: deliveryAddress.id || '',
      },
      // 配送方式为 1 = 物流 选择 发货地址
      returnGoodsAddress: {
        deliveryType,
        sendAddress:
          deliveryType === 1 ? shippingAddress.fullAddress : deliveryType === 2 ? pickupAddress.fullAddress : '',
        sendUserName: deliveryType === 1 ? shippingAddress.name : deliveryType === 2 ? pickupAddress.name : '',
        sendUserTel: deliveryType === 1 ? shippingAddress.phone : deliveryType === 2 ? pickupAddress.phone : '',
        sendId: deliveryType === 1 ? shippingAddress.id : deliveryType === 2 ? pickupAddress.id : '',
      },
      proofFileList: proofFileList
        .filter((item) => item.status === 'done')
        .map((item) => ({
          fileName: item.name,
          filePath: item.url,
        })),
      replaceGoodsList: replaceGoodsList.map(
        ({ replaceCount, brand, unit, extraData, associated, shopId, shopLogo, shopName, ...rest }) => ({
          ...rest,
          brand: brand || '',
          unit: unit || '',
          orderRecordId: extraData.id,
          replaceCount: +replaceCount,
        }),
      ),
      taskTypeKey: replaceGoodsList[0].extraData.taskTypeKey,
      shopId: replaceGoodsList[0].shopId,
      shopLogo: replaceGoodsList[0].shopLogo,
      shopName: replaceGoodsList[0].shopName,
    }

    postAftersalesReplaceGoodsAgentSave(payload)
      .then((res) => {
        if (res.code === 1000) {
          setUnsaved(false)
          setTimeout(() => {
            history.goBack()
          }, 800)
        } else {
          setSubmitLoading(false)
        }
      })
      .catch(() => {
        setSubmitLoading(false)
      })
  }

  const handleRemoveItem = (index: number) => {
    const newGoodsValue = [...goodsValue]
    const newValue = [...addSchemaAction.getFieldValue('replaceGoodsList')]

    const deleted = newValue.splice(index, 1)
    addSchemaAction.setFieldValue('replaceGoodsList', newValue)
    newGoodsValue.splice(
      newGoodsValue.findIndex((item) => item === deleted[0].id),
      1,
    )
    setGoodsValue(newGoodsValue)
  }

  // ArrayTable自定义渲染
  const renderListTableRemove = (index: number) => (
    <>
      <a
        onClick={() => handleRemoveItem(index)}
        style={{
          color: '#ff4d4f',
        }}
      >
        {intl.formatMessage({ id: 'afterService.common.delete', defaultMessage: '删除' })}
      </a>
    </>
  )

  const beforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 20) {
      message.warning(intl.formatMessage({ id: 'afterService.apply.upload.legal', defaultMessage: '图片大小超过20M' }))
      return Upload.LIST_IGNORE
    }
    return Promise.resolve()
  }

  const handleGoodsConfirm = (values) => {
    const preValues = addSchemaAction.getFieldValue('replaceGoodsList')
    const value = []

    values.forEach((item) => {
      const atom = {
        orderId: item.orderId,
        orderNo: item.orderNo,
        productId: item.productNo,
        productName: item.name,
        category: item.category,
        brand: item.brand,
        unit: item.unit,
        purchasePrice: item.price,
        purchaseCount: item.quantity,
        purchaseAmount: +(item.price * item.quantity).toFixed(2),
        replaceCount: '',
        replaceReason: '',
        extraData: {
          remaining: item.quantity - (item.exchangeCount || 0), // 可换货数量
          id: item.id,
          taskTypeKey: item.processKey,
          orderId: item.orderId,
        },
        isHasTax: item.tax,
        taxRate: item.taxRate,
        contractId: item.contractId,
        contractNo: item.contractNo,
        associated: !isMateriel
          ? ''
          : `${item.quotedProductNo}/${item.quotedName}/${item.quotedSpec}/${item.quotedCategory}/${item.quotedBrand}`,
        associatedProductId: item.quotedProductNo || '',
        associatedProductName: `${item.quotedName || ''}`,
        associatedType: `${item.quotedSpec || ''}`,
        associatedCategory: item.quotedCategory || '',
        associatedBrand: item.quotedBrand || '',
        associatedUnit: item.unit || '',
        skuId: item.skuId,
        skuPic: item.skuPic,
        shopId: item.shopId,
        shopLogo: item.shopLogo,
        shopName: item.shopName,
      }
      value.push(atom)
    })
    // 先过滤掉 value 中没有，preValues 中有的数据
    const concated = [
      ...value,
      ...preValues.filter((item) => value.find((val) => val.extraData.id === item.extraData.id)),
    ]
    const newData = concated.filter(
      (item, index) => findLastIndex(concated, (val) => val.extraData.id === item.extraData.id) === index,
    )
    if (preValues.length) {
      newData.reverse()
    }
    addSchemaAction.setFieldValue('replaceGoodsList', newData)
  }

  const handleGoodsChange = (values) => {
    setGoodsValue(values)
  }

  // 采购商搜索
  const handlePurchaserSearch = debounce((value: string) => {
    if (!value) {
      addSchemaAction.setFieldState('purchaser', (fieldState) => {
        fieldState.props.enum = []
      })
      return
    }
    getMemberManageOrderAgentMembers({
      name: value,
    }).then((res) => {
      if (res.code === 1000) {
        addSchemaAction.setFieldState('purchaser', (fieldState) => {
          fieldState.props.enum = res.data.map((item) => ({
            label: `${item.name}/${item.memberTypeName}/${item.roleName}`,
            value: item.id,
          }))
          fieldState.originData = res.data
        })
      }
    })
  }, 300)

  const OuterStatus = (
    <StatusTag type={EXCHANGE_OUTER_STATUS_TAG_MAP[detailInfo?.outerStatus]} title={detailInfo?.outerStatusName} />
  )

  const InnerStatus = (
    <Badge color={EXCHANGE_INNER_STATUS_BADGE_MAP[detailInfo?.innerStatus]} text={detailInfo?.innerStatusName} />
  )

  const schemaValue = useMemo(() => addSchema(orderTypeValue), [orderTypeValue])

  return (
    <Spin spinning={false}>
      <PageHeaderWrapper
        title={intl.formatMessage({ id: 'exchangeManage.exchangeValetApply.vale', defaultMessage: '代客换货申请' })}
        extra={[
          <AuthButton type="custom" code="submit">
            <Button
              key="1"
              type="primary"
              icon={<SaveOutlined />}
              loading={submitLoading}
              onClick={() => addSchemaAction.submit()}
            >
              {intl.formatMessage({ id: 'afterService.apply.save', defaultMessage: '保存' })}
            </Button>
            ,
          </AuthButton>,
        ]}
      >
        <Card>
          <NiceForm
            value={detailInfo}
            previewPlaceholder=" "
            expressionScope={{
              TableAddButton,
              OuterStatus,
              InnerStatus,
              renderListTableRemove,
              beforeUpload,
              handlePurchaserSearch,
            }}
            components={{
              ArrayTable,
              OrderNo,
            }}
            effects={($, actions) => {
              const { setFieldState } = actions

              useAsyncSelect('orderType', fetchOrderTypes, ['text', 'id'])

              createEffects($, actions)
              onFormInputChange$().subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })

              onFormInit$().subscribe(() => {
                setFieldState('*(applyNo,outerStatus,innerStatus)', (field) => {
                  field.visible = false
                })
              })

              onFieldInputChange$('supplierMember').subscribe(() => {
                setGoodsValue([])
              })

              onFieldInputChange$('orderType').subscribe((fieldState) => {
                setOrderTypeValue(fieldState.value)
              })
            }}
            onSubmit={handleSubmit}
            actions={addSchemaAction}
            schema={schemaValue}
          />
        </Card>

        <GoodsDrawer
          title={
            !isMateriel
              ? intl.formatMessage({
                  id: 'afterService.apply.product.add.replace.normal',
                  defaultMessage: '选择换货商品',
                })
              : intl.formatMessage({
                  id: 'afterService.apply.product.add.replace.material',
                  defaultMessage: '选择换货物料',
                })
          }
          afterType={2}
          visible={visibleGoodsDrawer}
          fetchOrderList={getOrderList}
          onClose={() => setVisibleGoodsDrawer(false)}
          onConfirm={handleGoodsConfirm}
          checked={goodsValue}
          onChange={handleGoodsChange}
          nestProps={{
            NestColumns: [tableColumn, childTableColumn],
          }}
          orderType={orderTypeValue}
        />
      </PageHeaderWrapper>
    </Spin>
  )
}

export default ExchangeValetApply
