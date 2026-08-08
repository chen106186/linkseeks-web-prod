/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-18 10:24:15
 * @Description: 授信退款
 */
import React, { useState, useEffect } from 'react'
import { Descriptions, Spin, Divider, Progress } from 'antd'
import { priceFormat } from '@/utils/numberFomat'
import styles from './index.less'
import { getPayCreditGetMemberCredit } from '@apps/apis'

interface Credit {
  quota: number
  useQuota: number
  canUseQuota: number
  isUsable: number
}

interface BalanceProps {
  /**
   * 弹窗需要的数据值
   */
  value: { [key: string]: any }
  /**
   * 采购商id
   */
  purchaserId: number
  /**
   * 采购商角色id
   */
  purchaserRoleId: number
  /**
   * 供应商id
   */
  supplierId: number
  /**
   * 供应商角色id
   */
  supplierRoleId: number
}

const Credit: React.FC<BalanceProps> = ({ value, purchaserId, purchaserRoleId, supplierId, supplierRoleId }) => {
  const [credit, setCredit] = useState<Credit>({
    quota: 0,
    useQuota: 0,
    canUseQuota: 0,
    isUsable: 0,
  })
  const [loading, setLoading] = useState(false)

  const getMemberCredit = () => {
    if (!purchaserId || !purchaserRoleId || !supplierId || !supplierRoleId) {
      return
    }
    setLoading(true)
    getPayCreditGetMemberCredit({
      memberId: `${purchaserId}`,
      roleId: `${purchaserRoleId}`,
      parentMemberId: `${supplierId}`,
      parentMemberRoleId: `${supplierRoleId}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          setCredit(res.data)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getMemberCredit()
  }, [])

  return (
    <Spin spinning={loading}>
      <div className={styles.credit}>
        <Descriptions column={1}>
          <Descriptions.Item
            label="当前退款金额"
            style={{
              paddingBottom: 0,
            }}
          >
            <span className={styles['amount-plus']}>￥{priceFormat(value.refundAmount)}</span>
          </Descriptions.Item>
        </Descriptions>
        <Divider dashed />
        <Progress
          percent={credit.quota ? (credit.useQuota / credit.quota) * 100 : 0}
          strokeLinecap="square"
          status="success"
          showInfo={false}
          style={{
            marginBottom: 12,
          }}
        />
        <Descriptions column={2}>
          <Descriptions.Item label="可用授信额度(元)">
            <span className={styles.amount}>￥{priceFormat(credit.canUseQuota)}</span>
          </Descriptions.Item>
          <Descriptions.Item label="已用授信额度(元)">
            <span className={styles.amount}>￥{priceFormat(credit.useQuota)}</span>
          </Descriptions.Item>
          <Descriptions.Item label="总授信额度(元)">
            <span className={styles.amount}>￥{priceFormat(credit.quota)}</span>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Spin>
  )
}

export default Credit
