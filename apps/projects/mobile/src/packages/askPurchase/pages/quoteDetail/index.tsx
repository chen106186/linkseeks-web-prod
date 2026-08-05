import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useCallback, useEffect } from 'react'
import cx from 'classnames'
import { View, Text, Toast, ScrollView, Modal } from '@apps/mobile-ui'
import useSafeArea from '@/hooks/useSafeArea'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import { getCurrentInstance, preload, setClipboardData } from '@apps/mobile-services/utils/taro'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import {
  getTradeMobileAskPurchaseAskPurchaseQuoteDetail,
  GetTradeMobileAskPurchaseAskPurchaseQuoteDetailResponse,
} from '@apps/apis'
import BasicInfo from './BasicInfo'
import QuoteInfo from '../detail/components/QuoteInfo'
import Other from './Other'
import Enclosure from '../detail/components/Enclosure'
import { PAGE_TYPE } from '../detail'
import { quoteStatusList } from '../../constants'
import useMerchants from '../merchants/hooks/useMerchants'
import styles from './index.module.scss'
import Router from '@/utils/router'
import { useMobileIntl } from '@apps/locales'
const QuoteDetail: React.FC<{}> = () => {
  const params = getCurrentInstance().preloadData as {
    id: string
    PAGE: PAGE_TYPE
    refresh: () => void
  }
  const { id, PAGE, refresh } = params || {}
  const intl = useIntl()
  const translate = useMobileIntl()
  const { safeBottomHeight } = useSafeArea()
  const [dataSoucre, setDataSoucre] = React.useState<GetTradeMobileAskPurchaseAskPurchaseQuoteDetailResponse>()
  const {
    optionType,
    expandIds,
    modalTitle,
    modalVisible,
    setExpandIds,
    setOptionType,
    setModalVisible,
    setModalTitle,
    handleAuditQuote,
    handleAudit,
    handleSubmit,
  } = useMerchants()
  const fetchGetApi = useCallback(async () => {
    await getTradeMobileAskPurchaseAskPurchaseQuoteDetail({
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
      if (res.data.askPurchaseQuoteGoodsResponses && res.data.askPurchaseQuoteGoodsResponses.length > 0) {
        setExpandIds([res.data.askPurchaseQuoteGoodsResponses[0].id])
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
  const renderBottomButton = () => {
    if (PAGE === 'MERCHANTS_LIST') {
      switch (dataSoucre?.status) {
        case 1:
        case 6:
        case 7:
          return (
            <View className={styles['inquiryDetailContainer-btnBox']}>
              <View
                className={styles['inquiryDetailContainer-touchableOpacity']}
                onClick={(e) => {
                  e.stopPropagation()
                  setOptionType('audit')
                  setModalTitle(translate('mobile.resource.askPurchase.shifouquerentijiaoshenhe'))
                  setModalVisible(true)
                }}
              >
                <View className={cx(styles['inquiryDetailContainer-primaryBtn'])}>
                  <Text
                    className={cx(
                      styles['inquiryDetailContainer-btnText'],
                      styles['inquiryDetailContainer-primaryText'],
                    )}
                  >
                    {translate('mobile.resource.askPurchase.tijiaoshenhe')}
                  </Text>
                </View>
              </View>
            </View>
          )
        case 2:
        case 3:
          return (
            <View className={styles['inquiryDetailContainer-btnBox']}>
              <View
                className={styles['inquiryDetailContainer-touchableOpacity']}
                onClick={(e) => {
                  e.stopPropagation()
                  preload({
                    id,
                    level: dataSoucre?.status === 2 ? 1 : 2,
                    refresh: () => {
                      refresh()
                    },
                  })
                  Router.navigateTo('askPurchase/merchants/feedback')
                }}
              >
                <View
                  className={cx(
                    styles['inquiryDetailContainer-primaryBtn'],
                    styles['inquiryDetailContainer-defaultBtn'],
                  )}
                >
                  <Text className={cx(styles['inquiryDetailContainer-btnText'])}>
                    {translate('mobile.resource.askPurchase.shenhebutongguo')}
                  </Text>
                </View>
              </View>
              <View
                className={styles['inquiryDetailContainer-touchableOpacity']}
                onClick={(e) => {
                  e.stopPropagation()
                  setOptionType(dataSoucre?.status === 2 ? 'auditLevel1' : 'auditLevel2')
                  setModalTitle(translate('mobile.resource.askPurchase.shifouquerenshenhetongguo'))
                  setModalVisible(true)
                }}
              >
                <View className={cx(styles['inquiryDetailContainer-primaryBtn'])}>
                  <Text
                    className={cx(
                      styles['inquiryDetailContainer-btnText'],
                      styles['inquiryDetailContainer-primaryText'],
                    )}
                  >
                    {translate('mobile.resource.askPurchase.shenhetongguo')}
                  </Text>
                </View>
              </View>
            </View>
          )
        case 4:
          return (
            <View className={styles['inquiryDetailContainer-btnBox']}>
              <View
                className={styles['inquiryDetailContainer-touchableOpacity']}
                onClick={(e) => {
                  e.stopPropagation()
                  setOptionType('submit')
                  setModalTitle(translate('mobile.resource.askPurchase.shifouquerentijiao'))
                  setModalVisible(true)
                }}
              >
                <View className={cx(styles['inquiryDetailContainer-primaryBtn'])}>
                  <Text
                    className={cx(
                      styles['inquiryDetailContainer-btnText'],
                      styles['inquiryDetailContainer-primaryText'],
                    )}
                  >
                    {translate('mobile.resource.askPurchase.tijiao')}
                  </Text>
                </View>
              </View>
            </View>
          )
        default:
          return null
      }
    }
    return null
  }
  const handleModalConfirm = () => {
    if (dataSoucre) {
      if (optionType === 'audit') {
        handleAuditQuote(dataSoucre.id).then((result) => {
          if (result) {
            refresh()
            Router.navigateBack()
          }
        })
      } else if (optionType === 'auditLevel1' || optionType === 'auditLevel2') {
        handleAudit(optionType === 'auditLevel1' ? 1 : 2, Number(dataSoucre.id), 1).then((result) => {
          if (result) {
            refresh()
            Router.navigateBack()
          }
        })
      } else if (optionType === 'submit') {
        handleSubmit(dataSoucre.id).then((result) => {
          if (result) {
            refresh()
            Router.navigateBack()
          }
        })
      }
    }
  }
  const SHOW_STATUS = PAGE !== 'BUYER_DETAIL'
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
            {SHOW_STATUS && (
              <View className={styles['status']}>
                {dataSoucre && <Text className={styles['status-txet']}>{quoteStatusList[dataSoucre.status]} &gt;</Text>}
              </View>
            )}
            <View className={cx(styles['inquiryDetailContainer-scrollBox'], SHOW_STATUS && styles['mgt'])}>
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
                <BasicInfo dataSoucre={dataSoucre} />
                <QuoteInfo expandIds={expandIds} quoteInfo={dataSoucre} setExpandIds={setExpandIds} />
                {/* 其他信息 */}
                <Other dataSoucre={dataSoucre} />
                {/* 附件 */}
                <Enclosure enclosureUrls={dataSoucre.enclosureUrls} />
              </View>
            </View>
          </ScrollView>
        </View>
      )}
      {renderBottomButton()}
      <Modal
        title={modalTitle}
        isOpened={modalVisible}
        onConfirm={handleModalConfirm}
        onCancel={() => {
          setModalVisible(false)
        }}
        cancelText={translate('mobile.common.cancel')}
        confirmText={translate('mobile.common.confirm')}
        className={styles['order-model']}
      />
    </View>
  )
}
export default GlobalWrapper(observer(QuoteDetail))
