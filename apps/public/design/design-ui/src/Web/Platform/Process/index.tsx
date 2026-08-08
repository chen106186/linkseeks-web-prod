import React, { useState } from 'react'
import cx from 'classnames'
import { Input } from 'antd'
import ImageBox from '@apps/components/src/web/ImageBox'
import processIcon from './imgs/process_icon.png'
import formBg from './imgs/process_form_bg.png'
import companyIcon from './imgs/company_icon.png'
import supplyIcon from './imgs/supply_icon.png'
import styles from './index.less'
import { PlatformLocale } from '../../../locale/types/platform'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'

interface ProcessItemType {
  id: number
  describe: string
  logo: string
  memberName: string
  categoryBOList: string
  plantArea: number // 厂房面积
  yearProcessAmount: number // 年加工额
}

interface ProcessInfo {
  advertImg: string
  link: string
  advertTitle: string
  advertDescribe: string
  processMerchantList: ProcessItemType[]
}

interface ProcessPorps {
  className?: string
  dataInfo: ProcessInfo
}

const Process: React.FC<ProcessPorps> = (props) => {
  const { className, dataInfo, ...others } = props
  const [tabType, setTabType] = useState<number>(1)
  const [processCount, setProcessCount] = useState<string>()

  const classNameString = cx(styles.process, className)

  const nullArr = Array.from({ length: 6 }, (_, i) => i + 1)

  const renderComponent = (locale: PlatformLocale) => {
    const renderPlantArea = (type: number) => {
      switch (type) {
        case 1:
          return `100m2${locale['platform.under']}`
        case 2:
          return '100-200m2'
        case 3:
          return '201-500m2'
        case 4:
          return '501-1000m2'
        case 5:
          return '1001-5000m2'
        case 6:
          return `5000m2${locale['platform.above']}`
        default:
          return ''
      }
    }

    const renderYearProcessAmount = (type: number) => {
      switch (type) {
        case 1:
          return `50${locale['platform.unit.ten.thousand']}${locale['platform.under']}`
        case 2:
          return `50-100${locale['platform.unit.ten.thousand']}`
        case 3:
          return `101-500${locale['platform.unit.ten.thousand']}`
        case 4:
          return `501-1000${locale['platform.unit.ten.thousand']}`
        case 5:
          return `1001-2000${locale['platform.unit.ten.thousand']}`
        case 6:
          return `2000${locale['platform.unit.ten.thousand']}${locale['platform.above']}`
        default:
          return ''
      }
    }

    return (
      <div className={classNameString} {...others}>
        <div className={cx(styles.module_card, styles.autoWidth)}>
          <div className={styles.module_card_title}>
            <i className={styles.module_card_title_icon}>
              <img src={processIcon} />
            </i>
            <label className={styles.module_card_title_label}>
              {locale['platform.process.title']}
            </label>
            <div
              className={styles.advert_box}
              title={`${dataInfo.advertTitle}_${dataInfo.advertDescribe}`}
            >
              {dataInfo.advertImg ? (
                <ImageBox width={400} height={48} src={dataInfo.advertImg} />
              ) : (
                <div className={styles.process_advert_null}>广告图</div>
              )}
            </div>
          </div>
          <div className={styles.list}>
            {dataInfo.processMerchantList?.length > 0
              ? dataInfo.processMerchantList.map((item) => (
                  <div
                    className={styles.list_item}
                    key={`list_item_${item.id}`}
                  >
                    <div className={styles.line}>
                      <div className={styles.imgbox}>
                        <ImageBox width={24} height={24} src={item.logo} />
                      </div>
                      <div className={styles.name}>{item.memberName}</div>
                    </div>
                    <div className={cx(styles.line, styles.martop16)}>
                      <div className={styles.line_item}>
                        <img className={styles.icon} src={companyIcon} />
                        <span>{renderPlantArea(item.plantArea)}</span>
                      </div>
                      <div className={styles.line_item}>
                        <img className={styles.icon} src={supplyIcon} />
                        <span>
                          {renderYearProcessAmount(item.yearProcessAmount)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.text_line}>
                      <label>{locale['platform.main.process']}：</label>
                      <span>{item.categoryBOList} </span>
                    </div>
                  </div>
                ))
              : nullArr?.map((item) => <div className={styles.process_null} />)}
          </div>
        </div>
        <div
          className={cx(styles.form_box, styles.log)}
          style={{ backgroundImage: `url(${formBg})` }}
        >
          <div className={styles.tab}>
            <div
              className={cx(styles.tab_item, tabType === 1 && styles.active)}
              onClick={() => setTabType(1)}
            >
              {locale['platform.process.find']}
            </div>
            <div
              className={cx(styles.tab_item, tabType === 2 && styles.active)}
              onClick={() => setTabType(2)}
            >
              {locale['platform.process.dispatch']}
            </div>
          </div>
          <div className={styles.form_body}>
            <div className={styles.form_item}>
              <label>{locale['platform.logistic.goods']}：</label>
              <span>{locale['platform.category.select']}</span>
            </div>
            <div className={styles.form_item}>
              <label>{locale['platform.area']}：</label>
              <span>{locale['platform.area.select']}</span>
            </div>
            <div className={styles.form_item}>
              <label>{locale['platform.count']}：</label>
              <Input
                value={processCount}
                onChange={(e) => setProcessCount(e.target.value)}
                placeholder={locale['platform.count.input']}
                className={styles.inputbox}
                maxLength={15}
              />
            </div>
            <div className={styles.form_item}>
              <label>{locale['platform.scope']}：</label>
              <span>{locale['platform.scope.select']}</span>
            </div>
            <div className={cx(styles.form_btn, styles.process_btn)}>
              {locale['platform.submit.btn']}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <LocaleReceiver componentName="Platform">{renderComponent}</LocaleReceiver>
  )
}

export default Process
