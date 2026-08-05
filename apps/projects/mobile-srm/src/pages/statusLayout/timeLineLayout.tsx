import React from 'react'
import { View, Text, ScrollView } from '@apps/mobile-ui'
import cx from 'classnames'
import MellowCard from '@/components/MellowCard'
import { useIntl } from '@linkseeks/i18n'
import Empty from '@/components/Empty'
import { dateFormat } from '@/utils/date'
import styles from './index.module.scss'

type dataSource = {
  /** 状态 */
  operation?: string
  /** 时间 */
  createTime?: number
  /** 操作人员 */
  operator?: string
  /** 职位 */
  jobTitle?: string
  /** 备注 */
  remark?: any
}

interface TimeLineProps {
  /** 流转进度数据 */
  dataSource?: dataSource[]
}

const TimeLineLayout: React.FC<TimeLineProps> = (props: TimeLineProps) => {
  const intl = useIntl()
  const { dataSource } = props
  return (
    <MellowCard
      title={intl.formatMessage({ id: 'inquiryQuotation.liuzhuanjilu', defaultMessage: '流转记录' })}
      className={styles['statusLayout-customStyle']}
      bodyStyle={{
        padding: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <ScrollView style={{ maxHeight: '63vh' }}>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '24rpx',
          }}
        >
          {dataSource &&
            dataSource.map((item: any, idx: number) => (
              <View className={styles['statusLayout-customStyle-timeLineBox']} key={`item_${idx}`}>
                <View className={styles['statusLayout-customStyle-timeLineDot']}>
                  <View
                    className={styles['statusLayout-customStyle-timeLineIcon']}
                    style={idx === 0 ? { backgroundColor: '#00B37A' } : {}}
                  />
                  {dataSource.length - 1 !== idx && <View className={styles['statusLayout-customStyle-timeLine']} />}
                </View>
                <View
                  className={
                    dataSource.length - 1 === idx
                      ? styles['statusLayout-customStyle-timeLineBeforeInfoBox']
                      : styles['statusLayout-customStyle-timeLineInfoBox']
                  }
                >
                  <View className={styles['statusLayout-customStyle-timeLineTitle']}>
                    <Text
                      className={
                        idx === 0
                          ? styles['statusLayout-customStyle-timeLineTitleAfterStyle']
                          : styles['statusLayout-customStyle-timeLineTitlebeforeStyle']
                      }
                    >
                      {item.operation}
                    </Text>
                    <Text className={styles['statusLayout-customStyle-timeLineTimeStyle']}>{item.createTime}</Text>
                  </View>
                  <View className={styles['statusLayout-customStyle-timeLineTitle']} style={{ paddingTop: '4rpx' }}>
                    <Text className={styles['statusLayout-customStyle-timeLineTitlebeforeStyle']}>
                      {item.jobTitle}({item.operator})
                    </Text>
                  </View>
                  {item?.remark && (
                    <View className={styles['statusLayout-customStyle-timeLineInfo']}>
                      <Text
                        className={cx(
                          styles['statusLayout-customStyle-timeLineInfoAfterStyle'],
                          styles['statusLayout-customStyle-auditOpinion'],
                        )}
                      >
                        {item.remark}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          {!dataSource && (
            <Empty
              description={intl.formatMessage({ id: 'inquiryQuotation.zanwujulu', defaultMessage: '暂无流转记录' })}
            />
          )}
        </View>
      </ScrollView>
    </MellowCard>
  )
}
export default TimeLineLayout
