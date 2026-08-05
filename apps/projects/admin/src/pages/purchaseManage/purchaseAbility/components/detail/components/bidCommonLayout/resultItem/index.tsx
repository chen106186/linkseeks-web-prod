import React from 'react'
import { Divider, Button, Tooltip } from 'antd'

import { priceFormat } from '@/utils/numberFomat'

import level1 from '@/assets/icons/the_first.png'
import level2 from '@/assets/icons/the_second.png'
import level3 from '@/assets/icons/the_third.png'
import winBig from '@/assets/imgs/win-bid.png'

import styles from './index.less'

export interface ResultItemPrpos {
  itemIndex: number
  detail?: any
  checkDetailFunc?: Function
}

const ResultItem: React.FC<ResultItemPrpos> = (props: any) => {
  const { itemIndex, detail, checkDetailFunc } = props

  const _returnBadge = (number) => {
    const _number = Number(number ?? 0)
    switch (_number) {
      case 1:
        return <img src={level1} alt="第一名" />
      case 2:
        return <img src={level2} alt="第二名" />
      case 3:
        return <img src={level3} alt="第三名" />
      default:
        return <div className={styles.badge}>{_number}</div>
    }
  }
  return (
    <div key={`msgItem_key_${itemIndex}`} className={styles.resultItem}>
      {detail.isAward != 0 ? <img src={winBig} alt="授标" className={styles.resultItemWinBid} /> : null}
      <div className={styles.resultItemRow} style={{ alignItems: 'center' }}>
        <Tooltip placement="top" title={detail.memberName}>
          <div className={styles.title}>{detail.memberName}</div>
        </Tooltip>
        {_returnBadge(detail.purchaseRanking)}
      </div>
      <div className={styles.resultItemRow}>
        <div className={styles.money}>
          {detail.price ? `¥${priceFormat(detail.price)}` : '-'}
          <span>(含税)</span>
        </div>
        <Button
          type="link"
          onClick={() => {
            checkDetailFunc(detail.id)
          }}
        >
          查看报价明细
        </Button>
      </div>
      <Divider dashed style={{ color: '#EBECF0', margin: '6px 0' }} />
      <div className={styles.resultItemRow}>
        <div className={styles.label}>联系人姓名：</div>
        <div className={styles.text}>{detail.contacts}</div>
      </div>
      <div className={styles.resultItemRow}>
        <div className={styles.label}>联系人手机：</div>
        <div className={styles.text}>{detail.tel.replace(/^(.{3})(.*)(.{4})$/, '$1 $2 $3')}</div>
      </div>
    </div>
  )
}

export default ResultItem
