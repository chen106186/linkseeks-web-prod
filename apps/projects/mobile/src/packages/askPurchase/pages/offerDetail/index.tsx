import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useCallback, useEffect } from 'react'
import cx from 'classnames'
import { View, Text, Toast, ScrollView, Modal } from '@apps/mobile-ui'
import useSafeArea from '@/hooks/useSafeArea'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import { setClipboardData } from '@apps/mobile-services/utils/taro'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import { getTradeMobileAskPurchaseDetail, GetTradeMobileAskPurchaseDetailResponse } from '@apps/apis'
import { useRouter } from '@apps/mobile-services/utils/taro'
import BasicInfo from '../detail/components/BasicInfo'
import QuoteMember from '../detail/components/QuoteMember'
import useBuyerList from '../buyer/hooks'
import styles from './index.module.scss'
export type PAGE_TYPE = 'LIST' | 'BUYER_LIST' | 'BUYER_DETAIL'
const OfferDetail: React.FC<{}> = () => {
  const router = useRouter<{
    id: string
  }>()
  const {
    params: { id },
  } = router
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  const [dataSoucre, setDataSoucre] = React.useState<GetTradeMobileAskPurchaseDetailResponse>()
  const { quoteList, fetchQuoteList } = useBuyerList()
  const fetchGetApi = useCallback(async () => {
    await getTradeMobileAskPurchaseDetail({
      id,
    }).then((res) => {
      if (res.code !== 1000) {
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
          icon: 'none',
        })
        return
      }
      setDataSoucre(res.data)
      if (res.data.status > 1) {
        fetchQuoteList(Number(id))
      }
    })
  }, [])
  useEffect(() => {
    fetchGetApi()
  }, [])
  const clipboard = (dataText: any) => {
    setClipboardData({
      data: dataText,
      success: () => {
        Toast.show({
          title: intl.formatMessage({
            id: 'inquiry.fuzhichenggong',
            defaultMessage: '内容复制成功',
          }),
          icon: 'none',
        })
      },
    })
  }
  return (
    <View
      className={styles['inquiryDetailContainer']}
      style={
        safeBottomHeight
          ? {
              paddingBottom: `${safeBottomHeight}PX`,
            }
          : {}
      }
    >
      <FullScreenLoading />
      {dataSoucre && (
        <View
          style={{
            flex: 1,
            height: 0,
          }}
        >
          <ScrollView className={styles['inquiryDetailContainer-scrollView']}>
            <View className={cx(styles['inquiryDetailContainer-scrollBox'])}>
              <View className={styles['inquiryDetailContainer-contextBox']}>
                <View className={styles['inquiryDetailContainer-productInfo']}>
                  <View className={styles['inquiryDetailContainer-productInfoTitle']}>
                    <View className={styles['inquiryDetailContainer-docLine']} />
                    <Text className={styles['inquiryDetailContainer-productName']}>{dataSoucre?.name}</Text>
                  </View>
                  <View className={styles['inquiryDetailContainer-productInfoNo']}>
                    <Text className={styles['inquiryDetailContainer-productNo']}>{dataSoucre?.askPurchaseNo}</Text>
                    <View>
                      <Text
                        onClick={() => clipboard(dataSoucre?.askPurchaseNo)}
                        className={styles['inquiryDetailContainer-textCopyStyle']}
                      >
                        {intl.formatMessage({
                          id: 'inquiry.fuzhi',
                          defaultMessage: '复制',
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
                <BasicInfo dataSoucre={dataSoucre} PAGE={'BUYER_DETAIL'} />
                <QuoteMember quoteList={quoteList} PAGE={'BUYER_DETAIL'} status={dataSoucre.status} jumpDetail />
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  )
}
export default GlobalWrapper(observer(OfferDetail))
