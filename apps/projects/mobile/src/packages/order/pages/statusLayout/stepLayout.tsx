import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, ScrollView } from '@apps/mobile-ui'
import MellowCard from '@/components/MellowCard'
import styles from './index.module.scss'

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
  // eslint-disable-next-line no-shadow
  const { dataSource } = props
  const intl = useIntl()
  return (
    <MellowCard
      title={intl.formatMessage({ id: 'inquiryQuotation.liuzhuanjindu', defaultMessage: '流转进度' })}
      className={styles['statusLayout-customStyle']}
      bodyStyle={{
        padding: 12,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <ScrollView horizontal>
        {dataSource &&
          dataSource.map((item: any, index: number) => (
            <View className={styles['statusLayout-cell']} key={`cell_${index}`}>
              <View className={styles['statusLayout-dotLineBox']}>
                <View
                  className={styles['statusLayout-dot']}
                  style={{ backgroundColor: item.isExecute ? '#00A98F' : '#EBEDF0' }}
                />
                {index !== dataSource.length - 1 && (
                  <View
                    className={styles['statusLayout-line']}
                    style={{ backgroundColor: item.isExecute ? '#00A98F' : '#EBEDF0' }}
                  />
                )}
              </View>
              <View className={styles['statusLayout-cellTextBox']}>
                {item.operationalProcess !== '' && (
                  <View className={styles['statusLayout-cellText']}>{item.operationalProcess}</View>
                )}
                {item && item.roleName !== '' && (
                  <View className={styles['statusLayout-cellText']}>{item.roleName}</View>
                )}
              </View>
            </View>
          ))}
      </ScrollView>
    </MellowCard>
  )
}
export default StepLayout
