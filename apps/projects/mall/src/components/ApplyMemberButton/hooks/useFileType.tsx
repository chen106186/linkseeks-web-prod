import React, { useState, Fragment } from 'react'
import { Input, Radio, Checkbox, Select, DatePicker, Button, Image, Table, Form } from 'antd'
import { CheckboxOptionType } from 'antd/es/checkbox'
import { PlusOutlined, CloudUploadOutlined } from '@ant-design/icons'
import UploadImage from '@apps/components/src/web/UploadImage'
import AreaSelect from '@/components/AreaSelect'
import { FileItem } from '@/components/FileList'
import cx from 'classnames'
import { FormInstance } from 'antd/es/form/Form'
import { ElementType, FieldType } from './useApplyStep'
import styles from '../index.module.less'

export enum FILE_TYPE_ENUM {
  checkbox = 'checkbox',
  radio = 'radio',
  select = 'select',
  number = 'number',
  long = 'long',
  string = 'string',
  area = 'area',
  file = 'file',
  date = 'date',
  list = 'list',
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  element: ElementType
  fieldName: string
  dataIndex: string
  title: any
  fileType: FILE_TYPE_ENUM
  record: any
  index: number
  children: React.ReactNode
}

const useFileType = ({ form }: { form: FormInstance<any> }) => {
  const [uploadStorage, setUploadStorage] = useState<Record<string, string>>({})
  const [listStorage, setListStorage] = useState<Record<string, any>>({})

  const handleDel = (element: ElementType, record: any) => {
    if (element.fieldName && listStorage[element.fieldName]) {
      form.resetFields([['detail', element.fieldName, `${element.fieldName}-${record.key}`]])
      setListStorage({
        ...listStorage,
        [element.fieldName]: listStorage[element.fieldName].filter((item: { key: any }) => item.key !== record.key),
      })
    }
  }

  const mergedColumns = (element: ElementType) => {
    const column: any[] = element.configs
      ? element.configs.map((item) => {
          return {
            element: item,
            fieldName: element.fieldName,
            title: item.fieldLocalName,
            dataIndex: item.fieldName,
            editable: true,
            fieldType: item.fieldType,
          }
        })
      : []

    column.push({
      width: 80,
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleDel(element, record)}>
          删除
        </Button>
      ),
    })

    return column.map((col) => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          element: col.element,
          fieldName: col.fieldName,
          fileType: col.fileType,
          dataIndex: col.dataIndex,
          title: col.title,
        }),
      }
    })
  }

  const EditableCell: React.FC<EditableCellProps> = ({
    element,
    fieldName,
    dataIndex,
    title,
    fileType,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {element ? (
          <Form.Item
            name={['depositDetails', fieldName, `${dataIndex}-${record.key}`]}
            style={{ margin: 0 }}
            rules={[
              {
                required: element.fieldEmpty === 0,
                message: `请输入${element.fieldLocalName}`,
              },
            ]}
          >
            {renderFormItem(element)}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }

  const handleAdd = (element: ElementType) => {
    if (element.fieldName && element.configs && element.configs.length > 0) {
      const defaultVal: any = {
        key: `${element.fieldName}-0`,
      }
      element.configs.forEach((item) => {
        if (item.fieldName) {
          defaultVal[item.fieldName] = ''
        }
      })
      if (listStorage && !listStorage[element.fieldName]) {
        setListStorage({
          ...listStorage,
          [element.fieldName]: [defaultVal],
        })
      } else {
        const currentListStore = listStorage[element.fieldName]
        if (currentListStore.length > 0) {
          defaultVal.key = `${element.fieldName}-${
            Number(currentListStore[currentListStore.length - 1].key.split('-')[1]) + 1
          }`
        }
        setListStorage({
          ...listStorage,
          [element.fieldName]: [...currentListStore, defaultVal],
        })
      }
    }
  }

  const getDataSource = (element: ElementType) => {
    if (listStorage && Object.keys(listStorage).length > 0) {
      if (element.fieldName) {
        return listStorage[element.fieldName] || []
      }
    }
    return []
  }

  const renderFormItem = (element: ElementType) => {
    switch (element.fieldType) {
      case FILE_TYPE_ENUM.string:
        return <Input placeholder={element.fieldRemark} />
      case FILE_TYPE_ENUM.checkbox:
        return (
          <Checkbox.Group
            className={cx(styles['common-checkbox'])}
            options={(element.fieldEnum as CheckboxOptionType[]) || []}
          />
        )
      case FILE_TYPE_ENUM.radio:
        return (
          <Radio.Group className={cx(styles['common-radio'])}>
            {element.fieldEnum &&
              element.fieldEnum.length > 0 &&
              element.fieldEnum.map((v, i) => (
                <Radio key={v.value} value={v.value}>
                  {v.label}
                </Radio>
              ))}
          </Radio.Group>
        )
      case FILE_TYPE_ENUM.select:
        return <Select options={element.fieldEnum || []} placeholder={element.fieldRemark} />
      case FILE_TYPE_ENUM.date:
        return <DatePicker />
      case FILE_TYPE_ENUM.number:
      case FILE_TYPE_ENUM.long:
        return <Input type="number" placeholder={element.fieldRemark} />
      case FILE_TYPE_ENUM.file:
        return (
          <Fragment>
            <UploadImage
              listType="text"
              fileMaxSize={2048}
              onChange={(url) => {
                if (element.fieldName) {
                  setUploadStorage({
                    ...uploadStorage,
                    [element.fieldName as string]: url,
                  })
                  form.setFieldValue(['depositDetails', element.fieldName], url)
                }
              }}
            >
              <Button
                className={styles['common-upload-button']}
                icon={<CloudUploadOutlined className={styles['common-upload-button-icon']} />}
              >
                {element.fieldLocalName}
              </Button>
            </UploadImage>
            {element.fieldName && uploadStorage[element.fieldName] && (
              <div className={styles['common-upload-button-img']}>
                <FileItem imagePreview file={uploadStorage[element.fieldName]} />
              </div>
            )}
            {element.fieldRemark && <div className={styles['common-upload-button-tip']}>{element.fieldRemark}</div>}
          </Fragment>
        )
      case FILE_TYPE_ENUM.area:
        return (
          <AreaSelect
            level={2}
            valueChange={false}
            onChange={(values) => {
              if (element.fieldName) {
                const areaCode: Record<string, string> = {}
                const keyMap: any = {
                  0: 'provinceCode',
                  1: 'cityCode',
                  2: 'districtCode',
                }
                values.forEach((item, index) => {
                  areaCode[keyMap[index]] = item.code
                })
                form.setFieldValue(['depositDetails', element.fieldName], areaCode)
              }
            }}
          />
        )
      case FILE_TYPE_ENUM.list:
        return (
          <Fragment>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              rowKey="key"
              dataSource={getDataSource(element)}
              columns={mergedColumns(element)}
              className={styles['common-table']}
              rowClassName="editable-row"
              pagination={false}
            />
            <Button
              block
              className={styles['common-table-button']}
              icon={<PlusOutlined className={styles['common-table-button-icon']} />}
              onClick={() => handleAdd(element)}
            >
              添加
            </Button>
          </Fragment>
        )
      default:
        return null
    }
  }

  const getFileNameFromUrl = (fileUrl: string) => {
    // 使用字符串的 split 方法将链接分割成数组
    const parts = fileUrl.split('/')
    // 从数组中获取最后一个部分，即文件名
    const fileName = parts[parts.length - 1]
    return fileName
  }

  const renderFile = (value: string | undefined) => {
    if (value) {
      const valueSplit = value.split('.')
      const fileType = valueSplit[valueSplit.length - 1]
      const imageTypeList = ['png', 'jpg', 'gif', 'jpeg']

      if (imageTypeList.includes(fileType)) {
        return <Image width={64} height={64} src={value} />
      } else {
        return (
          <a href={value} target="_blank" download>
            {getFileNameFromUrl(value)}
          </a>
        )
      }
    }
    return ''
  }

  const getFieldColumn = (element: FieldType) => {
    const column: any[] = []
    if (Array.isArray(element.registers) && element.registers.length > 0) {
      const registersItem: any[] = element.registers[0]
      for (const item of registersItem) {
        column.push({
          title: item.fieldLocalName,
          dataIndex: item.fieldName,
        })
      }
    }

    return column
  }

  const getFieldDataSource = (element: FieldType) => {
    const dataSource: any[] = []
    if (Array.isArray(element.registers) && element.registers.length > 0) {
      for (const registersItem of element.registers) {
        const dataItem: any = {}
        for (const item of registersItem) {
          dataItem[item.fieldName] = item.fieldValue
        }
        dataSource.push(dataItem)
      }
    }
    return dataSource
  }

  const renderFieldValue = (element: FieldType) => {
    switch (element.fieldType) {
      case FILE_TYPE_ENUM.string:
      case FILE_TYPE_ENUM.checkbox:
      case FILE_TYPE_ENUM.radio:
      case FILE_TYPE_ENUM.select:
      case FILE_TYPE_ENUM.date:
      case FILE_TYPE_ENUM.number:
      case FILE_TYPE_ENUM.long:
      case FILE_TYPE_ENUM.area:
        return element.fieldValue
      case FILE_TYPE_ENUM.file:
        return renderFile(element.fieldValue)
      case FILE_TYPE_ENUM.list:
        return (
          <Table
            pagination={false}
            style={{ width: '100%' }}
            columns={getFieldColumn(element)}
            dataSource={getFieldDataSource(element)}
          />
        )
    }
  }

  return {
    renderFormItem,
    renderFieldValue,
  }
}

export default useFileType
