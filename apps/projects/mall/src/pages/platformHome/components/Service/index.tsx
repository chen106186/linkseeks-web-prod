import React from 'react'
import serviceIcon from '../icons/platform_service_icon.png'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface ServiceItem {
  advertImg: string
  link: string
  advertTitle: string
  advertDescribe: string
}
interface ServiceProps {
  dataList: ServiceItem[]
  anchor: string
}

const Service: React.FC<ServiceProps> = (props) => {
  const { dataList, anchor } = props
  const translate = getWebIntl()

  return (
    <div className={styles.module_card} id={anchor}>
      <div className={styles.module_card_title}>
        <i className={styles.module_card_title_icon}>
          <img src={serviceIcon} />
        </i>
        <label className={styles.module_card_title_label}>{translate('web.resource.mall.pingtaifuwu')}</label>
      </div>
      <div className={styles.service_list}>
        {dataList &&
          dataList.map(
            (item, index) =>
              index < 5 && (
                <div
                  className={cx(styles.service_list_item, styles[`service${index + 1}`])}
                  key={`service_list_item_${index}`}
                >
                  <a href={item.link || '#!'} target={item.link ? '_blank' : '_self'}>
                    <img className={styles.service_icon} src={item.advertImg} />
                  </a>
                  <div className={styles.service_title}>{item.advertTitle}</div>
                  <div className={styles.split}></div>
                  <div className={styles.service_describe}>{item.advertDescribe}</div>
                </div>
              ),
          )}
      </div>
    </div>
  )
}

export default Service
