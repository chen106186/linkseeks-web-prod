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
  /** 步骤名称 */
  stepName?: string
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
            <View className={styles['statusLayout-customStyle-cell']} key={`cell_${index}`}>
              <View className={styles['statusLayout-customStyle-dotLineBox']}>
                <View
                  className={styles['statusLayout-customStyle-dot']}
                  style={{ backgroundColor: item.isExecute ? '#00B37A' : '#EBEDF0' }}
                />
                {index !== dataSource.length - 1 && (
                  <View
                    className={styles['statusLayout-customStyle-line']}
                    style={{ backgroundColor: item.isExecute && item.lineFlag ? '#00B37A' : '#EBEDF0' }}
                  />
                )}
              </View>
              <View className={styles['statusLayout-customStyle-cellTextBox']}>
                {item.stepName !== '' && (
                  <View className={styles['statusLayout-customStyle-cellText']}>{item.stepName}</View>
                )}
                {item && item.roleName !== '' && (
                  <View className={styles['statusLayout-customStyle-cellText']}>{item.roleName}</View>
                )}
              </View>
            </View>
          ))}
      </ScrollView>
    </MellowCard>
  )
}
export default StepLayout
