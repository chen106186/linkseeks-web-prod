import React from 'react'
import cx from 'classnames'
import captitalIcon from './imgs/capital_icon.png'
import areaIcon from './imgs/area_icon.png'
import saleAreaIcon from './imgs/sale_area_icon.png'
import registerYearIcon from './imgs/register_year_icon.png'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { CompanyInfoLocale } from '../../locale/types/companyinfo'

interface CompanyInfoProps {
  shopInfo: any
  className?: string
  visible?: boolean
  /** 显示控制：商城端控制 */
  visibleControl?: boolean
}

const CompanyInfo: React.FC<CompanyInfoProps> = (props) => {
  const {
    className,
    shopInfo,
    visible = true,
    visibleControl = false,
    ...others
  } = props

  const formatAreas = (area: string) => {
    if (area) {
      const areaList = area.split('，')
      return areaList
        .map((item) => {
          const temp = item.split('/')
          const provice = temp[0]
          const city = temp[1]
          if (provice === city) {
            return provice
          } else {
            return `${provice}${city}`
          }
        })
        .join('、')
    }
    return ''
  }

  const formatAreasToProvice = (area: string) => {
    if (area) {
      const areaList = area.split('，')
      return areaList
        .map((item) => {
          const temp = item.split('/')
          const provice = temp[0]
          return provice
        })
        .join('、')
    }
    return ''
  }

  const renderComponent = (locale: CompanyInfoLocale) => {
    const getYear = (value: string) => {
      if (value) {
        const temp = value.split('年')
        if (temp.length > 0) {
          return `${temp[0]}${locale['unit.year']}`
        }
      }
      return null
    }

    return (
      (visibleControl ? visible : true) && (
        <div className={cx(styles.company_info, className)} {...others}>
          <div className={styles.company_info_body}>
            <div className={styles.company_info_brief}>
              <div className={styles.company_title}>{shopInfo?.memberName}</div>
              <div className={styles.company_describe}>
                {shopInfo?.describe}
              </div>
            </div>
            <div className={styles.company_info_right}>
              <div className={styles.shop_ul}>
                <div className={styles.shop_ul_li}>
                  <img className={styles.shop_ul_li_icon} src={areaIcon} />
                  <div className={styles.shop_ul_li_main}>
                    <div className={styles.shop_ul_li_main_title}>
                      {locale['areas']}
                    </div>
                    <span title={formatAreas(shopInfo?.areas)}>
                      {formatAreas(shopInfo?.areas)}
                    </span>
                  </div>
                </div>
                <div className={styles.shop_ul_li}>
                  <img className={styles.shop_ul_li_icon} src={captitalIcon} />
                  <div className={styles.shop_ul_li_main}>
                    <div className={styles.shop_ul_li_main_title}>
                      {locale['registeredCapital']}
                    </div>
                    <span>{shopInfo?.registeredCapital}</span>
                  </div>
                </div>
                <div className={styles.shop_ul_li}>
                  <img
                    className={styles.shop_ul_li_icon}
                    src={registerYearIcon}
                  />
                  <div className={styles.shop_ul_li_main}>
                    <div className={styles.shop_ul_li_main_title}>
                      {locale['establishmentDate']}
                    </div>
                    <span>{getYear(shopInfo?.establishmentDate)}</span>
                  </div>
                </div>
                <div className={styles.shop_ul_li}>
                  <img className={styles.shop_ul_li_icon} src={saleAreaIcon} />
                  <div className={styles.shop_ul_li_main}>
                    <div className={styles.shop_ul_li_main_title}>
                      {locale['sale.areas']}
                    </div>
                    <span title={formatAreasToProvice(shopInfo?.areas)}>
                      {formatAreasToProvice(shopInfo?.areas)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    )
  }

  return (
    <LocaleReceiver componentName="CompanyInfo">
      {renderComponent}
    </LocaleReceiver>
  )
}

export default CompanyInfo
