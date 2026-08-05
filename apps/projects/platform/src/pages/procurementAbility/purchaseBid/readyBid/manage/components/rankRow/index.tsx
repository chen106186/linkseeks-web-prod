import React, { Fragment } from 'react'
import { Tooltip } from 'antd'

import level1 from '@/assets/icons/the_first.png'
import level2 from '@/assets/icons/the_second.png'
import level3 from '@/assets/icons/the_third.png'
import { priceFormat } from '@/utils/numberFomat'
import { toChatRoom } from '@/utils/im'
import CustomerServiceList from '@apps/components/src/web/CustomerServiceList'
import IMBtn from '../../../../../components/detail/components/iMBtn'

import TriangleTag from '../triangleTag'
import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'
import { useToggle } from '@linkseeks/hooks'

const intl = getIntl()
interface RankRowProps {
  detail: any
  rowType?: (1 | 2) & number
}

const RankForLeve = {
  1: level1,
  2: level2,
  3: level3,
}

const RankRow: React.FC<RankRowProps> = (props: any) => {
  const { detail = {}, rowType } = props
  const [visible, toggle] = useToggle()

  const _returnBadge = (number) => {
    const _number = Number(number)
    switch (_number) {
      case 1:
      case 2:
      case 3:
        return <img src={RankForLeve[_number]} alt={`第${_number}名`} />
      default:
        return <div className={styles.rankRowLeftTopRank}>{_number}</div>
    }
  }
  const _returnRow = () => {
    if (rowType === 1) {
      return (
        <div className={`${styles.rankRow} ${styles[`rankRow_level_${detail.ranking}`]}`}>
          <div className={styles.rankRowLeft}>
            <div className={styles.rankRowLeftTop}>
              {_returnBadge(detail.ranking)}
              <Tooltip placement="top" title={detail.memberName}>
                <div className={styles.rankRowLeftTopRankCalc}>{detail.memberName}</div>
              </Tooltip>
              {detail.ranking === 1 && (
                <TriangleTag
                  text={intl.formatMessage({ id: 'detail.purchase.minPrice1' })}
                  wrapStyle={{ backgroundColor: '#EA8000', marginLeft: '8px' }}
                  bgcolor="#EA8000"
                  direction="left"
                />
              )}
            </div>
            <div className={styles.rankRowLeftBottom}>
              {intl.formatMessage({ id: 'common.money' })}
              {priceFormat(detail.sumPrice)}
              <div className={styles.rankRowLeftBottomTag}>
                {intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.batch.1', data: detail.count })}
              </div>
            </div>
          </div>
          <div className={styles.rankRowRight}>
            {detail.contacts}
            <IMBtn func={() => toggle(true)} />
          </div>
        </div>
      )
    } else {
      return (
        <div className={`${styles.rankRow}`}>
          <div className={styles.rankRowLeft}>
            <Tooltip placement="top" title={detail.createMemberName}>
              <div className={styles.rankRowLeftEllipsisTitle}>{detail.createMemberName}</div>
            </Tooltip>
            <div className={styles.rankRowLeftBottomPhone}>{detail.tel.replace(/^(.{3})(.*)(.{4})$/, '$1 $2 $3')}</div>
          </div>
          <div>
            <div className={styles.rankRowRight}>
              {detail.contacts}
              <IMBtn func={() => toggle(true)} />
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <Fragment>
      {_returnRow()}
      <CustomerServiceList visible={visible} onClose={toggle} memberId={detail.memberId} />
    </Fragment>
  )
}

RankRow.defaultProps = {
  rowType: 1,
}

export default RankRow
