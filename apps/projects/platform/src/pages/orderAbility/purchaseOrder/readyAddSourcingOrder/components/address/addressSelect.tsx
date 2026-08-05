import React, { useEffect, useRef, useState } from 'react'
import { Col, FormInstance, Modal, Radio, Row, Tag } from 'antd'
import cx from 'classnames'
import {
  getLogisticsReceiverAddressGet,
  getLogisticsSelectListReceiverAddress,
  postLogisticsReceiverAddressDelete,
} from '@apps/apis'
import type { GetLogisticsSelectListReceiverAddressResponse } from '@apps/apis'
import { CaretDownOutlined, CaretUpOutlined, PlusOutlined } from '@ant-design/icons'
import { useWebIntl } from '@apps/locales'
import AddressModal from './addressModal'
import styles from './index.less'
import { useOrder } from '../../orderProvider'
import { ADDRESS_TYPE, AddressManageModal } from '@apps/components'
import { BLOCK_STATUS } from '@apps/services'

type ValueType = GetLogisticsSelectListReceiverAddressResponse[0]

interface InvoiceSelectProps {
  value?: ValueType
  disabled?: boolean
  onChange?: (value: ValueType) => void
}

const AddressSelect: React.FC<InvoiceSelectProps> = (props) => {
  const { disabled } = props
  const [list, setList] = useState<ValueType[]>([])
  const [selectValue, setSelectValue] = useState<ValueType>()
  const [showMore, setShowMore] = useState<boolean>(false)
  const translate = useWebIntl()
  const actionRef = AddressManageModal.useRef({ type: ADDRESS_TYPE.RECEIVING })
  const { form, orderDetail } = useOrder()

  const fetchList = () => {
    getLogisticsSelectListReceiverAddress().then((res) => {
      if (res.code === 1000 && res.data && res.data.length > 0) {
        setList(res.data)
      }
    })
  }

  const reloadAddress = () => {
    fetchList()
  }

  useEffect(() => {
    if (list && list.length > 0 && !selectValue) {
      const defaultInfo = list.find((item) => item.isDefault)
      if (defaultInfo) {
        setSelectValue(defaultInfo)
        form.setFieldValue('consignee', defaultInfo)
      } else {
        setSelectValue(list[0])
        form.setFieldValue('consignee', list[0])
      }
    }
  }, [list, selectValue])

  useEffect(() => {
    if (list && list.length > 0 && orderDetail && orderDetail.consignee.consigneeId) {
      const selectItem = list.find((item) => item.id === orderDetail.consignee.consigneeId)
      if (selectItem) {
        setSelectValue(selectItem)
        form.setFieldValue('consignee', selectItem)
      }
    }
  }, [orderDetail, list])

  useEffect(() => {
    fetchList()
  }, [])

  const handleDelete = async (id, e) => {
    // 选中当前的删除
    e.stopPropagation()
    try {
      Modal.confirm({
        title: translate('web.resource.logistics.shifouquerenshanchu'),
        onOk: async () => {
          const result = await postLogisticsReceiverAddressDelete({ id })
          if (result.code === 1000) {
            fetchList()
          }
        },
      })
    } catch (error) {}
  }

  const handleEdit = async (item: ValueType, e) => {
    e.stopPropagation()
    const { data } = await getLogisticsReceiverAddressGet({ id: String(item.id) })
    actionRef.toggle(BLOCK_STATUS.EDIT, {
      ...data,
      isDefault: item.isDefault,
    })
  }

  const handleAdd = () => {
    actionRef.toggle(BLOCK_STATUS.ADD)
  }

  return (
    <div style={{ width: '100%' }} className={styles.invoice}>
      <Radio.Group
        className={styles.raido_group}
        value={selectValue}
        onChange={(e) => {
          setSelectValue(e.target.value)
          form.setFieldValue('consignee', e.target.value)
        }}
      >
        <div className={styles.invoice_list}>
          <Row gutter={[8, 8]}>
            {list.map(
              (item, index) =>
                (showMore || index < 3) && (
                  <Col span={12} key={`address_list_radio_${item?.id}`}>
                    <Radio className={styles.list_radio} value={item}>
                      <div className={styles.invoice_list_item} key={`invoice_list_item_${index}`}>
                        <div className={styles.invoice_list_item_content}>
                          <Row style={{ color: '#303133', alignItems: 'center' }}>
                            <Col>{item.receiverName}</Col>
                            <Col> / </Col>
                            <Col>{item.phone}</Col>
                            {item.isDefault ? (
                              <Col style={{ marginLeft: 6 }}>
                                <Tag color="default">{translate('web.resource.logistics.morendizhi')}</Tag>
                              </Col>
                            ) : null}
                          </Row>
                          <div style={{ color: '#909399' }}>{item.fullAddress}</div>
                        </div>
                        {selectValue?.id === item?.id &&
                          (!disabled ? (
                            <div className={styles.invoice_list_item_btn_group}>
                              <div className={styles.invoice_list_item_btn} onClick={(e) => handleEdit(item, e)}>
                                {translate('web.common.edit')}
                              </div>
                              <div className={styles.invoice_list_item_btn} onClick={(e) => handleDelete(item?.id, e)}>
                                {translate('web.common.delete')}
                              </div>
                            </div>
                          ) : null)}
                      </div>
                    </Radio>
                  </Col>
                ),
            )}
            {!disabled && (
              <Col span={12}>
                <div
                  className={styles.select_style_border}
                  style={{ width: '100%', height: 72, display: 'flex', alignItems: 'center', borderStyle: 'dashed' }}
                  onClick={handleAdd}
                >
                  <p style={{ width: '100%', textAlign: 'center', fontSize: 12, marginBottom: 0 }}>
                    <PlusOutlined />
                    &nbsp;{translate('web.common.add')}
                  </p>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </Radio.Group>
      {list.length > 3 && (
        <div
          onClick={() => setShowMore(!showMore)}
          style={{ textAlign: 'center', cursor: 'pointer', color: '#00a98f', marginTop: 8 }}
        >
          {!showMore ? translate('web.common.more') : translate('web.resource.mall.shouqi')}
          {showMore ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </div>
      )}
      <AddressManageModal onSubmit={reloadAddress} actionRef={actionRef} />
    </div>
  )
}

export default AddressSelect
