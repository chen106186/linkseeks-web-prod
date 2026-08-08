/*
 * @Author: Crayon
 * @Date: 2021-10-16 15:27:00
 * @LastEditTime: 2022-04-01 15:40:40
 * @LastEditors: GHua
 * @Description: 订单附加信息-送货时间，备注
 */

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Input } from 'antd'
import AddDeliveryTime, { AddDeliveryTimeRefProps, onOkProps } from '../addDeliveryTime'
import styles from './index.less'
import { getOrderBuyerFindDeliveryDate } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { DeliverTimesItemType } from '../../types'

interface AddInvoicePropsType {
  onChange: (x: DeliverTimesItemType) => void
  shopId: number | undefined
  vendorMemberId: number
  vendorRoleId: number
}

interface ConfigInfoType {
  appointmentDay?: string
  deliveryTime?: string
  days?: number
  paramList?: any[]
}

const AdditionalInfo: React.FC<AddInvoicePropsType> = (props) => {
  const { onChange, shopId, vendorMemberId, vendorRoleId } = props
  const [deliverTimeText, setDeliverTimeText] = useState<string>()
  // const [remark, setRemark] = useState<string>()
  const [configInfo, setConfigInfo] = useState<ConfigInfoType>({})
  const intl = useIntl()
  const remarkRef = useRef<string>()
  const deliveryTimeValueRef = useRef<string>()
  const addRef = useRef<AddDeliveryTimeRefProps>()

  // 修改或选择送货时间回调
  const onChangeDeliveryTime = (values: onOkProps) => {
    deliveryTimeValueRef.current = values.deliverTime
    setDeliverTimeText(values.deliverTimeText)
    callbackOnChange()
  }

  // 修改备注
  const onChangeRemark = (e: any) => {
    remarkRef.current = e.target.value
    // setRemark(e.target.value)
    callbackOnChange()
  }

  // 数据回调
  const callbackOnChange = () => {
    onChange &&
      onChange({
        vendorMemberId,
        vendorRoleId,
        deliverTime: deliveryTimeValueRef.current,
        remark: remarkRef.current,
      })
  }

  const onShowModal = () => {
    addRef.current?.showModal(true)
  }

  // 获取送货预约时长和配送时间段信息
  const getConfigDeliveryDate = () => {
    const param: any = {
      shopId,
      vendorMemberId,
      vendorRoleId,
    }
    getOrderBuyerFindDeliveryDate(param).then((res: any) => {
      const { code, data } = res
      if (code === 1000) {
        setConfigInfo(data)
        if (data.appointmentDay) {
          onChange &&
            onChange({
              vendorMemberId,
              vendorRoleId,
              deliverTime: deliverTimeText,
              remark: remarkRef.current,
              needDeliverTimes: true,
            })
        }
      }
    })
  }

  useEffect(() => {
    getConfigDeliveryDate()
  }, [])

  return (
    <div className={styles.additional}>
      {(configInfo.deliveryTime || configInfo.appointmentDay) && (
        <div className={styles.additional_row}>
          <div className={styles.additional_row_title}>
            {intl.formatMessage({ id: 'addDeliveryTime.index.DeliveryTime' })}
          </div>
          <div className={styles.additional_row_content}>
            {deliverTimeText && (
              <span className={styles.additional_row_content_time}>
                {intl.formatMessage({ id: 'additionalInfo.index.estimate' })} {deliverTimeText}{' '}
                {intl.formatMessage({ id: 'additionalInfo.index.service' })}
              </span>
            )}
            <span className={styles.additional_row_content_btn} onClick={onShowModal}>
              {deliverTimeText
                ? intl.formatMessage({ id: 'SideNav.footprint.modify' })
                : intl.formatMessage({ id: 'order.addAddress.select' })}
            </span>
          </div>
        </div>
      )}
      <div className={styles.additional_row}>
        <div className={styles.additional_row_title}>{intl.formatMessage({ id: 'SincerityInfo.remarks' })}</div>
        <div className={styles.additional_row_content}>
          <Input className={styles.remark_input} onBlur={onChangeRemark} />
        </div>
      </div>
      {useMemo(
        () => (
          <AddDeliveryTime
            ref={addRef}
            onOk={onChangeDeliveryTime}
            shopId={shopId}
            vendorMemberId={vendorMemberId}
            vendorRoleId={vendorRoleId}
          />
        ),
        [],
      )}
    </div>
  )
}

export default AdditionalInfo
