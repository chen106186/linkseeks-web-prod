/*
 * @Author: Crayon
 * @Date: 2021-10-16 15:24:18
 * @LastEditTime: 2022-04-01 15:39:39
 * @LastEditors: GHua
 * @Description:
 * @FilePath: \lingxi-mall\apps\b2b\web\page\order\components\addDeliveryTime\index.tsx
 */
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, DatePicker, Radio, TimePicker, Space } from 'antd'
import FormLabel from '../FormLabel'
import moment from 'moment'
import styles from './index.less'
import { WEEK } from './constant'
import { getOrderBuyerFindDeliveryDate } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

interface AddDeliveryTimePropsType {
  onOk: (x: onOkProps) => void
  shopId: number | undefined
  vendorMemberId: number
  vendorRoleId: number
}

interface configInfoType {
  appointmentDay?: string
  deliveryTime?: string
  days?: number
  paramList?: any[]
}

interface paramListItemType {
  startTime: string
  endTime: string
}

export interface onOkProps {
  deliverTime: string
  deliverTimeText: string
}

export interface AddDeliveryTimeRefProps {
  showModal: (x: boolean) => void
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 24 },
}

// 设置只可选择的时间
const disabledDate = (current: any, configInfo: configInfoType) => {
  if (configInfo.appointmentDay) {
    // 只能选择指定天数的日期(例如指定7天内)
    return (
      current.isBefore(moment(Date.now()).add(-1, 'days')) ||
      current.isAfter(moment(Date.now()).add((configInfo.days as number) - 1, 'days'))
    )
  } else {
    // 只能选择当天之后的日期
    return current && current < moment().subtract(1, 'days')
  }
}

const AddDeliveryTime = forwardRef((props: AddDeliveryTimePropsType, ref) => {
  const { onOk, shopId, vendorMemberId, vendorRoleId } = props
  const intl = useIntl()
  const [visible, setVisible] = useState<boolean>(false)
  const [configInfo, setConfigInfo] = useState<configInfoType>({})
  const [slotOptions, setSlotOptions] = useState<any[]>([])

  const [form] = Form.useForm()

  useImperativeHandle(ref, () => ({
    showModal(visible = true) {
      setVisible(visible)
    },
  }))

  const getConfigDeliveryDate = () => {
    getOrderBuyerFindDeliveryDate({
      shopId: `${shopId}`,
      vendorMemberId: `${vendorMemberId}`,
      vendorRoleId: `${vendorRoleId}`,
    }).then((res: any) => {
      const { code, data } = res
      if (code === 1000) {
        const { deliveryTime, paramList } = data
        setConfigInfo(data)
        if (deliveryTime && paramList) {
          const newOptions = paramList.map((item: paramListItemType) => {
            return {
              label: `${item.startTime}-${item.endTime}`,
              value: `${item.startTime}-${item.endTime}`,
            }
          })
          setSlotOptions(newOptions)
        }
      }
    })
  }

  useEffect(() => {
    if (visible) {
      getConfigDeliveryDate()
    }
  }, [visible])

  const handleOk = () => {
    form.validateFields().then((values) => {
      // 日期
      const date = moment(values.date).format('MM-DD')
      const yearData = moment(values.date).format('YYYY-MM-DD')
      // 星期
      const week = values.date.day()
      // 时间段/时间
      const time = configInfo.deliveryTime ? values.timeSlot : values.time ? moment(values.time).format('hh:mm') : ''
      // 日期 时间段/时间，也是接口所需要的字段数据
      const deliverTime = `${yearData} ${time}`
      // 具体送货时间拼接，展示用数据
      const deliverTimeText = `${date.replace(
        '-',
        intl.formatMessage({ id: 'LatestAnnounces.index.Mount' }),
      )}${intl.formatMessage({ id: 'ShopInfo.index.day' })} [${WEEK[week]}] ${time}`
      const params: onOkProps = {
        deliverTime,
        deliverTimeText,
      }
      setVisible(false)
      onOk && onOk(params)
    })
  }

  return (
    <Modal
      title={intl.formatMessage({ id: 'addDeliveryTime.index.DeliveryTime' })}
      visible={visible}
      onOk={handleOk}
      width={600}
      centered
      className={styles.modal}
      onCancel={() => setVisible(false)}
      maskClosable={false}
    >
      <Form {...layout} layout="vertical" labelAlign="left" form={form} colon={false}>
        <Form.Item label={<FormLabel label={intl.formatMessage({ id: 'addDeliveryTime.index.DeliveryTime' })} />}>
          <Space size={16}>
            <Form.Item
              name="date"
              rules={[
                {
                  required: true,
                  message:
                    intl.formatMessage({ id: 'order.addAddress.select' }) +
                    intl.formatMessage({ id: 'addDeliveryTime.index.DeliveryTime' }),
                },
              ]}
            >
              <DatePicker
                style={{ width: configInfo.deliveryTime ? '100%' : 380 }}
                disabledDate={(current) => disabledDate(current, configInfo)}
              />
            </Form.Item>
            {!configInfo.deliveryTime && (
              <Form.Item
                name="time"
                rules={[
                  {
                    required: true,
                    message:
                      intl.formatMessage({ id: 'order.addAddress.select' }) +
                      intl.formatMessage({ id: 'addDeliveryTime.index.DeliveryTime' }),
                  },
                ]}
              >
                <TimePicker format="hh:mm" style={{ width: 160 }} />
              </Form.Item>
            )}
          </Space>
        </Form.Item>
        {configInfo.deliveryTime && (
          <Form.Item
            name="timeSlot"
            label={<FormLabel label={intl.formatMessage({ id: 'pay.purchaseOnline.time' })} />}
            rules={[
              {
                required: true,
                message:
                  intl.formatMessage({ id: 'order.addAddress.select' }) +
                  intl.formatMessage({ id: 'pay.purchaseOnline.time' }),
              },
            ]}
          >
            <Radio.Group options={slotOptions} optionType="button" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
})

export default AddDeliveryTime
