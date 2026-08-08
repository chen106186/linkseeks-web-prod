import React, { useState, useEffect, useMemo } from 'react'
import { Button, Card, Spin, Badge, message, Upload } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { ArrayTable } from '@apps/formily'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { usePrompt } from '@linkseeks/router-core'
import moment from 'moment'
import { formatTimeString } from '@/utils'
import { findLastIndex } from 'lodash'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined, PlusOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import BigNumber from 'bignumber.js'
import { getOrderBuyerDetail, getOrderCommonAfterSalePage } from '@apps/apis'
import { getAftersalesReturnGoodsGetDetailByConsumer, postAftersalesReturnGoodsSave } from '@apps/apis'
import { normalizeFiledata, FileData } from '@/utils'
import ReturnEle from '@/components/ReturnEle'
import StatusTag from '@/components/StatusTag'
import NiceForm from '@/components/NiceForm'
import GoodsDrawer from '../../../../components/GoodsDrawer'
import { OrderListRes } from '../../../../components/GoodsDrawer/interface'
import ReturnInfoDrawer, { ReturnApplyInfo } from '../../../../components/ReturnInfoDrawer'
import { addSchema } from './schema'
import { createEffects } from './effects'
import { RETURN_OUTER_STATUS_TAG_MAP, RETURN_INNER_STATUS_BADGE_MAP } from '../../../../constants'
import { isMaterialOrder } from '../../../../utils'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { fetchOrderTypes } from '@/pages/orderAbility/utils/orderTypes'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
const addSchemaAction = createFormActions()
const { onFormInputChange$, onFieldInputChange$, onFormInit$ } = FormEffectHooks

/** 质检单 */
const ZHIJIANDAN = 1
interface BillsFormProps {
  id?: string
  /**
   * 是否是编辑的
   */
  isEdit?: boolean
  /**
   * 订单id，从订单列表跳转过来的
   */
  orderId?: number
  /**
   * 订单类型
   */
  orderType?: number
}

type ReturnGoodsListItemType = {
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
   * 已支付金额
   */
  payAmount: number
  /**
   * 退货数量
   */
  returnCount: number
  /**
   * 退款金额
   */
  refundAmount: number
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
  sourceId?: number
  sourceType?: number
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
  returnGoodsList?: ReturnGoodsListItemType[]
}

interface OrderNoProps {
  value: any
  name: string
}

const OrderNo = (props: OrderNoProps) => {
  const { value, name } = props
  const extraData = addSchemaAction.getFieldValue(
    FormPath.transform(name, /\d/, ($1) => {
      return `returnGoodsList.${$1}.extraData`
    }),
  )
  return (
    <a href={`/afterAbility/returnApplication/returnPrSubmit/orderDetail?id=${extraData?.orderId}`} target="_blank">
      {value}
    </a>
  )
}
OrderNo.isFieldComponent = true

const ReturnForm: React.FC<BillsFormProps> = ({ id, isEdit = false, orderId, orderType: outerOrderType }) => {
  const [detailInfo, setDetailInfo] = useState<DetailInfo>({
    applyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
  })
  const [unsaved, setUnsaved] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [applyInfo, setApplyInfo] = useState<ReturnApplyInfo>(null)
  const [visibleGoodsDrawer, setVisibleGoodsDrawer] = useState(false)
  const [visibleReturnInfoDrawer, setVisibleReturnInfoDrawer] = useState(false)
  const [goodsValue, setGoodsValue] = useState([])
  const [orderTypeValue, setOrderTypeValue] = useState(0)
  const GENERATE_QUALITY_AFTERSALE = JSON.parse(localStorage.getItem('GENERATE_QUALITY_AFTERSALE'))
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
        <a href={`/afterAbility/returnApplication/returnPrSubmit/orderDetail?id=${record.orderId}`} target="_blank">
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
          render: (text, record) => `${text}${record.spec ? `/${record.spec}` : ''}`,
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
      title: intl.formatMessage({ id: 'afterService.order.query.column.quantity', defaultMessage: '订单数量' }),
      dataIndex: 'quantity',
    },
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.price', defaultMessage: '单价' }),
      dataIndex: 'price',
      render: (text) => `${translate('web.common.currencySymbol')} ${text}`,
    },
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.amount', defaultMessage: '金额' }),
      dataIndex: 'amount',
      render: (text) => `${translate('web.common.currencySymbol')} ${text}`,
    },
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.returnCount', defaultMessage: '已退货数量' }),
      dataIndex: 'returnCount',
    },
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.returnAmount', defaultMessage: '已退款金额' }),
      dataIndex: 'returnAmount',
    },
  ]

  // 根据供应会员获取订单列表
  const getOrderList = (params): Promise<OrderListRes> => {
    const supplierMemberValue = addSchemaAction.getFieldValue('supplierMember')
    const { startDate = null, endDate = null } = params
    const payload = { ...params }

    if (startDate) {
      payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
    }
    if (endDate) {
      payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
    }

    return new Promise((resolve, reject) => {
      getOrderCommonAfterSalePage({
        ...payload,
        vendorMemberId: supplierMemberValue[0].memberId,
        vendorRoleId: supplierMemberValue[0].roleId,
        orderType: orderTypeValue,
        afterSalesType: 3, // 退货
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

  // 获取退货申请详情
  const getDetailInfo = () => {
    if (!id) {
      return
    }
    setInfoLoading(true)
    getAftersalesReturnGoodsGetDetailByConsumer({
      returnId: id,
    })
      .then((res) => {
        if (res.code === 1000) {
          const {
            returnGoodsAddress,
            faultFileList,
            supplierName,
            parentMemberId,
            parentMemberRoleId,

            evaluate,
            goodsDetailList,
            innerRecordList,
            innerTaskList,
            manualReturnGoodsAddress,
            returnDeliveryGoodsList,
            returnStatisticsList,
            taskTypeKey,
            consumerName,
            outerRecordList,
            outerTaskList,
            returnBatch,
            returnId,
            roleId,
            refundList,
            shopName,
            shopId,
            shopLogo,
            agentFlag,
            ...rest
          } = res.data

          addSchemaAction.setFieldState('*(supplierMember)', (state) => {
            state.props['x-component-props'].disabled = true
          })

          addSchemaAction.setFieldState('*(shippingAddress,pickupAddress)', (state) => {
            // 非代客申请 echo 设置成 false
            state.props['x-component-props'].echo = agentFlag === 0 ? false : true
          })

          setDetailInfo({
            proofFileList: faultFileList.map((item) => normalizeFiledata(item.filePath, item.fileName)),
            // 物流
            shippingAddress:
              returnGoodsAddress.deliveryType === 1
                ? {
                    fullAddress: returnGoodsAddress.sendAddress,
                    id: returnGoodsAddress.sendId,
                    phone: returnGoodsAddress.sendUserTel,
                    name: returnGoodsAddress.sendUserName,
                  }
                : undefined,
            // 自提
            pickupAddress:
              returnGoodsAddress.deliveryType === 2
                ? {
                    fullAddress: returnGoodsAddress.sendAddress,
                    id: returnGoodsAddress.sendId,
                    phone: returnGoodsAddress.sendUserTel,
                    name: returnGoodsAddress.sendUserName,
                  }
                : undefined,
            deliveryType: returnGoodsAddress.deliveryType,
            supplierMember: supplierName
              ? [
                  {
                    name: supplierName,
                    memberId: parentMemberId,
                    roleId: parentMemberRoleId,
                  },
                ]
              : [],
            returnGoodsList: goodsDetailList.map((item) => ({
              ...item,
              extraData: {
                returnReason: item.returnReason,
                payList: item.payList || [],
                id: item.orderRecordId,
                taskTypeKey,
                orderId: item.orderId,
                remaining: item.purchaseCount || 0, // 可退货数量，这里取 采购数量判断即可
              },
              associated: !item.associatedProductId
                ? ''
                : `${item.associatedProductId}/${item.associatedProductName}/${item.associatedType || ' '}/${
                    item.associatedCategory
                  }/${item.associatedBrand}`,
              shopId,
              shopLogo,
              shopName,
            })),
            ...rest,
          })

          setOrderTypeValue(rest.orderType)
          setGoodsValue(goodsDetailList.map((item) => item.orderRecordId))
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  // 获取订单详情
  const getOrderDetailInfo = () => {
    if (!orderId) {
      return
    }
    setInfoLoading(true)
    getOrderBuyerDetail({
      orderId: `${orderId}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { vendorMemberName, vendorMemberId, vendorRoleId, orderNo } = res.data

          addSchemaAction.setFieldState('*(supplierMember)', (state) => {
            state.props['x-component-props'].disabled = true
          })

          setDetailInfo({
            applyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            supplierMember: vendorMemberName
              ? [
                  {
                    name: vendorMemberName,
                    memberId: vendorMemberId,
                    roleId: vendorRoleId,
                  },
                ]
              : [],
            orderNo,
            orderType: +outerOrderType,
          })
          setOrderTypeValue(+outerOrderType)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  // 质检单生成售后
  const getQualityOrderProduct = () => {
    if (outerOrderType && !id && !orderId) {
      const {
        qualityOrderProductVOS,
        sourceId,
        sourceType,
        supplierMemberId,
        supplierMemberName,
        supplierRoleId,
      }: any = GENERATE_QUALITY_AFTERSALE
      addSchemaAction.setFieldState('*(supplierMember)', (state) => {
        state.props['x-component-props'].disabled = true
      })

      setDetailInfo({
        applyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        supplierMember: supplierMemberName
          ? [
              {
                name: supplierMemberName,
                memberId: supplierMemberId,
                roleId: supplierRoleId,
              },
            ]
          : [],
        sourceId,
        sourceType,
        returnGoodsList: qualityOrderProductVOS.map((_item) => ({
          orderRecordId: _item.orderProductId,
          orderNo: _item.orderNo,
          type: _item.type,
          skuId: _item.skuId,
          productId: _item.productId,
          productName: _item.productName,
          category: _item.category,
          brand: _item.brand,
          unit: _item.unit,
          returnCount: _item.rejectCount,
          purchaseCount: _item.receiveCount,
          purchaseAmount: +(_item.purchasePrice * _item.receiveCount),
          isHasTax: _item?.isHasTax,
          taxRate: _item?.taxRate,
          purchasePrice: _item?.purchasePrice,
          orderId: _item?.orderId,
          refundAmount: undefined,
          payAmount: +(_item.purchasePrice * _item.receiveCount),
          extraData: {
            returnReason: _item.returnReason,
            payList: _item.payList || [],
            id: _item.orderProductId,
            orderId: _item.orderId,
            remaining: _item.rejectCount || 0, // 可退货数量，这里取 采购数量判断即可
          },
        })),
        orderType: +outerOrderType,
      })
      setOrderTypeValue(+outerOrderType)
    }
  }

  useEffect(() => {
    getDetailInfo()
    getOrderDetailInfo()
    getQualityOrderProduct()
  }, [])

  const handleAddGoods = () => {
    const supplierMemberVal = addSchemaAction.getFieldValue('supplierMember')
    const orderTypeVal = addSchemaAction.getFieldValue('orderType')

    if (!supplierMemberVal || !supplierMemberVal.length) {
      message.error(
        intl.formatMessage({ id: 'afterService.apply.supplierMember.nothing', defaultMessage: '请先选择供应会员' }),
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
    <Button
      icon={<PlusOutlined />}
      onClick={handleAddGoods}
      type="dashed"
      disabled={!isEdit || detailInfo?.sourceType === ZHIJIANDAN}
      block
    >
      {!isMateriel
        ? intl.formatMessage({ id: 'afterService.apply.product.add.refund.normal', defaultMessage: '选择退货商品' })
        : intl.formatMessage({ id: 'afterService.apply.product.add.refund.material', defaultMessage: '选择退货物料' })}
    </Button>
  )

  const handleSubmit = (values) => {
    const {
      supplierMember,
      deliveryType,
      shippingAddress = {},
      pickupAddress = {},
      deliveryAddress = {},
      proofFileList = [],
      returnGoodsList = [],

      outerStatus,
      outerStatusName,
      innerStatus,
      innerStatusName,
      applyNo,
      applyTime,
      refundList,
      ...rest
    } = values
    setSubmitLoading(true)

    const payload = {
      ...rest,
      returnId: +id || 0,
      supplierMemberId: supplierMember[0].memberId,
      supplierRoleId: supplierMember[0].roleId,
      supplierMemberName: supplierMember[0].name,
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
      returnGoodsList: returnGoodsList.map(
        ({
          id,
          brand,
          unit,
          extraData,
          needReturnName,
          isNeedReturn,
          associated,
          returnCount,
          refundAmount,
          shopId,
          shopLogo,
          shopName,
          ...rest
        }) => ({
          ...rest,
          brand: brand || '',
          unit: unit || '',
          orderRecordId: extraData.id,
          returnReason: extraData.returnReason,
          returnCount: +returnCount,
          payList: extraData.payList.map((item) => {
            const { channelName, payTime, payWayName, ...payItemRest } = item
            return {
              ...payItemRest,
              payTime: +new Date(payTime),
            }
          }),
        }),
      ),
      taskTypeKey: returnGoodsList[0].extraData.taskTypeKey,
      shopId: returnGoodsList[0].shopId,
      shopLogo: returnGoodsList[0].shopLogo,
      shopName: returnGoodsList[0].shopName,
    }

    postAftersalesReturnGoodsSave(payload)
      .then((res) => {
        if (res.code === 1000) {
          setUnsaved(false)
          setTimeout(() => {
            if (GENERATE_QUALITY_AFTERSALE) {
              localStorage.removeItem('GENERATE_QUALITY_AFTERSALE')
            }
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
    const newValue = [...addSchemaAction.getFieldValue('returnGoodsList')]

    const deleted = newValue.splice(index, 1)
    addSchemaAction.setFieldValue('returnGoodsList', newValue)
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
        onClick={() => handleEditReturnGood(index)}
        style={{
          marginRight: 20,
        }}
      >
        {intl.formatMessage({ id: 'afterService.common.edit', defaultMessage: '编辑' })}
      </a>
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
    const preValues = addSchemaAction.getFieldValue('returnGoodsList')
    const value = []

    values.forEach((item) => {
      const atom = {
        id: item.id,
        orderId: item.orderId,
        orderNo: item.orderNo,
        productId: item.productNo,
        productName: `${item.name}${item.spec ? `/${item.spec}` : ''}`,
        category: item.category,
        brand: item.brand,
        unit: item.unit,
        purchasePrice: item.price,
        purchaseCount: item.quantity,
        purchaseAmount: +(item.price * item.quantity).toFixed(2),
        payAmount: item.paidAmount,
        type: item.spec,
        returnCount: '',
        refundAmount: undefined,
        extraData: {
          id: item.id,
          returnReason: '',
          taskTypeKey: item.processKey,
          remaining: new BigNumber(item.quantity).minus(item.returnCount || 0).toFixed(3), // 可退货数量
          orderId: item.orderId,
        },
        isHasTax: item.tax,
        taxRate: item.taxRate,
        contractId: item.contractId,
        contractNo: item.contractNo,
        associated: !isMateriel
          ? ''
          : `${item.quotedProductNo}/${item.quotedName}/${item.quotedSpec || ' '}/${item.quotedCategory}/${
              item.quotedBrand
            }`,
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
    addSchemaAction.setFieldValue('returnGoodsList', newData)
  }

  const handleGoodsChange = (values) => {
    setGoodsValue(values)
  }

  const handleEditReturnGood = (index) => {
    const { getFieldValue } = addSchemaAction
    const returnGoodsListValue = getFieldValue('returnGoodsList')
    const item = returnGoodsListValue[index]
    const { extraData, ...rest } = item

    setApplyInfo({
      index,
      ...rest,
      payList: extraData.payList,
      remaining: extraData.remaining,
      returnReason: extraData.returnReason,
      orderType: orderTypeValue,
    })
    setVisibleReturnInfoDrawer(true)
  }

  const handleReturnInfoSubmit = (values) => {
    const { getFieldValue, setFieldValue, setFieldState } = addSchemaAction
    const { index } = applyInfo
    const newData = [...getFieldValue('returnGoodsList')]
    newData.splice(index, 1, {
      ...newData[index],
      returnCount: values.returnCount,
      refundAmount: values.refundAmount,
      extraData: {
        ...newData[index].extraData,
        returnReason: values.returnReason,
        payList: values.payList,
      },
    })
    setFieldValue('returnGoodsList', newData)
    addSchemaAction.clearErrors(`returnGoodsList.${index}.returnCount`)
    addSchemaAction.clearErrors(`returnGoodsList.${index}.refundAmount`)
    setVisibleReturnInfoDrawer(false)
  }

  const OuterStatus = (
    <StatusTag type={RETURN_OUTER_STATUS_TAG_MAP[detailInfo?.outerStatus]} title={detailInfo?.outerStatusName} />
  )

  const InnerStatus = (
    <Badge color={RETURN_INNER_STATUS_BADGE_MAP[detailInfo?.innerStatus]} text={detailInfo?.innerStatusName} />
  )

  const schemaValue = useMemo(() => addSchema(orderTypeValue), [orderTypeValue])

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        title={
          !id
            ? intl.formatMessage({ id: 'returnApplication.returnPrSubmit.add', defaultMessage: '新建退货申请单' })
            : isEdit
            ? intl.formatMessage({ id: 'returnApplication.returnPrSubmit.edit', defaultMessage: '编辑退货申请单' })
            : intl.formatMessage({ id: 'returnApplication.returnPrSubmit.check', defaultMessage: '查看退货申请单' })
        }
        extra={
          isEdit || !id
            ? [
                <Button
                  key="1"
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={submitLoading}
                  onClick={() => addSchemaAction.submit()}
                >
                  {intl.formatMessage({ id: 'afterService.apply.save', defaultMessage: '保存' })}
                </Button>,
              ]
            : []
        }
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
            }}
            components={{
              ArrayTable,
              OrderNo,
            }}
            editable={isEdit || !id}
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
                if (!id && isEdit) {
                  setFieldState('*(applyNo,outerStatus,innerStatus)', (field) => {
                    field.visible = false
                  })
                }

                if (outerOrderType) {
                  setFieldState('orderType', (field) => {
                    field.editable = false
                    // field.value = +outerOrderType;
                  })
                }

                if (id) {
                  addSchemaAction.setFieldState('*(shippingAddress,pickupAddress)', (state) => {
                    state.props['x-component-props'].isDefaultAddress = false
                  })

                  addSchemaAction.setFieldState('orderType', (state) => {
                    state.editable = false
                  })
                }
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
                  id: 'afterService.apply.product.add.refund.normal',
                  defaultMessage: '选择退货商品',
                })
              : intl.formatMessage({
                  id: 'afterService.apply.product.add.refund.material',
                  defaultMessage: '选择退货物料',
                })
          }
          afterType={3}
          visible={visibleGoodsDrawer}
          fetchOrderList={getOrderList}
          onClose={() => setVisibleGoodsDrawer(false)}
          onConfirm={handleGoodsConfirm}
          checked={goodsValue}
          onChange={handleGoodsChange}
          nestProps={{
            NestColumns: [tableColumn, childTableColumn],
          }}
          searchable={!orderId}
          orderType={orderTypeValue}
        />

        <ReturnInfoDrawer
          visible={visibleReturnInfoDrawer}
          applyInfo={applyInfo}
          onClose={() => setVisibleReturnInfoDrawer(false)}
          onSubmit={handleReturnInfoSubmit}
          isEdit={isEdit}
        />
      </PageHeaderWrapper>
    </Spin>
  )
}

export default ReturnForm
