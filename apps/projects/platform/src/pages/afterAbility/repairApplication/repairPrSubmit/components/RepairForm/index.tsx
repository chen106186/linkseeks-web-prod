import React, { useState, useEffect, useMemo } from 'react'
import { Button, Card, Spin, Badge, message, Upload } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { DeleteOutlined } from '@ant-design/icons'
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
import { createFormActions, FormEffectHooks } from '@apps/formily'
import {
  getAftersalesRepairGoodsGetDetailByConsumer,
  getAftersalesRepairGoodsPageRepairGoods,
  GetAftersalesRepairGoodsPageRepairGoodsResponseDetail,
  postAftersalesRepairGoodsSave,
} from '@apps/apis'
import { getOrderBuyerDetail, getOrderCommonAfterSalePage } from '@apps/apis'
import { normalizeFiledata, FileData, isJSONStr } from '@/utils'
import ReturnEle from '@/components/ReturnEle'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import GoodsDrawer from '../../../../components/GoodsDrawer'
import { OrderListRes } from '../../../../components/GoodsDrawer/interface'
import { addSchema } from './schema'
import { createEffects } from './effects'
import { REPAIR_OUTER_STATUS_TAG_MAP, REPAIR_INNER_STATUS_BADGE_MAP } from '../../../../constants'
import { isMaterialOrder } from '../../../../utils'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { fetchOrderTypes } from '@/pages/orderAbility/utils/orderTypes'

/** 质检单 */
const ZHIJIANDAN = 1

const addSchemaAction = createFormActions()
const { onFormInputChange$, onFieldInputChange$, onFormInit$ } = FormEffectHooks

interface DetailInfo {
  applyTime: string
  faultFileList?: FileData[]
  repairAddress?: { [key: string]: any }[]
  supplierMember?: {}
  outerStatus?: number
  outerStatusName?: string
  innerStatus?: number
  innerStatusName?: string
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
  repairGoodsList?: any[]
}

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

interface OrderNoProps {
  value: any
}

const OrderNo = (props: OrderNoProps) => {
  const { value } = props
  return (
    <a href={`/afterAbility/repairApplication/repairPrSubmit/orderDetail?orderNo=${value}`} target="_blank">
      {value}
    </a>
  )
}
OrderNo.isFieldComponent = true

type ExtraType = {
  /**
   * 商城名称
   */
  shopName: string
  /**
   * 商城id
   */
  shopId: number
  /**
   * 商城logo
   */
  shopLogo: string
}

const RepairForm: React.FC<BillsFormProps> = ({ id, isEdit = false, orderId, orderType: outerOrderType }) => {
  const [detailInfo, setDetailInfo] = useState<DetailInfo>({
    applyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
  })
  const [repairGoodsList, setRepairGoodsList] = useState<GetAftersalesRepairGoodsPageRepairGoodsResponseDetail[]>([])
  const [unsaved, setUnsaved] = useState(false)

  const [infoLoading, setInfoLoading] = useState(false)
  const [repairGoodsLoading, setRepairGoodsLoading] = useState(false)
  const [goodsValue, setGoodsValue] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [visibleDrawer, setVisibleDrawer] = useState(false)
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
      title: intl.formatMessage({ id: 'afterService.order.query.column.maintainCount', defaultMessage: '已维修数量' }),
      dataIndex: 'maintainCount',
    },
  ]

  // 获取维修明细列表
  const getRepairGoods = (extra: ExtraType) => {
    if (!id) {
      return
    }
    setRepairGoodsLoading(true)
    getAftersalesRepairGoodsPageRepairGoods({
      repairId: id,
      current: `${1}`,
      pageSize: `${99999}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          setRepairGoodsList(
            res.data.data.map((item) => ({
              ...item,
              extraData: {
                id: item.orderRecordId,
                orderId: item.orderId,
                remaining: item.purchaseCount || 0, // 已维修数量，这里取 采购数量判断即可
              },
              associated: !item.associatedProductId
                ? ''
                : `${item.associatedProductId}/${item.associatedProductName}/${item.associatedType || ' '}/${
                    item.associatedCategory
                  }/${item.associatedBrand}`,
              ...extra,
            })),
          )
          setGoodsValue(res.data && res.data.data ? res.data.data.map((item) => item.orderRecordId) : [])
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setRepairGoodsLoading(false)
      })
  }

  // 获取维修申请详情
  const getDetailInfo = () => {
    if (!id) {
      return
    }
    setInfoLoading(true)
    getAftersalesRepairGoodsGetDetailByConsumer({
      repairId: id,
    })
      .then((res) => {
        if (res.code === 1000) {
          const {
            repairAddress,
            faultFileList,
            supplierName,
            parentMemberId,
            parentMemberRoleId,
            applyId,
            consumerName,
            evaluate,
            innerRecordList,
            innerTaskList,
            outerRecordList,
            outerStatus,
            outerTaskList,
            shopName,
            shopId,
            shopLogo,
            agentFlag,
            ...rest
          } = res.data

          addSchemaAction.setFieldState('*(supplierMember)', (state) => {
            state.props['x-component-props'].disabled = true
          })

          addSchemaAction.setFieldState('repairAddress', (state) => {
            // 非代客申请 echo 设置成 false
            state.props['x-component-props'].echo = agentFlag === 0 ? false : true
          })

          getRepairGoods({
            shopName,
            shopId,
            shopLogo,
          })

          setOrderTypeValue(rest.orderType)
          const formInfo = {
            ...detailInfo,
            faultFileList: faultFileList ? faultFileList.map((item) => normalizeFiledata(item.filePath)) : [],
            repairAddress: isJSONStr(repairAddress) || null,
            supplierMember: supplierName
              ? [
                  {
                    name: supplierName,
                    memberId: parentMemberId,
                    roleId: parentMemberRoleId,
                  },
                ]
              : [],
            ...rest,
          }
          setDetailInfo(formInfo)
        }
      })
      .catch((err) => {
        console.warn(err, 'errr')
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
    } as any)
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
        afterSalesType: 4, // 维修
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
        orderType: +outerOrderType,
      })
      setRepairGoodsList(
        qualityOrderProductVOS.map((_item) => ({
          orderRecordId: _item.orderProductId,
          orderNo: _item.orderNo,
          type: _item.type,
          skuId: _item.skuId,
          productId: _item.productId,
          productName: _item.productName,
          category: _item.category,
          brand: _item.brand,
          unit: _item.unit,
          repairCount: _item.rejectCount,
          purchaseCount: _item.receiveCount,
          isHasTax: _item?.isHasTax,
          taxRate: _item?.taxRate,
          // purchasePrice: _item?.purchasePrice,
          orderId: _item?.orderId,
          extraData: {
            id: _item.orderProductId,
            orderId: _item.orderId,
            remaining: _item.receiveCount || 0,
          },
        })),
      )
      setOrderTypeValue(+outerOrderType)
      console.log(outerOrderType)
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
    setVisibleDrawer(true)
  }

  const TableAddButton = (
    <Button
      icon={<PlusOutlined />}
      onClick={handleAddGoods}
      disabled={!isEdit || !!id || detailInfo?.sourceType === ZHIJIANDAN}
      type="dashed"
      block
    >
      {!isMateriel
        ? intl.formatMessage({ id: 'afterService.apply.product.add.repair.normal', defaultMessage: '选择维修商品' })
        : intl.formatMessage({ id: 'afterService.apply.product.add.repair.material', defaultMessage: '选择维修物料' })}
    </Button>
  )

  const handleSubmit = (values) => {
    const {
      supplierMember,
      faultFileList = [],
      repairGoodsList,
      repairAddress,
      orderNo,
      applyNo,
      applyTime,
      innerStatusName,
      outerStatusName,
      ...rest
    } = values

    setSubmitLoading(true)
    const payload = {
      repairId: +id || 0, // 有 id 表示编辑，0表示新增
      supplierMemberId: supplierMember[0].memberId,
      supplierRoleId: supplierMember[0].roleId,
      supplierName: supplierMember[0].name,
      repairAddress: repairAddress ? JSON.stringify(repairAddress) : '',
      faultFileList: faultFileList
        .filter((item) => item.status === 'done')
        .map((item) => ({
          fileName: item.name,
          filePath: item.url,
        })),
      repairGoodsList: repairGoodsList.map(
        ({ repairCount, brand, unit, extraData, associated, shopId, shopLogo, shopName, ...rest }) => ({
          orderId: extraData.orderId,
          orderRecordId: extraData.id,
          repairCount: +repairCount,
          brand: brand || '',
          unit: unit || '',
          ...rest,
        }),
      ),
      ...rest,
      shopId: repairGoodsList[0].shopId,
      shopLogo: repairGoodsList[0].shopLogo,
      shopName: repairGoodsList[0].shopName,
    }

    postAftersalesRepairGoodsSave(payload)
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

  // 删除维修商品项
  const handleRemoveItem = (index: number) => {
    const newGoodsValue = [...goodsValue]
    const newValue = [...addSchemaAction.getFieldValue('repairGoodsList')]

    const deleted = newValue.splice(index, 1)
    addSchemaAction.setFieldValue('repairGoodsList', newValue)
    newGoodsValue.splice(
      newGoodsValue.findIndex((item) => item === deleted[0].id),
      1,
    )
    setGoodsValue(newGoodsValue)
  }

  // ArrayTable自定义渲染
  const renderListTableRemove = (index: number) => (
    <Button shape="circle" icon={<DeleteOutlined />} onClick={() => handleRemoveItem(index)} />
  )

  const beforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 20) {
      message.warning(intl.formatMessage({ id: 'afterService.apply.upload.legal', defaultMessage: '图片大小超过20M' }))
      return Upload.LIST_IGNORE
    }
    return Promise.resolve()
  }

  const handleGoodsConfirm = (values) => {
    const preValues = addSchemaAction.getFieldValue('repairGoodsList')
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
        purchaseCount: item.quantity,
        purchasePrice: item.price,
        type: item.spec,
        repairReason: '',
        extraData: {
          id: item.id,
          orderId: item.orderId,
          remaining: item.purchaseCount - (item.repairCount || 0), // 可维修数量
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
    addSchemaAction.setFieldValue('repairGoodsList', newData)
  }

  const handleGoodsChange = (values) => {
    setGoodsValue(values)
  }

  const OuterStatus = (
    <StatusTag type={REPAIR_OUTER_STATUS_TAG_MAP[detailInfo?.outerStatus]} title={detailInfo?.outerStatusName} />
  )

  const InnerStatus = (
    <Badge color={REPAIR_INNER_STATUS_BADGE_MAP[detailInfo?.innerStatus]} text={detailInfo?.innerStatusName} />
  )

  const schemaValue = useMemo(() => addSchema(orderTypeValue), [orderTypeValue])

  return (
    <Spin spinning={infoLoading || repairGoodsLoading}>
      <PageHeaderWrapper
        title={
          !id
            ? intl.formatMessage({ id: 'repairApplication.repairPrSubmit.add', defaultMessage: '新建维修申请单' })
            : isEdit
            ? intl.formatMessage({ id: 'repairApplication.repairPrSubmit.edit', defaultMessage: '编辑维修申请单' })
            : intl.formatMessage({ id: 'repairApplication.repairPrSubmit.check', defaultMessage: '查看维修申请单' })
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
            value={{
              ...detailInfo,
              repairGoodsList: repairGoodsList,
            }}
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

                if (id) {
                  addSchemaAction.setFieldState('repairAddress', (state) => {
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
                  id: 'afterService.apply.product.add.repair.normal',
                  defaultMessage: '选择维修商品',
                })
              : intl.formatMessage({
                  id: 'afterService.apply.product.add.repair.material',
                  defaultMessage: '选择维修物料',
                })
          }
          afterType={4}
          visible={visibleDrawer}
          fetchOrderList={getOrderList}
          onClose={() => setVisibleDrawer(false)}
          onConfirm={handleGoodsConfirm}
          checked={goodsValue}
          onChange={handleGoodsChange}
          nestProps={{
            NestColumns: [tableColumn, childTableColumn],
          }}
          searchable={!orderId}
          orderType={orderTypeValue}
        />
      </PageHeaderWrapper>
    </Spin>
  )
}

export default RepairForm
