import React, { Dispatch, SetStateAction } from 'react'
import { View, Text, ScrollView, Button, Image, RadioGroup, Radio } from '@apps/mobile-ui'
import {
  GetTradeAskPurchaseDetailForShopResponse,
  GetTradeAskPurchasePriceComparisonInfoResponse,
  GetTradeMobileAskPurchaseQuoteRankListResponse,
} from '@apps/apis'
import cx from 'classnames'
import MellowCard from '@/components/MellowCard'
import rank1Icon from './icons/rank1.png'
import rank2Icon from './icons/rank2.png'
import rank3Icon from './icons/rank3.png'
import { PAGE_TYPE } from '../../index'
import styles from '../../index.module.scss'
import { PARITY_STATUS, SHOW_AWARD_STATUS } from '@/packages/askPurchase/constants'
import { useMobileIntl } from '@apps/locales'

interface IProps {
  expandIds: number[]
  parityList: GetTradeAskPurchasePriceComparisonInfoResponse
  rankList: GetTradeMobileAskPurchaseQuoteRankListResponse
  dataSoucre: GetTradeAskPurchaseDetailForShopResponse | undefined
  PAGE: PAGE_TYPE
  selectAwardItem: number | undefined
  setSelectAwardItem: Dispatch<SetStateAction<number | undefined>>
  setExpandIds: Dispatch<SetStateAction<number[]>>
}

type GoodsItemType = GetTradeAskPurchasePriceComparisonInfoResponse[0]['quoteGoodsPCRespList'][0]

const QuoteInfo: React.FC<IProps> = ({
  expandIds,
  selectAwardItem,
  setSelectAwardItem,
  rankList,
  parityList,
  dataSoucre,
  PAGE,
  setExpandIds,
}) => {
  const translate = useMobileIntl()

  const handleExpand = (id: number) => {
    if (expandIds.includes(id)) {
      setExpandIds(expandIds.filter((item) => item !== id))
    } else {
      setExpandIds([...expandIds, id])
    }
  }

  const getIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return rank1Icon
      case 2:
        return rank2Icon
      case 3:
        return rank3Icon
      default:
        return rank3Icon
    }
  }

  const renderGoodsList = (goodsList: GoodsItemType[]) => {
    return (
      <ScrollView scrollX>
        <View className={styles['goodslist-wrap']}>
          <View className={styles['goodslist-table-head']}>
            <View className={styles['goodslist-table-th']}></View>
            <View className={styles['goodslist-table-th']}>
              {translate('mobile.resource.askPurchase.danjiahanshui')}
            </View>
            <View className={styles['goodslist-table-th']}>
              {translate('mobile.resource.askPurchase.hanshuizongjia')}
            </View>
            <View className={styles['goodslist-table-th']}>
              {translate('mobile.resource.askPurchase.danjiabuhanshui')}
            </View>
            <View className={styles['goodslist-table-th']}>
              {translate('mobile.resource.askPurchase.shifouhanshui')}
            </View>
            <View className={styles['goodslist-table-th']}>{translate('mobile.resource.askPurchase.shuilv')}</View>
            <View className={styles['goodslist-table-th']}>
              {translate('mobile.resource.askPurchase.buhanshuizongjia')}
            </View>
            <View className={styles['goodslist-table-th']}>
              {translate('mobile.resource.askPurchase.baojiayouxiaoqi')}
            </View>
          </View>
          <View className={styles['goodslist-table-tbody']}>
            {goodsList &&
              goodsList.length > 0 &&
              goodsList.map((goodsItem) => (
                <View className={styles['goodslist-table-tr']} key={goodsItem.id}>
                  <View className={styles['goodslist-table-td']}>{goodsItem.memberName}</View>
                  <View className={styles['goodslist-table-td']}>￥{goodsItem.unitPriceWithTax}</View>
                  <View className={styles['goodslist-table-td']}>￥{goodsItem.totalPriceWithTax}</View>
                  <View className={styles['goodslist-table-td']}>￥{goodsItem.unitPriceWithoutTax}</View>
                  <View className={styles['goodslist-table-td']}>
                    {goodsItem.includeTax === 1 ? translate('mobile.common.shi') : translate('mobile.common.fou')}
                  </View>
                  <View className={styles['goodslist-table-td']}>{goodsItem.taxRate}%</View>
                  <View className={styles['goodslist-table-td']}>￥{goodsItem.totalPriceWithoutTax}</View>
                  <View className={cx(styles['goodslist-table-td'])}>
                    <View className={styles['goodslist-table-td-date']}>
                      <Text>
                        {goodsItem.quoteStartTime}
                        <Text>~</Text>
                      </Text>
                      <Text>{goodsItem.quoteEndTime}</Text>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    )
  }

  const handleSelect = (index: number) => {
    setSelectAwardItem(index)
  }

  return PAGE !== 'LIST' && PARITY_STATUS.includes(dataSoucre?.status!) ? (
    <MellowCard
      title={translate('mobile.resource.askPurchase.bijiaxinxi')}
      className={styles['inquiryDetailContainer-customStyle']}
      bodyStyle={{
        padding: 0,
      }}
    >
      {parityList &&
        parityList.length > 0 &&
        parityList.map((parityItem) => (
          <View className={styles['inquiryDetailContainer-quoteTitleBox']} key={parityItem.id}>
            <View className={styles['inquiryDetailContainer-quoteTitle-wrap']}>
              <View className={styles['inquiryDetailContainer-quoteTitle-split']}></View>
              <Text className={styles['inquiryDetailContainer-quoteTitle']}>{parityItem.goodsName}</Text>
              <View className={styles['more-btn-wrap']} onClick={() => handleExpand(parityItem.id)}>
                <Text className={styles['more-btn']}>
                  {expandIds.includes(parityItem.id)
                    ? translate('mobile.resource.askPurchase.shouqibijia')
                    : translate('mobile.resource.askPurchase.chakanbijia')}
                </Text>
              </View>
            </View>
            <Text className={styles['inquiryDetailContainer-quoteCount']}>x{parityItem.num}</Text>
            {expandIds.includes(parityItem.id) && renderGoodsList(parityItem.quoteGoodsPCRespList)}
          </View>
        ))}
      <RadioGroup value={selectAwardItem} customStyle={{ display: 'block' }} onChange={(value) => handleSelect(value)}>
        <View className={styles['quote-ranklist']}>
          {rankList &&
            rankList.length > 0 &&
            rankList.map((rankItem, rankIndex) => (
              <View className={styles['quote-ranklist-item']} key={`rankItem-${rankIndex}`}>
                <View className={styles['quote-ranklist-item-head']}>
                  <Image className={styles['quote-ranklist-item-icon']} src={getIcon(rankItem.rank)} />
                  <Text className={styles['quote-ranklist-item-name']}>{rankItem.memberName}</Text>
                  {PARITY_STATUS.includes(dataSoucre?.status!) &&
                    !SHOW_AWARD_STATUS.includes(dataSoucre?.status!) &&
                    rankItem.awardBid && (
                      <View className={styles['award-tag']}>{translate('mobile.resource.askPurchase.shoubiao')}</View>
                    )}
                </View>
                <View className={styles['quote-ranklist-item-body']}>
                  <View className={styles['quote-ranklist-item-left']}>
                    <View className={styles['quote-ranklist-item-line']}>
                      <Text className={styles['quote-ranklist-item-label']}>
                        {translate('mobile.resource.askPurchase.baojiapaixing')}：
                      </Text>
                      <Text className={styles['quote-ranklist-item-content']}>{rankItem.rank}</Text>
                    </View>
                    <View className={styles['quote-ranklist-item-line']}>
                      <Text className={styles['quote-ranklist-item-label']}>
                        {translate('mobile.resource.askPurchase.baojiazongjine')}：
                      </Text>
                      <Text className={styles['quote-ranklist-item-content']}>{rankItem.totalAmount}</Text>
                    </View>
                  </View>
                  {PAGE === 'BUYER_LIST' && SHOW_AWARD_STATUS.includes(dataSoucre?.status!) && (
                    <Radio size={18} value={rankItem.quoteId}>
                      {translate('mobile.resource.askPurchase.shoubiao')}
                    </Radio>
                  )}
                </View>
              </View>
            ))}
        </View>
      </RadioGroup>
    </MellowCard>
  ) : null
}

export default QuoteInfo
