import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, ScrollView } from '@apps/mobile-ui'
import MellowCard from '@/components/MellowCard'
import './index.scss'

type dataSource = {
  /** 选中 */
  isExecute?: number
  /** 状态 */
  roleName?: string
  /** 备注 */
  operationalProcess?: string
}

interface StepProps {
  /** 流转进度数据 */
  dataSource?: dataSource[]
}

const StepLayout: React.FC<StepProps> = (props: StepProps) => {
  const intl = useIntl()
  // eslint-disable-next-line no-shadow
  const { dataSource } = props

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'inquiryQuotation.liuzhuanjindu', defaultMessage: '流转进度' })}
      className="statusLayout-customStyle"
      bodyStyle={{
        padding: 12,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <ScrollView horizontal>
        {dataSource &&
          dataSource.map((item: any, index: number) => (
            <View className="statusLayout-cell" key={`cell_${index}`}>
              <View className="statusLayout-dotLineBox">
                <View
                  className="statusLayout-dot"
                  style={{ backgroundColor: item.isExecute ? '#00B37A' : '#EBEDF0' }}
                />
                {index !== dataSource.length - 1 && (
                  <View
                    className="statusLayout-line"
                    style={{ backgroundColor: item.isExecute ? '#00B37A' : '#EBEDF0' }}
                  />
                )}
              </View>
              <View className="statusLayout-cellTextBox">
                {item.operationalProcess !== '' && (
                  <View className="statusLayout-cellText">{item.operationalProcess}</View>
                )}
                {item && item.roleName !== '' && <View className="statusLayout-cellText">{item.roleName}</View>}
              </View>
            </View>
          ))}
      </ScrollView>
    </MellowCard>
  )
}
export default StepLayout
