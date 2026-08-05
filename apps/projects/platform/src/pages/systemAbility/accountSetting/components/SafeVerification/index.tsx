import React, { useEffect, useState } from 'react'
import styles from './index.less'
import { Row, Col, Modal, message } from 'antd'
// import SliderVerify from '../SliderVerify';
import { useIntl } from '@linkseeks/i18n'
import RiskCheck from '@/components/RiskCheck'
import { decryptedByAES } from '@linkseeks/crypto'
import { getMemberCaptcha } from '@apps/apis'

// const imageUrl = 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1689053532,4230915864&fm=26&gp=0.jpg'

// 滑块尺寸
const FLAG_SIZE = 60
const IMG_WIDTH = 352
const IMG_HEIGHT = 180

interface Iprops {
  isDisabled: boolean
  handleVerifySuccess: () => void
  tips?: string
}

const SafeVerification: React.FC<Iprops> = (props) => {
  const intl = useIntl()
  const { isDisabled, tips = intl.formatMessage({ id: 'accountSetting.inputCode', defaultMessage: '请填写验证码' }) } =
    props
  const [visible, setVisible] = useState(false)
  const [remoteImg, setRemoteImg] = useState({
    x: 0,
    y: 0,
    imgId: '',
    img: '',
  })
  const handleVisible = () => {
    if (isDisabled) {
      message.error(tips)
      return
    }
    setVisible(true)
  }
  const cancel = () => {
    setVisible(false)
  }
  // console.log(visible)
  const handleSuccess = () => {
    setVisible(false)
    !!props.handleVerifySuccess && props.handleVerifySuccess()
  }

  useEffect(() => {
    if (visible) {
      getMemberCaptcha({
        width: IMG_WIDTH.toString(),
        height: IMG_HEIGHT.toString(),
        size: FLAG_SIZE.toString(),
      }).then((res) => {
        const { backImage, width, height, imgId } = res.data
        setRemoteImg(() => {
          return {
            img: 'data:image/jpeg;base64,' + backImage,
            imgId,
            x: Number(decryptedByAES(width)),
            y: Number(height),
          }
        })
      })
    }
  }, [visible])

  return (
    <div className={styles.box}>
      <Row>
        <Col span={16} offset={4}>
          <div className={styles.container}>
            <div className={styles.btn} onClick={handleVisible}>
              {intl.formatMessage({ id: 'accountSetting.clickVerify' })}
            </div>
          </div>
        </Col>
      </Row>

      <Modal
        title={intl.formatMessage({ id: 'components.huadongyanzheng' })}
        visible={visible}
        mask
        centered
        destroyOnClose
        footer={null}
        onCancel={cancel}
      >
        <RiskCheck
          className={styles.risk}
          imgUrl={remoteImg.img}
          imgWidth={IMG_WIDTH}
          imgHeight={IMG_HEIGHT}
          xPoint={remoteImg.x}
          yPoint={remoteImg.y}
          shadowSize={FLAG_SIZE}
          differ={10}
          tipText={intl.formatMessage({ id: 'components.riskCheckTips', defaultMessage: '' })}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  )
}

export default SafeVerification
