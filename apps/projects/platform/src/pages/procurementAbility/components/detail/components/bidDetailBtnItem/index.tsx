import React from 'react'
import { Row, Col, Button } from 'antd'

import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'

import TrendTag from '../trendTag'
import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'

interface BtnItemProps {
  detail: any
  btnType?: number
  active?: boolean
  onOk?: () => void
  onCancle?: () => void
  btnLoading?: boolean
}

const intl = getIntl()

const BtnItem: React.FC<BtnItemProps> = (props: any) => {
  const { btnType, active, detail, onOk, onCancle, btnLoading } = props
  const _returnBtn = () => {
    if (btnType === 1) {
      return (
        <div className={styles.btnItem} style={{ borderColor: active ? '#00A98F' : '#F4F5F7' }}>
          <div className={styles.btnItemTitle}>
            <div>{detail?.memberName}</div>
            {intl.formatMessage({ id: 'detail.purchase.label4' })}
            {detail?.peportPriceSum}
            {intl.formatMessage({ id: 'detail.purchase.label6' })}
          </div>
          <div className={styles.btnItemPrice}>
            <div>
              {intl.formatMessage({ id: 'common.money' })}
              {priceFormat(detail?.sumPice)}
              <span>({intl.formatMessage({ id: 'detail.purchase.isTax' })})</span>
            </div>
            {formatTimeString(detail?.peportTime, 'HH:mm:ss')}
          </div>
        </div>
      )
    } else if (btnType === 2) {
      return (
        <div className={styles.btnItem2} style={{ borderColor: active ? '#00A98F' : '#F4F5F7' }}>
          <div className={styles.info}>
            {detail?.isOpenRanking
              ? `${intl.formatMessage({ id: 'detail.purchase.label4' })} ${detail?.ranking} ${intl.formatMessage({
                  id: 'detail.purchase.label5',
                })}`
              : intl.formatMessage({ id: 'detail.purchase.label7' })}
            <span>
              {intl.formatMessage({ id: 'detail.purchase.nowMinPrice1' })}：
              {detail?.isOpenPurchase
                ? `${intl.formatMessage({ id: 'common.money' })}${priceFormat(detail?.minPrice)}`
                : intl.formatMessage({ id: 'detail.purchase.label7' })}
            </span>
          </div>
          <div className={styles.box}>
            <div className={styles.price}>
              <div>
                {intl.formatMessage({ id: 'common.money' })}
                {priceFormat(detail?.sumPice)}
                <span>({intl.formatMessage({ id: 'detail.purchase.isTax' })})</span>
              </div>
              {intl.formatMessage({ id: 'detail.purchase.label4' })}
              {detail?.peportPriceSum}
              {intl.formatMessage({ id: 'detail.purchase.label6' })}
            </div>
            <div className={styles.time}>
              <span>{formatTimeString(detail?.peportTime, 'HH:mm:ss')}</span>
              <TrendTag ratio={detail.ratio} />
            </div>
          </div>
        </div>
      )
    } else if (btnType === 3) {
      return (
        <div className={styles.btnItem3} style={{ borderColor: active ? '#00A98F' : '#F4F5F7' }}>
          <div className={styles.title}>
            <div>
              {intl.formatMessage({ id: 'common.money' })}
              {priceFormat(detail?.sumPice)}
              <span>({intl.formatMessage({ id: 'detail.purchase.isTax' })})</span>
            </div>
            {intl.formatMessage({ id: 'detail.purchase.label4' })}
            {detail?.peportPriceSum}
            {intl.formatMessage({ id: 'detail.purchase.label6' })}
          </div>
          <Row>
            <Col span={12}>
              <Button block style={{ backgroundColor: '#F4F5F7', border: 0 }} onClick={onCancle}>
                {intl.formatMessage({ id: 'detail.purchase.cancel' })}
              </Button>
            </Col>
            <Col span={12}>
              <Button type="primary" block onClick={onOk} loading={btnLoading} disabled={!active}>
                {intl.formatMessage({ id: 'detail.purchase.offerSubmit' })}
              </Button>
            </Col>
          </Row>
        </div>
      )
    }
  }
  return _returnBtn()
}

BtnItem.defaultProps = {
  btnType: 1,
}

export default BtnItem
