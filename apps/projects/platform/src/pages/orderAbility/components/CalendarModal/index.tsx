import React, { useImperativeHandle, useState } from 'react'
import moment from 'moment'
import { Alert, Calendar, Modal } from 'antd'
import { CalendarMode } from 'antd/lib/calendar/generateCalendar'
import {
  CurrentlySelectedDateText,
  DefaultModalCancelText,
  DefaultModalOkText,
  DefaultSelectDateText,
} from '../translate'

interface CalendarModalProps {
  /**
   * 标题
   */
  title?: string
  /**
   *  确认按钮文字自定义
   */
  okText?: string
  /**
   *  取消按钮文字自定义
   */
  cancelText?: string
  /**
   * Modal 宽度
   */
  width?: string
  /**
   *  确认操作 -> 反馈
   */
  onOk?: (date: string) => void
  /**
   * 确认操作 ->  反馈
   */
  onCancel?: (visible?: boolean) => void
}

/**
 *  选择 日历 弹窗
 * @author: Gavin
 * @description: 组件 ref  提供如下方法
 *  -  test: () => void  ------> 测试方法
 *  -  handleOpen: () => void ------> 打开弹窗
 *  - handleClose: () => void ------> 关闭弹窗
 */
const CalendarModal = React.forwardRef((props: CalendarModalProps, ref: React.Ref<unknown>) => {
  const { title, width, okText, cancelText, onOk, onCancel } = props

  const [visible, setVisible] = useState<boolean>(false)
  const [dateValue, setDateValue] = useState<moment.Moment>(moment())

  const onSelect = (date: moment.Moment) => {
    setDateValue(date)
  }

  const onPanelChange = (date: moment.Moment, mode: CalendarMode) => {
    setDateValue(date)
  }

  const modalOnOk = () => {
    setVisible(false)
    if (onOk) onOk(moment(dateValue).format('YYYY-MM-DD'))
  }

  const modalOnCancel = () => {
    setVisible(false)
    setDateValue(moment())
    if (onCancel) onCancel(false)
  }

  useImperativeHandle(ref, () => ({
    // 测试调用
    test: () => {
      console.log('恭喜您调用到我了 :>> ')
    },
    //  打开弹窗
    handleOpen: () => {
      setVisible(true)
    },
    //  关闭弹窗
    handleClose: () => {
      setVisible(false)
    },
  }))

  return (
    <Modal
      title={title || DefaultSelectDateText}
      visible={visible}
      width={width || 680}
      okText={okText || DefaultModalOkText}
      cancelText={cancelText || DefaultModalCancelText}
      onOk={modalOnOk}
      onCancel={modalOnCancel}
    >
      <Alert message={`${CurrentlySelectedDateText}: ${dateValue.format('YYYY-MM-DD')}`} />
      <Calendar value={dateValue} onSelect={onSelect} onPanelChange={onPanelChange} />
    </Modal>
  )
})

CalendarModal.defaultProps = {}

export default CalendarModal
