import { useState, Fragment } from 'react'
import { Input, Radio, Checkbox, Select, DatePicker, Button, Table, Form } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { CheckboxOptionType } from 'antd/es/checkbox'
import { CloudUploadIcon, PlusIcon } from '@linkseeks/icons'
import { UploadImage, FileItem } from '@apps/components'
import AreaSelect from '@/components/AddressSelect/components/AreaSelect'
import cx from 'classnames'
import { FormInstance } from 'antd/es/form/Form'
import styles from '../../components/Info/index.less'

export interface ElementType {
  /**
   * 注册资料id
   */
  id?: number
  /**
   * 字段名称
   */
  fieldName?: string
  /**
   * 中文名称
   */
  fieldLocalName?: string
  /**
   * 字段类型
   */
  fieldType?: string
  /**
   * 字段类型附加属性
   */
  attr?: {
    key?: {}
  }
  /**
   * 字段长度
   */
  fieldLength?: number
  /**
   * 是否可为空 0-不能为空 1-可以为空
   */
  fieldEmpty?: number
  /**
   * 字段顺序
   */
  fieldOrder?: number
  /**
   * 帮助信息
   */
  fieldRemark?: string
  /**
   * 枚举标签列表
   */
  fieldEnum?: {
    /**
     * 枚举值的标签
     */
    value?: number
    /**
     * 枚举值的文本
     */
    label?: string
  }[]
  /**
   * 字段校验规则枚举：0-无校验规则，1-邮箱规则，2-手机号码规则，3-身份证规则，4-电话号码规则
   */
  ruleEnum?: number
  /**
   * 校验规则的正则表达式
   */
  pattern?: string
  /**
   * 校验错误的提示语
   */
  msg?: string
  /**
   * 会员注册资料配置子字段
   */
  configs?: {
    /**
     * 注册资料id
     */
    id?: number
    /**
     * 字段名称
     */
    fieldName?: string
    /**
     * 中文名称
     */
    fieldLocalName?: string
    /**
     * 字段类型
     */
    fieldType?: string
    /**
     * 字段类型附加属性
     */
    attr?: {
      key?: {}
    }
    /**
     * 字段长度
     */
    fieldLength?: number
    /**
     * 是否可为空 0-不能为空 1-可以为空
     */
    fieldEmpty?: number
    /**
     * 字段顺序
     */
    fieldOrder?: number
    /**
     * 帮助信息
     */
    fieldRemark?: string
    /**
     * 枚举标签列表
     */
    fieldEnum?: {
      /**
       * 枚举值的标签
       */
      value?: number
      /**
       * 枚举值的文本
       */
      label?: string
    }[]
    /**
     * 字段校验规则枚举：0-无校验规则，1-邮箱规则，2-手机号码规则，3-身份证规则，4-电话号码规则
     */
    ruleEnum?: number
    /**
     * 校验规则的正则表达式
     */
    pattern?: string
    /**
     * 校验错误的提示语
     */
    msg?: string
    /**
     * 会员注册资料配置子字段
     */
    configs?: {}[]
  }[]
}

export enum FILE_TYPE_ENUM {
  checkbox = 'checkbox',
  radio = 'radio',
  select = 'select',
  number = 'number',
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
  const intl = useIntl()

  const handleDel = (element: ElementType, record: any) => {
    if (element.fieldName && listStorage[element.fieldName]) {
      form.resetFields([['detail', element.fieldName, `${element.fieldName}-${record.key}`]])
      setListStorage({
        ...listStorage,
        [element.fieldName]: listStorage[element.fieldName].filter((item) => item.key !== record.key),
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
      title: intl.formatMessage({
        id: 'common.table.action',
        defaultMessage: '操作',
      }),
      dataIndex: 'operation',
      render: (_, record: any) => (
        <Button type="link" onClick={() => handleDel(element, record)}>
          {intl.formatMessage({
            id: 'common.button.delete',
            defaultMessage: '删除',
          })}
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
            name={['detail', fieldName, `${dataIndex}-${record.key}`]}
            style={{ margin: 0 }}
            rules={[
              {
                required: element.fieldEmpty === 0,
                message: `${intl.formatMessage({
                  id: 'common.form.input.placeholder',
                  defaultMessage: '请输入',
                })}${element.fieldLocalName}`,
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
      const defaultVal = {
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
        return <Input type="number" placeholder={element.fieldRemark} />
      case FILE_TYPE_ENUM.file:
        return (
          <Fragment>
            <UploadImage
              listType="text"
              fileMaxSize={(element.fieldLength || 2) * 1024}
              onChange={(url) => {
                if (element.fieldName) {
                  setUploadStorage({
                    ...uploadStorage,
                    [element.fieldName as string]: url,
                  })
                  form.setFieldValue(['detail', element.fieldName], url)
                }
              }}
            >
              <Button
                className={styles['common-upload-button']}
                icon={<CloudUploadIcon className={styles['common-upload-button-icon']} />}
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
                const areaCode = {}
                const keyMap = {
                  0: 'provinceCode',
                  1: 'cityCode',
                  2: 'districtCode',
                }
                values.forEach((item, index) => {
                  areaCode[keyMap[index]] = item.code
                })
                form.setFieldValue(['detail', element.fieldName], areaCode)
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
              icon={<PlusIcon className={styles['common-table-button-icon']} />}
              onClick={() => handleAdd(element)}
            >
              {intl.formatMessage({
                id: 'common.button.addition',
                defaultMessage: '添加',
              })}
            </Button>
          </Fragment>
        )
      default:
        return null
    }
  }

  return {
    renderFormItem,
  }
}

export default useFileType
