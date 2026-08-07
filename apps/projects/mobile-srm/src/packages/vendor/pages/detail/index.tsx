import React, { useEffect, useState } from 'react'
import { View, Text, Button, Input, Toast } from '@apps/mobile-ui'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import styles from './index.module.scss'

import { getPurchaseRequisitionSrmDetail } from '@apps/apis'
import request from '@apps/apis/src/request'

const postVendorShip = (data: any) =>
  request({ url: '/purchase/requisition/srm/vendor/ship', method: 'POST', data })

const VendorOrderDetail: React.FC = () => {
  const params = getCurrentInstance().router?.params || {}
  const id = String(params.id || '')

  const [detail, setDetail] = useState<any>(null)
  const [showShipModal, setShowShipModal] = useState(false)
  const [mailNo, setMailNo] = useState('')
  const [expressCode, setExpressCode] = useState('')
  const [expressName, setExpressName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchDetail = () => {
    getPurchaseRequisitionSrmDetail({ id } as any).then((res: any) => {
      if (res.code === 1000) setDetail(res.data)
    })
  }

  useEffect(() => {
    fetchDetail()
  }, [])

  const handleShip = () => {
    if (!mailNo.trim()) {
      Toast.show({ title: '请输入快递单号', icon: 'none' })
      return
    }
    if (!expressCode.trim() || !expressName.trim()) {
      Toast.show({ title: '请填写快递公司信息', icon: 'none' })
      return
    }
    setSubmitting(true)
    postVendorShip({
      id: Number(id),
      mailNo: mailNo.trim(),
      expressCompanyCode: expressCode.trim(),
      expressCompanyName: expressName.trim(),
    })
      .then((res: any) => {
        if (res.code === 1000) {
          Toast.show({ title: '发货成功', icon: 'success' })
          setShowShipModal(false)
          fetchDetail()
        } else {
          Toast.show({ title: res.msg || '发货失败', icon: 'none' })
        }
      })
      .finally(() => setSubmitting(false))
  }

  if (!detail) return <PageLayout renderHeader={<NavBar title="采购单详情" />} />

  const shipped = !!detail.mailNo

  return (
    <PageLayout renderHeader={<NavBar title="采购单详情" />}>
      <View className={styles.section}>
        <View className={styles.row}>
          <Text className={styles.label}>采购单号</Text>
          <Text>{detail.requisitionNo}</Text>
        </View>
        <View className={styles.row}>
          <Text className={styles.label}>采购方</Text>
          <Text>{detail.vendorMemberName}</Text>
        </View>
        <View className={styles.row}>
          <Text className={styles.label}>摘要</Text>
          <Text>{detail.digest || '—'}</Text>
        </View>
        <View className={styles.row}>
          <Text className={styles.label}>预交日期</Text>
          <Text>{detail.advanceDeliveryDate || '—'}</Text>
        </View>
        <View className={styles.row}>
          <Text className={styles.label}>送货地址</Text>
          <Text>{detail.deliveryAddress || '—'}</Text>
        </View>
      </View>

      {shipped && (
        <View className={styles.section}>
          <View className={styles.sectionTitle}>物流信息</View>
          <View className={styles.row}>
            <Text className={styles.label}>快递单号</Text>
            <Text>{detail.mailNo}</Text>
          </View>
          <View className={styles.row}>
            <Text className={styles.label}>快递公司</Text>
            <Text>{detail.expressCompanyName}</Text>
          </View>
          <View className={styles.row}>
            <Text className={styles.label}>发货时间</Text>
            <Text>{detail.shippedTime}</Text>
          </View>
        </View>
      )}

      {!shipped && (
        <View className={styles.footer}>
          <Button className={styles.shipBtn} onClick={() => setShowShipModal(true)}>
            发货
          </Button>
        </View>
      )}

      {showShipModal && (
        <View className={styles.mask}>
          <View className={styles.modal}>
            <View className={styles.modalTitle}>填写发货信息</View>
            <View className={styles.field}>
              <Text className={styles.fieldLabel}>快递公司编码</Text>
              <Input
                className={styles.input}
                placeholder="如：SF（顺丰）/ YTO（圆通）"
                value={expressCode}
                onChange={(value: string) => setExpressCode(value)}
              />
            </View>
            <View className={styles.field}>
              <Text className={styles.fieldLabel}>快递公司名称</Text>
              <Input
                className={styles.input}
                placeholder="如：顺丰速递"
                value={expressName}
                onChange={(value: string) => setExpressName(value)}
              />
            </View>
            <View className={styles.field}>
              <Text className={styles.fieldLabel}>快递单号</Text>
              <Input
                className={styles.input}
                placeholder="请输入快递单号"
                value={mailNo}
                onChange={(value: string) => setMailNo(value)}
              />
            </View>
            <View className={styles.modalBtns}>
              <Button className={styles.cancelBtn} onClick={() => setShowShipModal(false)}>
                取消
              </Button>
              <Button
                className={styles.confirmBtn}
                loading={submitting}
                disabled={submitting}
                onClick={handleShip}
              >
                确认发货
              </Button>
            </View>
          </View>
        </View>
      )}
    </PageLayout>
  )
}

export default VendorOrderDetail
