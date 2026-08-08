import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import IconFont from '@/utils/iconfont'
import { message, Button, Spin } from 'antd'
import { LinkTo } from '@/utils'
import {
  GetMemberSecurityGetResponse,
  GetPayCreditGetCreditResponse,
  getMemberSecurityGet,
  getPayCreditGetCredit,
  postOrderCreateBuyerPay,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { encryptedByAES } from '@linkseeks/crypto'
import useLink from '@/hooks/useLink'
import PasswordInput from '../passwordInput'
import styles from './index.module.less'
import { priceFormat } from '@apps/utils'
import { MEMBER_CENTER_URL } from '@/constants/domain'

interface CreditPayWayPropsType {
  queryParam: any
  orderId: number[]
  onChange: Function
}

const CreditPayWay: React.FC<CreditPayWayPropsType> = (props) => {
  const translate = getWebIntl()
  const { orderId, queryParam } = props
  const [payPassword, setPayPassword] = useState<string>('')
  const [creditInfo, setCreditInfo] = useState<GetPayCreditGetCreditResponse>()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [securityInfo, setSecurityInfo] = useState<GetMemberSecurityGetResponse>()
  const [pageLoading, setPageLoading] = useState<boolean>(true)
  const [payDisabled] = useState<boolean>(false)
  const { linkPrefix } = useLink()

  const handlePasswordChange = (value: string) => {
    setPayPassword(value)
  }

  useEffect(() => {
    if (queryParam) {
      fetchCreditInfo()
      fetchSecurity()
    }
  }, [queryParam])

  const fetchCreditInfo = () => {
    const param: any = {
      parentMemberId: queryParam.memberId,
      parentMemberRoleId: queryParam.memberRoleId,
    }
    getPayCreditGetCredit(param).then((res: any) => {
      if (res.code === 1000) {
        if (res.data.isUsable === 0) {
          message.error(translate('web.resource.mall.shouxinedubukeyong'))
          return
        }
        setCreditInfo(res.data)
        setPageLoading(false)
      }
    })
  }

  const fetchSecurity = () => {
    getMemberSecurityGet().then((res: any) => {
      if (res.code === 1000) {
        setSecurityInfo(res.data)
      }
    })
  }

  const pay = () => {
    if (creditInfo?.isUsable === 0) {
      message.error(translate('web.resource.mall.shouxinedubukeyong'))
      return
    }
    if (!payPassword || payPassword.length < 6) {
      message.error(translate('web.resource.mall.qingshuruzhifumima'))
      return
    }
    const param: any = {
      orderIds: orderId,
      batchNo: queryParam.batchNo,
      payChannel: queryParam.payChannel,
      payType: queryParam.payType,
      fundMode: queryParam.fundMode,
      payPassword: encryptedByAES(payPassword),
    }
    setConfirmLoading(true)
    postOrderCreateBuyerPay(param)
      .then((res) => {
        if (res.code === 1000) {
          message.destroy()
          message.success(translate('web.resource.mall.zhifuchenggong'))
          LinkTo(linkPrefix(`/pay/result?orderId=${orderId[0]}`), 'replace')
        } else {
          setConfirmLoading(false)
          message.destroy()
          message.error(res.message)
        }
      })
      .catch(() => {
        setConfirmLoading(false)
      })
  }

  return (
    <Spin spinning={pageLoading}>
      <div className={styles.common_title}>
        <span>{translate('web.resource.mall.shouxineduzhifu')}</span>
      </div>
      <div className={styles.pay_point}>
        <div className={styles.pay_point_way_list}>
          <div className={cx(styles.pay_point_way_list_item, styles.active)}>
            <div className={styles.pay_point_way_list_item_title}>
              <IconFont type="icon-credit_icon" className={styles.title_icon} />
              <span>{translate('web.resource.mall.shouxineduzhifu')}</span>
            </div>
            <div className={styles.pay_point_way_list_item_content}>
              <p>{translate('web.resource.mall.keyongshouxinedu')}：</p>
              <div className={styles.pay_point_way_list_item_point}>
                <label>{priceFormat(creditInfo?.canUseQuota || 0)}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.pay_amount_text}>
        <div>
          {translate('web.resource.mall.dangqianxuyaozhifu')}：<span>{translate('web.common.currencySymbol')}</span>
          <span className={styles.pay_amount_point}>{priceFormat(queryParam.payAmount)} </span>
        </div>
      </div>
      {securityInfo && securityInfo.hasPayPassword === 1 ? (
        <div className={styles.pay_wray}>
          <div className={styles.pay_wray_title}>{translate('web.resource.mall.qingshuruzhifumima')}</div>
          <PasswordInput value={payPassword} onChange={handlePasswordChange} />
          <Button loading={confirmLoading} className={styles.pay_btn} onClick={() => pay()}>
            {translate('web.resource.mall.lijizhifu')}
          </Button>
        </div>
      ) : (
        <div className={styles.pay_wray}>
          <div className={styles.pay_wray_title}>{translate('web.resource.mall.ninhaimeiyoushezhizhifumima')}</div>
          <Button
            loading={confirmLoading}
            disabled={payDisabled}
            className={styles.pay_btn}
            onClick={() =>
              (window.location.href = `${MEMBER_CENTER_URL}/systemAbility/accountSetting/paycode?backPay=true`)
            }
          >
            {translate('web.resource.mall.qushezhimima')}
          </Button>
        </div>
      )}
    </Spin>
  )
}

export default CreditPayWay
