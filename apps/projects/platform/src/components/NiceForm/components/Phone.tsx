import { useEffect, useRef, useState } from 'react'
import { Row, Input, Col, Button, Modal } from 'antd'
import useCountDown from '@/utils/hooks'
import godEvent from '@/utils/event'
import RiskCheck from '@/components/RiskCheck'
import { decryptedByAES, encryptedByAES } from '@linkseeks/crypto'
import {
  getMemberCaptcha,
  postMemberRegisterPhoneCheck,
  postMemberRegisterPswSms,
  postMemberRegisterSms,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

// 滑块尺寸
const FLAG_SIZE = 60
const IMG_WIDTH = 352
const IMG_HEIGHT = 180

// 国家前缀 暂时写死
const prefixCode = '+86'

const Phone = (props) => {
  const { value, form, schema } = props
  const intl = useIntl()
  const instanceRef = useRef({
    canIUseSms: false,
  })

  const { text, isActive, start } = useCountDown({
    maxTime: 60,
    minTime: 0,
    initText: intl.formatMessage({ id: 'components.huoquyanzhengma' }),
    onEnd: () => {
      instanceRef.current.canIUseSms = false
      form.setFieldState('phone', (state) => {
        state.smsLoading = instanceRef.current.canIUseSms
      })
    },
    decayRate: 1,
    delay: 1 * 1000,
  })

  const { smsFn, btnSize = 'large', inputSize = 'large', ...componentProps } = schema.getExtendsComponentProps() || {}

  const [loading, setLoading] = useState(false)
  const [isShowValidate, setIsShowValidate] = useState(false)

  const [remoteImg, setRemoteImg] = useState({
    x: 0,
    y: 0,
    imgId: '',
    img: '',
  })

  useEffect(() => {
    godEvent.on('SHOW_PHONE_VALIDATE', (payload) => {
      if (isActive) {
        // 验证码在loading的时候 不能再次触发
        return
      }
      setIsShowValidate(payload)
    })

    return () => {
      godEvent.off('SHOW_PHONE_VALIDATE')
    }
  }, [isActive])

  useEffect(() => {
    if (isShowValidate && !isActive) {
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
  }, [isShowValidate, isActive])

  const validatePhoneRequest = async () => {
    return new Promise(async (resolve) => {
      try {
        // 这种情况说明是忘记密码, 无需校验手机号
        if (!form.getFieldValue('phone') && form.getFieldValue('account')) {
          resolve(true)
          return
        }
        const { code } = await postMemberRegisterPhoneCheck(
          {
            countryCode: prefixCode,
            phone: encryptedByAES(form.getFieldValue('phone')),
          },
          { ctlType: 'none', useCache: true, ttl: 60 * 1000 },
        )
        if (code !== 1000) {
          form.setFieldState('phone', (state) => {
            state.errors = [intl.formatMessage({ id: 'components.shoujihaoyicunzai' })]
            resolve(false)
            godEvent.emit('SHOW_PHONE_VALIDATE', false)
          })
        } else {
          resolve(true)
        }
      } catch (err) {
        console.log(err)
        resolve(false)
      }
    })
  }

  const handleStartSms = () => {
    setLoading(true)
    if (form.getFieldValue('phone')) {
      form.setFieldState('phone', (state) => {
        state.smsLoading = instanceRef.current.canIUseSms
      })
      postMemberRegisterSms({
        countryCode: '+86',
        width: remoteImg.x,
        imgId: remoteImg.imgId,
        phone: encryptedByAES(form.getFieldValue('phone')),
      }).finally(() => {
        start()
        setLoading(false)
      })
    }

    if (form.getFieldValue('account')) {
      form.setFieldState('account', (state) => {
        state.smsLoading = instanceRef.current.canIUseSms
      })

      postMemberRegisterPswSms({
        countryCode: '+86',
        width: remoteImg.x,
        imgId: remoteImg.imgId,
        phone: encryptedByAES(form.getFieldValue('account')),
      }).finally(() => {
        start()
        setLoading(false)
      })
    }
  }

  const handleClickSms = async () => {
    // 注册页手机号字段
    const validatePhoneState = await form.validate('phone')
    // 忘记密码 手机号或邮箱字段
    const validateAccountState = await form.validate('account')

    const phoneAsyncValidate = await validatePhoneRequest()
    // 手机号未通过校验
    if (validatePhoneState.errors > 0 || validateAccountState.errors > 0 || !phoneAsyncValidate) {
      return false
    }

    // 短信正在读秒中
    if (isActive) {
      return false
    }

    // 尚未通过滑块校验
    if (!instanceRef.current.canIUseSms) {
      setIsShowValidate(true)
    }
  }

  const handleCheckSuccess = () => {
    setTimeout(() => {
      setIsShowValidate(false)
      instanceRef.current.canIUseSms = true

      if (smsFn) {
        smsFn(form, remoteImg, setLoading, () => {
          start()
          setLoading(false)
        })
        return
      }

      handleStartSms()
    }, 1000)
  }

  return (
    <Row style={{ width: '100%' }}>
      <Col flex={1}>
        <Input
          value={value || ''}
          onChange={(e) => props.mutators.change(e.target.value)}
          size={inputSize}
          {...componentProps}
        />
      </Col>
      <Col style={{ marginLeft: 8 }}>
        <Button
          disabled={isActive}
          style={{ minWidth: 110, marginLeft: 8 }}
          loading={loading}
          size={btnSize}
          onClick={handleClickSms}
        >
          {text}
        </Button>
      </Col>
      <Modal
        title={intl.formatMessage({ id: 'components.huadongyanzheng' })}
        visible={isShowValidate}
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
    </Row>
  )
}

Phone.defaultProps = {}

Phone.isFieldComponent = true

export default Phone
