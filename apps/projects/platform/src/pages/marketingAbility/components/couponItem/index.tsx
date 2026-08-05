import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import { Row, Col } from 'antd'
import { formatTimeString } from '@/utils'
import styles from './index.less'
import { isEmpty } from 'lodash'

const CouponItem = (props) => {
  const { fieldListData } = props
  const intl = useIntl()

  return (
    <>
      {!isEmpty(fieldListData) && (
        <div className={styles.couponItem}>
          <Row style={{ height: '100%' }} wrap={false}>
            <Col flex="none">
              <div className={styles.couponItemLeft}>
                <p>
                  ¥<span>{fieldListData.denomination}</span>
                </p>
                <p>
                  {intl.formatMessage({ id: 'marketingAbility.man' })}
                  {fieldListData.useConditionMoney}
                  {intl.formatMessage({ id: 'marketingAbility.yuankeyong' })}
                </p>
              </div>
            </Col>
            <Col flex="auto" style={{ overflow: 'hidden' }}>
              <div className={styles.couponItemRight}>
                <div className={styles.couponItemRight_type}>{fieldListData.typeName}</div>
                <div className={styles.couponItemRight_info}>{fieldListData.name}</div>
                {fieldListData.effectiveType === 1 ? (
                  <div className={styles.couponItemRight_date}>
                    {formatTimeString(fieldListData.effectiveTimeStart, 'YYYY-MM-DD')}-
                    {formatTimeString(fieldListData.effectiveTimeEnd, 'YYYY-MM-DD')}
                  </div>
                ) : (
                  <div className={styles.couponItemRight_date}>
                    {fieldListData.invalidDay}&nbsp;{intl.formatMessage({ id: 'marketingAbility.tian' })}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </>
  )
}

export default CouponItem
