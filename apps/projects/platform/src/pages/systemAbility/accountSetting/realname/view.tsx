import React, { useEffect, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { encryptedByAES, decryptedByAES } from '@linkseeks/crypto'
import { Button, Card, Image, message, Upload } from 'antd'
import styles from '../index.less'
import data from '@/constants/uploadProps'
import card_ortho from '@/assets/imgs/card_ortho.png'
import card_inverse from '@/assets/imgs/card_inverse.png'
import {
  postMemberSecuritySaveAuthInfo,
  getMemberSecurityGetUserInfo,
  postMemberSecurityUploadIdCard,
} from '@apps/apis'
import { CloseSquareFilled } from '@ant-design/icons'

type InfoProps = {
  /** 身份证正面(人头像) */
  frontUrl?: string
  /** 身份证反面(国徽像) */
  backUrl?: string
  /** 姓名 */
  name?: string
  /** 身份证号码 */
  cardNo?: string
}

const RealnameLayout = () => {
  const intl = useIntl()
  const [info, setInfo] = useState<InfoProps>()
  const [term, setTerm] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(true)

  /** 人像面 */
  const handleFrontUrl = ({ file }) => {
    if (file.status !== 'done') {
      return
    }
    const front = file.response.data
    const data = {
      ...info,
      frontUrl: front,
      backUrl: info?.backUrl,
    }
    setTerm(true)
    setInfo(data)
  }

  /** 人像面 */
  const handleBackUrl = ({ file }) => {
    if (file.status !== 'done') {
      return
    }
    const back = file.response.data
    const data = {
      ...info,
      backUrl: back,
    }
    setTerm(true)
    setInfo(data)
  }

  useEffect(() => {
    if (info?.frontUrl && info?.backUrl && term) {
      postMemberSecurityUploadIdCard({
        frontUrl: encryptedByAES(info?.frontUrl, false),
        backUrl: encryptedByAES(info?.backUrl, false),
      }).then((res) => {
        if (res.code !== 1000) {
          return
        }

        const data = {
          ...res.data,
          cardNo: decryptedByAES(res.data.cardNo),
          frontUrl: info?.frontUrl,
          backUrl: info?.backUrl,
        }
        setInfo(data)
      })
    }
  }, [info?.frontUrl, info?.backUrl, term])

  useEffect(() => {
    getMemberSecurityGetUserInfo().then((res: any) => {
      if (res.code !== 1000) {
        return
      }
      const { data } = res
      setInfo({
        ...data,
        cardNo: data?.cardNo ? decryptedByAES(data?.cardNo) : '',
        frontUrl: data?.frontUrl ? decryptedByAES(data?.frontUrl) : '',
        backUrl: data?.backUrl ? decryptedByAES(data?.backUrl) : '',
      })
    })
  }, [])

  const handleSubmit = () => {
    setLoading(true)
    const params = {
      ...info,
      frontUrl: info?.frontUrl ? encryptedByAES(info.frontUrl, false) : '',
      backUrl: info?.backUrl ? encryptedByAES(info.backUrl, false) : '',
      name: info?.name ? encryptedByAES(info.name, false) : '',
      cardNo: info?.cardNo ? encryptedByAES(info.cardNo, false) : '',
    }
    postMemberSecuritySaveAuthInfo(params as any).then((res: any) => {
      if (res.code !== 1000) {
        setLoading(false)
        return
      }
      history.goBack()
    })
  }

  useEffect(() => {
    if (info?.frontUrl && info?.backUrl && info?.cardNo && info?.name) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [info?.frontUrl, info?.backUrl, info?.cardNo, info?.name])
  console.log(info, 'info')
  const handleCircle = (name: string) => {
    let data: InfoProps = {}
    switch (name) {
      case 'frontUrl':
        data = {
          frontUrl: '',
          name: '',
          cardNo: '',
          backUrl: info?.backUrl,
        }
        setInfo(data)
        break
      case 'backUrl':
        data = {
          frontUrl: info?.frontUrl,
          name: '',
          cardNo: '',
          backUrl: '',
        }
        setInfo(data)
        break
    }
  }

  return (
    <PageHeaderWrapper
      backDom
      extra={
        <Button loading={loading} disabled={disabled} type="primary" onClick={handleSubmit}>
          {intl.formatMessage({ id: 'accountSetting.submit' })}
        </Button>
      }
    >
      <Card style={{ marginBottom: '16px' }}>
        <div className={styles.r_title}>{intl.formatMessage({ id: 'accountSetting.cardImage' })}</div>
        <div className={styles.r_text}>{intl.formatMessage({ id: 'accountSetting.cardMessage' })}</div>
        <div className={styles.r_body}>
          <div className={styles.r_cardFile}>
            <div className={styles.r_fileLayout}>
              {info?.frontUrl ? (
                <div className={styles.r_imageBox}>
                  <div className={styles.r_clear} onClick={() => handleCircle('frontUrl')}>
                    <CloseSquareFilled className={styles.r_clearicon} />
                  </div>
                  <Image width="100%" height="100%" src={info?.frontUrl} />
                </div>
              ) : (
                <div className={styles.r_imageBox}>
                  <Upload {...data} showUploadList={false} accept=".png,.jpg" onChange={handleFrontUrl}>
                    <Image height="100%" preview={false} src={card_ortho} />
                  </Upload>
                </div>
              )}
            </div>
            <div className={styles.r_fileText}>{intl.formatMessage({ id: 'accountSetting.cardFace' })}</div>
          </div>
          <div className={styles.r_cardFile}>
            <div className={styles.r_fileLayout}>
              {info?.backUrl ? (
                <div className={styles.r_imageBox}>
                  <div className={styles.r_clear} onClick={() => handleCircle('backUrl')}>
                    <CloseSquareFilled className={styles.r_clearicon} />
                  </div>
                  <Image width="100%" height="100%" src={info?.backUrl} />
                </div>
              ) : (
                <div className={styles.r_imageBox}>
                  <Upload {...data} showUploadList={false} accept=".png,.jpg" onChange={handleBackUrl}>
                    <Image height="100%" preview={false} src={card_inverse} />
                  </Upload>
                </div>
              )}
            </div>
            <div className={styles.r_fileText}>{intl.formatMessage({ id: 'accountSetting.emblem' })}</div>
          </div>
        </div>
      </Card>
      <Card style={{ marginBottom: '16px' }}>
        <div className={styles.r_title}>{intl.formatMessage({ id: 'accountSetting.cardInfo' })}</div>
        <div className={styles.r_item}>
          <div className={styles.r_lable}>{intl.formatMessage({ id: 'accountSetting.name' })}</div>
          <div className={styles.r_value}>{info?.name || intl.formatMessage({ id: 'accountSetting.cardLabel' })}</div>
        </div>
        <div className={styles.r_item}>
          <div className={styles.r_lable}>{intl.formatMessage({ id: 'accountSetting.cardNo' })}</div>
          <div className={styles.r_value}>{info?.cardNo || intl.formatMessage({ id: 'accountSetting.cardLabel' })}</div>
        </div>
      </Card>
    </PageHeaderWrapper>
  )
}
export default RealnameLayout
