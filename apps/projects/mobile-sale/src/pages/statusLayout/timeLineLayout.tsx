import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, ScrollView } from '@apps/mobile-ui'
import MellowCard from '@/components/MellowCard'
import Empty from '@/components/Empty'
import { dateFormat } from '@/utils/date'
import './index.scss'

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
  const intl = useIntl()
  const { dataSource } = props
  return (
    <MellowCard
      title={intl.formatMessage({ id: 'inquiryQuotation.liuzhuanjilu', defaultMessage: '流转记录' })}
      className="statusLayout-customStyle"
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
              <View className="statusLayout-timeLineBox" key={`item_${idx}`}>
                <View className="statusLayout-timeLineDot">
                  <View className="statusLayout-timeLineIcon" style={idx === 0 ? { backgroundColor: '#00B37A' } : {}} />
                  {dataSource.length - 1 !== idx && <View className="statusLayout-timeLine" />}
                </View>
                <View
                  className={`${
                    dataSource.length - 1 === idx
                      ? 'statusLayout-timeLineBeforeInfoBox'
                      : 'statusLayout-timeLineInfoBox'
                  }`}
                >
                  <View className="statusLayout-timeLineTitle">
                    <Text
                      className={`${
                        idx === 0 ? 'statusLayout-timeLineTitleAfterStyle' : 'statusLayout-timeLineTitlebeforeStyle'
                      }`}
                    >
                      {item.operation}
                    </Text>
                    <Text className="statusLayout-timeLineTimeStyle">{dateFormat(new Date(item.operationTime))}</Text>
                  </View>
                  <View className="statusLayout-timeLineTitle" style={{ paddingTop: '4rpx' }}>
                    <Text
                      className={`${
                        idx === 0 ? 'statusLayout-timeLineTitleAfterStyle' : 'statusLayout-timeLineTitlebeforeStyle'
                      }`}
                    >
                      {item.roleName}
                    </Text>
                  </View>
                  {item.auditOpinion !== null && item.auditOpinion.length !== 0 && (
                    <View className="statusLayout-timeLineInfo">
                      <Text
                        className={`${
                          idx === 0 ? 'statusLayout-timeLineInfoAfterStyle' : 'statusLayout-timeLineInfobeforeStyle'
                        } statusLayout-auditOpinion`}
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
