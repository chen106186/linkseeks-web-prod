import React, { useEffect, useState } from 'react'
import { Button, Input, message, Modal } from 'antd'
import styles from './index.less'
import useCountDown from '@/utils/hooks'
import { getIntl } from '@linkseeks/i18n'
import { getPayEAccountAllInPayReSendPayCode } from '@apps/apis'
const intl = getIntl()

interface Iprops {
  visible: boolean
  title?: string
  onOk: (code: string) => void
  // onResendCode: () => void,
  /** 商户订单号 */
  tradeCode: string
  onClose?: () => void
  // /** 时间戳随机码 */
  // randomCode: string
}

const GetCodeModal: React.FC<Iprops> = (props: Iprops) => {
  const { title = '验证码', onOk, visible, tradeCode, onClose } = props
  const [code, setCode] = useState<string>('')
  const { text, isActive, start } = useCountDown({
    maxTime: 60,
    minTime: 0,
    initText: intl.formatMessage({ id: 'payandSettle.eAccountApprove.components.personal.initText' }),
    onEnd: () => {
      console.log('end')
    },
    decayRate: 1,
    delay: 1 * 1000,
  })
  const handleOk = () => {
    if (!code) {
      message.error('请填写验证码')
      return
    }
    onOk?.(code)
  }

  useEffect(() => {
    if (visible) {
      start()
    }
  }, [visible])

  const handleChange = (e) => {
    setCode(e.target.value)
  }

  const handleSendCode = async () => {
    const { code, data } = await getPayEAccountAllInPayReSendPayCode({
      tradeCode: `${tradeCode}`,
    })
    if (code === 1000) {
      start()
    }
  }
  const handleClose = () => {
    onClose?.()
  }

  return (
    <Modal visible={visible} width={360} title={title} onOk={handleOk} onCancel={handleClose}>
      <div className={styles.container}>
        <div className={styles.formItem}>
          <div className={styles.input}>
            <Input value={code} onChange={handleChange} placeholder="请输入验证码" />
          </div>
          <Button disabled={isActive} onClick={handleSendCode}>
            {text}
          </Button>
        </div>
        {/* <div className={styles.tips}>已将验证码发送到您尾号为2800的手机号</div> */}
      </div>
    </Modal>
  )
}

export default GetCodeModal
