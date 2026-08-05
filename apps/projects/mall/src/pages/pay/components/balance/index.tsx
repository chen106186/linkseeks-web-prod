import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Button, message, Spin } from 'antd'
import IconFont from '@/utils/iconfont'
import { LinkTo } from '@/utils'
import {
  GetMemberSecurityGetResponse,
  GetPayAssetAccountGetUserBalanceResponse,
  getMemberSecurityGet,
  postOrderCreateBuyerPay,
  getPayAssetAccountBalance,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { encryptedByAES } from '@linkseeks/crypto'
import useLink from '@/hooks/useLink'
import PasswordInput from '../passwordInput'
import styles from './index.module.less'
import { priceFormat } from '@apps/utils'
import { MEMBER_CENTER_URL } from '@/constants/domain'

interface BablancePayWayPropsType {
  queryParam: any
  orderId: number[]
  onChange: Function
}

const BablancePayWay: React.FC<BablancePayWayPropsType> = (props) => {
  const translate = getWebIntl()
  const { orderId, queryParam, onChange } = props
  const [balanceInfo, setBalanceInfo] = useState<GetPayAssetAccountGetUserBalanceResponse>(0)
  const [securityInfo, setSecurityInfo] = useState<GetMemberSecurityGetResponse>()
  const [payPassword, setPayPassword] = useState<string>('')
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [pageLoading, setPageLoading] = useState<boolean>(true)
  const [payDisabled] = useState<boolean>(false)
  const { linkPrefix } = useLink()

  const handlePasswordChange = (value: string) => {
    setPayPassword(value)
  }

  useEffect(() => {
    if (queryParam) {
      fetchBalanceInfo()
      fetchSecurity()
    }
  }, [queryParam])

  const fetchBalanceInfo = () => {
    const param: any = {
      fundMode: queryParam.fundMode,
      vendorMemberId: queryParam.memberId,
      vendorRoleId: queryParam.memberRoleId,
    }

    getPayAssetAccountBalance(param).then((res: any) => {
      if (res.code === 1000) {
        setBalanceInfo(res.data)
        setPageLoading(false)
      } else {
        setPageLoading(false)
        onChange(true, res.message)
      }
    })
  }

  const fetchSecurity = () => {
    getMemberSecurityGet().then((res: any) => {
      if (res.code === 1000) {
        setSecurityInfo(res.data)
      }
      setPageLoading(false)
    })
  }

  const pay = () => {
    if (balanceInfo < queryParam.payAmount) {
      message.info(translate('web.resource.mall.zhanghuyuebuzu'))
      return
    }
    if (!payPassword || payPassword.length < 6) {
      message.info(translate('web.resource.mall.qingshuruzhifumima'))
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
        <span>{translate('web.resource.mall.yuezhifu')}</span>
      </div>
      <div className={styles.pay_point}>
        <div className={styles.pay_point_way_list}>
          <div className={cx(styles.pay_point_way_list_item, styles.active)}>
            <div className={styles.pay_point_way_list_item_title}>
              <IconFont type="icon-blance_icon" className={styles.title_icon} />
              <span>{translate('web.resource.mall.zhanghuyue')}</span>
            </div>
            <div className={styles.pay_point_way_list_item_content}>
              <p>{translate('web.resource.payment.keyongyue')}：</p>
              <div className={styles.pay_point_way_list_item_point}>
                <label>{priceFormat(balanceInfo)}</label>
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

export default BablancePayWay
