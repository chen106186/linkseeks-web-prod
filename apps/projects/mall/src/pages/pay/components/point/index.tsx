import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Button, message, Spin } from 'antd'
import { LinkTo } from '@/utils'
import IconFont from '@/utils/iconfont'
import {
  GetMemberSecurityGetResponse,
  GetMemberBusinessLrcRightPointGetResponse,
  getMemberBusinessLrcRightPointGet,
  getMemberSecurityGet,
  postOrderCreateBuyerPay,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { encryptedByAES } from '@linkseeks/crypto'
import useLink from '@/hooks/useLink'
import { numFormat } from '@apps/utils'
import { MEMBER_CENTER_URL } from '@/constants/domain'
import PasswordInput from '../passwordInput'
import styles from './index.module.less'

interface PointPayWayPropsType {
  queryParam: any
  orderId: number
  onChange: Function
}

const PointPayWay: React.FC<PointPayWayPropsType> = (props) => {
  const translate = getWebIntl()
  const { orderId, queryParam, onChange } = props
  const [securityInfo, setSecurityInfo] = useState<GetMemberSecurityGetResponse>()
  const [payPassword, setPayPassword] = useState<string>('')
  const [pointInfo, setPointInfo] = useState<GetMemberBusinessLrcRightPointGetResponse>()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [payDisabled] = useState<boolean>(false)
  const [pageLoading, setPageLoading] = useState<boolean>(true)
  const [relType, setRelType] = useState<number>(1) // 1： 平台；2：会员
  const { linkPrefix } = useLink()

  const handlePasswordChange = (value: string) => {
    setPayPassword(value)
  }

  const handleChangeType = (type: number) => {
    setRelType(type)
  }

  useEffect(() => {
    if (queryParam) {
      fetchPointInfo()
      fetchSecurity()
    }
  }, [queryParam])

  const fetchPointInfo = () => {
    const param: any = {
      memberId: queryParam.memberId,
      roleId: queryParam.memberRoleId,
    }

    getMemberBusinessLrcRightPointGet(param).then((res: any) => {
      if (res.code === 1000) {
        setPointInfo(res.data)
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
    })
  }

  const pay = () => {
    if (!checkPoint()) {
      message.error(translate('web.resource.mall.jifenbuzu'))
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
      fundMode: relType,
      payPassword: encryptedByAES(payPassword),
    }

    setConfirmLoading(true)

    postOrderCreateBuyerPay(param)
      .then((res) => {
        if (res.code === 1000) {
          message.destroy()
          message.success(translate('web.resource.mall.zhifuchenggong'))
          LinkTo(linkPrefix(`/pay/result?orderId=${orderId}`), 'replace')
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

  const checkPoint = () => {
    if (relType === 1) {
      if (Number(pointInfo?.platformScore) >= Number(queryParam.payAmount)) {
        return true
      } else {
        return false
      }
    } else {
      if (Number(pointInfo?.memberScore) >= Number(queryParam.payAmount)) {
        return true
      } else {
        return false
      }
    }
  }

  return (
    <Spin spinning={pageLoading}>
      <div className={styles.common_title}>
        <span>{translate('web.resource.mall.jifenzhifu')}</span>
      </div>
      <div className={styles.pay_point}>
        <div className={styles.pay_point_way_list}>
          <div
            className={cx(styles.pay_point_way_list_item, relType === 1 ? styles.active : '')}
            onClick={() => handleChangeType(1)}
          >
            <div className={styles.pay_point_way_list_item_title}>
              <IconFont type="icon-zhifu-pingtai" className={styles.title_icon} />
              <span>{translate('web.resource.mall.pingtaitongyongjifen')}</span>
            </div>
            <div className={styles.pay_point_way_list_item_content}>
              <p>{translate('web.resource.mall.keyongjifen')}:</p>
              <div className={styles.pay_point_way_list_item_point}>
                <label>{numFormat(pointInfo?.platformScore || 0)}</label>
              </div>
            </div>
          </div>
          <div
            className={cx(styles.pay_point_way_list_item, relType === 2 ? styles.active : '')}
            onClick={() => handleChangeType(2)}
          >
            <div className={cx(styles.pay_point_way_list_item_title)}>
              <IconFont type="icon-zhifu-huiyuanzhuanshu" className={styles.title_icon} />
              <span>{translate('web.resource.mall.huiyuanzhuanyoujifen')}</span>
            </div>
            <div className={styles.pay_point_way_list_item_content}>
              <p>{translate('web.resource.mall.keyongjifen')}:</p>
              <div className={styles.pay_point_way_list_item_point}>
                <label>{numFormat(pointInfo?.memberScore || 0)}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.pay_amount_text}>
        <div>
          {translate('web.resource.mall.dangqianxuyaozhifu')}：
          <span className={styles.pay_amount_point}>{numFormat(queryParam.payAmount)} </span>
          {translate('web.resource.mall.integral')}
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

export default PointPayWay
