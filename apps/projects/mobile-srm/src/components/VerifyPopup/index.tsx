/*
 * @Description: 是否审核通过弹窗
 */
import React, { useMemo, useState, useEffect } from 'react'
import { pxTransform, showToast } from '@apps/mobile-services/utils/taro'
import { View, TextArea, Button } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import { limitByte } from '@/utils'
import MellowCard from '@/components/MellowCard'
import Popup from '@/components/Popup'
import './index.scss'

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
   * 是否同意
   */
  agree: boolean
  /**
   * 理由
   */
  reason?: string
  /**
   * 输入理由触发事件
   */
  onReasonChange?: (value: string) => void
  /**
   * 关闭事件
   */
  onClose: () => void
  /**
   * 点击确认回调事件
   */
  onConfirm?: (values: VerifySubmitValueType) => void
  /**
   * 标题
   */
  title1?: string
}

const reasonPlaceholderMap = {
  true: '(选填)点击输入原因，最长120个字符，60个汉字',
  false: '(必填)点击输入原因，最长120个字符，60个汉字',
}

const titleMap = {
  true: '审核通过原因',
  false: '审核不通过原因',
}

const VerifyPopup: React.FC<VerifyPopupProps> = (props: VerifyPopupProps) => {
  const { visible, agree, reason, onReasonChange, onClose, onConfirm, title1 } = props

  const [interalValue, setInteralValue] = useState('')

  const { safeBottomHeight } = useSafeArea()

  useEffect(() => {
    if ('reason' in props) {
      setInteralValue(reason || '')
    }
  }, [reason])

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleTextAreaChange = (value: string) => {
    if (!('value' in props)) {
      setInteralValue(value)
    }
    onReasonChange?.(value)
  }

  const handleConfirm = () => {
    if (!agree && !interalValue) {
      showToast({ title: '请填写原因', icon: 'none' })
      return
    }
    if (interalValue) {
      const resMsg = limitByte(interalValue, { maxByte: 120 })
      if (resMsg) {
        showToast({ title: resMsg, icon: 'none' })
        return
      }
    }
    onConfirm?.({
      agree: agree ? 1 : 0,
      reason: interalValue,
    })
  }

  const title = useMemo(() => title1 || titleMap[`${agree}`], [agree, title1])

  const reasonPlaceholder = useMemo(() => reasonPlaceholderMap[`${agree}`], [agree])

  return (
    <Popup
      visible={visible}
      onClose={handleClose}
      title={title}
      customTitleStyle={{
        borderBottom: 'none',
      }}
    >
      <View
        style={{
          height: pxTransform(446),
        }}
        className="verify-popup-content"
      >
        <TextArea
          value={interalValue}
          onChange={handleTextAreaChange}
          placeholder={reasonPlaceholder}
          count={false}
          showConfirmBar
        />
      </View>
      <View
        className="verify-popup-actions"
        style={{
          paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
        }}
      >
        <Button type="primary" onClick={handleConfirm} disabled={!agree && !interalValue}>
          确定
        </Button>
      </View>
    </Popup>
  )
}

export default VerifyPopup
