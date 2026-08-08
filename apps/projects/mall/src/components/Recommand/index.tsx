import React, { useEffect, useState } from 'react'
import { postProductShopEnterpriseGetCommodityList, postProductShopSelfGetCommodityList } from '@apps/apis'
import { message } from 'antd'
import { getNameByPriceType } from '@/utils'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import { priceFormat } from '@apps/utils'
import ImageBox from '@apps/components/src/web/ImageBox'
import { LAYOUT_TYPE } from '@/types/global'
import styles from './index.module.less'
import useLink from '@/hooks/useLink'

interface RecommandPropsType {
  categoryIds: number[] // 商品品类集合
  loading: boolean
  memberId?: number
  shopInfo?: any
}

const Recommand: React.FC<RecommandPropsType> = (props) => {
  const { categoryIds, loading } = props
  const { mallInfo, layoutType } = useGlobalConext()
  const [list, setList] = useState<any>([])
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

  useEffect(() => {
    if (loading) {
      if (categoryIds && categoryIds.length > 0) {
        getCommodityListByCategoryIds()
      }
    }
  }, [loading])

  const getCommodityListByCategoryIds = async () => {
    let result: number[] = []
    for (const id of categoryIds) {
      const resList: any = await getListById(id)
      result = [...result, ...resList]
      if (result && result.length > 0) {
        setList(result)
        break
      }
    }
  }

  const getListById = (categoryId: number) => {
    return new Promise((resolve) => {
      const param: any = {
        current: 1,
        pageSize: 5,
        customerCategoryId: categoryId,
      }
      const headers: { type: number; shopId?: number } = {
        type: 1,
        shopId: mallInfo?.id,
      }
      let getFn
      if (layoutType === LAYOUT_TYPE.own) {
        param.memberId = mallInfo?.memberId
        getFn = postProductShopSelfGetCommodityList
      } else {
        getFn = postProductShopEnterpriseGetCommodityList
      }
      getFn(param, { headers }).then((res) => {
        if (res.code === 1000) {
          message.destroy()
          resolve(res.data.data)
        }
      })
    })
  }

  /**
   * 根据商城类型返回不同的商品详情链接
   * @param item
   */
  const getCommodityDetailLink = (item: any) => {
    if (layoutType === LAYOUT_TYPE.own) {
      return linkPrefix(`/${getNameByPriceType(item.priceType)}/detail/${item.id}`)
    } else {
      return linkPrefix(`/shop/${item.storeId}/${getNameByPriceType(item.priceType)}/detail/${item.id}`)
    }
  }

  const renderPriceByType = (commodityItem: any) => {
    switch (commodityItem.priceType) {
      // 现货价格
      case 1:
        return (
          <div className={styles.recommand_list_item_price}>
            <span>{translate('web.common.currencySymbol')}</span>
            {priceFormat(commodityItem.min)}
          </div>
        )
      // 价格需要询价
      case 2:
        return (
          <div className={styles.inquiry_price}>
            <label>{translate('web.resource.mall.zaixianxunjia')}</label>
          </div>
        )
      default:
        break
    }
  }

  return list && list.length > 0 ? (
    <div className={styles.recommand}>
      <div className={styles.recommand_title}>{translate('web.resource.mall.maijiahaizaikan')}</div>
      <div className={styles.recommand_list}>
        {list &&
          list.map(
            (item: any, index: number) =>
              index < 5 && (
                <a
                  href={getCommodityDetailLink(item)}
                  key={`recommand_list_item_${index}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className={styles.recommand_list_item}>
                    <div className={styles.recommand_list_item_img}>
                      <ImageBox width={220} height={220} src={item.mainPic} alt={item.name} />
                    </div>
                    {renderPriceByType(item)}
                    <div className={styles.recommand_list_item_name}>{item.name}</div>
                  </div>
                </a>
              ),
          )}
      </div>
    </div>
  ) : null
}

export default Recommand
