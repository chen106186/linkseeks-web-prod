import React, { useEffect, useState } from 'react'
import { GetOrderCommonShopProductHistoryPageResponseDetail, getOrderCommonShopProductHistoryPage } from '@apps/apis'
import { dateFormat } from '@apps/utils/src/format'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import styles from '../../index.module.less'

const NewTrade: React.FC = () => {
  const { mallInfo, userInfo } = useGlobalConext()
  const [list, setList] = useState<GetOrderCommonShopProductHistoryPageResponseDetail[]>([])
  const [translateY, setTranslateY] = useState<number>(0)
  const [current, setCurrent] = useState<number>(1)
  const [pageSize] = useState<number>(20)

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
    if (!import.meta.env.SSR) {
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
              setCurrent(current + 1)
            }
          }, autoPlaySpeed)
        }
      }
    }
  }
  useEffect(() => {
    if (userInfo) {
      fetchData()
    }
  }, [current, userInfo])

  const fetchData = () => {
    let param: any = {
      shopId: mallInfo?.id,
      current: current,
      pageSize: pageSize,
    }

    getOrderCommonShopProductHistoryPage(param).then((res: any) => {
      if (res.code === 1000) {
        let newList = [...list, ...res.data.data]
        setList(newList)
        let maxLenght = newList.length
        if (res.data.data && res.data.data.length > 0) {
          autoPlayList(maxLenght)
        }
      }
    })
  }

  return (
    <div className={styles.new_trade}>
      <div className={styles.find_more_title}>
        <label>{translate('web.resource.mall.zuixinchengjiao')}</label>
      </div>
      <div className={styles.new_trade_list_wrap} style={{}}>
        <div className={styles.new_trade_list} id="newTradeList">
          {list &&
            list.map((item, index) => (
              <div className={styles.new_trade_list_item} key={`new_trade_list_item_${index}`}>
                <div className={styles.new_trade_list_item_header}>
                  <span>{item.productName}</span>
                  <div className={styles.price}>{item.quantity}</div>
                </div>
                <div className={styles.new_trade_list_item_content}>
                  <span className={styles.content_text}>{dateFormat(new Date(item.createTime), 'MM/DD HH:mm')}</span>
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
