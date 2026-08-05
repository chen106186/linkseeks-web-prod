import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { ISchemaFieldComponentProps, useFieldState } from '@apps/formily'
import { Space, Row, Col, Tag } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import cx from 'classnames'
import {
  getLogisticsReceiverAddressGet,
  getLogisticsSelectListReceiverAddress,
  postLogisticsReceiverAddressDelete,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { ADDRESS_TYPE, AddressManageModal } from '@apps/components'
import { BLOCK_STATUS } from '@apps/services'
const SelectStyles = styled((props) => <div className="select-list" style={{ display: 'flex' }} {...props}></div>)`
  .select_style_border {
    border: 1px solid #eef0f3;
    // margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    flex: 1;
    cursor: pointer;
    line-height: 28px;
    position: relative;
  }

  .select_style_border.active {
    border: 1px solid #00b382;
  }
  .select_style_border.active::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 12px solid #00b37a;
    border-left: 12px solid transparent;
    bottom: 0;
    right: 0;
    z-index: 5;
  }
`

const transformDefaultData = (data: any[]) => {
  if (data.length === 0) return data

  const hasDefault = data.some((v) => v.isDefault === 1)
  return hasDefault
    ? data
    : data.map((v, i) => {
        if (i === 0) {
          v.isDefault = 1
        }
        return v
      })
}

const SelectAddress = (props: ISchemaFieldComponentProps) => {
  const intl = useIntl()
  const [state, setFieldState] = useFieldState({
    dataSource: [],
    showMore: false,
  })
  const { dataSource, showMore } = state
  let { value = {}, mutators, editable } = props
  const transformData = transformDefaultData(dataSource)
  const showDataSource = showMore ? [...transformData].splice(0, 3) : transformData

  const actionRef = AddressManageModal.useRef({ type: ADDRESS_TYPE.RECEIVING })
  if (typeof value === 'number') {
    value = dataSource.find((v) => v.id === value) || {}
  }
  // 当前选中的id
  // const checkedId = value.id || dataSource[0]?.id
  const checkedId = value.id

  const handleAdd = () => {
    actionRef.toggle(BLOCK_STATUS.ADD)
  }
  const handleCheck = (item) => {
    if (editable) {
      mutators.change(item)
    }
  }

  const fetchAddressList = async () => {
    const { data } = await getLogisticsSelectListReceiverAddress()
    return data
  }

  const reloadAddress = () => {
    fetchAddressList().then((data) => {
      setFieldState({
        dataSource: data as any,
        showMore,
      })
    })
  }

  const toogleMore = () => {
    setFieldState({
      dataSource,
      showMore: !showMore,
    })
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    try {
      const result = await postLogisticsReceiverAddressDelete({ id })
      if (result.code === 1000) {
        // 删除后置空表单值
        mutators.change([])
      }
      reloadAddress()
    } catch (error) {}
  }

  const handleEdit = async (item, e, mode?) => {
    e.stopPropagation()
    const { data } = await getLogisticsReceiverAddressGet({ id: item.id })
    actionRef.toggle(BLOCK_STATUS.EDIT, {
      ...data,
      isDefault: item.isDefault,
    })
  }

  return (
    <div style={{ width: '100%' }}>
      {/* {editable && <Button block onClick={handleAdd} icon={<PlusOutlined />}>新建地址</Button>} */}
      <SelectStyles>
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          {showDataSource.map((v) => (
            <Col span={12} key={v.id}>
              <div
                onClick={() => handleCheck(v)}
                className={cx('select_style_border', checkedId === v.id ? 'active' : '')}
              >
                <div>
                  <Row style={{ color: '#303133' }}>
                    <Col>{v.receiverName}</Col>
                    <Col> / </Col>
                    <Col>{v.phone}</Col>
                    {v.isDefault ? (
                      <Col style={{ marginLeft: 6 }}>
                        <Tag color="default">{intl.formatMessage({ id: 'common.button.default.address' })}</Tag>
                      </Col>
                    ) : null}
                  </Row>
                  <div style={{ color: '#909399' }}>{v.fullAddress}</div>
                </div>
                <Space size={12}>
                  {editable ? (
                    <>
                      <EditOutlined onClick={(e) => handleEdit(v, e)} />
                      <DeleteOutlined onClick={(e) => handleDelete(v.id, e)} />
                    </>
                  ) : (
                    <EyeOutlined onClick={(e) => handleEdit(v, e, 'preview')} />
                  )}
                </Space>
              </div>
            </Col>
          ))}
          {editable && (
            <Col span={12}>
              <div
                className="select_style_border"
                style={{ width: '100%', height: '100%', borderStyle: 'dashed' }}
                onClick={handleAdd}
              >
                <p style={{ width: '100%', textAlign: 'center' }}>
                  <PlusOutlined />
                  &nbsp;{intl.formatMessage({ id: 'purchaseOrder.orderCollect.selectAddress.add' })}
                </p>
              </div>
            </Col>
          )}
        </Row>
      </SelectStyles>
      {transformData.length > 3 && (
        <div onClick={toogleMore} style={{ textAlign: 'center', cursor: 'pointer', color: '#00b37a' }}>
          {intl.formatMessage({ id: 'purchaseOrder.more' })}
          {showMore ? <CaretDownOutlined /> : <CaretUpOutlined />}
        </div>
      )}
      <AddressManageModal onSubmit={reloadAddress} actionRef={actionRef} />
    </div>
  )
}

SelectAddress.defaultProps = {}

SelectAddress.isFieldComponent = true

export default SelectAddress
