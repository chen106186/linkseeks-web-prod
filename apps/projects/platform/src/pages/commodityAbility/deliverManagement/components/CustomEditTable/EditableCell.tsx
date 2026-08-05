import React, { useRef, useContext, useEffect, useCallback, useMemo, useState } from 'react'
import { Form, Input, Switch, Button, Select, DatePicker, Space } from 'antd'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import moment from 'moment'
import { isFunction } from 'lodash'
import CustomInput from './CustomInput'
import { EditableContext } from './EditableRow'
import type { InputRef } from 'antd'
import { useWebIntl } from '@apps/locales'
import styles from './index.less'

/**
 * 自定义表格项组件
 */
type ComponentType = 'CustomInput' | 'Input' | 'Switch' | 'TextArea' | 'Button' | 'Select' | 'DatePicker' | 'File'

interface EditableCellProps {
  /**
   * 是否是自定义组件
   */
  editable?: boolean
  /**
   * 孩子插槽内容
   */
  children: React.ReactNode
  /**
   * 对应antd的table组件dataIndex
   */
  dataIndex: any
  /**
   * 每一行的数据
   */
  record?: any
  /**
   * 校验规则
   */
  rules?: any
  /**
   * 值，貌似不用被children干掉了
   */
  value?: any
  /**
   * 对应的自定义组件
   */
  component?: ComponentType
  /**
   * 格式化
   */
  format?: Function | string
  /**
   * 禁用
   */
  disabled?: boolean
  /**
   * 是否显示
   */
  visible?: boolean
  /**
   * 扩展属性
   */
  editProps?: Record<string, any>
  /**
   * 值变化的回调函数
   */
  handleChange?: (record: unknown, type: string) => void
  /**
   * table里面嵌套的form表单对应的ref
   */
  tablefromref?: any
  /**
   * 行数
   */
  rowlength?: number
  /**
   * 只读
   */
  readOnly: boolean
}
const { Option } = Select

export const EditableCell: React.FC<EditableCellProps> = ({
  editable = false,
  visible = true,
  children,
  dataIndex,
  record,
  rules,
  handleChange,
  component,
  value,
  format,
  disabled,
  editProps = {},
  tablefromref,
  readOnly = false,
  rowlength,
  ...restProps
}) => {
  const { getEnumsApi, ...getEditProps } = editProps
  // const [editing, setEditing] = useState(false);
  const [enumsList, setEnumsList] = useState([])
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)
  const translate = useWebIntl()

  useEffect(() => {
    form.setFieldsValue(record)
  }, [record])

  useEffect(() => {
    setEnumsList(getEditProps?.enums)
  }, [getEditProps?.enums])

  const changeInput = useCallback(
    async (e) => {
      try {
        form.setFieldsValue({ [dataIndex]: e.target.value })
        const values = await form.getFieldsValue()
        handleChange({ ...record, ...values }, dataIndex)
      } catch (errInfo) {
        console.log('Save failed:', errInfo)
      }
    },
    [record, dataIndex, form, handleChange],
  )

  const changeSwitch = useCallback(async () => {
    try {
      form.setFieldsValue({ [dataIndex]: !record[dataIndex] })
      const values = await form.getFieldsValue()
      handleChange({ ...record, ...values }, dataIndex)
    } catch (errInfo) {
      console.log('changeSwitch failed:', errInfo)
    }
  }, [record, dataIndex, form, handleChange])

  const onBtnClick = useCallback(async () => {
    try {
      const values = await form.getFieldsValue()
      handleChange({ ...record, ...values }, dataIndex)
    } catch (errInfo) {
      console.log('onBtnClick failed:', errInfo)
    }
  }, [record, dataIndex, form, handleChange])

  const onDateChange = useCallback(
    async (v, valueStr) => {
      try {
        form.setFieldsValue({ [dataIndex]: valueStr })
        const values = await form.getFieldsValue()
        handleChange({ ...record, ...values }, dataIndex)
      } catch (errInfo) {
        console.log('onDateChange failed:', errInfo)
      }
    },
    [record, dataIndex, form, handleChange],
  )

  const onFileChange = useCallback(
    async (info) => {
      try {
        const fileList = info.fileList
        const newList = fileList.map((file) => {
          return {
            name: file.name,
            url: file.url || file.response?.data,
            uid: file.uid,
            status: file.status,
            percent: file.percent,
            size: file.size,
            type: file.type,
          }
        })
        form.setFieldsValue({ [dataIndex]: newList })
        const values = await form.getFieldsValue()
        handleChange({ ...record, ...values }, dataIndex)
      } catch (errInfo) {
        console.log('onFileChange failed:', errInfo)
      }
    },
    [record, dataIndex, form, handleChange],
  )

  const onRemoveFile = useCallback(
    async ({ url }) => {
      try {
        const values = await form.getFieldsValue()
        const newList = values[dataIndex].filter((item) => item.url !== url)
        form.setFieldsValue({ [dataIndex]: newList })
        handleChange({ ...record, [dataIndex]: newList }, dataIndex)
      } catch (errInfo) {
        console.log('onRemoveFile failed:', errInfo)
      }
    },
    [record, dataIndex, form, handleChange],
  )

  const selectRecipient = useCallback(async () => {
    try {
      const values = await form.getFieldsValue()
      handleChange({ ...record, ...values }, dataIndex)
    } catch (errInfo) {
      console.log('selectRecipient failed:', errInfo)
    }
  }, [record, dataIndex, form, handleChange])

  const onChangeSelect = useCallback(
    async (selectCalue) => {
      try {
        form.setFieldsValue({ [dataIndex]: selectCalue })
        const values = await form.getFieldsValue()
        handleChange({ ...record, ...values }, dataIndex)
      } catch (errInfo) {
        console.log('onChangeSelect failed:', errInfo)
      }
    },
    [record, dataIndex, form, handleChange],
  )

  const onSearchSelect = useCallback(
    async (searchValue: string) => {
      if (getEnumsApi && isFunction(getEnumsApi)) {
        const res = await getEnumsApi(searchValue)
        setEnumsList(res)
      }
    },
    [getEnumsApi],
  )

  const dateFormat = useMemo(() => {
    return isFunction(format) ? format(children[1]) : format || 'YYYY-MM-DD hh:mm:ss'
  }, [format, children])

  const defaultDate = useMemo(() => {
    const dateValue = getEditProps?.defaultValue || moment()
    return moment(dateValue, dateFormat)
  }, [dateFormat, getEditProps])

  const componentObj: Record<ComponentType, React.ReactNode> = {
    Input: readOnly ? (
      <span>{isFunction(format) ? format(children[1]) : children[1]}</span>
    ) : (
      <Input
        ref={inputRef}
        value={children[1]}
        onPressEnter={changeInput}
        onBlur={changeInput}
        disabled={record?.disabled}
        {...getEditProps}
      />
    ),
    CustomInput: (
      <CustomInput
        inputRef={inputRef}
        inputValue={isFunction(format) ? format(children[1]) : children[1]}
        onClick={selectRecipient}
        onChange={changeInput}
        disabled={record?.disabled}
        readOnly={readOnly}
        {...getEditProps}
      />
    ),
    TextArea: readOnly ? (
      <span>{isFunction(format) ? format(children[1]) : children[1]}</span>
    ) : (
      <Input.TextArea
        ref={inputRef}
        value={children[1]}
        onPressEnter={changeInput}
        onBlur={changeInput}
        disabled={record?.disabled}
        {...getEditProps}
      />
    ),
    Switch: (
      <Switch
        onChange={changeSwitch}
        checked={isFunction(format) ? format(children[1]) : children[1]}
        disabled={record?.disabled}
        {...getEditProps}
      />
    ),
    Button: (
      <Button onClick={onBtnClick} disabled={record?.disabled} {...getEditProps}>
        {getEditProps?.title}
      </Button>
    ),
    Select: readOnly ? (
      <span>{isFunction(format) ? format(children[1]) : children[1]}</span>
    ) : (
      <Select
        defaultValue={getEditProps?.defaultValue}
        placeholder={getEditProps?.placeholder}
        disabled={record?.disabled}
        onSearch={onSearchSelect}
        onChange={onChangeSelect}
        value={isFunction(format) ? format(children[1], getEditProps?.enums || []) : children[1]}
        {...getEditProps}
      >
        {Array.isArray(enumsList)
          ? enumsList.map((item) => {
              return (
                <Option value={item.value} key={item.value}>
                  {item.label}
                </Option>
              )
            })
          : null}
      </Select>
    ),
    DatePicker: readOnly ? (
      <span>{isFunction(format) ? format(children[1]) : children[1]}</span>
    ) : (
      <Space direction="vertical">
        <DatePicker
          format={dateFormat}
          // value={children[1] || moment().startOf('day')}
          onChange={onDateChange}
          showTime
          disabled={record?.disabled}
          {...getEditProps}
          defaultValue={defaultDate}
        />
      </Space>
    ),
    File: (
      <UploadFiles
        onRemove={onRemoveFile}
        onChange={onFileChange}
        fileList={Array.isArray(children[1]) ? children[1] : []}
        disable={record?.disabled}
        showFiles
        mode={'link'}
        buttonText={translate('web.common.shangchuan')}
        canDownload
        fileContainerClassName={styles.fileContainer}
      >
        {/* 有上传的文件的话，显示空白替换掉上传按钮 */}
        {!!(Array.isArray(children[1]) && children[1].length) ? '' : undefined}
      </UploadFiles>
    ),
  }

  let childNode = children
  if (editable) {
    childNode = (
      <Form.Item style={{ margin: 0 }} name={dataIndex} rules={rules}>
        {!!visible && componentObj[component]}
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>
}
