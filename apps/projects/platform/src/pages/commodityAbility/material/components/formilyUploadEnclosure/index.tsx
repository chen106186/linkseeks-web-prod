import UploadFiles from '@/components/UploadFiles/UploadFiles'
import { PlusOutlined } from '@ant-design/icons'
import { FormItemShallowProvider, FormPath, ISchema, Schema, SchemaField, isArr, toArr } from '@apps/formily'
import { useWebIntl } from '@apps/locales'
import { Table, Form } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import React from 'react'

interface Iprops {
  value: any
  editable: boolean
  schema: Schema
  path: any
  props: {
    ['x-component-props']: {
      /**
       * ☹
       * 这里表现相对奇怪，当这个组件放在了table 下切这个组件是必填的话，会出现两个错误情况，我通过外部传值干掉其中一个
       */
      showError?: boolean
    } & {
      [key: string]: any
    }
  }
  mutators: {
    change: (params: any) => void
    remove: (index: number) => void
  }
}

const FormilyUploadEnclosure: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value, schema, path, editable, mutators } = props

  const translate = useWebIntl()
  const {
    renderAddition,
    renderRemove,
    // renderEmpty,
    // renderExtraOperations,
    operationsWidth,
    operations,
    ...componentProps
  } = schema.getExtendsComponentProps() || {}

  const renderColumns = (items: Schema) => {
    return items.mapProperties((props, key) => {
      const itemProps = {
        ...props.getExtendsItemProps(),
        ...props.getExtendsProps(),
      }
      return {
        title: props.title,
        ...itemProps,
        key,
        dataIndex: key,
        render: (value: any, record: any, index: number) => {
          const newPath = FormPath.parse(path).concat(index, key)
          return (
            <FormItemShallowProvider
              key={newPath.toString()}
              label={undefined}
              labelCol={undefined}
              wrapperCol={undefined}
            >
              <SchemaField path={newPath} schema={props} />
            </FormItemShallowProvider>
          )
        },
      }
    })
  }

  let columns = []
  if (schema.items) {
    columns = isArr(schema.items)
      ? schema.items.reduce((buf, items) => {
          return buf.concat(renderColumns(items))
        }, [])
      : renderColumns(schema.items)
  }

  if (editable && operations !== false) {
    columns.push({
      ...operations,
      key: 'operations',
      dataIndex: 'operations',
      width: operationsWidth || 200,
      render: (value: any, record: any, index: number) => {
        return (
          <Form.Item>
            <div className="array-item-operator">
              <a onClick={() => mutators.remove(index)}>{translate('web.common.delete')}</a>
            </div>
          </Form.Item>
        )
      },
    })
  }
  console.log(toArr(value))

  const renderTable = () => {
    return (
      <Table
        rowKey={(record) => {
          return toArr(value).indexOf(record)
        }}
        pagination={false}
        columns={columns}
        dataSource={toArr(value)}
      />
    )
  }

  return (
    <div>
      {renderTable()}

      {(editable && renderAddition) || null}
    </div>
  )
}

FormilyUploadEnclosure.isFieldComponent = true

export default FormilyUploadEnclosure
