import React from 'react'
import cx from 'classnames'
import serviceIcon from './imgs/platform_service_icon.png'
import itemNullIcon from './imgs/item_null.png'
import styles from './index.less'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'
import { PlatformLocale } from '../../../locale/types/platform'

interface ServiceItem {
  advertImg: string
  link: string
  advertTitle: string
  advertDescribe: string
}

interface ServiceProps {
  className?: string
  dataList: ServiceItem[]
}

const Service: React.FC<ServiceProps> = (props) => {
  const { className, dataList, ...others } = props

  const classNameString = cx(styles.module_card, className)

  const nullArr = [
    {
      style: {
        backgroundImage: 'linear-gradient(144deg, #F8FCFF 0%, #EEF8FD 100%)',
      },
    },
    {
      style: {
        backgroundImage: 'linear-gradient(144deg, #F5FCFB 0%, #E8F8F5 100%)',
      },
    },
    {
      style: {
        backgroundImage: 'linear-gradient(143deg, #FFFDF8 0%, #FFFAEE 100%)',
      },
    },
    {
      style: {
        backgroundImage: 'linear-gradient(143deg, #F9FAFF 0%, #F0F3FF 100%)',
      },
    },
    {
      style: {
        backgroundImage: 'linear-gradient(143deg, #FFF8F8 0%, #FDEEEE 100%)',
      },
    },
  ]

  const renderComponent = (locale: PlatformLocale) => (
    <div className={classNameString} {...others}>
      <div className={styles.module_card_title}>
        <i className={styles.module_card_title_icon}>
          <img src={serviceIcon} />
        </i>
        <label className={styles.module_card_title_label}>
          {locale['platform.service.title']}
        </label>
      </div>
      <div className={styles.service_list}>
        {dataList?.length > 0
          ? dataList.map(
              (item, index) =>
                index < 5 && (
                  <div
                    className={cx(
                      styles.service_list_item,
                      styles[`service${index + 1}`],
                    )}
                    key={`service_list_item_${index}`}
                  >
                    <img className={styles.service_icon} src={item.advertImg} />
                    <div className={styles.service_title}>
                      {item.advertTitle}
                    </div>
                    <div className={styles.split}></div>
                    <div className={styles.service_describe}>
                      {item.advertDescribe}
                    </div>
                    <div className={styles.service_kefu}>
                      {locale['platform.consult.customer']} &gt;
                    </div>
                  </div>
                ),
            )
          : nullArr?.map((item) => (
              <div className={styles.service_list_null} style={item.style}>
                <img src={itemNullIcon} />
              </div>
            ))}
      </div>
    </div>
  )

  return (
    <LocaleReceiver componentName="Platform">{renderComponent}</LocaleReceiver>
  )
}

export default Service
