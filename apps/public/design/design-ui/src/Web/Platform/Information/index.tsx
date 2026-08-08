import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { CaretDownOutlined } from '@ant-design/icons'
import infoIcon from './imgs/info_icon.png'
import AreaChart from './AreaChart'
import styles from './index.less'
import { PlatformLocale } from '../../../locale/types/platform'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'

interface DatePriceItemType {
  date: string
  price: number
  rate: string
}

interface MarketItem {
  priceLabel: string
  goodsName: string
  unitId: number | undefined
  unitName: string
  datePriceBOList: DatePriceItemType[]
}

interface InformationItemType {
  id: number
  title: string
  createTime: number
}

interface InformationProps {
  className?: string
  marketList: MarketItem[]
  information: {
    allList: InformationItemType[]
    bazaarList: InformationItemType[]
    hotList: InformationItemType[]
  }
}

const Information: React.FC<InformationProps> = (props) => {
  const { className, marketList, information, ...others } = props
  const [purchaseType, setPurchaseType] = useState<number>(0)
  const [informationType, setInformationType] = useState<number>(0)
  const [currentMarketItem, setCurrentMarketItem] = useState<
    MarketItem | undefined
  >(marketList[0])

  const classNameString = cx(styles.information, className)

  const [priceList, setPriceList] = useState<DatePriceItemType[]>([])
  const [currentRate, setCurrentRate] = useState<string>('-%')

  const init = () => {
    const marketItem = marketList[0]
    if (marketItem && marketItem.datePriceBOList) {
      const datePriceList = marketItem.datePriceBOList.filter(
        (item) => Number(item.price) > 0,
      )
      const newPriceList: DatePriceItemType[] = []
      for (let i = 0; i < datePriceList.length; i++) {
        const priceItem = { ...datePriceList[i] }
        if (i === 0) {
          priceItem['rate'] = '-%'
        } else {
          // （当前日价格-上一日价格）/ 上一日价格 * 100%
          const prevPriceItem = datePriceList[i - 1]
          const currentPrice = Number(priceItem.price)
          const prevPrice = Number(prevPriceItem.price)
          const rate = ((currentPrice - prevPrice) / prevPrice) * 100
          priceItem['rate'] = `${rate.toFixed(2)}%`
        }
        newPriceList.push(priceItem)
      }
      if (newPriceList.length > 1) {
        const lastItem = newPriceList[newPriceList.length - 1]
        setCurrentRate(lastItem.rate)
      }
      setPriceList(newPriceList)
    }
    setCurrentMarketItem(marketItem)
  }

  useEffect(() => {
    init()
  }, [marketList])

  const renderInformationByType = () => {
    let list: InformationItemType[] = []
    switch (informationType) {
      case 0:
        list = information.allList
        break
      case 1:
        list = information.bazaarList
        break
      case 2:
        list = information.hotList
        break
      default:
        break
    }
    return (
      <div className={styles.publicity_list}>
        {list &&
          list.map((item) => (
            <div
              className={styles.publicity_list_item}
              key={`publicity_list_item-${item.id}`}
            >
              {item.title}
            </div>
          ))}
      </div>
    )
  }

  const getCurrentMarketProductPrice = () => {
    if (!currentMarketItem) {
      return 0
    }
    const datePriceList = currentMarketItem.datePriceBOList
    return datePriceList[datePriceList.length - 1]
      ? datePriceList[datePriceList.length - 1].price
      : 0
  }

  const handleTooltipChange = (e: any) => {
    const {
      data: { items },
    } = e
    const item = items[0]
    if (item) {
      setCurrentRate(item.data.rate)
    }
  }

  const renderComponent = (locale: PlatformLocale) => (
    <div className={classNameString} {...others}>
      <div className={cx(styles.module_card, styles.autoWidth)}>
        <div className={styles.module_card_title}>
          <i className={styles.module_card_title_icon}>
            <img src={infoIcon} />
          </i>
          <label className={styles.module_card_title_label}>
            {locale['platform.information.title']}
          </label>
          <div className={styles.type_list}>
            {marketList &&
              marketList.map((item, index) => (
                <div
                  key={`type_list_item_${index}`}
                  className={cx(
                    styles.type_list_item,
                    purchaseType === index && styles.active,
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    setPurchaseType(index)
                    setCurrentMarketItem(marketList[index])
                  }}
                >
                  {item.priceLabel}
                </div>
              ))}
          </div>
        </div>
        <div className={styles.information_body}>
          <div className={styles.show_data_box}>
            <div className={styles.data_name}>
              {currentMarketItem ? currentMarketItem.goodsName : ''}
            </div>
            <div className={styles.data_price}>
              ¥ {getCurrentMarketProductPrice()}
            </div>
            <div className={styles.data_unit}>
              {currentMarketItem ? `每${currentMarketItem.unitName}` : ''}
            </div>
            <div className={styles.data_rate}>
              <div className={styles.rate_box}>
                <CaretDownOutlined />
                <span>{currentRate}</span>
              </div>
              <span>{locale['platform.sold.ratio']}</span>
            </div>
          </div>
          <div className={styles.chart_box}>
            <AreaChart data={priceList} onTooltipChange={handleTooltipChange} />
          </div>
        </div>
      </div>
      <div className={styles.purchase_publicity}>
        <div className={styles.purchase_publicity_title}>
          <div className={styles.publicity_type}>
            <div
              className={cx(
                styles.publicity_type_item,
                informationType === 0 ? styles.active : '',
              )}
              onClick={(e) => {
                e.preventDefault()
                setInformationType(0)
              }}
            >
              {locale['platform.information.tab.all']}
            </div>
            <div
              className={cx(
                styles.publicity_type_item,
                informationType === 1 ? styles.active : '',
              )}
              onClick={(e) => {
                e.preventDefault()
                setInformationType(1)
              }}
            >
              {locale['platform.information.tab.market']}
            </div>
            <div
              className={cx(
                styles.publicity_type_item,
                informationType === 2 ? styles.active : '',
              )}
              onClick={(e) => {
                e.preventDefault()
                setInformationType(2)
              }}
            >
              {locale['platform.information.tab.hot']}
            </div>
          </div>
          <div className={styles.publicity_more}>
            {locale['platform.more.btn']} &gt;
          </div>
        </div>
        <div className={styles.purchase_publicity_body}>
          {renderInformationByType()}
        </div>
      </div>
    </div>
  )

  return (
    <LocaleReceiver componentName="Platform">{renderComponent}</LocaleReceiver>
  )
}

export default Information
