import React, { useState, useEffect } from 'react'
import ProcurementResult from './components/ProcurementResult'
import { getPurchasePurchaseNoticeDetails } from '@apps/apis'
import { useParams } from 'react-router-dom'
import styles from './index.module.less'

const Detail: React.FC = () => {
  const { id } = useParams()
  const [notice, setNotice] = useState<any>({})
  /**
   * 获取一级品类详细信息
   */
  const fnGetInviteTenderListByEnterpriseWeb = () => {
    const param: any = {
      id: id,
    }

    getPurchasePurchaseNoticeDetails(param).then((res) => {
      if (res.code === 1000) {
        setNotice(res.data)
      }
    })
  }

  useEffect(() => {
    fnGetInviteTenderListByEnterpriseWeb()
  }, [])

  return (
    <div className={styles.purchaseInquiry}>
      <div className={styles.mall_container}>
        <div className={styles.purchaseInquiry_container}>
          <div className={styles.purchaseInquiry_main}>
            <ProcurementResult
              resultTitle={notice.name}
              releaseTime={notice.createTime}
              content={notice.content}
              winTenderAnnounceFile={notice.winTenderAnnounceFile}
              winTenderNoticeFile={notice.winTenderNoticeFile}
            ></ProcurementResult>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail
