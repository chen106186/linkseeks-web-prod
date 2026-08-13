import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Drawer, Modal, message } from 'antd'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import moment from 'moment'
import { getLogisticsSelectListShipperAddress } from '@apps/apis'
import { schema } from './constant'
import { useProductTable } from './useProductTable'
import {
  getOrderPlatformManageDeliveryProducts,
  getOrderPlatformManageLogisticsCompanyList,
  postOrderPlatformManageDeliveryConfirm,
} from '../../services/platform'

export interface PlatformDeliveryModalProps {
  currentRef?: any
  orderNo: string
  visible?: boolean
  onClose?: () => void
  onCancel?: () => void
  onSuccess?: () => void
}

const schemaActions = createFormActions()

const PlatformDeliveryModal: React.FC<PlatformDeliveryModalProps> = ({
  currentRef,
  orderNo,
  visible: propsVisible,
  onClose,
  onCancel,
  onSuccess,
}) => {
  const dataRef = useRef<any>({})
  const [visible, setVisible] = useState<boolean>(propsVisible || false)
  const [loading, setLoading] = useState(false)
  const { productColumns, productComponents } = useProductTable(schemaActions)

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        visible,
        setVisible,
      }
    }
  }, [visible, currentRef])

  useEffect(() => {
    if (propsVisible !== undefined) {
      setVisible(propsVisible)
    }
  }, [propsVisible])

  useEffect(() => {
    if (visible && orderNo) {
      initData()
    }
  }, [visible, orderNo])

  const initData = async () => {
    try {
      const { code, data, message: msg } = await getOrderPlatformManageDeliveryProducts({ orderNo })
      if (code === 1000) {
        schemaActions.setFieldValue(
          'products',
          (data || []).map((item) => ({
            ...item,
            deliveryCount: item.leftCount ?? 0,
          })),
        )
      } else {
        message.error(msg || '获取可发货商品失败')
      }
    } catch (error) {
      message.error('获取可发货商品失败')
    }
  }

  const handleSubmit = async (value) => {
    const products = (value.products || [])
      .filter((item) => Number(item.deliveryCount) > 0)
      .map((item) => ({
        orderProductId: item.orderProductId,
        relationId: item.relationId,
        deliveryCount: Number(item.deliveryCount),
      }))

    if (!products.length) {
      message.warning('请至少填写一个商品的发货数量')
      return
    }

    const params = {
      orderNo,
      addressId: value.addressId?.id,
      address: value.addressId?.fullAddress,
      deliveryTime: moment(value.deliveryTime).format('YYYY-MM-DD HH:mm:ss'),
      logisticsNo: value.logisticsNo,
      company: value.company,
      companyCode: value.companyCode,
      products,
    }

    try {
      setLoading(true)
      const { code } = await postOrderPlatformManageDeliveryConfirm(params)
      if (code === 1000) {
        message.success('发货成功')
        handleClose()
        onSuccess?.()
      }
    } catch (error) {
      message.error('发货失败')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setVisible(false)
    schemaActions.reset()
    onClose?.()
  }

  const handleCancel = () => {
    Modal.confirm({
      title: '确认取消',
      content: '确定要取消当前发货操作吗？',
      onOk: () => {
        setVisible(false)
        schemaActions.reset()
        onCancel?.()
      },
    })
  }

  const expressionScope = useMemo(
    () => ({
      productColumns,
      productComponents,
    }),
    [productColumns, productComponents],
  )

  return (
    <Drawer
      title={`去发货${orderNo ? `：${orderNo}` : ''}`}
      width={1280}
      bodyStyle={{ paddingLeft: 0, paddingTop: 0 }}
      onClose={handleCancel}
      open={visible}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={() => schemaActions.submit()} type="primary" loading={loading} style={{ marginRight: 8 }}>
            确定
          </Button>
          <Button onClick={handleCancel}>取消</Button>
        </div>
      }
    >
      <div style={{ margin: '8px 16px' }}>
        <NiceForm
          actions={schemaActions}
          schema={schema}
          onSubmit={handleSubmit}
          initialValues={{
            deliveryTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          }}
          expressionScope={expressionScope}
          effects={($, actions) => {
            useAsyncSelect('addressId', async () => (await getLogisticsSelectListShipperAddress()).data, [
              'fullAddress',
              'id',
            ])

            useAsyncSelect(
              'logisticsCompanyId',
              async () => {
                const { data } = await getOrderPlatformManageLogisticsCompanyList()
                return (data || []).map((item) => ({
                  ...item,
                  name: item.company,
                  code: item.companyCode,
                }))
              },
              ['name', 'id'],
            )

            $('requestAsyncSelect').subscribe(({ name, payload }) => {
              if (name === 'addressId') {
                dataRef.current.addressId = payload
              }
              if (name === 'logisticsCompanyId') {
                dataRef.current.logisticsCompanyId = payload
              }
            })

            $('onFieldInputChange', 'logisticsCompanyId').subscribe(({ value }) => {
              const selectedCompany = dataRef.current.logisticsCompanyId?.find((v) => String(v.id) === String(value))
              actions.setFieldValue('company', selectedCompany?.name || '')
              actions.setFieldValue('companyCode', selectedCompany?.code || '')
            })
          }}
        />
      </div>
    </Drawer>
  )
}

export default PlatformDeliveryModal
