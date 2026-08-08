import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { FormInstance, Modal, message } from 'antd'
import { Form, Input, Table } from '@linkseeks/ui'
import { LanguageInfo } from '@apps/domains'
import { ColumnsType } from 'antd/lib/table'
import { postProductUnitSaveOrUpdateUnit } from '@apps/apis'

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  inputType: 'text'
  record: LanguageInfo
  index: number
  children: React.ReactNode
}

interface IProps {
  operateType: 'add' | 'edit'
  form: FormInstance<any>
  visible: boolean
  languageList: LanguageInfo[]
  setVisible: Dispatch<SetStateAction<boolean>>
  onOk?: () => void
}

const AddUnitModal: React.FC<IProps> = (props) => {
  const { operateType, form, languageList, visible, setVisible, onOk } = props
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  const columns: ColumnsType<any> = useMemo(() => {
    if (languageList && languageList.length > 0) {
      return languageList.map((item) => ({
        title: `${item.language}(${item.key})`,
        key: item.key,
        dataIndex: item.key,
        onCell: (record: LanguageInfo) => ({
          record,
          inputType: 'text',
          dataIndex: item.key,
          title: `${item.language}(${item.key})`,
          editing: true,
        }),
      }))
    }
    return []
  }, [languageList])

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `请输入`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }

  const handleConfirm = () => {
    form.validateFields().then(async (values) => {
      const param: { id: number; unitNameList: { language: string; value: string }[] } = {
        id: values?.id,
        unitNameList: [],
      }
      Object.keys(values).forEach((key) => {
        if (key !== 'id') {
          param.unitNameList.push({
            language: key,
            value: values[key],
          })
        }
      })
      setConfirmLoading(true)
      const res = await postProductUnitSaveOrUpdateUnit(param as any)
      if (res.code === 1000) {
        form.resetFields()
        setVisible(false)
        onOk?.()
      }
      setConfirmLoading(false)
    })
  }

  return (
    <Modal
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleConfirm}
      title={operateType === 'add' ? '新增单位' : '编辑单位'}
      width={800}
      centered
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        labelCol={{
          span: 3,
        }}
        labelAlign="left"
      >
        <Form.Item name="id" label="单位ID" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="单位名称" required>
          <Table
            dataSource={[{ key: 'zh-CN' }]}
            columns={columns}
            pagination={false}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddUnitModal
