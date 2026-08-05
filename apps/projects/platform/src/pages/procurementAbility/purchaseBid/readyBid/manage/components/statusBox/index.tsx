import React, { useMemo, useState } from 'react'
import { Button, Divider, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { priceFormat } from '@/utils/numberFomat'
import useCountDown from '@/hooks/useCountDown'

import DetailBottomDrawer from './detailBottomDrawer'

import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'

interface StatuBoxProps {
  detail: any
  hasBidBtn?: boolean
  refresh?: () => void
}

const intl = getIntl()
const transforType = {
  1: intl.formatMessage({ id: 'detail.purchase.okText' }),
  0: intl.formatMessage({ id: 'detail.purchase.cancelText' }),
}

const StatuBox: React.FC<StatuBoxProps> = (props: any) => {
  const { hasBidBtn, detail, refresh } = props
  const [hour, minute, second, stillRun] = useCountDown(detail?.biddingEndTime / 1000)
  const [visible, setVisible] = useState<boolean>(false)

  const _handleBid = () => {
    if (detail.allowPurchaseCount > detail.offerCount) {
      setVisible(true)
    } else {
      message.error(intl.formatMessage({ id: 'detail.purchase.tips16' }))
    }
  }

  const renderDetailBottomDrawer = useMemo(() => {
    return <DetailBottomDrawer visible={visible} onClose={() => setVisible(false)} detail={detail} refresh={refresh} />
  }, [visible, detail, refresh])

  return (
    <>
      <div className="ant-card ant-card-bordered">
        <div className="ant-card-body">
          <div className={styles.statusBox}>
            <div className={styles.statusBoxStatus}>
              {intl.formatMessage({ id: 'detail.purchase.statusBoxStatus' })}：
              <span>
                {stillRun
                  ? intl.formatMessage({ id: 'detail.purchase.stillRunStart' })
                  : intl.formatMessage({ id: 'detail.purchase.stillRunend' })}
              </span>
            </div>
            <p className={styles.statusBoxTips}>{intl.formatMessage({ id: 'detail.purchase.distanceStillRunend' })}</p>
            <div className={styles.statusBoxTime}>
              <div className={styles.statusBoxTimeChild}>
                <div className={styles.statusBoxTimeChild_top}>{hour}</div>
                <p className={styles.statusBoxTimeChild_bottom}>{intl.formatMessage({ id: 'detail.purchase.hour' })}</p>
              </div>
              <span>:</span>
              <div className={styles.statusBoxTimeChild}>
                <div className={styles.statusBoxTimeChild_top}>{minute}</div>
                <p className={styles.statusBoxTimeChild_bottom}>
                  {intl.formatMessage({ id: 'detail.purchase.minute' })}
                </p>
              </div>
              <span>:</span>
              <div className={styles.statusBoxTimeChild}>
                <div className={styles.statusBoxTimeChild_top}>{second}</div>
                <p className={styles.statusBoxTimeChild_bottom}>
                  {intl.formatMessage({ id: 'detail.purchase.second' })}
                </p>
              </div>
            </div>
            <Divider dashed style={{ color: '#EBECF0', margin: '6px 0' }} />
            <h4>{intl.formatMessage({ id: 'detail.purchase.bidRulesLayout' })}</h4>
            <div className={styles.statusBoxText}>
              <div>{intl.formatMessage({ id: 'detail.purchase.offerRule' })}：</div>
              {intl.formatMessage({ id: 'detail.purchase.offerRule1' })}
            </div>
            <div className={styles.statusBoxText}>
              <div>{intl.formatMessage({ id: 'detail.purchase.startingPrice' })}：</div>
              {detail.isStartingPrice
                ? `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(detail?.startingPrice)}`
                : intl.formatMessage({ id: 'detail.purchase.null' })}
            </div>
            {!hasBidBtn && (
              <div className={styles.statusBoxText}>
                <div>{intl.formatMessage({ id: 'detail.purchase.targetPrice' })}：</div>
                {detail.isTargetPrice
                  ? `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(detail?.targetPrice)}`
                  : intl.formatMessage({ id: 'detail.purchase.null' })}
              </div>
            )}
            <div className={styles.statusBoxText}>
              <div>{intl.formatMessage({ id: 'detail.purchase.minPrice' })}：</div>
              {detail.isMinPrice
                ? `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(detail?.minPrice)}`
                : intl.formatMessage({ id: 'detail.purchase.null' })}
            </div>
            <div className={styles.statusBoxText}>
              <div>{intl.formatMessage({ id: 'detail.purchase.allowPurchaseCount' })}：</div>
              {detail?.allowPurchaseCount}次
            </div>
            <div className={styles.statusBoxText}>
              <div>{intl.formatMessage({ id: 'detail.purchase.offerRank' })}：</div>
              {hasBidBtn
                ? detail.isOpenPurchase
                  ? intl.formatMessage({ id: 'detail.purchase.offerRule4' })
                  : intl.formatMessage({ id: 'detail.purchase.null' })
                : intl.formatMessage({ id: 'detail.purchase.offerRule5' })}
            </div>
            {hasBidBtn ? (
              <Button
                disabled={!stillRun}
                type="primary"
                icon={<PlusOutlined />}
                block
                onClick={_handleBid}
                size={'large'}
                style={{ margin: '15px 0' }}
              >
                {intl.formatMessage({ id: 'detail.purchase.offerRule3' })}
              </Button>
            ) : (
              <>
                <div className={styles.statusBoxText}>
                  <div>{intl.formatMessage({ id: 'detail.purchase.offerRule2' })}：</div>
                  {transforType[detail?.isOpenPurchase]}
                </div>
                <div className={styles.statusBoxText}>
                  <div>{intl.formatMessage({ id: 'detail.purchase.isOpenRanking' })}：</div>
                  {transforType[detail?.isOpenRanking]}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {renderDetailBottomDrawer}
    </>
  )
}

export default StatuBox
