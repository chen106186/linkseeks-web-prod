import { useIntl } from '@linkseeks/i18n'
import React, { useMemo } from 'react'
import AnnotationArc from './annotationArc'
import CustomizeCard from '../CustomizeCard'
import styles from './index.less'

const DashboardContainer = () => {
  const intl = useIntl()

  return (
    <CustomizeCard
      title={intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.AnnotationArc.container.singerMoneyOver',
      })}
      bodyStyle={{ minHeight: '312px', padding: '0' }}
    >
      <div className={styles.section}>
        <AnnotationArc />
        <div className={styles.tips}>
          <p className={styles.text}>
            {intl.formatMessage({ id: 'member.memberWarning.dashboard.components.AnnotationArc.container.overMoney' })}
          </p>
          <p className={styles.money}>69万</p>
          <p className={styles.level}>
            {intl.formatMessage({ id: 'member.memberWarning.dashboard.components.AnnotationArc.container.firstRisk' })}
          </p>
        </div>
      </div>
    </CustomizeCard>
  )
}

export default DashboardContainer
