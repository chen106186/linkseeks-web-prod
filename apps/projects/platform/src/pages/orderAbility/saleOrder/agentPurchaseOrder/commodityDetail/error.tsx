import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import noResultIcon from '@/assets/imgs/no_result_icon.png'
import styles from './index.less'

interface ErrorResultPropsType {
  errorMessage: string
}

const ErrorResult: React.FC<ErrorResultPropsType> = (props) => {
  const { errorMessage } = props
  const intl = useIntl()

  return (
    <div className={styles.no_result_container}>
      <div className={styles.no_result}>
        <div className={styles.no_result_tip}>
          <div className={styles.no_result_tip_img}>
            <img src={noResultIcon} />
          </div>
          <div className={styles.no_result_tip_text}>{errorMessage}</div>
        </div>
        <div className={styles.no_result_suggest}>
          <ul className={styles.no_result_suggest_list}>
            <li>{intl.formatMessage({ id: 'agentOrder.commodityDetail.error.possibleCauses' })}</li>
            <li>1、{intl.formatMessage({ id: 'agentOrder.commodityDetail..error.delelte' })}</li>
            <li>2、{intl.formatMessage({ id: 'agentOrder.commodityDetail..error.link' })}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ErrorResult
