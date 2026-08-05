import React, { useState, useEffect } from 'react'
import CommonHeader from '@/components/CommonHeader'
import { getWebIntl } from '@/utils/locales'
import { Button } from 'antd'
import { useGlobalConext } from '@/context/globalProvider'
import { PayWayType } from '@/constants/pay'
import { LinkTo } from '@/utils'
import useLink from '@/hooks/useLink'
import HelmetProvider from '@/context/helmetProvider'
import { getQueryString } from '@/utils/getUrlParam'
import { useLocation } from 'react-router-dom'
import PointPayWay from './components/point'
import BablancePayWay from './components/balance'
import CreditPayWay from './components/credit'
import WechatPayWay from './components/wechat'
import AlipayPayWay from './components/alipay'
import DigitPayWay from './components/digitpay'
import TransferPayWay from './components/transfer'
import AllInPayQuick from './components/allinpayQuick'
import EBank from './components/EBank'
import styles from './index.module.less'

const PayPage: React.FC = () => {
  const { mallInfo } = useGlobalConext()
  const [payState, setPayState] = useState<boolean>(false)
  const [pageTitle, setPageTitle] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)
  const [errMsg, setErrMsg] = useState<string>('')
  const [query, setQuery] = useState<any>({})
  const translate = getWebIntl()
  const { search } = useLocation()
  const { linkPrefix } = useLink()

  const getPayTypeTitle = (type: number) => {
    switch (type) {
      case PayWayType.point:
        return translate('web.resource.mall.jifenzhifu')
      case PayWayType.allInPayBalance:
      case PayWayType.balance:
        return translate('web.resource.mall.yuezhifu')
      case PayWayType.credit:
      case PayWayType.wechat:
      case PayWayType.transfer:
      case PayWayType.alipay:
      case PayWayType.bank:
      case PayWayType.allInPayAliPay:
      case PayWayType.allInPayBank:
      case PayWayType.allInPayQuick:
      case PayWayType.allInPayWechat:
      case PayWayType.ccbBank:
      case PayWayType.ccbDigit:
      case PayWayType.crossBorder:
        return translate('web.resource.mall.shouyintai')
      default:
        return ''
    }
  }

  useEffect(() => {
    try {
      const spam = getQueryString('spam', search)
      try {
        let queryParam: any = spam ? atob(spam) : undefined
        queryParam = queryParam ? JSON.parse(queryParam) : {}
        setQuery(queryParam)
      } catch (error) {
        setErrMsg(translate('web.resource.mall.dingdanxinxicuowu'))
      }
    } catch (error) {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (query.orderId) {
      setPageTitle(getPayTypeTitle(query.payChannel))
      setLoading(false)
    }
  }, [query])

  const handlePayChangge = (
    state: boolean | ((prevState: boolean) => boolean),
    errMsg?: React.SetStateAction<string>,
  ) => {
    setPayState(state)
    errMsg && setErrMsg(errMsg)
  }

  const renderPayWay = () => {
    if (!query) {
      return
    }

    switch (Number(query.payChannel)) {
      case PayWayType.point:
        return (
          <PointPayWay
            queryParam={query}
            orderId={query.orderId}
            onChange={(
              state: boolean | ((prevState: boolean) => boolean),
              errMsg: React.SetStateAction<string> | undefined,
            ) => handlePayChangge(state, errMsg)}
          />
        )
      case PayWayType.balance:
        return (
          <BablancePayWay
            queryParam={query}
            orderId={query.orderId}
            onChange={(
              state: boolean | ((prevState: boolean) => boolean),
              errMsg: React.SetStateAction<string> | undefined,
            ) => handlePayChangge(state, errMsg)}
          />
        )
      case PayWayType.credit:
        return (
          <CreditPayWay
            queryParam={query}
            orderId={query.orderId}
            onChange={(
              state: boolean | ((prevState: boolean) => boolean),
              errMsg: React.SetStateAction<string> | undefined,
            ) => handlePayChangge(state, errMsg)}
          />
        )
      case PayWayType.wechat:
      case PayWayType.allInPayWechat:
        return (
          <WechatPayWay
            queryParam={query}
            orderId={query.orderId}
            onChange={(
              state: boolean | ((prevState: boolean) => boolean),
              errMsg: React.SetStateAction<string> | undefined,
            ) => handlePayChangge(state, errMsg)}
          />
        )
      case PayWayType.alipay:
      case PayWayType.allInPayAliPay:
        return (
          <AlipayPayWay
            isCode={Number(query.payChannel) === PayWayType.allInPayAliPay}
            queryParam={query}
            orderId={query.orderId}
            onChange={(
              state: boolean | ((prevState: boolean) => boolean),
              errMsg: React.SetStateAction<string> | undefined,
            ) => handlePayChangge(state, errMsg)}
          />
        )
      case PayWayType.transfer:
        return (
          <TransferPayWay
            queryParam={query}
            orderId={query.orderId}
            onChange={(
              state: boolean | ((prevState: boolean) => boolean),
              errMsg: React.SetStateAction<string> | undefined,
            ) => handlePayChangge(state, errMsg)}
          />
        )
      case PayWayType.allInPayQuick:
      case PayWayType.allInPayBalance:
        return (
          <AllInPayQuick
            type={query.payChannel}
            queryParam={query}
            orderId={query.orderId}
            onChange={(
              state: boolean | ((prevState: boolean) => boolean),
              errMsg: React.SetStateAction<string> | undefined,
            ) => handlePayChangge(state, errMsg)}
          />
        )
      case PayWayType.allInPayBank:
      case PayWayType.ccbBank:
        return (
          <EBank
            queryParam={query}
            orderId={query.orderId}
            onChange={(
              state: boolean | ((prevState: boolean) => boolean),
              errMsg: React.SetStateAction<string> | undefined,
            ) => handlePayChangge(state, errMsg)}
          />
        )
      case PayWayType.ccbDigit:
        return (
          <DigitPayWay
            queryParam={query}
            orderId={query.orderId}
            onChange={(
              state: boolean | ((prevState: boolean) => boolean),
              errMsg: React.SetStateAction<string> | undefined,
            ) => handlePayChangge(state, errMsg)}
          />
        )
      default:
        return null
    }
  }

  const backHome = () => {
    LinkTo(linkPrefix())
  }

  const renderError = () => {
    return (
      <div>
        <CommonHeader logoUrl={mallInfo?.logoUrl} title={translate('web.resource.mall.zhifucuowu')} />
        <div className={styles.errmsg}>
          <p>{errMsg}</p>
          <Button type="primary" className={styles.backbtn} onClick={() => backHome()}>
            {translate('web.resource.mall.fanghuishouye')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <HelmetProvider title={`${translate('web.resource.payment.dingdanzhifu')}-${mallInfo?.name}`}>
      {!loading ? (
        !payState ? (
          <div className={styles.pay}>
            <CommonHeader logoUrl={mallInfo?.logoUrl} title={pageTitle} />
            <div className={styles.pay_container}>{renderPayWay()}</div>
          </div>
        ) : (
          renderError()
        )
      ) : (
        renderError()
      )}
    </HelmetProvider>
  )
}

export default PayPage
