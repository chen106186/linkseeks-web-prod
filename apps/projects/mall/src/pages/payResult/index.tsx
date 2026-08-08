import React, { useState, useEffect } from 'react'
import CommonHeader from '@/components/CommonHeader'
import { Button, message } from 'antd'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import { LinkTo } from '@/utils'
import paySuccessIcon from '@/assets/imgs/pay_success.png'
import { useLocation } from 'react-router-dom'
import HelmetProvider from '@/context/helmetProvider'
import { useGlobalConext } from '@/context/globalProvider'
import { getQueryString } from '@/utils/getUrlParam'
import useLink from '@/hooks/useLink'
import { MEMBER_CENTER_URL } from '@/constants/domain'
import styles from './index.module.less'

let timer: any = null
const PayResult: React.FC = () => {
  const { mallInfo } = useGlobalConext()
  const [count, setCount] = useState<number>(10)
  const location = useLocation()
  const orderId = getQueryString('orderId', location?.search)
  const queryType = getQueryString('type', location?.search)
  const type = queryType ? queryType : '1'
  const { linkPrefix } = useLink()
  const translate = getWebIntl()

  useEffect(() => {
    if (count > 1) {
      setTimer()
    } else {
      clearTimeout(timer)
      goToDetail()
    }
  }, [count])

  const setTimer = () => {
    timer = setTimeout(() => {
      setCount(count - 1)
    }, 1000)
  }

  const backHome = () => {
    LinkTo(linkPrefix())
  }

  const goToDetail = () => {
    if (orderId) {
      LinkTo(`${MEMBER_CENTER_URL}/orderAbility/purchaseOrder/orderList/detail?id=${orderId}`)
    } else {
      message.destroy()
      message.error(translate('web.resource.mall.dingdanxinxiyichang'))
    }
  }

  const renderTextByType = () => {
    switch (type) {
      case '1':
        return translate('web.resource.mall.zhifuchenggong')
      case '2':
        return translate('web.resource.mall.xiadanchenggong')
      case '3':
        return translate('web.resource.mall.tijiaochenggong')
      case '4':
        return translate('web.resource.mall.zhifuzhong')
      default:
        return translate('web.resource.mall.zhifuchenggong')
    }
  }

  return (
    <HelmetProvider title={`${translate('web.resource.mall.dingdanjieguo')}-${mallInfo?.name}`}>
      <div className={styles.pay}>
        <CommonHeader logoUrl={mallInfo?.logoUrl} title={translate('web.resource.mall.dingdanjieguo')} />
        <div className={styles.pay_result_container}>
          <img className={styles.success_icon} src={paySuccessIcon} />
          <div className={styles.result_text}>{renderTextByType()}</div>
          <div className={styles.btn_group}>
            <Button className={cx(styles.btn_item, styles.primary)} type="primary" onClick={() => goToDetail()}>
              {translate('web.resource.mall.qudingdanchakan')}({count}s)
            </Button>
            <Button className={styles.btn_item} onClick={() => backHome()}>
              {translate('web.resource.mall.fanghuishouye')}
            </Button>
          </div>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default PayResult
