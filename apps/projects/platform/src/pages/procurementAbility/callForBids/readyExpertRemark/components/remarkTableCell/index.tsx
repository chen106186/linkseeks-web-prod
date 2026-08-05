import React, { useRef, useContext } from 'react'
import { Form, Input } from 'antd'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export interface TableCellProps {
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

export const RemarkEditableRow: React.FC<any> = ({ ...props }) => {
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

export const RemarkTableCell: React.FC<TableCellProps> = ({
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

  const save = async (e) => {
    try {
      const values = await form.validateFields()
      console.log(values, e, 'vvv')
      const score = Object.values(values).reduce((a, b) => Number(a) + Number(b), 0)
      values.totalScore = Number(score).toFixed(2)
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed', errInfo)
      handleSave({ ...record, ...errInfo.values })
    }
  }

  const chooseFormItem = (type) => {
    switch (type) {
      case 'input': {
        return (
          <Input
            style={{ width: 140 }}
            type="number"
            ref={formItemRef}
            onChange={save}
            {...formItemProps}
            id={dataIndex + record.id}
            className="score_amount_input"
          />
        )
      }
    }
  }

  let childNode = children
  if (editable) {
    childNode = (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        initialValue={record[dataIndex] || null}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'table.purchase.cixiangbixutian' }),
          },
          {
            pattern: /^\d+(\.\d{1,2})?$/,
            message: intl.formatMessage({ id: 'table.purchase.xiaoshudianhoumian' }),
          },
        ]}
      >
        {chooseFormItem(formItem)}
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

RemarkTableCell.defaultProps = {}

export default RemarkTableCell
