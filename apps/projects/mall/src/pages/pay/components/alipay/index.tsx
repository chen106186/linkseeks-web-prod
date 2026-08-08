import React, { useEffect, useState } from 'react'
import alipayIcon from '@/assets/imgs/alipay_icon.png'
import { LinkTo } from '@/utils'
import { message, Spin } from 'antd'
import QRCode from 'qrcode'
import { postOrderCreateBuyerPay, getOrderCreateBuyerPayResult } from '@apps/apis'
import useLink from '@/hooks/useLink'
import { getWebIntl } from '@/utils/locales'
import { priceFormat } from '@apps/utils'
import styles from './index.module.less'

interface AlipayPayWayPropsType {
  orderId: number[]
  onChange: Function
  queryParam: any
  isCode: boolean
}

const AlipayPayWay: React.FC<AlipayPayWayPropsType> = (props) => {
  const translate = getWebIntl()
  const { orderId, queryParam, onChange, isCode } = props
  const [alipayUrl, setAlipayUrl] = useState<any>('')
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
        setAlipayUrl(url)
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
          if (isCode) {
            generateQrCode(res.data.codeUrl)
          } else {
            setAlipayUrl(res.data.codeUrl)
          }
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
              LinkTo(linkPrefix(`/pay/result?orderId=${orderId[0]}`), 'replace')
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
          <img src={alipayIcon} />
        </div>
        <span>{translate('web.resource.mall.zhifubaozhifu')}</span>
      </div>
      <div className={styles.wechat_payway}>
        <p className={styles.wechat_payway_title}>
          {translate('web.resource.mall.shiyongzhifubaosaoyisaoxiafangerweima')}
        </p>
        <div className={styles.wechat_payway_imgbox}>
          {alipayUrl && isCode ? <img src={alipayUrl} /> : <iframe className={styles.alipay_wrap} srcDoc={alipayUrl} />}
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

export default AlipayPayWay
