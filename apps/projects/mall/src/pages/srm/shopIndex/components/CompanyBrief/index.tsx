import React from 'react'
import { getWebIntl } from '@/utils/locales'
import Pin from './img/Pin.svg'
import Date from './img/Date.svg'
import capital from './img/capital.svg'
import earth from './img/earth.svg'
import styles from './index.module.less'

interface Props {
  brief?: string
  address?: string
  money?: string
  years?: string
  mainManagement?: string
}

const CompanyBrief: React.FC<Props> = (props) => {
  const { brief = '-', address = '-', money = '-', years = '-', mainManagement = '-' } = props
  const translate = getWebIntl()

  return (
    <div className={styles['company-brief']}>
      <div className={styles['company-left']}>
        <div className={styles['company-title']}>{translate('web.resource.mall.gongsijianjie')}</div>
        <div className={styles['company-content']}>{brief}</div>
      </div>
      <ul className={styles['company-dom-warp']}>
        <li className={styles['company-dom']}>
          <div className={styles['icon-warp']}>
            <img src={Pin} alt="" className={styles['icon']} />
          </div>
          <div>
            <div className={styles['company-dom-title']}>{translate('web.common.diqu')}</div>
            <div className={styles['company-dom-value']}>{address || '-'}</div>
          </div>
        </li>
        <li className={styles['company-dom']}>
          <div className={styles['icon-warp']}>
            <img src={capital} alt="" className={styles['icon']} />
          </div>
          <div>
            <div className={styles['company-dom-title']}>{translate('web.resource.mall.zhuceziben')}</div>
            <div className={styles['company-dom-value']}>{money || '-'}</div>
          </div>
        </li>
        <li className={styles['company-dom']}>
          <div className={styles['icon-warp']}>
            <img src={Date} alt="" className={styles['icon']} />
          </div>
          <div>
            <div className={styles['company-dom-title']}>{translate('web.resource.mall.chenglinianfen')}</div>
            <div className={styles['company-dom-value']}>{years || '0'}</div>
          </div>
        </li>
        <li className={styles['company-dom']}>
          <div className={styles['icon-warp']}>
            <img src={earth} alt="" className={styles['icon']} />
          </div>
          <div>
            <div className={styles['company-dom-title']}>{translate('web.resource.mall.zhuyaocaigou')}</div>
            <div className={styles['company-dom-value']}>{mainManagement || '-'}</div>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default CompanyBrief
