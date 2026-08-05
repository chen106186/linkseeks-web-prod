/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-18 09:52:30
 * @Description: 授信退款
 */
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Descriptions, Spin, Divider, Progress } from 'antd'
import { getPayCreditGetMemberCredit } from '@apps/apis'
import { priceFormat } from '@/utils/numberFomat'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

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

  const intl = useIntl()

  const translate = useWebIntl()
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
            label={`${intl.formatMessage({
              id: 'afterService.components.RefundModal.refundAmount',
              defaultMessage: '当前退款金额',
            })}(${translate('web.common.currencySymbol')})`}
            style={{
              paddingBottom: 0,
            }}
          >
            <span className={styles['amount-plus']}>
              {intl.formatMessage({ id: 'common.money' })}
              {priceFormat(value.refundAmount)}
            </span>
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
          <Descriptions.Item
            label={`${intl.formatMessage({
              id: 'afterService.components.Credit.canUseQuota',
              defaultMessage: '可用授信额度',
            })}(${translate('web.common.currencySymbol')})`}
          >
            <span className={styles.amount}>
              {intl.formatMessage({ id: 'common.money' })}
              {priceFormat(credit.canUseQuota)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item
            label={`${intl.formatMessage({
              id: 'afterService.components.Credit.useQuota',
              defaultMessage: '已用授信额度',
            })}(${translate('web.common.currencySymbol')})`}
          >
            <span className={styles.amount}>
              {intl.formatMessage({ id: 'common.money' })}
              {priceFormat(credit.useQuota)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item
            label={`${intl.formatMessage({
              id: 'afterService.components.Credit.quota',
              defaultMessage: '总授信额度',
            })}(${translate('web.common.currencySymbol')})`}
          >
            <span className={styles.amount}>
              {intl.formatMessage({ id: 'common.money' })}
              {priceFormat(credit.quota)}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Spin>
  )
}

export default Credit
