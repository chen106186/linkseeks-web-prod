import React, { useEffect } from 'react'
import { getWebIntl } from '@/utils/locales'
import askPurchase from '@/assets/imgs/askPurchase.png'
import useCountdown from '@/hooks/useCountdown'
import { Button, message } from 'antd'
import { useGlobalConext } from '@/context/globalProvider'
import { MEMBER_CENTER_URL } from '@/constants/domain'
import { validateLoginWrapper } from '@/utils/validateLogin'
import styles from './index.module.less'

interface Props {
  projectName?: string
  projectType?: string
  data?: any
  id: string | undefined
}

const ShopTitle: React.FC<Props> = (props) => {
  const { projectName = '', projectType = '', data, id } = props
  const { userInfo, url } = useGlobalConext()
  const translate = getWebIntl()
  const { count, setTime } = useCountdown()

  useEffect(() => {
    if (data?.quoteEndTime) {
      setTime(new Date(data?.quoteEndTime).getTime())
    }
  }, [data?.quoteEndTime])

  return (
    <div className={styles['shop-title-warp']}>
      <div className={styles['shop-title-left']}>
        <div className={styles['shop-title']}>{projectName}</div>
        <div className={styles['shop-title-tips']}>
          <img src={askPurchase} style={{ width: 24, height: 24 }} />
          {projectType}
        </div>
      </div>
      {data?.status && userInfo?.memberRoleType === 1 ? (
        <div className={styles['shop-title-right']}>
          <Button
            type="primary"
            disabled={[3, 4, 5].includes(data?.status)}
            className={styles['shop-title-btn']}
            onClick={validateLoginWrapper(() => {
              if (data?.status == 3) {
                // message.error(translate('web.resource.mall.baojiayijiezhi'))
                return
              }
              if (data?.status == 4) {
                // message.error(translate('web.resource.mall.yizhongzhi'))
                return
              }
              if (data?.status == 5) {
                // message.error(translate('web.common.yizuofei'))
                return
              }

              if (data.whetherQuoted) {
                // message.error(translate('web.resource.mall.yibaojia'))
                return
              }
              window.open(`${MEMBER_CENTER_URL}/dealAbility/wangBuyOffer/inquiryOffer/waitAddOffer/add?id=${id}`)
            })}
          >
            {data.whetherQuoted ? translate('web.resource.mall.yibaojia') : translate('web.resource.mall.lijibaojia')}
          </Button>
          <div>
            {translate('web.resource.mall.baojiashengyu')}：
            {data?.status == 3 ? (
              <span className={styles['card-value']}>{translate('web.resource.mall.baojiayijiezhi')}</span>
            ) : (
              <div>
                {count?.d ? (
                  <>
                    {' '}
                    <span className={styles['shop-title-small-btn']}>{count.d}</span> {translate('web.common.tian')}{' '}
                  </>
                ) : null}
                {count?.h ? (
                  <>
                    {' '}
                    <span className={styles['shop-title-small-btn']}>{count.h}</span> {translate('web.common.hour')}{' '}
                  </>
                ) : null}
                {count?.m ? (
                  <>
                    {' '}
                    <span className={styles['shop-title-small-btn']}>{count.m}</span> {translate('web.common.minute')}{' '}
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ShopTitle
