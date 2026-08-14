import React, { useEffect, useMemo, useState } from 'react'
import { Button, Drawer, Form, Input, InputNumber, Select, Space, Table, message } from 'antd'
import { formatTimeString } from '@/utils'
import {
  postOrderPlatformManageDeliveryConfirm,
  postOrderPlatformManageDeliveryProducts,
} from '../../services/platform'
import style from './index.less'

const LOGISTICS_COMPANIES = [
  { company: '邮政速递', companyCode: 'EMS' },
  { company: '顺丰速运', companyCode: 'SF' },
  { company: '中通快递', companyCode: 'ZTO' },
  { company: '圆通速递', companyCode: 'YTO' },
  { company: '韵达速递', companyCode: 'YD' },
  { company: '申通快递', companyCode: 'STO' },
  { company: '京东物流', companyCode: 'JD' },
  { company: '德邦快递', companyCode: 'DBL' },
  { company: '极兔速递', companyCode: 'JTSD' },
]

export interface PlatformDeliveryModalProps {
  visible: boolean
  orderNo: string
  orderDigest?: string
  buyerMemberName?: string
  createTime?: string
  selectedAmount?: string | number
  consignee?: {
    consignee?: string
    phone?: string
    address?: string
  }
  selectedOrderProductIds: number[]
  onClose: () => void
  onSuccess: () => void
}

const PlatformDeliveryModal: React.FC<PlatformDeliveryModalProps> = ({
  visible,
  orderNo,
  orderDigest,
  buyerMemberName,
  createTime,
  selectedAmount,
  consignee,
  selectedOrderProductIds,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])

  const filteredProducts = useMemo(
    () => products.filter((item) => selectedOrderProductIds.includes(item.orderProductId)),
    [products, selectedOrderProductIds],
  )

  useEffect(() => {
    if (visible) {
      loadData()
    } else {
      form.resetFields()
      setProducts([])
    }
  }, [visible, orderNo, selectedOrderProductIds.join(',')])

  const loadData = async () => {
    try {
      const productResp = await postOrderPlatformManageDeliveryProducts({ orderNo })
      const nextProducts = (productResp.data || []).filter((item) =>
        selectedOrderProductIds.includes(item.orderProductId),
      )
      setProducts(nextProducts)

      form.setFieldsValue({
        deliveryTime: formatTimeString(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        products: nextProducts.map((item) => ({
          ...item,
          deliveryCount: item.leftCount,
        })),
      })
    } catch (error) {
      message.error('获取发货数据失败')
    }
  }

  const submit = async () => {
    try {
      const values = await form.validateFields()
      const companyItem = LOGISTICS_COMPANIES.find((item) => item.companyCode === values.companyCode)
      const submitProducts = (values.products || [])
        .filter((item) => Number(item.deliveryCount) > 0)
        .map((item) => ({
          orderProductId: item.orderProductId,
          relationId: item.relationId,
          deliveryCount: Number(item.deliveryCount),
        }))

      if (!submitProducts.length) {
        message.warning('请至少填写一个商品的发货数量')
        return
      }

      setLoading(true)
      const { code } = await postOrderPlatformManageDeliveryConfirm({
        orderNo,
        address: consignee?.address || '',
        deliveryTime: values.deliveryTime,
        logisticsNo: values.logisticsNo,
        company: companyItem?.company || '',
        companyCode: companyItem?.companyCode || '',
        products: submitProducts,
      })
      if (code === 1000) {
        onSuccess()
      }
    } catch (error) {
      if (error?.errorFields) {
        return
      }
      message.error('发货失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer
      title="去发货"
      width={980}
      open={visible}
      onClose={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" loading={loading} onClick={submit}>
              确认发货
            </Button>
          </Space>
        </div>
      }
    >
      <div className={style.summary}>
        <div className={style.summaryItem}>订单号：{orderNo}</div>
        <div className={style.summaryItem}>订单摘要：{orderDigest || '-'}</div>
        <div className={style.summaryItem}>采购会员：{buyerMemberName || '-'}</div>
        <div className={style.summaryItem}>下单时间：{createTime || '-'}</div>
        <div className={style.summaryItem}>订单总额：{selectedAmount ?? '-'}</div>
        <div className={style.summaryItem}>本次发货商品数：{filteredProducts.length}</div>
      </div>

      <Form form={form} layout="vertical">
        <Space style={{ display: 'flex' }} size={16} align="start">
          <Form.Item label="收货地址" style={{ flex: 1 }}>
            <span>
              {consignee ? [consignee.consignee, consignee.phone, consignee.address].filter(Boolean).join(' ') : '-'}
            </span>
          </Form.Item>
          <Form.Item
            name="deliveryTime"
            label="发货时间"
            rules={[{ required: true, message: '请输入发货时间' }]}
            style={{ flex: 1 }}
          >
            <Input />
          </Form.Item>
        </Space>

        <Space style={{ display: 'flex' }} size={16} align="start">
          <Form.Item
            name="companyCode"
            label="物流公司"
            rules={[{ required: true, message: '请选择物流公司' }]}
            style={{ flex: 1 }}
          >
            <Select
              showSearch
              placeholder="请选择物流公司"
              optionFilterProp="label"
              options={LOGISTICS_COMPANIES.map((item) => ({
                label: `${item.company} (${item.companyCode})`,
                value: item.companyCode,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="logisticsNo"
            label="物流单号"
            rules={[{ required: true, message: '请输入物流单号' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="请输入物流单号" />
          </Form.Item>
        </Space>

        <Form.List name="products">
          {(fields) => (
            <div className={style.tableWrap}>
              <Table
                pagination={false}
                rowKey="orderProductId"
                dataSource={fields.map((field) => form.getFieldValue(['products', field.name])).filter(Boolean)}
                columns={[
                  { title: '商品ID', dataIndex: 'skuId', key: 'skuId', width: 100 },
                  { title: '商品名称', dataIndex: 'name', key: 'name', width: 220 },
                  { title: '品类', dataIndex: 'category', key: 'category', width: 140 },
                  { title: '品牌', dataIndex: 'brand', key: 'brand', width: 140 },
                  { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
                  { title: '已发货', dataIndex: 'delivered', key: 'delivered', width: 100 },
                  { title: '未发货', dataIndex: 'leftCount', key: 'leftCount', width: 100 },
                  {
                    title: '发货数量',
                    key: 'deliveryCount',
                    width: 160,
                    render: (_, record, index) => {
                      const maxCount = Number(record.leftCount) || 0
                      return (
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          name={['products', index, 'deliveryCount']}
                          rules={[
                            { required: true, message: '请输入发货数量' },
                            {
                              validator: (_, value) => {
                                const num = Number(value)
                                if (num < 0) return Promise.reject('发货数量不能小于0')
                                if (num > maxCount) return Promise.reject(`发货数量不能超过未发货数量${maxCount}`)
                                return Promise.resolve()
                              },
                            },
                          ]}
                        >
                          <InputNumber min={0} max={maxCount} precision={0} style={{ width: '100%' }} />
                        </Form.Item>
                      )
                    },
                  },
                ]}
              />
            </div>
          )}
        </Form.List>
      </Form>
    </Drawer>
  )
}

export default PlatformDeliveryModal
