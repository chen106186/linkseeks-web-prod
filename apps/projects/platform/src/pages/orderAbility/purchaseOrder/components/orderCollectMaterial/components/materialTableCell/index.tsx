import React, { useState, useRef, useContext } from 'react'
import { Form, Input, Select, Popover, Row, DatePicker } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import { FormDetailContext } from '@/formSchema/context'
import { getLogisticsSelectListMemberShipperAddress } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import moment from 'moment'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'

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
  ctx: ISchemaFormActions | ISchemaFormAsyncActions
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
  ctx,
  formItemProps = {},
  ...restProps
}) => {
  const intl = useIntl()
  const formItemRef = useRef<any>()
  const { form } = useContext(EditableContext)
  const { formContext } = useContext(FormDetailContext)

  // 是否显示地址
  const [showAddress, setShowAddress] = useState<boolean>(false)
  // 地址信息
  const [receiveInfo, setReceiveInfo] = useState<any>()

  const disabledDate = (current) => {
    return current && current < moment().endOf('day')
  }

  const getReceiveInfo = async () => {
    const vendorMemberId = ctx.getFieldValue('vendorMemberId'),
      vendorRoleId = ctx.getFieldValue('vendorRoleId')
    const { data: deliveryAddress } = await getLogisticsSelectListMemberShipperAddress({
      memberId: vendorMemberId,
      roleId: vendorRoleId,
    })
    // setReceiveInfo(() => deliveryAddress.filter(item => item.isDefault)[0])
    setReceiveInfo(() => deliveryAddress[0])
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      values.purchaseCount = Number(values.quantity) || 0
      handleSave({ ...record, ...values })
      formContext.ctl.setInnerFormErrors(0)
    } catch (errInfo) {
      formContext.ctl.setInnerFormErrors(errInfo.errorFields.length)
      console.log('Save failed:', errInfo)
    }
  }

  // select的change
  const change = async (va, op, idx) => {
    // 自提情况下 显示地址
    if (va === 2) {
      setShowAddress(true)
      getReceiveInfo()
    } else {
      setShowAddress(false)
    }
    try {
      const values = await form.validateFields()
      // values[idx] = op.label
      // values.logistics = op.value
      values.deliverType = op.value
      values.deliverTypeName = op.label
      console.log(idx)
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  // date的change
  const changeDate = async (va, format, idx) => {
    try {
      const values = await form.validateFields()
      console.log(values)
      values[idx] = format
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  const chooseFormItem = (type) => {
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
              {
                label: intl.formatMessage({
                  id: 'purchaseOrder.orderCollect.constant.deliveryType4',
                }),
                value: 1,
              },
              {
                label: intl.formatMessage({
                  id: 'purchaseOrder.orderCollect.constant.deliveryType2',
                }),
                value: 2,
              },
              {
                label: intl.formatMessage({
                  id: 'purchaseOrder.orderCollect.constant.deliveryType3',
                }),
                value: 3,
              },
            ]}
            {...formItemProps}
          />
        )
      }
      // date日期类型
      case 'date': {
        return (
          <DatePicker
            style={{ width: 120 }}
            ref={formItemRef}
            disabledDate={disabledDate}
            onChange={(value, format) => changeDate(value, format, dataIndex)}
            id={dataIndex + record.id}
            className="purchase_logistic_date"
            {...formItemProps}
          />
        )
      }
    }
  }

  // 校验数值精度
  const validatorNumber = (rule, value, callback) => {
    try {
      const _value = Number(value)
      if (_value > Number.MAX_SAFE_INTEGER) {
        throw new Error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.productTableCell.validator1' }))
      }
      callback()
    } catch (err) {
      callback(err)
    }
  }

  // 校验
  const validatorFn = (idx) => {
    let rules = []
    switch (idx) {
      case 'quantity':
        rules = [
          {
            required: true,
            message: intl
              .formatMessage({ id: 'purchaseOrder.orderCollect.productTableCell.validator4' })
              .replaceAll('x', `${title}`),
          },
          {
            pattern: /^\d+(\.\d{1,3})?$/,
            message: intl.formatMessage({
              id: 'purchaseOrder.orderCollect.productTableCell.validator2',
            }),
          },
          {
            validator: validatorNumber,
          },
        ]
        break
      case 'price':
        rules = [
          {
            required: true,
            message: intl
              .formatMessage({ id: 'purchaseOrder.orderCollect.productTableCell.validator4' })
              .replaceAll('x', `${title}`),
          },
          {
            pattern: /^\d+(\.\d{1,4})?$/,
            message: intl.formatMessage({
              id: 'purchaseOrder.orderCollect.productTableCell.validator5',
            }),
          },
          {
            validator: validatorNumber,
          },
        ]
        break
      case 'taxRate':
        rules = [
          // {
          //   required: true,
          //   message: intl.formatMessage({id: 'purchaseOrder.orderCollect.productTableCell.validator4'}).replaceAll('x', `${title}`),
          // },
          {
            validator: validatorNumber,
          },
        ]
        break
      default:
        rules = []
        break
    }
    return rules
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
            validatorFn(dataIndex)
            //   dataIndex === 'quantity' ? [
            //   {
            //     required: true,
            //     message: `${title}必须填写`,
            //   },
            //   {
            //     pattern: /^\d+(\.\d{1,3})?$/,
            //     message: '采购数量仅限三位小数',
            //   },
            //   {
            //     validator: validatorNumber
            //   },
            // ] : [
            //   {
            //     required: true,
            //     message: `${title}必须填写`,
            //   }
            // ]
          }
        >
          {chooseFormItem(formItem)}
        </Form.Item>
        {showAddress ? (
          <Popover
            content={
              <Row>
                <div>
                  <div>
                    <EnvironmentOutlined />{' '}
                    {intl.formatMessage({ id: 'purchaseOrder.orderCollect.productTableCell.h3' })}
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
