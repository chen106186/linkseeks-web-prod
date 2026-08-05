import React, { useContext, useRef, useEffect, useState, useMemo } from 'react'
import { Button, Drawer, message, Modal } from 'antd'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { OrderDetailContext } from '../../_public/order/context'
import moment from 'moment'
import { useProductTable } from './model/useProductTable'
import { OrderKindType } from '@/constants/order'
import { schema } from './constant/indexx'
import { getOrderVendorValidateDeliveryProduct, postOrderVendorValidateDeliveryConfirm } from '@apps/apis'
import { getLogisticsSelectListCompany, getLogisticsSelectListShipperAddress } from '@apps/apis'
import {
  getProductSelectGetWarehouse,
  postProductFreightGetInventoryPattern,
  postProductInventoryGetWarehouseDistributableInventory,
} from '@apps/apis'

export interface OrderHandDeleveModalProps {
  currentRef?: any
  fahuoList?: Array<any>
}
const intl = getIntl()
const schemaActions = createFormActions()

const OrderHandDeleveModal: React.FC<OrderHandDeleveModalProps> = (props) => {
  // 获取订单上下文，兼容两种使用方式
  // const context = useContext(OrderDetailContext)
  // let orderKind = 0
  // try {
  //   orderKind = context?.formContext?.data?.orderKind || props.orderKind || 0
  // } catch (error) {
  //   orderKind = props.orderKind || 0
  // }

  // const contractOrder = orderKind === OrderKindType.SRM_ORDER
  const dataRef = useRef<any>({})
  const { currentRef, orderNo, onClose, onSuccess, onCancel, visible: propsVisible } = props
  const [visible, setVisible] = useState<boolean>(propsVisible || false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isInventory, setIsInventory] = useState<boolean>(false)
  const [warehouseOptions, setWarehouseOptions] = useState<any>([])
  const [outOfStockId, setOutOfStockId] = useState<number>()
  // const { productColumns, productComponents } = useProductTable(schemaActions, contractOrder)

  // 优化 _productColumns 计算逻辑
  const _productColumns = useMemo(() => {
    // if (!productColumns) return []
    // return productColumns.filter((item) => {
    //   if (item.isInventory === undefined) {
    //     return true
    //   }
    //   return item.isInventory === isInventory
    // })
  }, [])

  // 兼容原有的 currentRef 使用方式
  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        visible,
        setVisible,
      }
    }
  }, [visible, currentRef])

  // 监听 propsVisible 变化
  useEffect(() => {
    if (propsVisible !== undefined) {
      setVisible(propsVisible)
    }
  }, [propsVisible])

  // 弹窗打开时初始化数据
  useEffect(() => {
    if (visible) {
      // initData()
    }
  }, [visible])

  // 提取初始化数据逻辑
  const initData = (row) => {
    return new Promise(async (resolve, reject) => {
      try {
        const orderId = row.orderId
        const res = await getOrderVendorValidateDeliveryProduct(
          { orderId, deliveryNo: null },
          { penetrateError: true },
          { ctlType: 'none' },
        )
        message.destroy()
        const { code }: any = res
        const _data = res.data
        if (code === 1000) {
          // 获取库存模式
          const _res = await postProductFreightGetInventoryPattern(
            { idList: _data.map((item) => item.skuId) },
            { ctlType: 'none' },
          )
          message.destroy()

          if (_res.code === 1000) {
            // 包含true就代表开启同步物料库存
            const _flag = _res.data.some((_item) => _item.isInventory)
            // setIsInventory(_flag)
            row.isInventory = _flag
            // schemaActions.setFieldState('outOfStockId', (state) => {
            //   state.visible = _flag
            // })
          }
          row.products = _data.map((item) => ({ ...item, deliveryCount: item.leftCount }))
          // schemaActions.setFieldValue(
          //   'products',
          //   _data.map((item) => ({ ...item, deliveryCount: item.leftCount })),
          // )
          resolve(row)
        } else {
          message.error(res.message)
        }
      } catch (error) {
        message.error('初始化数据失败')
      }
    })
  }

  // 仓库库存查询
  useEffect(() => {
    if (outOfStockId) {
      const _products = schemaActions.getFieldValue('products')
      const _materielIdList = _products.map((item) => item.productId).filter((item) => item !== null)

      if (_materielIdList.length > 0) {
        postProductInventoryGetWarehouseDistributableInventory(
          {
            warehouseId: outOfStockId,
            materielIdList: _materielIdList,
          },
          { ctlType: 'none' },
        ).then((res) => {
          message.destroy()
          if (res.code === 1000) {
            const _list = _products.map((item) => {
              const _obj = { ...item }
              const _distributableInventory =
                res.data.find((_item) => _item.goodsId === item.productId)?.distributableInventory ?? 0
              _obj.availableForDeliveryQuantity = _distributableInventory
              return _obj
            })
            schemaActions.setFieldValue('products', _list)
          }
        })
      }
    }
  }, [outOfStockId])
  const s = (row, value) => {
    return new Promise(async (resolve) => {
      const params = {
        ...value,
        addressId: value.addressId?.id,
        address: value.addressId?.fullAddress,
        orderId: row.orderId,
        deliveryTime: moment(value.deliveryTime).format('YYYY-MM-DD HH:mm:ss'),
      }

      const products: any[] = []
      for (const item of row.products || []) {
        const _obj: Record<string, any> = {
          orderProductId: item.orderProductId,
          relationId: item.relationId,
          deliveryCount: Number(item.deliveryCount),
        }

        if (Number(item.deliveryCount) > 0) {
          if (item.orderKind != OrderKindType.SRM_ORDER && isInventory) {
            _obj.outOfStockOrderProductDetailVO = {
              goodsId: item.productId,
              skuId: item.skuId,
              name: item.name,
              category: item.category,
              brand: item.brand,
              unit: item.unit,
              spec: item.spec,
              outOfStockId: value.outOfStockId,
              warehouseRole: value.warehouseAdminName,
              received: item.deliveryCount,
            }
          }
          products.push(_obj)
        }
      }

      params.products = products

      try {
        setLoading(true)
        const { code } = await postOrderVendorValidateDeliveryConfirm(params, { ctlType: 'none' })
        message.destroy()
        if (code === 1000) {
          resolve()
        } else {
          setLoading(false)
        }
      } catch (error) {
        message.error('发货失败')
        setLoading(false)
      }
    })
  }
  const handleSubmit = async (value) => {
    await Promise.all(
      props.fahuoList.map((item) => {
        return new Promise<void>(async (resolve) => {
          await initData(item)
          await s(item, value)
          resolve()
        })
      }),
    )
    setLoading(false)
    message.success('发货成功')
    handleClose()
    onSuccess?.()
  }

  const handleConfirm = () => {
    schemaActions.submit()
  }

  const handleClose = () => {
    setVisible(false)
    schemaActions.reset()
    onClose?.()
  }

  const handleCancel = () => {
    setVisible(false)
    schemaActions.reset()
    onCancel?.()
  }

  const footer = (
    <div
      style={{
        textAlign: 'right',
      }}
    >
      <Button onClick={handleConfirm} type="primary" loading={loading} style={{ marginRight: 8 }}>
        {intl.formatMessage({ id: 'transaction_components.queding' })}
      </Button>
      <Button onClick={handleCancel}>{intl.formatMessage({ id: 'transaction_components.quxiao' })}</Button>
    </div>
  )

  // 获取下单仓库
  const fetchWarehouseOptions = async () => {
    const { data: warehouseData } = await getProductSelectGetWarehouse()
    setWarehouseOptions(warehouseData)
    return warehouseData
  }

  return (
    <Drawer
      title={`${intl.formatMessage({ id: 'transaction_components.shougongfahuo' })}${orderNo ? '：' + orderNo : ''}`}
      width={1400}
      bodyStyle={{ paddingLeft: 0, paddingTop: 0 }}
      onClose={handleCancel}
      open={visible}
      footer={footer}
    >
      <div style={{ margin: '8px 16px' }}>
        <NiceForm
          actions={schemaActions}
          schema={schema}
          onSubmit={handleSubmit}
          initialValues={{
            deliveryTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          }}
          effects={($, actions) => {
            useAsyncSelect(
              'logisticsCompanyId',
              async () => (await getLogisticsSelectListCompany({ cooperateType: '2' })).data,
              ['name', 'id'],
            )

            useAsyncSelect('outOfStockId', fetchWarehouseOptions, ['name', 'id'])

            // 地址选择器（可选，根据需求决定是否保留）
            if (props.visible !== undefined) {
              // 当作为独立组件使用时启用地址选择
              useAsyncSelect('addressId', async () => (await getLogisticsSelectListShipperAddress()).data, [
                'fullAddress',
                'id',
              ])
            }

            // 获取联动的select后续事件, 为了设置对应的name值
            $('requestAsyncSelect').subscribe(({ name, payload }) => {
              if (name === 'addressId') {
                dataRef.current.addressId = payload
              }
              if (name === 'logisticsCompanyId') {
                dataRef.current.logisticsCompanyId = payload
              }
            })

            $('onFieldInputChange', 'addressId').subscribe(({ value }) => {
              actions.setFieldValue(
                'address',
                dataRef.current.addressId?.find((v) => v.id === value)?.fullAddress || '',
              )
            })

            $('onFieldInputChange', 'logisticsCompanyId').subscribe(({ value }) => {
              const selectedCompany = dataRef.current.logisticsCompanyId?.find((v) => v.id === value)
              actions.setFieldValue('company', selectedCompany?.name || '')
              actions.setFieldValue('companyCode', selectedCompany?.code || '')
            })

            $('onFieldValueChange', 'outOfStockId').subscribe((state) => {
              // 设置仓库名称
              setOutOfStockId(state.value)
              actions.setFieldValue(
                'warehouseAdminName',
                warehouseOptions?.find((item) => item.id === state.value)?.warehouseAdminName,
              )
            })
          }}
          expressionScope={{}}
        />
      </div>
    </Drawer>
  )
}

OrderHandDeleveModal.defaultProps = {}

export default OrderHandDeleveModal
