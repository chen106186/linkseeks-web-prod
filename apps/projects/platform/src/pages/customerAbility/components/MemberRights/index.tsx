/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-20 15:48:49
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 15:39:53
 * @Description: 会员权益
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import classNames from 'classnames'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'
import equity_1 from '@/assets/imgs/equity-1.png'
import equity_2 from '@/assets/imgs/equity-2.png'
import equity_3 from '@/assets/imgs/equity-3.png'
import equity_4 from '@/assets/imgs/equity-4.png'
import equity_5 from '@/assets/imgs/equity-5.png'

const equityTxtMap = {
  1: 'customerAbility.components.MemberRights.rightType.1', // 折扣
  2: 'customerAbility.components.MemberRights.rightType.2', // 返现
  3: 'customerAbility.components.MemberRights.rightType.3', // 积分
}

const clsMap = {
  1: 'tofo-item-tag-price',
  2: 'tofo-item-tag-recurrence',
  3: 'tofo-item-tag-integral',
}

const imgMap = {
  1: equity_1,
  2: equity_2,
  3: equity_3,
  4: equity_4,
  5: equity_5,
}

interface IProps {
  data: {
    acquireWay: string
    /**
     * 数据id
     */
    id: number
    /**
     * 权益名称
     */
    name: string
    paramWay: string
    parameter: string
    remark: string
    rightTypeEnum: number
    status: number
  }[]
}

const MemberRights: React.FC<IProps> = (props: IProps) => {
  const { data = [], ...rest } = props

  const intl = useIntl()

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'customerAbility.components.MemberRights.title', defaultMessage: '会员权益' })}
      {...rest}
      className={styles.equityInfo}
    >
      <div className={styles['container-content']}>
        <ul className={styles.tofo}>
          {data
            ? data.map((item, index) => (
                <li key={item.id} className={styles['tofo-item']}>
                  <div className={styles['tofo-item-logo']}>
                    <img src={imgMap[item.rightTypeEnum]} />
                  </div>
                  <div className={styles['tofo-item-text']}>
                    <div className={styles['tofo-item-title']}>{item.name}</div>
                    <div className={styles['tofo-item-desc']}>{item.remark}</div>
                  </div>
                  <div className={styles['tofo-item-extra']}>
                    <span className={classNames(styles['tofo-item-tag'], styles[clsMap[item.rightTypeEnum]])}>
                      {item.parameter}% {intl.formatMessage({ id: equityTxtMap[item.rightTypeEnum] }) || ''}
                    </span>
                  </div>
                  {index !== data.length - 1 ? <div className={styles['tofo-item-line']} /> : null}
                </li>
              ))
            : null}
        </ul>
      </div>
    </MellowCard>
  )
}

export default MemberRights
