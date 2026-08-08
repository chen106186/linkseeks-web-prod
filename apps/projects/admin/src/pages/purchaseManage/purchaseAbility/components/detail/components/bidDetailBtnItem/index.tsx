import React from 'react'
import { Row, Col, Button } from 'antd'

import { priceFormat } from '@/utils/numberFomat'
import { formatTimeString } from '@/utils'

import TrendTag from '../trendTag'
import styles from './index.less'

interface BtnItemProps {
  btnType?: number
  active?: boolean
  detail?: any
  onOk?: Function
  onCancle?: Function
}

const BtnItem: React.FC<BtnItemProps> = (props: any) => {
  const { btnType, active, detail, onOk, onCancle } = props
  const _returnBtn = () => {
    if (btnType === 1) {
      return (
        <div className={styles.btnItem} style={{ borderColor: active ? '#00A98F' : '#F4F5F7' }}>
          <div className={styles.btnItemTitle}>
            <div>{detail?.memberName}</div>第{detail?.peportPriceSum}次
          </div>
          <div className={styles.btnItemPrice}>
            <div>
              ¥{priceFormat(detail?.sumPice)}
              <span>(含税)</span>
            </div>
            {formatTimeString(detail?.peportTime)}
          </div>
        </div>
      )
    } else if (btnType === 2) {
      return (
        <div className={styles.btnItem2} style={{ borderColor: active ? '#00A98F' : '#F4F5F7' }}>
          <div className={styles.info}>
            第 {detail?.ranking} 名<span>当前最低价：¥{priceFormat(detail?.minPrice)}</span>
          </div>
          <div className={styles.box}>
            <div className={styles.price}>
              <div>
                ¥{priceFormat(detail?.sumPice)}
                <span>(含税)</span>
              </div>
              第{detail?.peportPriceSum}次
            </div>
            <div className={styles.time}>
              <span>{formatTimeString(detail?.peportTime)}</span>
              <TrendTag />
            </div>
          </div>
        </div>
      )
    } else if (btnType === 3) {
      return (
        <div className={styles.btnItem3} style={{ borderColor: active ? '#00A98F' : '#F4F5F7' }}>
          <div className={styles.title}>
            <div>
              ¥{priceFormat(detail?.sumPice)}
              <span>(含税)</span>
            </div>
            第{detail?.peportPriceSum}次
          </div>
          <Row>
            <Col span={12}>
              <Button block style={{ backgroundColor: '#F4F5F7', border: 0 }} onClick={onCancle}>
                取消
              </Button>
            </Col>
            <Col span={12}>
              <Button type="primary" block onClick={onOk} disabled={!active}>
                提交报价
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
