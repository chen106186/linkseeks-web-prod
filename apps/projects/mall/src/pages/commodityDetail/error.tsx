import React from 'react'
import noResultIcon from '@/assets/imgs/no_result_icon.png'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface ErrorResultPropsType {
  errorMessage: string
}

const ErrorResult: React.FC<ErrorResultPropsType> = (props) => {
  const { errorMessage } = props
  const translate = getWebIntl()

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
            <li>{translate('web.resource.mall.chuxiandekenengyuanyin')}</li>
            <li>1、{translate('web.resource.mall.gaishangpinyishanchu')}</li>
            <li>2、{translate('web.resource.mall.shurucuowudeshangpinlianjie')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ErrorResult
