/*
 * @Description: 审核 FormItem，需要放到 Form 组件下使用
 */
import React, { useRef, useState } from 'react'
import { pxTransform, showToast } from '@apps/mobile-services/utils/taro'
import { View, TextArea, Button } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import { limitByte } from '@/utils'
import MellowCard from '@/components/MellowCard'
import Popup from '@/components/Popup'
import Form from '../Form'
import CustomSwitch from '../CustomSwitch'
import { RuleObject } from '../Form/typings'
import './index.scss'
import { validateFields } from '../Form/utils/validateUtil'

export type VerifyValueType = {
  /**
   * 是否通过
   */
  agree: boolean
  /**
   * 理由
   */
  reason: string
}

export type VerifySubmitValueType = Omit<VerifyValueType, 'agree'> & {
  /**
   * 是否通过
   */
  agree: number
}

export interface VerifyPopupProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 关闭事件
   */
  onClose: () => void
  /**
   * 点击确认回调事件
   */
  onConfirm?: (values: VerifySubmitValueType) => void
}

const reasonPlaceholderMap = {
  true: '(选填)点击输入原因，最长120个字符，60个汉字',
  false: '(必填)点击输入原因，最长120个字符，60个汉字',
}

const VerifyPopup: React.FC<VerifyPopupProps> = (props: VerifyPopupProps) => {
  const { visible, onClose, onConfirm } = props

  const [reasonPlaceholder, setReasonPlaceholder] = useState(reasonPlaceholderMap['true'])

  const [form] = Form.useForm()

  const rules = useRef<Map<string, RuleObject[]>>(
    new Map([
      [
        'reason',
        [
          {
            required: false,
            message: '请填写原因',
          },
        ],
      ],
    ]),
  )

  const { safeBottomHeight } = useSafeArea()

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleAgreeInputChange = (value: boolean) => {
    rules.current.set('reason', [
      {
        required: !value,
        message: '请填写原因',
      },
      {
        validator: (_, value) => {
          const resMsg = limitByte(value || '', { maxByte: 120 })
          if (resMsg) {
            return Promise.reject(new Error(resMsg))
          }
          return Promise.resolve()
        },
      },
    ])
    setReasonPlaceholder(reasonPlaceholderMap[`${value}`])
  }

  const handleConfirm = () => {
    form.submit()
  }

  const handleFinish = async (values: VerifyValueType) => {
    try {
      const valueErrors = await validateFields(values, rules.current)
      if (valueErrors.length) {
        showToast({ title: valueErrors[0].errors?.[0], icon: 'none' })
        return
      }
      onConfirm?.({
        agree: values.agree ? 1 : 0,
        reason: values.reason || '',
      })
    } catch (error) {}
  }

  return (
    <Popup
      visible={visible}
      onClose={handleClose}
      title="审核"
      customTitleStyle={{
        borderBottom: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <View
        style={{
          height: 448,
        }}
        className="verify-popup-content"
      >
        <Form form={form} onFinish={handleFinish}>
          <MellowCard
            headStyle={{
              borderBottomWidth: 0,
            }}
            bodyStyle={{
              paddingTop: 0,
              paddingBottom: 0,
            }}
            style={{
              marginBottom: pxTransform(themeLayout['margin-xs']),
            }}
          >
            <Form.Item label="是否审核通过" labelWidth={100} name="agree" valuePropName="checked" initialValue={true}>
              <CustomSwitch onChange={handleAgreeInputChange} />
            </Form.Item>
          </MellowCard>
          <MellowCard
            headStyle={{
              borderBottomWidth: 0,
            }}
            bodyStyle={{
              paddingTop: 0,
              paddingBottom: 0,
            }}
          >
            <Form.Item name="reason">
              <TextArea placeholder={reasonPlaceholder} count={false} />
            </Form.Item>
          </MellowCard>
        </Form>
      </View>
      <View
        className="verify-popup-actions"
        style={{
          paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
        }}
      >
        <Button type="primary" onClick={handleConfirm}>
          确定
        </Button>
      </View>
    </Popup>
  )
}

export default VerifyPopup
