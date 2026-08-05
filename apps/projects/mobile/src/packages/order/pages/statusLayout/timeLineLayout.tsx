import React from 'react'
import cx from 'classnames'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, ScrollView } from '@apps/mobile-ui'
import MellowCard from '@/components/MellowCard'
import { useIntl } from '@linkseeks/i18n'
import Empty from '@/components/Empty'
import { THEME_COLORS } from '@/constants/theme'
import { dateFormat } from '@/utils/date'
import styles from './index.module.scss'

type dataSource = {
  /** 状态 */
  operation?: string
  /** 时间 */
  operationTime?: number
  /** 操作人员 */
  roleName?: string
  /** 备注 */
  auditOpinion?: any
}

interface TimeLineProps {
  /** 流转进度数据 */
  dataSource?: dataSource[]
}

const TimeLineLayout: React.FC<TimeLineProps> = (props: TimeLineProps) => {
  const { dataSource } = props
  const intl = useIntl()
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
            padding: pxTransform(12),
          }}
        >
          {dataSource &&
            dataSource.map((item: any, idx: number) => (
              <View className={styles['statusLayout-timeLineBox']} key={`item_${idx}`}>
                <View className={styles['statusLayout-timeLineDot']}>
                  <View
                    className={styles['statusLayout-timeLineIcon']}
                    style={idx === 0 ? { backgroundColor: THEME_COLORS.primary } : {}}
                  />
                  {dataSource.length - 1 !== idx && <View className={styles['statusLayout-timeLine']} />}
                </View>
                <View
                  className={
                    dataSource.length - 1 === idx
                      ? styles['statusLayout-timeLineBeforeInfoBox']
                      : styles['statusLayout-timeLineInfoBox']
                  }
                >
                  <View className={styles['statusLayout-timeLineTitle']}>
                    <Text
                      className={
                        idx === 0
                          ? styles['statusLayout-timeLineTitleAfterStyle']
                          : styles['statusLayout-timeLineTitlebeforeStyle']
                      }
                    >
                      {item.operation}
                    </Text>
                    <Text className={styles['statusLayout-timeLineTimeStyle']}>
                      {dateFormat(new Date(item.operationTime))}
                    </Text>
                  </View>
                  <View className={styles['statusLayout-timeLineTitle']} style={{ paddingTop: pxTransform(2) }}>
                    <Text
                      className={
                        idx === 0
                          ? styles['statusLayout-timeLineTitleAfterStyle']
                          : styles['statusLayout-timeLineTitlebeforeStyle']
                      }
                    >
                      {item.roleName}
                    </Text>
                  </View>
                  {item.auditOpinion !== null && item.auditOpinion.length !== 0 && (
                    <View className={styles['statusLayout-timeLineInfo']}>
                      <Text
                        className={cx(
                          idx === 0
                            ? styles['statusLayout-timeLineInfoAfterStyle']
                            : styles['statusLayout-timeLineInfobeforeStyle'],
                          styles['statusLayout-auditOpinion'],
                        )}
                      >
                        {item.auditOpinion}
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
