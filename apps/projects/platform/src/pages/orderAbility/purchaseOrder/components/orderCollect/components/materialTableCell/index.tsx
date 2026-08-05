import React, { useState, useRef, useContext } from 'react'
import { Form, Input, Select, Popover, Row } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import { getLogisticsSelectListMemberShipperAddress } from '@apps/apis'

export interface MaterialTableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: string
  record: any
  handleSave: (record: any) => Promise<any>
  forceEdit: boolean
  formItem: string
  formItemProps: any
}

const EditableContext = React.createContext<any>({})

export const MaterialEditableRow: React.FC<any> = ({ ...props }) => {
  const [form] = Form.useForm()

  const ctx = {
    form,
  }
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={ctx}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

export const MaterialTableCell: React.FC<MaterialTableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  forceEdit,
  formItem,
  formItemProps = {},
  ...restProps
}) => {
  const formItemRef = useRef<any>()
  const { form } = useContext(EditableContext)

  // 是否显示地址
  const [showAddress, setShowAddress] = useState<boolean>(false)
  // 地址信息
  const [receiveInfo, setReceiveInfo] = useState<any>()

  const getReceiveInfo = async () => {
    const { data: deliveryAddress } = await getLogisticsSelectListMemberShipperAddress({
      memberId: record.memberId,
      roleId: record.memberRoleId,
    })
    // setReceiveInfo(() => deliveryAddress.filter(item => item.isDefault)[0])
    setReceiveInfo(() => deliveryAddress[0])
  }

  const save = async (e) => {
    try {
      const values = await form.validateFields()
      values.purchaseCount = Number(values.purchaseCount) || 0
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  // select的change
  const change = async (va, op, idx) => {
    console.log(va, op, idx)
    // 自提情况下 显示地址
    if (va === 2) {
      setShowAddress(true)
      getReceiveInfo()
    } else {
      setShowAddress(false)
    }
    try {
      const values = await form.validateFields()
      values[idx] = op['label']
      values['logistics'] = op['value']
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  const chooseFormItem = (type, v) => {
    switch (type) {
      // input类型
      case 'input': {
        return (
          <Input
            style={{ width: 80 }}
            type="number"
            ref={formItemRef}
            onChange={save}
            {...formItemProps}
            id={dataIndex + record.id}
            className="purchase_amount_input"
          />
        )
      }
      // select选择类型
      case 'select': {
        return (
          <Select
            style={{ width: 80 }}
            ref={formItemRef}
            onChange={(value, option) => change(value, option, dataIndex)}
            id={dataIndex + record.id}
            className="purchase_logistic_select"
            options={[
              { label: '物流', value: 1 },
              { label: '自提', value: 2 },
              { label: '无需配送', value: 3 },
            ]}
            {...formItemProps}
          />
        )
      }
    }
  }

  // 校验最小起订
  const validatorNumber = (rule, value, callback) => {
    try {
      let _value = Number(value)
      if (isNaN(_value) || _value < Number(record['minOrder'])) {
        throw new Error(`数量不小于最小起订数${record['minOrder']}`)
      }
      if (_value > Number.MAX_SAFE_INTEGER) {
        throw new Error('数值精度溢出')
      }
      callback()
    } catch (err) {
      callback(err)
    }
  }
  let childNode = children
  if (editable) {
    childNode = (
      <>
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          initialValue={record[dataIndex] || ''}
          rules={
            dataIndex === 'purchaseCount'
              ? [
                  {
                    required: true,
                    message: `${title}必须填写`,
                  },
                  {
                    pattern: /^\d+(\.\d{1,3})?$/,
                    message: '采购数量仅限三位小数',
                  },
                  {
                    validator: validatorNumber,
                  },
                ]
              : [
                  {
                    required: true,
                    message: `${title}必须填写`,
                  },
                ]
          }
        >
          {chooseFormItem(formItem, record[dataIndex] || '')}
        </Form.Item>
        {showAddress ? (
          <Popover
            content={
              <Row>
                <div>
                  <div>
                    <EnvironmentOutlined /> 自提地址
                  </div>
                  {receiveInfo && (
                    <>
                      <p>
                        {receiveInfo.shipperName} / {receiveInfo.phone}
                      </p>
                      <p>
                        {receiveInfo.provinceName +
                          receiveInfo.cityName +
                          receiveInfo.districtName +
                          receiveInfo.address || receiveInfo.fullAddress}
                      </p>
                    </>
                  )}
                </div>
              </Row>
            }
          >
            <span style={{ position: 'absolute', right: 0, top: '42%' }}>
              <EnvironmentOutlined />
            </span>
          </Popover>
        ) : null}
      </>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

MaterialTableCell.defaultProps = {}

export default MaterialTableCell
