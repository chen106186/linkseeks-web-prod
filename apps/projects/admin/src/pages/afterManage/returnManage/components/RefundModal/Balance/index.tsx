/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-09 17:40:38
 * @Description: 余额退款
 */
import React, { useEffect, useState } from 'react'
import { Descriptions, Spin, Divider } from 'antd'
import { priceFormat } from '@/utils/numberFomat'
import styles from './index.less'
import { getPayAssetAccountGetChildUserBalance } from '@apps/apis'

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
}

const Balance: React.FC<BalanceProps> = ({ value, purchaserId, purchaserRoleId }) => {
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)

  const getPayAssetAccountGetUserBalance = () => {
    if (!purchaserId || !purchaserRoleId) {
      return
    }
    setLoading(true)
    getPayAssetAccountGetChildUserBalance({
      childMemberId: `${purchaserId}`,
      childMemberRoleId: `${purchaserRoleId}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          setBalance(res.data)
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
    getPayAssetAccountGetUserBalance()
  }, [])

  return (
    <Spin spinning={loading}>
      <div className={styles.balance}>
        <Descriptions column={1}>
          <Descriptions.Item
            label="当前退款金额(元)"
            style={{
              paddingBottom: 0,
            }}
          >
            <span className={styles['amount-plus']}>￥{priceFormat(value.refundAmount)}</span>
          </Descriptions.Item>
        </Descriptions>
        <Divider dashed />
        <Descriptions column={1}>
          <Descriptions.Item label="账户可用余额(元)">
            <span className={styles.amount}>￥{priceFormat(balance)}</span>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Spin>
  )
}

export default Balance
