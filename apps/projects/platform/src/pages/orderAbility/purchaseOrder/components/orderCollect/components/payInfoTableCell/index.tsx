import React, { useState, useRef, useContext, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { useQuery } from '@linkseeks/router-core'
import styles from '../../index.less'

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
  // form.setFieldsValue()
  const { options = [] } = props?.children[5]?.props.additionalProps.formItemProps || {}
  const [childOptions, setChildOptions] = useState<any[]>(() => {
    const { payWay } = props?.children[5]?.props.record || {}
    if (payWay) {
      return (
        options
          .find((v) => v.payType === payWay)
          ?.payList.map((v) => ({
            label: v.way,
            value: v.id,
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
  const formItemRef = useRef<any>()
  const { form, childOptions, setChildOptions, originOptions } = useContext(EditableContext)
  const query = useQuery()
  // fix: 没有childOptions 导致第一次进入编辑页面无法显示支付渠道
  let _childOptions = null
  if (query?.id && title === '支付渠道') {
    let payList = originOptions.filter((item) => item.payType === record.payWay) || []
    if (payList.length) {
      _childOptions = payList[0].payList.map((_item) => ({
        label: _item.way,
        value: _item.wayId,
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
        throw new Error('请正确输入支付比例')
      } else if (n < 0 || !Number.isInteger(n)) {
        throw new Error('支付比例为大于0的整数')
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
            className="payRatio"
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
        if (dataIndex === 'payWay') {
          return (
            <Select
              ref={formItemRef}
              options={originOptions.map((v) => ({ label: v.payVal, value: v.payType, disabled: v?.disabled }))} // ?? 仅限线下支付下面只有一种方式
              onChange={(e) => {
                const result = originOptions.find((v) => e === v.payType)
                setChildOptions(result.payList.map((v) => ({ label: v.way, value: v.id })))
                form.setFieldsValue({ channel: '' })
                save(e)
              }}
              {...rest}
              id={formId}
            />
          )
        }

        // 需联动的内容
        if (dataIndex === 'channel') {
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
    childNode = forceEdit ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        initialValue={record[dataIndex] || ''}
        rules={[
          {
            required: true,
            message: `${title}必须填写`,
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
