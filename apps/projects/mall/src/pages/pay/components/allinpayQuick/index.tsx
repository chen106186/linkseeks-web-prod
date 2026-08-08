import React, { useEffect, useMemo, useRef, useState } from 'react'
import { LinkTo } from '@/utils'
import { message, Spin, Button } from 'antd'
import cx from 'classnames'
import {
  postOrderCreateBuyerPay,
  getPayEAccountAllInPayReSendPayCode,
  postPayEAccountAllInPayConfirmPay,
} from '@apps/apis'
import useLink from '@/hooks/useLink'
import { getWebIntl } from '@/utils/locales'
import { priceFormat } from '@apps/utils'
import { PayWayType } from '@/constants/pay'
import styles from './index.module.less'
import PasswordInput from '../passwordInput'

interface AllInPayQuickProps {
  orderId: number[]
  onChange: Function
  queryParam: any
  type: PayWayType
}

const AllInPayQuick: React.FC<AllInPayQuickProps> = (props) => {
  const { onChange, orderId, queryParam, type } = props
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [payPassword, setPayPassword] = useState<string>('')
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const initialCount = 60
  const [count, setCount] = useState(initialCount)
  const translate = getWebIntl()
  const timer = useRef<any>(null)
  const [tradeCode, setTradeCode] = useState<string>()
  const { linkPrefix } = useLink()

  const clearTimer = () => {
    clearInterval(timer.current)
    timer.current = null
  }

  useEffect(() => {
    pay()
    return () => {
      clearTimer()
    }
  }, [])

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
          setTradeCode(res.data.tradeNo)
          countDown()
        } else {
          setCount(0)
          message.error(res.message)
        }
        setPageLoading(false)
      })
      .catch(() => {
        onChange(false)
        setPageLoading(false)
      })
  }

  const countDown = () => {
    timer.current = setInterval(() => {
      setCount((prev) => prev - 1)
    }, 1000)
  }

  const handlePasswordChange = (value: string) => {
    setPayPassword(value)
  }

  const getCode = () => {
    const param: any = {
      tradeCode,
    }
    setCount(initialCount)
    getPayEAccountAllInPayReSendPayCode(param).then((res) => {
      if (res.code === 1000) {
        countDown()
      }
    })
  }

  const _codeBtn = useMemo(() => {
    if (count <= 0) {
      clearTimer()
      return (
        <div className={cx(styles.send_reset)} onClick={getCode}>
          {translate('web.resource.mall.fasongyanzhengma')}
        </div>
      )
    } else {
      return (
        <div className={cx(styles.send_reset, styles.disable)}>
          {translate('web.resource.mall.zaicifasong')}({count}s)
        </div>
      )
    }
  }, [count])

  const confirmPay = () => {
    if (!payPassword || payPassword.length < 5) {
      return
    }
    if (tradeCode) {
      setConfirmLoading(true)
      const param: any = {
        tradeCode,
        verificationCode: payPassword,
      }
      postPayEAccountAllInPayConfirmPay(param)
        .then((res) => {
          message.destroy()
          setConfirmLoading(false)
          if (res.code === 1000) {
            if (res.data.payStatus === 'success') {
              message.success(translate('web.resource.mall.zhifuchenggong'))
              LinkTo(linkPrefix(`/pay/result?orderId=${orderId[0]}`), 'replace')
            } else if (res.data.payStatus === 'unpay') {
              message.error(res.data.payFailMessage)
            } else {
              message.error(res.data.payFailMessage)
            }
          } else {
            message.error(res.message)
          }
        })
        .catch(() => {
          setConfirmLoading(false)
        })
    }
  }

  return (
    <Spin spinning={pageLoading}>
      <div className={styles.common_title}>
        <span>
          {type === PayWayType.allInPayQuick
            ? translate('web.resource.mall.kuaijiezhifu')
            : translate('web.resource.mall.yuezhifu')}
        </span>
      </div>
      <div className={styles.allinpay_quick}>
        <div className={styles.allinpay_quick_needpay}>
          <label>{translate('web.resource.mall.dangqianxuzhifu')}：</label>
          <span>{translate('web.common.currencySymbol')}</span>
          <span>{priceFormat(queryParam.payAmount)}</span>
        </div>
        <div className={styles.code_input}>{translate('web.resource.mall.qingshuruduanxinyanzhengma')}</div>
        <div className={styles.pay_wray}>
          <PasswordInput
            //maxLength={type === PayWayType.allInPayQuick ? 6 : 5}
            value={payPassword}
            onChange={handlePasswordChange}
          />
          <div className={styles.code_send}>
            {translate('web.resource.mall.yijiangyanzhengmafasongzhiningshoujihao')}
          </div>
          {_codeBtn}
          <Button loading={confirmLoading} className={styles.pay_btn} onClick={() => confirmPay()}>
            {translate('web.resource.mall.lijizhifu')}
          </Button>
        </div>
      </div>
    </Spin>
  )
}

export default AllInPayQuick
