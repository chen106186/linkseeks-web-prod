import React, { useRef, useState, useEffect, Fragment } from 'react'
import { Button, Modal } from 'antd'
import useCountDown from '@/utils/hooks'
import { useIntl } from '@linkseeks/i18n'
import { FormInstance } from 'antd/es/form/Form'
import { decryptedByAES } from '@linkseeks/crypto'
import { RiskCheck } from '@apps/components'

interface IProps {
  className?: string
  form: FormInstance<any>
  style?: React.CSSProperties
  smsFn: Function
  sliderFn?: Function
  sliderParam?: Record<string, any>
  validateField: string
}

// 滑块尺寸
const FLAG_SIZE = 60
const IMG_WIDTH = 352
const IMG_HEIGHT = 180

const SmsButton: React.FC<IProps> = (props) => {
  const { form, style, smsFn, sliderFn, sliderParam, validateField, className } = props
  const intl = useIntl()
  const [loading, setLoading] = useState<boolean>(false)
  const [isShowValidate, setIsShowValidate] = useState<boolean>(false)
  const instanceRef = useRef({
    canIUseSms: false,
  })
  const [remoteImg, setRemoteImg] = useState({
    x: 0,
    y: 0,
    imgId: '',
    img: '',
  })
  const { text, isActive, start } = useCountDown({
    maxTime: 60,
    minTime: 0,
    initText: intl.formatMessage({
      id: 'components.huoquyanzhengma',
      defaultMessage: '获取验证码',
    }),
    onEnd: () => {
      instanceRef.current.canIUseSms = false
    },
    decayRate: 1,
    delay: 1 * 1000,
  })

  useEffect(() => {
    if (isShowValidate && !isActive && sliderFn) {
      sliderFn({
        width: IMG_WIDTH.toString(),
        height: IMG_HEIGHT.toString(),
        size: FLAG_SIZE.toString(),
        ...(sliderParam || {}),
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
  }, [isShowValidate, isActive])

  const handleCheckSuccess = () => {
    setIsShowValidate(false)
    instanceRef.current.canIUseSms = true

    if (smsFn) {
      smsFn(form, remoteImg, setLoading, () => {
        start()
        setLoading(false)
      })
      return
    }
  }

  const handleClickSms = async () => {
    // 注册页手机号字段 | 忘记密码 手机号或邮箱字段
    form.validateFields([validateField]).then((values) => {
      // 短信正在读秒中
      if (isActive) {
        return false
      }

      // 尚未通过滑块校验
      if (!instanceRef.current.canIUseSms && sliderFn) {
        setIsShowValidate(true)
        return
      }

      if (!sliderFn) {
        handleCheckSuccess()
      }
    })
  }

  return (
    <Fragment>
      <Button
        className={className}
        disabled={isActive}
        style={{
          minWidth: 110,
          height: 39,
          ...style,
        }}
        loading={loading}
        onClick={handleClickSms}
      >
        {text}
      </Button>
      <Modal
        title={intl.formatMessage({
          id: 'components.huadongyanzheng',
          defaultMessage: '滑动验证码',
        })}
        open={isShowValidate}
        mask
        centered
        destroyOnClose
        footer={null}
        onCancel={() => setIsShowValidate(false)}
      >
        <RiskCheck
          className="lx-risk-check"
          imgUrl={remoteImg.img}
          imgWidth={IMG_WIDTH}
          imgHeight={IMG_HEIGHT}
          xPoint={remoteImg.x}
          yPoint={remoteImg.y}
          shadowSize={FLAG_SIZE}
          differ={10}
          tipText={intl.formatMessage({ id: 'components.riskCheckTips', defaultMessage: '' })}
          onSuccess={handleCheckSuccess}
        />
      </Modal>
    </Fragment>
  )
}

export default SmsButton
