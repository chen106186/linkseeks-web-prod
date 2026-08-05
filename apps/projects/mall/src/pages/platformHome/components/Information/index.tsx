import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { CaretDownOutlined } from '@ant-design/icons'
import { useGlobalConext } from '@/context/globalProvider'
import infoIcon from '../icons/info_icon.png'
// import AreaChart from '@/components/AreaChart'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

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
  marketList: MarketItem[]
  information: {
    allList: InformationItemType[]
    bazaarList: InformationItemType[]
    hotList: InformationItemType[]
    allIdList: number[]
    bazaarIdList: number[]
    hotIdList: number[]
  }
  anchor: string
}

const Information: React.FC<InformationProps> = (props) => {
  const { marketList, information, anchor } = props
  const { mallUrl } = useGlobalConext()
  const [purchaseType, setPurchaseType] = useState<number>(0)
  const [informationType, setInformationType] = useState<number>(0)
  const [currentMarketItem, setCurrentMarketItem] = useState<MarketItem | undefined>(marketList[0])
  const [priceList, setPriceList] = useState<DatePriceItemType[]>([])
  const [currentRate, setCurrentRate] = useState<string>('-%')
  const translate = getWebIntl()

  const init = (index: number) => {
    const marketItem = marketList[index]
    if (marketItem && marketItem.datePriceBOList) {
      const datePriceList = marketItem.datePriceBOList.filter((item) => Number(item.price) > 0)
      const newPriceList: DatePriceItemType[] = []
      for (let i = 0; i < datePriceList.length; i++) {
        const priceItem = datePriceList[i]
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
    init(0)
  }, [marketList])

  const getCurrentMarketProductPrice = () => {
    if (!currentMarketItem) {
      return 0
    }
    const datePriceList = currentMarketItem.datePriceBOList
    if (datePriceList[datePriceList.length - 1]) {
      return datePriceList[datePriceList.length - 1].price
    }
    return 0
  }

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
            <a
              href={`${mallUrl?.defaultEnterpriseUrl}/info/infoDetail/${item.id}`}
              target="_blank"
              className={styles.publicity_list_item}
              key={`publicity_list_item-${item.id}`}
            >
              {item.title}
            </a>
          ))}
      </div>
    )
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

  return (
    <div className={styles.information} id={anchor}>
      <div className={cx(styles.module_card, styles.autoWidth)}>
        <div className={styles.module_card_title}>
          <i className={styles.module_card_title_icon}>
            <img src={infoIcon} />
          </i>
          <label className={styles.module_card_title_label}>{translate('web.resource.mall.nav-info')}</label>
          <div className={styles.type_list}>
            {marketList &&
              marketList.map((item, index) => (
                <div
                  key={`type_list_item_${index}`}
                  className={cx(styles.type_list_item, purchaseType === index && styles.active)}
                  onClick={() => {
                    setPurchaseType(index)
                    setCurrentMarketItem(marketList[index])
                    init(index)
                  }}
                >
                  {item.priceLabel}
                </div>
              ))}
          </div>
        </div>
        <div className={styles.information_body}>
          <div className={styles.show_data_box}>
            <div className={styles.data_name}>{currentMarketItem ? currentMarketItem.goodsName : ''}</div>
            <div className={styles.data_price}>
              {translate('web.common.currencySymbol')} {getCurrentMarketProductPrice()}
            </div>
            <div className={styles.data_unit}>
              {currentMarketItem ? `${translate('web.resource.mall.mei')}${currentMarketItem.unitName}` : ''}
            </div>
            <div className={styles.data_rate}>
              <div className={styles.rate_box}>
                <CaretDownOutlined translate={undefined} />
                <span>{currentRate}</span>
              </div>
              <span>{translate('web.resource.mall.rihuanbi')}</span>
            </div>
          </div>
          <div className={styles.chart_box}>
            {/* <AreaChart
            data={priceList}
            onTooltipChange={handleTooltipChange}
          /> */}
          </div>
        </div>
      </div>
      <div className={styles.purchase_publicity}>
        <div className={styles.purchase_publicity_title}>
          <div className={styles.publicity_type}>
            <div
              className={cx(styles.publicity_type_item, informationType === 0 ? styles.active : '')}
              onClick={(e) => {
                e.preventDefault()
                setInformationType(0)
              }}
            >
              {translate('web.common.all')}
            </div>
            <div
              className={cx(styles.publicity_type_item, informationType === 1 ? styles.active : '')}
              onClick={(e) => {
                e.preventDefault()
                setInformationType(1)
              }}
            >
              {translate('web.resource.mall.shichanghangqing')}
            </div>
            <div
              className={cx(styles.publicity_type_item, informationType === 2 ? styles.active : '')}
              onClick={(e) => {
                e.preventDefault()
                setInformationType(2)
              }}
            >
              {translate('web.resource.mall.remenzixun')}
            </div>
          </div>
          <a href={`${mallUrl?.defaultEnterpriseUrl}/info`} target="_blank" className={styles.publicity_more}>
            {translate('web.common.more')}
            &gt;
          </a>
        </div>
        <div className={styles.purchase_publicity_body}>{renderInformationByType()}</div>
      </div>
    </div>
  )
}

export default Information
