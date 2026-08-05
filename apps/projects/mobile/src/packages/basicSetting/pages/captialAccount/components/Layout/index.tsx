import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Steps, ScrollView } from '@apps/mobile-ui'
import styles from './index.module.scss'

interface Iprops {
  children: React.ReactNode
  footer?: React.ReactNode
  steps?: number
  items?: any[]
}

const Layout: React.FC<Iprops> = (props: Iprops) => {
  const { children, footer, steps, items } = props
  const intl = useIntl()
  const defaultItems = [
    { title: intl.formatMessage({ id: 'pay.xinxishenhe', defaultMessage: '信息审核' }) },
    { title: intl.formatMessage({ id: 'pay.zhengjianxinxicaiji', defaultMessage: '证件信息采集' }) },
    { title: intl.formatMessage({ id: 'pay.farenshoujihaobangding', defaultMessage: '法人手机号绑定' }) },
  ]
  return (
    <View className={styles.page}>
      <ScrollView className={styles.scrollView} contentContainerStyle={{ width: '100%', minHeight: '100vh' }}>
        <View className={styles.step}>
          <Steps items={items || defaultItems} current={steps} />
        </View>
        <View className={styles['pad-12']}>{children}</View>
      </ScrollView>
      {footer}
    </View>
  )
}

Layout.defaultProps = {
  footer: null,
  steps: 1,
}

export default Layout
