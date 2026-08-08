import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { changeProps, changeStylesByKey, getComponentKey, PageConfigType } from '@apps/design-core'
import moment from 'moment'

import styles from './index.less'

import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import { postMarketingCouponPlatformActivityPageSelectDetail } from '@apps/apis'

import CouponsDrawer from '@/pages/pageCustomized/components/drawers/couponsDrawer'
import useSamLevelProps from '../../../common/hooks/useSameLevelProps'

interface MarketingCardCouponProps {
  id?: number
  belongType?: 1 | 2
  // 当前选中组件的key
  selectedKey?: any
  pageConfig: PageConfigType
}

const MarketingCardCoupon: React.FC<MarketingCardCouponProps> = (props: MarketingCardCouponProps) => {
  const { id, belongType, selectedKey, pageConfig } = props
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [record, setRecord] = useState<any>()
  const sameLevelPropsList = useSamLevelProps({ key: selectedKey })

  const _onClose = () => {
    setDrawerVisible(false)
  }

  useEffect(() => {
    const key = getComponentKey('CouponsModal', pageConfig)
    if (key) {
      changeStylesByKey({
        key,
        style: {
          display: 'block',
        },
      })
      return () => {
        changeStylesByKey({
          key,
          style: {
            display: 'none',
          },
        })
      }
    }
  }, [])

  useEffect(() => {
    if (id && id != record?.id) {
      postMarketingCouponPlatformActivityPageSelectDetail(
        { couponList: [{ belongType: belongType, couponId: id }] },
        { ctlType: 'none' },
      )
        .then((res) => {
          if (res.code === 1000) {
            setRecord(res.data[0])
          } else {
            setRecord('')
          }
        })
        .catch((_) => setRecord(''))
    } else if (!id) {
      setRecord('')
    }
  }, [id, belongType])
  const _onChooseConfirm = (record) => {
    setRecord(record)
    changeProps({
      title: record?.name,
      props: Object.assign(
        { ...props },
        { ...record, expiredDay: moment(record?.releaseTimeEnd || moment()).diff(moment(), 'days'), isnull: false },
      ),
    })
    _onClose()
  }
  return (
    <div className={styles['marketingCardCoupon']}>
      <Button
        onClick={() => {
          setDrawerVisible(true)
        }}
      >
        选择
      </Button>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>优惠券ID：</div>
        <div className={styles['marketingCardCoupon-box-content']}>{record?.id}</div>
      </div>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>优惠券名称：</div>
        <div className={styles['marketingCardCoupon-box-content']}>{record?.name}</div>
      </div>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>类型：</div>
        <div className={styles['marketingCardCoupon-box-content']}>{record?.typeName}</div>
      </div>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>领券方式：</div>
        <div className={styles['marketingCardCoupon-box-content']}>{record?.getWayName}</div>
      </div>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>商家名称：</div>
        <div className={styles['marketingCardCoupon-box-content']}>{record?.belongName}</div>
      </div>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>面额：</div>
        <div className={styles['marketingCardCoupon-box-content']}>
          {record?.denomination ? `¥ ${priceFormat(record?.denomination)}` : ''}
        </div>
      </div>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>使用条件：</div>
        <div className={styles['marketingCardCoupon-box-content']}>
          {record?.useConditionMoney ? `满 ${record?.useConditionMoney} 元使用` : ''}
        </div>
      </div>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>有效期：</div>
        <div className={styles['marketingCardCoupon-box-content']}>
          {record?.releaseTimeStart
            ? `${formatTimeString(record?.releaseTimeStart)} 至 ${formatTimeString(record?.releaseTimeEnd)}`
            : ''}
        </div>
      </div>
      <CouponsDrawer
        visible={drawerVisible}
        belongType={belongType}
        onClose={_onClose}
        onConfirm={_onChooseConfirm}
        disabledKeys={sameLevelPropsList ? sameLevelPropsList.map((item) => item.id) : []}
        selectId={id}
      />
    </div>
  )
}

export default MarketingCardCoupon
