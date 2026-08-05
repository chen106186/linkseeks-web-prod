import React from 'react'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'
import { getOssUrlPath } from '@apps/constants'
interface Props {
  companyTitle?: string
  purchaseAmount?: number // 采购金额
  purchaseNum?: number // 采购数量
  inquiryNum?: number // 询价次数
  inviteTenderNum?: number // 招标次数
  biddingNum?: number // 竞价次数
  logo?: string // 商户的logo
}

const CompanyMessage: React.FC<Props> = (props) => {
  const {
    companyTitle = '-',
    purchaseAmount = 0, // 采购金额
    purchaseNum = 0, // 采购数量
    inquiryNum = 0, // 询价次数
    inviteTenderNum = 0, // 招标次数
    biddingNum = 0, // 竞价次数
  } = props
  const translate = getWebIntl()

  return (
    <ul style={{ position: 'relative' }} className={styles['company-warp']}>
      <li
        className={styles['company-title-bg']}
        style={{
          backgroundImage: `url(${getOssUrlPath(
            '/TIM%E6%88%AA%E5%9B%BE201809051044459e88dec39fb94e0c8d6a34605715e4fe969ea49cafae48ccb5e9e1cb87c32bd0.png',
            'ssyOne',
          )})`,
        }}
      >
        <div className={styles['company-title-bg-inner']}></div>
      </li>
      <li className={styles['company-title']}>{companyTitle}</li>
      <li className={styles['company-content']}>
        <div>
          <div className={styles['company-key']}>{translate('web.resource.mall.leijicaigoujine')}</div>
          <div className={styles['company-value']}>{purchaseAmount}</div>
        </div>
        <div className={styles['company-icon-warp']}>
          <div className={styles['company-icon']}>{translate('web.resource.mall.zong')}</div>
        </div>
      </li>
      <li className={styles['company-content']}>
        <div>
          <div className={styles['company-key']}>{translate('web.resource.mall.leijicaigouci')}</div>
          <div className={styles['company-value']}>{purchaseNum}</div>
        </div>
        <div className={styles['company-icon-warp']}>
          <div className={styles['company-icon']}>{translate('web.resource.mall.cai')}</div>
        </div>
      </li>
      <li className={styles['company-content']}>
        <div>
          <div className={styles['company-key']}>{translate('web.resource.mall.leijixunjiaci')}</div>
          <div className={styles['company-value']}>{inquiryNum}</div>
        </div>
        <div className={styles['company-icon-warp']}>
          <div className={styles['company-icon']}>{translate('web.resource.mall.xun')}</div>
        </div>
      </li>
      <li className={styles['company-content']}>
        <div>
          <div className={styles['company-key']}>{translate('web.resource.mall.leijizhaobiaoci')}</div>
          <div className={styles['company-value']}>{inviteTenderNum}</div>
        </div>
        <div className={styles['company-icon-warp']}>
          <div className={styles['company-icon']}>{translate('web.resource.mall.zhao')}</div>
        </div>
      </li>
      <li className={styles['company-content']}>
        <div>
          <div className={styles['company-key']}>{translate('web.resource.mall.leijijingjiaci')}</div>
          <div className={styles['company-value']}>{biddingNum}</div>
        </div>
        <div className={styles['company-icon-warp']}>
          <div className={styles['company-icon']}>{translate('web.resource.mall.jing')}</div>
        </div>
      </li>
    </ul>
  )
}

export default CompanyMessage
