import React from 'react'
import { View, Text, Icons } from '@apps/mobile-ui'
import { PostTradeMobileAskPurchasePageQuoteResponseDetail } from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import { PAGE_TYPE } from '../../index'
import styles from '../../index.module.scss'
import Empty from '@/components/Empty'
import { PARITY_STATUS, SHOW_AWARD_STATUS } from '@/packages/askPurchase/constants'
import Router from '@/utils/router'
import { preload } from '@apps/mobile-services/utils/taro'
import { useMobileIntl } from '@apps/locales'

interface IProps {
  quoteList: PostTradeMobileAskPurchasePageQuoteResponseDetail[]
  status: number
  PAGE: PAGE_TYPE
  jumpDetail?: boolean
}

const QuoteMember: React.FC<IProps> = ({ quoteList, status, PAGE, jumpDetail = false }) => {
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

  return PAGE !== 'LIST' ? (
    <MellowCard
      title={translate('mobile.resource.askPurchase.baojiaxinxi')}
      className={styles['inquiryDetailContainer-customStyle']}
      bodyStyle={{
        padding: 0,
      }}
    >
      {quoteList && quoteList.length > 0 ? (
        quoteList.map((quoteItem) => (
          <View
            className={styles['inquiryDetailContainer-quoteTitleBox']}
            key={quoteItem.quoteNo}
            onClick={() => {
              if (jumpDetail) {
                preload({
                  id: quoteItem.id,
                  PAGE: PAGE || 'BUYER_DETAIL',
                })
                Router.navigateTo('askPurchase/quoteDetail')
              }
            }}
          >
            <View className={styles['inquiryDetailContainer-quoteTitle-wrap']}>
              <View className={styles['inquiryDetailContainer-quoteTitle-split']}></View>
              <Text className={styles['inquiryDetailContainer-quoteTitle']}>{quoteItem.memberName}</Text>
              {PARITY_STATUS.includes(status) && !SHOW_AWARD_STATUS.includes(status) && quoteItem.awardBid && (
                <View className={styles['award-tag']}>{translate('mobile.resource.askPurchase.shoubiao')}</View>
              )}
              {jumpDetail && <Icons name="ChevronRight" size={14} />}
            </View>
            <Cell customStyle={{ padding: 0, marginTop: 8 }}>
              <Cell.Item
                {...commonCellSyle}
                title={translate('mobile.resource.askPurchase.lianxiren')}
                value={quoteItem.contactName}
              />
              <Cell.Item
                {...commonCellSyle}
                title={translate('mobile.resource.askPurchase.lianxidianhua')}
                value={quoteItem.contactMobile}
              />
              <Cell.Item
                {...commonCellSyle}
                title={translate('mobile.resource.askPurchase.baojiazhaiyao')}
                value={quoteItem.name}
              />
              <Cell.Item
                {...commonCellSyle}
                title={translate('mobile.resource.askPurchase.baojiazongjine')}
                value={`￥${quoteItem.totalPriceWithTax}`}
              />
            </Cell>
          </View>
        ))
      ) : (
        <Empty description={translate('mobile.resource.askPurchase.zanwubaojiaxinxi')} />
      )}
    </MellowCard>
  ) : null
}

export default QuoteMember
