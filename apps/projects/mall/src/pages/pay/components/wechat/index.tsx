import React, { useEffect, useState } from 'react'
import { postOrderCreateBuyerPay, getOrderCreateBuyerPayResult } from '@apps/apis'
import wechatIcon from '@/assets/imgs/wechat_icon.png'
import { LinkTo } from '@/utils'
import { message, Spin } from 'antd'
import { getWebIntl } from '@/utils/locales'
import QRCode from 'qrcode'
import useLink from '@/hooks/useLink'
import { priceFormat } from '@apps/utils'
import styles from './index.module.less'

interface WechatPayWayPropsType {
  orderId: number[]
  onChange: Function
  queryParam: any
}

const WechatPayWay: React.FC<WechatPayWayPropsType> = (props) => {
  const translate = getWebIntl()
  const { orderId, queryParam, onChange } = props
  const [wechatPayUrl, setWechatPayUrl] = useState<any>('')
  const [pageLoading, setPageLoading] = useState<boolean>(true)
  const [timeOutStatus, setTimeOutStatus] = useState<boolean>(false)
  const { linkPrefix } = useLink()

  let checkCount = 0
  let checkTimer: any = null

  useEffect(() => {
    pay()
  }, [])

  const generateQrCode = (path: any) => {
    // 生成二维码
    QRCode.toDataURL(path)
      .then((url: any) => {
        setWechatPayUrl(url)
      })
      .catch((err: any) => {
        console.error(err)
      })
  }

  const pay = () => {
    const param: any = {
      orderIds: orderId,
      batchNo: queryParam.batchNo,
      payChannel: queryParam.payChannel,
      payType: queryParam.payType,
      fundMode: queryParam.fundMode,
    }

    postOrderCreateBuyerPay(param)
      .then((res) => {
        message.destroy()
        if (res.code === 1000 && res.data) {
          generateQrCode(res.data.codeUrl)
          setTimeout(() => {
            checkPayState(res.data.tradeNo)
          }, 5000)
        } else {
          onChange(true, res.message)
        }
        setPageLoading(false)
      })
      .catch(() => {
        onChange(false)
        setPageLoading(false)
      })
  }

  const checkPayState = (tradeNo: string) => {
    if (checkCount < 24) {
      const param: any = {
        tradeNo,
      }
      getOrderCreateBuyerPayResult(param).then((res) => {
        const { data, code } = res
        message.destroy()
        if (code === 1000) {
          if (data) {
            if (data.paySuccess) {
              message.success(translate('web.resource.mall.zhifuchenggong'))
              LinkTo(linkPrefix(`/pay/result?orderId=${orderId}`), 'replace')
            } else {
              clearTimeout(checkTimer)
              checkTimer = null
              onChange(true, res.message)
            }
          } else {
            checkCount++
            checkTimer = setTimeout(() => {
              checkPayState(tradeNo)
            }, 5000)
          }
        } else {
          message.error(res.message)
        }
      })
    } else {
      clearTimeout(checkTimer)
      checkTimer = null
      setTimeOutStatus(true)
    }
  }

  return (
    <Spin spinning={pageLoading}>
      <div className={styles.common_title}>
        <div className={styles.common_title_icon}>
          <img src={wechatIcon} />
        </div>
        <span>{translate('web.resource.mall.weixinzhifu')}</span>
      </div>
      <div className={styles.wechat_payway}>
        <p className={styles.wechat_payway_title}>
          {translate('web.resource.mall.shiyongweixinsaoyisaoxiafangerweima')}
        </p>
        <div className={styles.wechat_payway_imgbox}>
          {wechatPayUrl && <img src={wechatPayUrl} />}
          {timeOutStatus && (
            <div className={styles.mask}>
              <p>
                {translate('web.resource.mall.erweimayiguoqi')}
                <br />
                {translate('web.resource.mall.qingshuaxinyemian')}
              </p>
            </div>
          )}
        </div>
        <div className={styles.wechat_payway_needpay}>
          <label>{translate('web.resource.mall.dangqianxuzhifu')}：</label>
          <span>{translate('web.common.currencySymbol')}</span>
          <span>{priceFormat(queryParam.payAmount)}</span>
        </div>
      </div>
    </Spin>
  )
}

export default WechatPayWay
