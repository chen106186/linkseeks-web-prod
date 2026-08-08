import React, { useEffect, useState } from 'react'
import { dateFormat } from '@apps/utils/src/format'
import { getWebIntl } from '@apps/locales'
import styles from '../../index.less'

export interface TradeItemType {
  /**
   * 订单时间，格式为yyyy-MM-dd HH:mm:ss
   */
  createTime: string
  /**
   * 商品名称
   */
  productName: string
  /**
   * 品类
   */
  category: string
  /**
   * 品牌
   */
  brand: string
  /**
   * 规格
   */
  spec: string
  /**
   * 计价单位
   */
  unit: string
  /**
   * 数量
   */
  quantity: string
}

interface IProps {
  list: TradeItemType[] | undefined
}

const NewTrade: React.FC<IProps> = (props) => {
  const { list } = props
  const [translateY, setTranslateY] = useState<number>(0)
  const translate = getWebIntl()

  let distance = translateY
  let timer: any = null

  useEffect(() => {
    return () => {
      clearInterval(timer)
      timer = null
    }
  }, [])

  const autoPlayList = (maxLenght: number) => {
    if (typeof window !== 'undefined') {
      const newTradeList: any = document.getElementById('newTradeList')
      if (newTradeList) {
        const autoPlaySpeed = 5000
        const unitDistance = 79
        if (maxLenght > 4) {
          const maxDistance = (maxLenght - 3) * unitDistance
          timer = setInterval(() => {
            distance += unitDistance
            if (distance < maxDistance) {
              newTradeList.style = `transform: translateY(${-distance}px);`
            } else {
              clearInterval(timer)
              timer = null
              setTranslateY(distance - unitDistance)
            }
          }, autoPlaySpeed)
        }
      }
    }
  }

  useEffect(() => {
    if (list && list.length > 0) {
      autoPlayList(list.length)
    }
  }, [list])

  return (
    <div className={styles.new_trade}>
      <div className={styles.find_more_title}>
        <label>{translate('web.resource.mall.zuixinchengjiao' as never)}</label>
      </div>
      <div className={styles.new_trade_list_wrap} style={{}}>
        <div className={styles.new_trade_list} id="newTradeList">
          {list &&
            list.map((item, index) => (
              <div
                className={styles.new_trade_list_item}
                key={`new_trade_list_item_${index}`}
              >
                <div className={styles.new_trade_list_item_header}>
                  <span>{item.productName}</span>
                  <div className={styles.price}>{item.quantity}</div>
                </div>
                <div className={styles.new_trade_list_item_content}>
                  <span className={styles.content_text}>
                    {dateFormat(new Date(item.createTime), 'MM/DD HH:mm')}
                  </span>
                  <span className={styles.content_time}>{item.unit}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default NewTrade
