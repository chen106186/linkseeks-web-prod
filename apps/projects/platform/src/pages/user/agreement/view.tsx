import React, { useEffect, useState } from 'react'
import { getManageContentNoticeFindAllByColumnType } from '@apps/apis'
import { Loading } from '@apps/components'
import { usePageStatus } from '@/hooks/usePageStatus'
import styles from './index.less'

interface AgreementPropsType {
  location: any
}

const Agreement: React.FC<AgreementPropsType> = (props) => {
  const [agreementInfo, setAgreementInfo] = useState<any>()
  const { id } = usePageStatus()

  useEffect(() => {
    fetchAgreement()
  }, [])

  const fetchAgreement = () => {
    let param = {
      columnType: '2',
    }
    getManageContentNoticeFindAllByColumnType(param).then((res) => {
      if (res.code === 1000) {
        initData(res.data)
      }
    })
  }

  const initData = (data) => {
    let result = null
    if (data) {
      for (let item of data) {
        if (item.id === Number(id)) {
          result = item
        }
      }
    }
    setAgreementInfo(result)
  }

  return agreementInfo ? (
    <div className={styles.policyBox}>
      <h1>{agreementInfo.title}</h1>
      <div className={styles.policyBox_container}>
        <article dangerouslySetInnerHTML={{ __html: agreementInfo.content }}></article>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default Agreement
