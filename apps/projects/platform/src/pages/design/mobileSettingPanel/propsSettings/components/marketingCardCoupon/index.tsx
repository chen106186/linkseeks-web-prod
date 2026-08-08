import React, { useState, useEffect } from 'react'
import { Button, message } from 'antd'
import { changeProps, changeStylesByKey, getComponentKey, PageConfigType } from '@apps/design-core'
import moment from 'moment'
import { useIntl } from '@linkseeks/i18n'
import { postMarketingCouponActivityPageSelectDetail } from '@apps/apis'
import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import useSamLevelProps from '../../../common/hooks/useSameLevelProps'
import CouponsDrawer from '@/pages/design/components/drawer/couponsDrawer'
import styles from './index.less'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
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
  const intl = useIntl()

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

  const _onClose = () => {
    setDrawerVisible(false)
  }

  useEffect(() => {
    if (id && id != record?.id) {
      postMarketingCouponActivityPageSelectDetail({ couponList: [{ belongType, couponId: id }] })
        .then((res) => {
          message.destroy()
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
        {intl.formatMessage({ id: 'common.button.select' })}
      </Button>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>
          {intl.formatMessage({ id: 'editor.form.label.coupons.id' })}：
        </div>
        <div className={styles['marketingCardCoupon-box-content']}>{record?.id}</div>
      </div>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>
          {intl.formatMessage({ id: 'editor.form.label.coupons.name' })}：
        </div>
        <div className={styles['marketingCardCoupon-box-content']}>{record?.name}</div>
      </div>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>
          {intl.formatMessage({ id: 'editor.drawer.coupons.columns.typeName' })}：
        </div>
        <div className={styles['marketingCardCoupon-box-content']}>{record?.typeName}</div>
      </div>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>
          {intl.formatMessage({ id: 'editor.form.label.coupons.getWayName' })}：
        </div>
        <div className={styles['marketingCardCoupon-box-content']}>{record?.getWayName}</div>
      </div>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>
          {intl.formatMessage({ id: 'editor.columns.memberName' })}：
        </div>
        <div className={styles['marketingCardCoupon-box-content']}>{record?.belongName}</div>
      </div>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>
          {intl.formatMessage({ id: 'editor.drawer.coupons.columns.denomination' })}：
        </div>
        <div className={styles['marketingCardCoupon-box-content']}>
          {record?.denomination ? `${translate('web.common.currencySymbol')}${priceFormat(record?.denomination)}` : ''}
        </div>
      </div>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>
          {intl.formatMessage({ id: 'editor.drawer.coupons.columns.useConditionMoney' })}：
        </div>
        <div className={styles['marketingCardCoupon-box-content']}>
          {record?.useConditionMoney
            ? `${intl.formatMessage({ id: 'common.text.full' })} ${record?.useConditionMoney} ${intl.formatMessage({
                id: 'common.text.canuse',
              })}`
            : ''}
        </div>
      </div>
      <div className={styles['marketingCardCoupon-box']}>
        <div className={styles['marketingCardCoupon-box-label']}>
          {intl.formatMessage({ id: 'editor.drawer.coupons.columns.releaseTimeEnd' })}：
        </div>
        <div className={styles['marketingCardCoupon-box-content']}>
          {record?.releaseTimeStart
            ? `${formatTimeString(record?.releaseTimeStart)} ${intl.formatMessage({
                id: 'common.text.to',
              })} ${formatTimeString(record?.releaseTimeEnd)}`
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
