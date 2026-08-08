/*
 * @Author: XieZhiXiong
 * @Date: 2021-12-03 09:54:46
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 10:41:53
 * @Description: 代客维修申请
 */
import React, { useState, useMemo } from 'react'
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
import { debounce, findLastIndex } from 'lodash'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined, PlusOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { GetAftersalesRepairGoodsPageRepairGoodsResponseDetail, postAftersalesRepairGoodsAgentSave } from '@apps/apis'
import { getOrderCommonAgentAfterSalePage } from '@apps/apis'
import { getMemberManageOrderAgentMembers, GetMemberManageOrderAgentMembersResponse } from '@apps/apis'
import { FileData } from '@/utils'
import { authService } from '@apps/services'
import { ORDER_TYPE_STORE_PURCHASE } from '@/constants/order'
import ReturnEle from '@/components/ReturnEle'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import GoodsDrawer from '../../components/GoodsDrawer'
import { OrderListRes } from '../../components/GoodsDrawer/interface'
import { addSchema } from './schema'
import { createEffects } from './effects'
import { REPAIR_OUTER_STATUS_TAG_MAP, REPAIR_INNER_STATUS_BADGE_MAP } from '../../constants'
import { isMaterialOrder } from '../../utils'
import { AuthButton } from '@apps/components'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { fetchOrderTypes } from '@/pages/orderAbility/utils/orderTypes'

const addSchemaAction = createFormActions()
const { onFormInputChange$, onFieldInputChange$, onFieldValueChange$, onFormInit$ } = FormEffectHooks

interface DetailInfo {
  applyTime: string
  faultFileList?: FileData[]
  repairAddress?: { [key: string]: any }[]
  supplierMember?: {}
  outerStatus?: number
  outerStatusName?: string
  innerStatus?: number
  innerStatusName?: string
  /**
   * 订单编号
   */
  orderNo?: string
  /**
   * 订单类型
   */
  orderType?: number
}

interface BillsFormProps {}

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

const RepairValetApply: React.FC<BillsFormProps> = () => {
  const [detailInfo] = useState<DetailInfo>({
    applyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    orderType: ORDER_TYPE_STORE_PURCHASE,
  })
  const [repairGoodsList] = useState<GetAftersalesRepairGoodsPageRepairGoodsResponseDetail[]>([])
  const [unsaved, setUnsaved] = useState(false)

  const [goodsValue, setGoodsValue] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [orderTypeValue, setOrderTypeValue] = useState(ORDER_TYPE_STORE_PURCHASE)

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
          render: (text, record) => `${text}/${record.spec}`,
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
    setVisibleDrawer(true)
  }

  const TableAddButton = (
    <Button icon={<PlusOutlined />} onClick={handleAddGoods} type="dashed" block>
      {!isMateriel
        ? intl.formatMessage({ id: 'afterService.apply.product.add.repair.normal', defaultMessage: '选择维修商品' })
        : intl.formatMessage({ id: 'afterService.apply.product.add.repair.material', defaultMessage: '选择维修物料' })}
    </Button>
  )

  const handleSubmit = (values) => {
    const {
      purchaser,
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

    const purchaserOriginData: GetMemberManageOrderAgentMembersResponse = addSchemaAction.getFieldState(
      'purchaser',
      (fieldState) => fieldState.originData,
    )
    const current = purchaserOriginData.find((item) => item.id === purchaser)

    const userInfo = authService.getAuth()

    const payload = {
      repairId: 0, // 有 id 表示编辑，0表示新增
      memberId: current.memberId,
      memberRoleId: current.roleId,
      company: current.name,
      supplierMemberId: userInfo.memberId,
      supplierRoleId: userInfo.memberRoleId,
      supplierName: userInfo.memberName,
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

    postAftersalesRepairGoodsAgentSave(payload)
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
        type: item.type,
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
    <StatusTag type={REPAIR_OUTER_STATUS_TAG_MAP[detailInfo?.outerStatus]} title={detailInfo?.outerStatusName} />
  )

  const InnerStatus = (
    <Badge color={REPAIR_INNER_STATUS_BADGE_MAP[detailInfo?.innerStatus]} text={detailInfo?.innerStatusName} />
  )

  const schemaValue = useMemo(() => addSchema(orderTypeValue), [orderTypeValue])

  return (
    <Spin spinning={false}>
      <PageHeaderWrapper
        title={intl.formatMessage({ id: 'repairManage.repairValetApply.vale', defaultMessage: '代客维修申请' })}
        extra={[
          <AuthButton type="custom" code="save">
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

              onFieldValueChange$('purchaser').subscribe((fieldState) => {
                const purchaserValue = fieldState.value
                const current = fieldState.originData.find((item) => item.id === purchaserValue)
                if (current) {
                  setFieldState('repairAddress', (field) => {
                    field.visible = true
                    field.props['x-component-props'] = {
                      ...field.props['x-component-props'],
                      params: {
                        memberId: current.memberId,
                        roleId: current.roleId,
                      },
                    }
                  })
                }
              })

              onFormInit$().subscribe(() => {
                setFieldState('*(applyNo,outerStatus,innerStatus)', (field) => {
                  field.visible = false
                })
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
          orderType={orderTypeValue}
        />
      </PageHeaderWrapper>
    </Spin>
  )
}

export default RepairValetApply
