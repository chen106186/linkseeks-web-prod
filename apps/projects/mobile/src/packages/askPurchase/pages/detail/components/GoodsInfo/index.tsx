import React, { Dispatch, SetStateAction } from 'react'
import { View, Image, Text } from '@apps/mobile-ui'
import { GetTradeAskPurchaseDetailForShopResponse } from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { getIcon, getName, handleOpenDocument } from '../Enclosure'
import { PAGE_TYPE } from '../../index'
import styles from '../../index.module.scss'
import { useMobileIntl } from '@apps/locales'

interface IProps {
  expandIds: number[]
  dataSoucre: GetTradeAskPurchaseDetailForShopResponse | undefined
  PAGE: PAGE_TYPE
  setExpandIds: Dispatch<SetStateAction<number[]>>
}

const commonCellSyle: Record<string, React.CSSProperties> = {
  customHeadStyle: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  customValueStyle: {
    fontSize: 12,
  },
  customTitleStyle: {
    fontSize: 12,
  },
}

const GoodsInfo: React.FC<IProps> = ({ expandIds, dataSoucre, PAGE, setExpandIds }) => {
  const goodsList = dataSoucre?.askPurchaseGoodsResponses || []
  const translate = useMobileIntl()

  const handleExpand = (id: number) => {
    if (expandIds.includes(id)) {
      setExpandIds(expandIds.filter((item) => item !== id))
    } else {
      setExpandIds([...expandIds, id])
    }
  }

  if (PAGE === 'LIST') {
    return (
      <MellowCard
        title={translate('mobile.resource.askPurchase.shangpin')}
        className={styles['inquiryDetailContainer-customStyle']}
        bodyStyle={{
          padding: 0,
        }}
      >
        {(dataSoucre?.askPurchaseGoodsResponses || []).map((item: any) => (
          <View className={styles['inquiryDetailContainer-productBox']} key={`box_${item.id}`}>
            <View className={styles['inquiryDetailContainer-productWrap']}>
              <Text className={styles['inquiryDetailContainer-productWrapTitle']}>{item.goodsName}</Text>
              <Text className={styles['inquiryDetailContainer-productWrapCount']}>{`x${item.num}`}</Text>
            </View>
          </View>
        ))}
      </MellowCard>
    )
  }

  const show =
    PAGE === 'BUYER_LIST'
      ? dataSoucre?.status !== 3 && dataSoucre?.status !== 9
      : [1, 2, 3, 10, 11, 12].includes(dataSoucre?.status!)

  return show ? (
    <MellowCard
      title={translate('mobile.resource.askPurchase.xunyuanwuliaoxinxi')}
      className={styles['inquiryDetailContainer-customStyle']}
      bodyStyle={{
        padding: 0,
      }}
    >
      {goodsList &&
        goodsList.length > 0 &&
        goodsList.map((goodsItem) => (
          <View className={styles['inquiryDetailContainer-quoteTitleBox']} key={goodsItem.id}>
            <View className={styles['inquiryDetailContainer-quoteTitle-wrap']}>
              <View className={styles['inquiryDetailContainer-quoteTitle-split']}></View>
              <Text className={styles['inquiryDetailContainer-goodsTitle']}>{goodsItem.goodsName}</Text>
              <View className={styles['more-btn-wrap']} onClick={() => handleExpand(goodsItem.id)}>
                <Image
                  src={
                    expandIds.includes(goodsItem.id)
                      ? 'https://static.dbydata.cn/web-static/images/show.svg'
                      : 'https://static.dbydata.cn/web-static/images/next.svg'
                  }
                  style={{ width: pxTransform(15), height: pxTransform(15), marginLeft: pxTransform(5) }}
                />
              </View>
            </View>
            <Text className={styles['inquiryDetailContainer-quoteCount']}>x{goodsItem.num}</Text>
            {expandIds.includes(goodsItem.id) && (
              <Cell customStyle={{ padding: 0, marginTop: 8 }}>
                <Cell.Item
                  {...commonCellSyle}
                  title={translate('mobile.resource.askPurchase.wuliaobianma')}
                  value={goodsItem.goodsNo}
                />
                <Cell.Item
                  {...commonCellSyle}
                  title={translate('mobile.resource.askPurchase.wuliaomingcheng')}
                  value={goodsItem.goodsName}
                />
                <Cell.Item
                  {...commonCellSyle}
                  title={translate('mobile.resource.askPurchase.guigexinghao')}
                  value={goodsItem.specification}
                />
                <Cell.Item
                  {...commonCellSyle}
                  title={translate('mobile.resource.askPurchase.pinlei')}
                  value={goodsItem.categoryName}
                />
                <Cell.Item
                  {...commonCellSyle}
                  title={translate('mobile.resource.askPurchase.pinpai')}
                  value={goodsItem.brandName || ''}
                />
                <Cell.Item
                  {...commonCellSyle}
                  title={translate('mobile.resource.askPurchase.danwei')}
                  value={goodsItem.unit}
                />
                <Cell.Item
                  {...commonCellSyle}
                  title={translate('mobile.resource.askPurchase.xunyuanshuliang')}
                  value={goodsItem.num}
                />
                <Cell.Item title={translate('mobile.resource.askPurchase.fujian')} />
                <View className={styles['inquiryDetailContainer-uploadBox']}>
                  {(goodsItem?.enclosureUrls || []).map((item: any, index: number) => (
                    <View
                      className={styles['inquiryDetailContainer-uploadBoxItem']}
                      key={`${index}_${item.name}`}
                      onClick={() => handleOpenDocument(item)}
                    >
                      <Image className={styles.icon} src={getIcon(item.url)} />
                      <Text className={styles['file-name']}>{getName(item.name)}</Text>
                    </View>
                  ))}
                </View>
              </Cell>
            )}
          </View>
        ))}
    </MellowCard>
  ) : null
}

export default GoodsInfo
