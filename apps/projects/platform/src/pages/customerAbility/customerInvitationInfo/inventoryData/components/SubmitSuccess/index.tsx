/*
 * @Description: 提交成功
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import IMG_APPLY_SUCCESS from '@/assets/imgs/apply-success.png'
import styles from './index.less'

const SubmitSuccess: React.FC = () => {
  const intl = useIntl()

  return (
    <div className={styles.success}>
      <img src={IMG_APPLY_SUCCESS} width="300px" height="225px" />
      <p className={styles['success-text']}>
        {intl.formatMessage({ id: 'member.memberQuery.applyMember.save.success' })}
      </p>
    </div>
  )
}

export default SubmitSuccess
