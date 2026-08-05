import React, { useState, useEffect } from 'react'
import { message, Spin, Modal } from 'antd'
import { postOrderCreateBuyerPay } from '@apps/apis'
import { PayWayType } from '@/constants/pay'
import { LinkTo } from '@/utils'
import { priceFormat } from '@apps/utils'
import { getWebIntl } from '@/utils/locales'
import useLink from '@/hooks/useLink'
import styles from './index.module.less'

interface EBankProps {
  orderId: number[]
  onChange: Function
  queryParam: any
}

const EBank: React.FC<EBankProps> = (props) => {
  const { onChange, orderId, queryParam } = props
  const [pageLoading, setPageLoading] = useState<boolean>(true)
  const { linkPrefix } = useLink()
  const translate = getWebIntl()

  useEffect(() => {
    pay()
  }, [])

  const showConfirm = () => {
    Modal.confirm({
      content: translate('web.resource.mall.shifouquerenzhifu'),
      centered: true,
      onOk: () => {
        LinkTo(
          linkPrefix(
            `/pay/result?orderId=${orderId[0]}&type=${Number(queryParam.payChannel) === PayWayType.ccbBank ? 4 : 2}`,
          ),
          'replace',
        )
      },
      onCancel: () => {
        LinkTo(linkPrefix(`/pay/result?orderId=${orderId[0]}&type=2`), 'replace')
      },
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
          if (res.data?.codeUrl) {
            Modal.confirm({
              title: '提示',
              content: '即将离开本页面前往通联支付',
              onOk() {
                window.open(res.data.codeUrl, '_blank')
                showConfirm()
              },
            })
            // const el = document.createElement('a')
            // el.href = res.data?.codeUrl
            // el.target = '_blank'
            // el.click()
          }
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

  return (
    <Spin spinning={pageLoading}>
      <div className={styles.common_title}>
        <span>{translate('web.resource.mall.wangyinzhifu')}</span>
      </div>
      <div className={styles.allinpay_ebank}>
        <div className={styles.allinpay_ebank_needpay}>
          <label>{translate('web.resource.mall.dangqianxuzhifu')}：</label>
          <span>{translate('web.common.currencySymbol')}</span>
          <span>{priceFormat(queryParam.payAmount)}</span>
        </div>
      </div>
    </Spin>
  )
}

export default EBank
