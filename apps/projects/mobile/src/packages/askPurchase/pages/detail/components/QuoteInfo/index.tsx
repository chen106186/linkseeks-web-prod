import React, { Fragment, Dispatch, SetStateAction } from 'react'
import { View, Image, Text, Toast } from '@apps/mobile-ui'
import { GetTradeMobileAskPurchaseAskPurchaseQuoteDetailResponse } from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import { pxTransform, setClipboardData } from '@apps/mobile-services/utils/taro'
import Empty from '@/components/Empty'
import styles from '../../index.module.scss'
import { useMobileIntl } from '@apps/locales'

interface IProps {
  expandIds: number[]
  quoteInfo: GetTradeMobileAskPurchaseAskPurchaseQuoteDetailResponse | undefined
  setExpandIds: Dispatch<SetStateAction<number[]>>
}

const QuoteInfo: React.FC<IProps> = ({ expandIds, quoteInfo, setExpandIds }) => {
  const translate = useMobileIntl()

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

  const handleExpand = (id: number) => {
    if (expandIds.includes(id)) {
      setExpandIds(expandIds.filter((item) => item !== id))
    } else {
      setExpandIds([...expandIds, id])
    }
  }

  const clipboard = (dataText: any) => {
    setClipboardData({
      data: dataText,
      success: () => {
        Toast.show({
          title: translate('mobile.resource.askPurchase.neirongfuzhichenggong'),
          icon: 'none',
        })
      },
    })
  }

  return quoteInfo ? (
    <Fragment>
      <MellowCard
        title={translate('mobile.resource.askPurchase.baojiadanxinxi')}
        className={styles['inquiryDetailContainer-customStyle']}
        bodyStyle={{
          padding: 0,
        }}
      >
        <Cell>
          <Cell.Item
            title={translate('mobile.resource.askPurchase.baojiadanhao')}
            value={
              <View>
                <Text style={{ color: '#91959b' }}>{quoteInfo.quoteNo}</Text>
                <Text
                  onClick={() => clipboard(quoteInfo?.quoteNo)}
                  className={styles['inquiryDetailContainer-textCopyStyle']}
                >
                  {translate('mobile.common.copy')}
                </Text>
              </View>
            }
          />
          <Cell.Item title={translate('mobile.resource.askPurchase.baojiazhaiyao')} value={quoteInfo.name} />
          <Cell.Item title={translate('mobile.resource.askPurchase.lianxiren')} value={quoteInfo.contactName} />
          <Cell.Item title={translate('mobile.resource.askPurchase.lianxidianhua')} value={quoteInfo.contactMobile} />
          <Cell.Item title={translate('mobile.resource.askPurchase.bizhong')} value={quoteInfo.currencyName} />
        </Cell>
      </MellowCard>
      <MellowCard
        title={translate('mobile.resource.askPurchase.baojiadanxinxi')}
        className={styles['inquiryDetailContainer-customStyle']}
        bodyStyle={{
          padding: 0,
        }}
      >
        {quoteInfo.askPurchaseQuoteGoodsResponses && quoteInfo.askPurchaseQuoteGoodsResponses.length > 0 ? (
          quoteInfo.askPurchaseQuoteGoodsResponses.map((goodsItem) => (
            <View className={styles['inquiryDetailContainer-quoteTitleBox']} key={`goods-${goodsItem.id}`}>
              <View className={styles['inquiryDetailContainer-quoteTitle-wrap']}>
                <View className={styles['inquiryDetailContainer-quoteTitle-split']}></View>
                <Text className={styles['inquiryDetailContainer-quoteTitle']}>{goodsItem.goodsName}</Text>
                <View
                  className={styles['inquiryDetailContainer-more-btn-wrap']}
                  onClick={() => handleExpand(goodsItem.id)}
                >
                  <Text className={styles['inquiryDetailContainer-more-btn']}>
                    {expandIds.includes(goodsItem.id)
                      ? translate('mobile.common.shouqi')
                      : translate('mobile.resource.askPurchase.gengduoxiangqing')}
                  </Text>
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
              <Text className={styles['inquiryDetailContainer-quoteCount']}>
                {translate('mobile.resource.askPurchase.caigouliang')} x{goodsItem.num}
              </Text>
              {expandIds.includes(goodsItem.id) && (
                <Cell customStyle={{ padding: 0, marginTop: 8 }}>
                  <Cell.Item
                    {...commonCellSyle}
                    title={translate('mobile.resource.askPurchase.shifouhanshui')}
                    value={goodsItem.includeTax === 1 ? translate('mobile.common.shi') : translate('mobile.common.fou')}
                  />
                  <Cell.Item
                    {...commonCellSyle}
                    title={translate('mobile.resource.askPurchase.shuilv')}
                    value={`${goodsItem.taxRate}%`}
                  />
                  <Cell.Item
                    {...commonCellSyle}
                    title={translate('mobile.resource.askPurchase.danjiahanshui')}
                    value={`￥${goodsItem.unitPriceWithTax}`}
                  />
                  <Cell.Item
                    {...commonCellSyle}
                    title={translate('mobile.resource.askPurchase.zongjiahanshui')}
                    value={`￥${goodsItem.totalPriceWithTax}`}
                  />
                  <Cell.Item
                    {...commonCellSyle}
                    title={translate('mobile.resource.askPurchase.danjiabuhanshui')}
                    value={`￥${goodsItem.unitPriceWithoutTax}`}
                  />
                  <Cell.Item
                    {...commonCellSyle}
                    title={translate('mobile.resource.askPurchase.zongjiabuhanshui')}
                    value={`￥${goodsItem.totalPriceWithoutTax}`}
                  />
                  <Cell.Item
                    {...commonCellSyle}
                    title={translate('mobile.resource.askPurchase.baojiayouxiaoqi')}
                    value={`${goodsItem.quoteStartTime} ~ ${goodsItem.quoteEndTime}`}
                  />
                  <Cell.Item
                    {...commonCellSyle}
                    title={translate('mobile.resource.askPurchase.guanlianbaojiashangpin')}
                    value={goodsItem.commodityName}
                  />
                  <Cell.Item
                    {...commonCellSyle}
                    title={translate('mobile.resource.askPurchase.caigouqudao')}
                    value={goodsItem.shopName}
                  />
                </Cell>
              )}
            </View>
          ))
        ) : (
          <Empty description={translate('mobile.resource.askPurchase.zanwubaojiaxinxi')} />
        )}
      </MellowCard>
    </Fragment>
  ) : null
}

export default QuoteInfo
