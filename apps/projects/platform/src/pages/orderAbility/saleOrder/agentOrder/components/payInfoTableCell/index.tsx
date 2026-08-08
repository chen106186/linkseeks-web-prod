import React, { useState, useRef, useContext } from 'react'
import { Form, Input, Select } from 'antd'
import { useQuery } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
export interface PayInfoCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: string
  record: any
  colIndex: number
  handleChange(record: any, value: any)
  handleSave: (record: any) => Promise<any>
  forceEdit: boolean
  formItem: string
  formItemProps: any
}

const EditableContext = React.createContext<any>({})

export const EditableRow: React.FC<any> = (props) => {
  const [form] = Form.useForm()
  const { options = [] } = props?.children[5]?.props.additionalProps.formItemProps || {}
  const [childOptions, setChildOptions] = useState<any[]>(() => {
    const { payType } = props?.children[5]?.props.record || {}
    if (payType) {
      return (
        options
          .find((v) => v.payType === payType)
          ?.payChannels.map((v) => ({
            label: v.payChannelName,
            value: v.payChannel,
          })) || []
      )
    } else {
      return []
    }
  })
  const ctx = {
    form,
    childOptions,
    setChildOptions,
    originOptions: options,
  }
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={ctx}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

export const PayInfoCell: React.FC<PayInfoCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  colIndex,
  handleChange,
  handleSave,
  forceEdit,
  formItem,
  formItemProps = {},
  ...restProps
}) => {
  const intl = useIntl()
  const formItemRef = useRef<any>()
  const query = useQuery()
  const { form, childOptions, setChildOptions, originOptions } = useContext(EditableContext)
  let _childOptions = null
  if (query?.id && title === '支付渠道') {
    let payList = originOptions.filter((item) => item.payType === record.payType) || []
    if (payList.length) {
      _childOptions = payList[0].payChannels.map((_item) => ({
        label: _item.payChannelName,
        value: _item.payChannel,
      }))
    }
  }
  const validatorNumber = (rule, value, callback) => {
    try {
      if (formItem !== 'input') {
        callback()
      }
      let n = Number(value)
      if (isNaN(n)) {
        throw new Error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.payInfoCell.validator1' }))
      } else if (n < 0 || !Number.isInteger(n)) {
        throw new Error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.payInfoCell.validator2' }))
      } else {
        callback()
      }
    } catch (err) {
      callback(err)
    }
  }

  const save = async (e) => {
    try {
      const values = await form.validateFields()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  const handleInputChange = (e) => {
    handleChange(record, e.target.value)
  }

  const chooseFormItem = (type) => {
    const formId = dataIndex + colIndex
    switch (type) {
      case 'input': {
        return (
          <Input
            className="payRate"
            ref={formItemRef}
            onPressEnter={save}
            onBlur={save}
            onChange={handleInputChange}
            {...formItemProps}
            id={formId}
          />
        )
      }
      case 'select': {
        const { options, ...rest } = formItemProps
        // 支付方式
        if (dataIndex === 'payType') {
          return (
            <Select
              ref={formItemRef}
              options={originOptions.map((v) => ({ label: v.payTypeName, value: v.payType, disabled: v?.disabled }))}
              onChange={(e) => {
                const result = originOptions.find((v) => e === v.payType)
                setChildOptions(result.payChannels.map((v) => ({ label: v.payChannelName, value: v.payChannel })))
                form.setFieldsValue({ payChannel: '' })
                save(e)
              }}
              {...rest}
              id={formId}
            />
          )
        }

        // 需联动的内容
        if (dataIndex === 'payChannel') {
          return (
            <Select
              ref={formItemRef}
              onChange={save}
              options={childOptions.length ? childOptions : _childOptions}
              {...rest}
              id={formId}
            />
          )
        }
      }
    }
  }

  let childNode = children

  if (editable) {
    // console.log(dataIndex, record)
    childNode = forceEdit ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        initialValue={record[dataIndex] || ''}
        rules={[
          {
            required: true,
            message: intl
              .formatMessage({ id: 'purchaseOrder.orderCollect.payInfoCell.validator3' })
              .replaceAll('x', `${title}`),
          },
          // 支付比例大于0
          {
            validator: validatorNumber,
          },
        ]}
      >
        {chooseFormItem(formItem)}
      </Form.Item>
    ) : null
  }

  return (
    <td {...restProps} style={{ height: 90 }}>
      {childNode}
    </td>
  )
}

PayInfoCell.defaultProps = {}

export default PayInfoCell
