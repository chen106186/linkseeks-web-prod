import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: Crayon
 * @Date: 2021-11-02 16:55:59
 * @LastEditTime: 2021-11-05 18:05:09
 * @LastEditors: Crayon
 * @Description: 线下支付线上确认
 * @FilePath: \lingxi-mobile\src\packages\order\pages\offlineTransfer\index.tsx
 */
import React, { useEffect, useCallback, useState, useRef } from 'react'
import { View, Button, Text, Toast, ScrollView } from '@apps/mobile-ui'
import useStores from '@/store/useStores'
import { useRouter, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import TopTitle from '@/components/TopTitle'
import { useIntl } from '@linkseeks/i18n'
import { getSettlementCommonCorporateAccountDetail } from '@apps/apis'
import { postOrderMobileCreateBuyerPay } from '@apps/apis'
import PayCount from '../payOrder/components/PayCount'
import Account from './components/Account'
import UploadCertificate from './components/UploadCertificate'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'

// mock
const objMessage = {
  orderIds: [],
  paymentRequired: false,
  fundMode: 1,
  batchNo: 1,
  payType: 4,
  payChannel: 1,
  payAmount: 10000,
}
const OfflineTransfer: React.FC = () => {
  const intl = useIntl()
  const {
    params: { storeId },
  } = useRouter()
  const {
    userStore: { userInfo },
    confirmOrderStore: { orderMessage = objMessage },
  } = useStores()
  const [payDetail, setPayDetail] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const vouchersRef = useRef<string[]>([])
  const handleUploadChange = (urls: string[]) => {
    vouchersRef.current = urls
  }
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'offlineTransfer_navigationBarTitleText' }) })
  }, [])
  const fetchPayDetail = useCallback(async () => {
    const { code, data } = await getSettlementCommonCorporateAccountDetail({
      type: orderMessage.fundMode,
      memberId: orderMessage.vendorMemberId,
      roleId: orderMessage.vendorRoleId,
    })
    if (code === 1000) {
      setPayDetail(data)
    }
  }, [])
  useEffect(() => {
    if (orderMessage.orderIds > 0) {
      fetchPayDetail()
    }
  }, [orderMessage])
  const handleSubmit = async () => {
    if (loading) {
      Toast.show({
        title: intl.formatMessage({
          id: 'offlineTransfer_handleSubmit_show_1',
        }),
        icon: 'loading',
      })
      return
    }
    if (vouchersRef.current.length === 0) {
      Toast.show({
        title: intl.formatMessage({
          id: 'offlineTransfer_handleSubmit_show_2',
        }),
        icon: 'none',
      })
      return
    }
    setLoading(true)
    const { data, code, message } = await postOrderMobileCreateBuyerPay({
      orderIds: orderMessage.orderIds,
      payType: orderMessage.payType,
      payChannel: orderMessage.payChannel,
      batchNo: orderMessage.batchNo,
      fundMode: orderMessage.fundMode,
      vouchers: vouchersRef.current,
    })
    setLoading(false)
    if (code === 1000) {
      Router.redirectTo('order/SubmitSuccess', {
        storeId,
        orderId: orderMessage.orderIds[0],
      })
    } else {
      Toast.show({
        title: intl.formatMessage({
          id: `${code}`,
          defaultMessage: message,
        }),
        icon: 'none',
      })
    }
  }

  /**
   * 重置路由，返回的时候跳到待支付页面，将当前页面从路由栈中去除
   */
  const handleGoBack = () => {
    Router.redirectTo('order/mycommodityDetails', {
      orderId: orderMessage.orderIds[0],
      categoryIndex: 0,
    })
  }
  const options = [
    {
      label: intl.formatMessage({
        id: 'offlineTransfer_options_1',
      }),
      key: 'name',
    },
    {
      label: intl.formatMessage({
        id: 'offlineTransfer_options_2',
      }),
      key: 'bankAccount',
    },
    {
      label: intl.formatMessage({
        id: 'offlineTransfer_options_3',
      }),
      key: 'bankDeposit',
    },
  ]
  return (
    <View className={styles['page']}>
      <TopTitle
        title={intl.formatMessage({
          id: 'offlineTransfer_title',
        })}
        goBack={handleGoBack}
      />
      <ScrollView className={styles['scrollView']}>
        <View className={styles['countContainer']} />
        <View className={styles['panel']}>
          <PayCount
            money={orderMessage?.payAmount as number}
            tips={intl.formatMessage({
              id: 'offlineTransfer_payCount',
            })}
          />
        </View>
        <View className={styles['panelSection']}>
          <Account column={options} dataSource={payDetail} />
        </View>
        <View className={styles['panelSection']}>
          <UploadCertificate onUploadChange={handleUploadChange} />
        </View>
        <Text className={styles['tips']}>
          {intl.formatMessage({
            id: 'offlineTransfer_tips',
          })}
        </Text>
      </ScrollView>
      <Button className={styles['btn']} onClick={handleSubmit} disabled={!payDetail}>
        <Text className={styles['btnText']}>
          {intl.formatMessage({
            id: 'offlineTransfer_btnText',
          })}
        </Text>
      </Button>
    </View>
  )
}
export default GlobalWrapper(OfflineTransfer)
