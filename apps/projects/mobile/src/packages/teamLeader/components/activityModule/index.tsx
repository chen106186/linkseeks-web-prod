import React from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'
import cx from 'classnames'
import { formatDateFromTimestamp, formatMoney } from '../../utils/formatter'

interface ActivityItem {
	[key: string]: any
}

interface ActivityModuleProps {
	item: ActivityItem
	onClickDetail?: (_id: number) => void
	onClickAction?: (_id: number, _status: number) => void
}

const ActivityModule = ({ item, onClickDetail, onClickAction }: ActivityModuleProps) => {
  const intl = useIntl()

  const renderStatusText = (status: number) => {
    switch (status) {
    case 1:
      return intl.formatMessage({ id: 'teamLeader.weikaishi', defaultMessage: '未开始' })
    case 2:
      return intl.formatMessage({ id: 'teamLeader.jinxingzhong', defaultMessage: '进行中' })
    case 3:
      return intl.formatMessage({ id: 'teamLeader.yijieshu', defaultMessage: '已结束' })
    default:
      return ''
    }
  }

  return (
    <View className={styles['activity']}>
      <View className={styles['activity-box']} onClick={() => onClickDetail && onClickDetail(item.id)}>
        <View
          className={cx(styles['activity-box-top'],
            item.status === 3 ? styles['activity-box-top-bg2'] : styles['activity-box-top-bg1']
          )}
        >
          <View className={styles['activity-box-top-view']}>
            <Text className={styles['activity-box-top-text']}>{ item.name }</Text>
            <Text className={styles['activity-box-top-text2']}>{renderStatusText(item.status)}</Text>
          </View>
          <Text className={styles['activity-box-top-text2']}>
            {intl.formatMessage({id: 'teamLeader.huodongshijian', defaultMessage: '活动时间：',})}
            {formatDateFromTimestamp(item.startTime, 1)} ～ {formatDateFromTimestamp(item.endTime, 1)}
          </Text>
        </View>
        <View className={styles['activity-box-content']}>
          <View className={styles['content-item']}>
            {item.goodsList.slice(0, 4).map((goods, index) => (
              <View className={styles['content-item-view']} key={index}>
                <Image
                  className={styles['content-item-view-img']}
                  src={goods?.productImgUrl}
                />
              </View>
            ))}
          </View>
          <View className={styles['content-bottom']}>
            <View className={styles['content-bottom-left']}>
              <View className={styles['content-bottom-left-box1']}>
                {intl.formatMessage({id: 'teamLeader.fanli', defaultMessage: '返利',})}
              </View>
              <View className={styles['content-bottom-left-box2']}>
                <Text className={styles['content-bottom-left-box2-text1']}>
                  {intl.formatMessage({id: 'currency', defaultMessage: '￥',})}
                  {formatMoney(item.minReward)}
									~
                  {intl.formatMessage({id: 'currency', defaultMessage: '￥',})}
                  {formatMoney(item.maxReward)}
                </Text>
                <Text className={styles['content-bottom-left-box2-text2']}>
                  {item.minCommission}%
									~
                  {item.maxCommission}%
                </Text>
              </View>
            </View>
            <View
              className={cx(styles['content-bottom-right'], item.status === 3 ? styles['content-bottom-right-bg2'] : styles['content-bottom-right-bg1'])}
              onClick={e => {
                // 阻止冒泡
                e.stopPropagation()
                if (item.status === 3) return
								onClickAction?.(item.id, item?.signupStatus)
              }}
            >
              {
								item?.signupStatus === 1
								  ? intl.formatMessage({id: 'teamLeader.chexiaobaoming', defaultMessage: '撤销报名',})
								  : intl.formatMessage({id: 'teamLeader.lijibaoming', defaultMessage: '立即报名',})
              }
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ActivityModule
