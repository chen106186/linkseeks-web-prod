import React, { useEffect, useState } from 'react'
import { getReportMallGetPopularShopList } from '@apps/apis'
import ImageBox from '@apps/components/src/web/ImageBox'
import { getWebIntl } from '@apps/locales'
import top1Icon from './imgs/top1.png'
import top2Icon from './imgs/top2.png'
import top3Icon from './imgs/top3.png'
import styles from '../../index.less'

interface PopularShopsPropsType {}

const PopularShops: React.FC<PopularShopsPropsType> = (props) => {
  const [shopList, setShopList] = useState<any[]>([])
  const translate = getWebIntl()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    getReportMallGetPopularShopList().then((res) => {
      if (res.code === 1000) {
        setShopList(res.data)
      }
    })
  }

  const renderRank = (rank: number) => {
    switch (rank) {
      case 1:
        return <img src={top1Icon} />
      case 2:
        return <img src={top2Icon} />
      case 3:
        return <img src={top3Icon} />
      default:
        return <span>0{rank}</span>
    }
  }

  return (
    <div className={styles.popular_shops}>
      <div className={styles.find_more_title}>
        <label>{translate('web.resource.mall.popularStore')}</label>
        <span>
          {translate('web.resource.mall.paimingmeitianlingchengengxin')}
        </span>
        <a className={styles.more_btn} href="/stores">
          {translate('web.common.more')} &gt;
        </a>
      </div>
      <div className={styles.popular_shops_list}>
        {shopList &&
          shopList.map(
            (item, index) =>
              index <= 5 && (
                <a
                  title={item.memberName}
                  href={`/shop/${item.memberShopId}`}
                  className={styles.popular_shops_list_item}
                  key={item.memberShopId || index}
                >
                  <div className={styles.popular_shops_rank}>
                    {renderRank(index + 1)}
                  </div>
                  <div className={styles.popular_shops_logo}>
                    <ImageBox
                      width={36}
                      height={36}
                      src={item.memberLogo}
                      alt={item.name}
                    />
                  </div>
                  <div className={styles.popular_shops_name}>
                    <span>{item.name || item.memberName}</span>
                  </div>
                </a>
              ),
          )}
      </div>
    </div>
  )
}

export default PopularShops
