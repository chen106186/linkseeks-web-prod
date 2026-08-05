import React, { useState } from 'react'
import cx from 'classnames'
import { Input } from 'antd'
import ImageBox from '@apps/components/src/web/ImageBox'
import logisticsIcon from './imgs/logistics_icon.png'
import formBg from './imgs/logistics_form_bg.png'
import styles from './index.less'
import { PlatformLocale } from '../../../locale/types/platform'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'

interface LogisticsItemType {
  id: number
  describe: string
  logo: string
  memberName: string
  mainBusiness: string
}

interface LogisticsInfo {
  advertImg: string
  link: string
  advertTitle: string
  advertDescribe: string
  logisticsMerchantList: LogisticsItemType[]
}

interface LogisticsProps {
  className?: string
  dataInfo: LogisticsInfo
}

const Logistics: React.FC<LogisticsProps> = (props) => {
  const { className, dataInfo, ...others } = props
  const [tabType, setTabType] = useState<number>(1)
  const [goodsWeight, setGoodsWeight] = useState<string>()

  const classNameString = cx(styles.logistics, className)

  const nullArr = Array.from({ length: 6 }, (_, i) => i + 1)

  const renderComponent = (locale: PlatformLocale) => (
    <div className={classNameString} {...others}>
      <div className={cx(styles.module_card, styles.autoWidth)}>
        <div className={styles.module_card_title}>
          <i className={styles.module_card_title_icon}>
            <img src={logisticsIcon} />
          </i>
          <label className={styles.module_card_title_label}>
            {locale['platform.logistic.title']}
          </label>
          <div
            className={styles.advert_box}
            title={`${dataInfo.advertTitle}_${dataInfo.advertDescribe}`}
          >
            {dataInfo.advertImg ? (
              <ImageBox width={400} height={48} src={dataInfo.advertImg} />
            ) : (
              <div className={styles.logistics_advert_null}>广告图</div>
            )}
          </div>
        </div>
        <div className={styles.list}>
          {dataInfo?.logisticsMerchantList?.length > 0
            ? dataInfo.logisticsMerchantList.map(
                (item, index) =>
                  index < 6 && (
                    <div className={styles.list_item} key={item.id}>
                      <div className={styles.line}>
                        <div className={styles.imgbox}>
                          <ImageBox width={24} height={24} src={item.logo} />
                        </div>
                        <div className={styles.name}>{item.memberName}</div>
                      </div>
                      <div className={styles.tag}>{item.describe}</div>
                      <div className={styles.text_line}>
                        <label>{locale['platform.main.business']}：</label>
                        <span>{item.mainBusiness}</span>
                      </div>
                    </div>
                  ),
              )
            : nullArr?.map((item) => <div className={styles.logistics_null} />)}
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
            {locale['platform.logistic.findcar']}
          </div>
          <div
            className={cx(styles.tab_item, tabType === 2 && styles.active)}
            onClick={() => setTabType(2)}
          >
            {locale['platform.logistic.dispatch']}
          </div>
        </div>
        <div className={styles.form_body}>
          <div className={styles.form_item}>
            <label>{locale['platform.logistic.begin.address']}：</label>
            <span>{locale['platform.logistic.begin.address.select']}</span>
          </div>
          <div className={styles.form_item}>
            <label>{locale['platform.logistic.end.address']}：</label>
            <span>{locale['platform.logistic.end.address.select']}</span>
          </div>
          <div className={styles.form_item}>
            <label>{locale['platform.logistic.goods']}：</label>
            <span>{locale['platform.logistic.goods.select']}</span>
          </div>
          <div className={styles.form_item}>
            <label>{locale['platform.logistic.weight']}：</label>
            <Input
              value={goodsWeight}
              onChange={(e) => setGoodsWeight(e.target.value)}
              placeholder={locale['platform.logistic.weight.input']}
              className={styles.inputbox}
            />
          </div>
          <div className={styles.form_btn}>{locale['platform.submit.btn']}</div>
        </div>
      </div>
    </div>
  )

  return (
    <LocaleReceiver componentName="Platform">{renderComponent}</LocaleReceiver>
  )
}

export default Logistics
