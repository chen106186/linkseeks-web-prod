import React, { Fragment, useEffect, useState } from 'react'
import { Button, Checkbox, Divider, Form, Input, Space, Table, Typography } from '@linkseeks/ui'
import { Select, message } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { validatorByte } from '@/utils/regExp'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { PlusOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'
import { useCategoryContext } from '../../context'
import styles from './index.less'
import { PlusIcon } from '@linkseeks/icons'

/** 检测类型options */
const plainOptions = [
  {
    label: '免检',
    value: 1,
  },
  {
    label: '抽检',
    value: 2,
  },
  {
    label: '全检',
    value: 3,
  },
]

/** 检测项目类型 */
interface CheckProjectType {
  /** 行标识 */
  fieldKey: number
  rowKey: number
  /** 是否已确定 */
  isEnter: boolean
  /** 分组 */
  grouping?: string
  /** 检验项目 */
  testItems?: string
  /** 合格范围-开始 */
  startValue?: string
  /** 合格范围-结束 */
  endValue?: string
  /** 检测说明 */
  inspectionInstructions?: string
}

const DetectionForm: React.FC = () => {
  const { categoryForm } = useCategoryContext()
  const [groupName, setGroupName] = useState('') // 新增分组名
  const [grouping, setGrouping] = useState<string[]>([])
  const intl = useIntl()

  /**
   * 更改行是否可编辑的状态
   * @param index 行下标
   * @param status 新状态
   */
  const changeStatus = (record, status) => {
    console.log(record, status, 'changeStatus')
    const fieldPathNames = [['categoryInspections', record.fieldKey, 'grouping']]
    categoryForm.validateFields(fieldPathNames)
    // const newList = [...projectList]
    // if (status) {
    // 	// 若为确认操作，需进行校验
    // 	const { rowKey } = newList[index]
    // 	let isError = false
    // 	form
    // 		.validateFields([
    // 			`${rowKey}_testItems`,
    // 			`${rowKey}_limit`,
    // 			`${rowKey}_inspectionInstructions`,
    // 			`${rowKey}_grouping`,
    // 		])
    // 		.catch((error) => {
    // 			isError = true
    // 		})
    // 		.finally(() => {
    // 			if (!isError) {
    // 				newList[index].isEnter = status
    // 				setProjectList(newList)
    // 			}
    // 		})
    // } else {
    // 	newList[index].isEnter = status
    // 	setProjectList(newList)
    // }
  }

  /** 添加组别 */
  const addGrouping = (groupName: string) => {
    if (!groupName || groupName === '' || grouping.includes(groupName)) {
      return true
    }
    if (groupName.replace(/[\u4e00-\u9fa5]/g, 'OO').length > 24) {
      message.warning(
        intl.formatMessage({
          id: 'classAndProperty.class.check.groupNameTip1',
          defaultMessage: '组别名最长24个字符或12个汉字',
        }),
      )
      return false
    }
    setGrouping([...grouping, groupName])
    return true
  }

  const columnConfig = (props): ColumnsType<CheckProjectType> => {
    const { handleDelete, setGrouping, grouping, addGrouping } = props

    return [
      {
        title: (
          <span className={styles.requiredStart}>
            {intl.formatMessage({ id: 'classAndProperty.class.check.column.grouping', defaultMessage: '分组' })}
          </span>
        ),
        dataIndex: 'grouping',
        width: 220,
        render: (text, record, index) => (
          <Fragment>
            <Form.Item name={[record.fieldKey, 'id']} hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name={[record.fieldKey, 'grouping']}
              rules={[
                {
                  validator: (_rule, _value, callback) => {
                    if (!_value || _value === '') {
                      callback(
                        intl.formatMessage({
                          id: 'classAndProperty.class.check.column.groupingTip1',
                          defaultMessage: '分组不能为空',
                        }),
                      )
                    } else {
                      callback()
                    }
                  },
                },
              ]}
            >
              <Select
                style={{ width: 200 }}
                placeholder={intl.formatMessage({
                  id: 'classAndProperty.class.check.groupNameTip2',
                  defaultMessage: '请添加分组',
                })}
                onDropdownVisibleChange={(open) => {
                  !open && setGroupName('') // 关闭下拉时重置输入框
                }}
                optionLabelProp="label"
                dropdownRender={(menu) => {
                  return (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Space align="center" style={{ padding: '0 8px 4px' }}>
                        <Input
                          value={groupName}
                          placeholder={intl.formatMessage({
                            id: 'classAndProperty.class.check.groupNameTip3',
                            defaultMessage: '请输入新选项',
                          })}
                          onChange={(e) => {
                            setGroupName(e.target.value)
                          }}
                          onKeyDown={(e) => {
                            if (e.code === 'Enter') {
                              const result = addGrouping(groupName)
                              result && setGroupName('') // 添加成功后重置input
                            }
                          }}
                        />
                        <Typography.Link
                          onClick={() => {
                            const result = addGrouping(groupName)
                            result && setGroupName('')
                          }}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          <PlusOutlined /> {intl.formatMessage({ id: 'components.xinzeng', defaultMessage: '新增' })}
                        </Typography.Link>
                      </Space>
                    </>
                  )
                }}
              >
                {grouping.map((item) => {
                  return (
                    <Select.Option value={item} label={item} key={item}>
                      <div className={styles.groupOption}>
                        <span className={styles.overflowHide}>{item}</span>
                        <Typography.Link
                          onClick={(e) => {
                            e.stopPropagation()
                            e.nativeEvent.stopImmediatePropagation()
                            setGrouping(grouping.filter((oldItem) => oldItem !== item))
                          }}
                        >
                          {intl.formatMessage({ id: 'common.button.delete', defaultMessage: '删除' })}
                        </Typography.Link>
                      </div>
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Fragment>
        ),
      },
      {
        title: (
          <span className={styles.requiredStart}>
            {intl.formatMessage({ id: 'classAndProperty.class.check.column.checkItem', defaultMessage: '检验项目' })}
          </span>
        ),
        dataIndex: 'testItems',
        width: 200,
        render: (text, record, index) => (
          <Form.Item
            name={[record.fieldKey, 'testItems']}
            initialValue={record.testItems}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'classAndProperty.class.check.column.checkItemTip1',
                  defaultMessage: '检验项目不能为空',
                }),
              },
              {
                validator: (rule, value, callback) => validatorByte(rule, value, callback, 60),
              },
            ]}
          >
            <Input />
          </Form.Item>
        ),
      },
      {
        title: (
          <span className={styles.requiredStart}>
            {intl.formatMessage({
              id: 'classAndProperty.class.check.column.acceptabilityLimit',
              defaultMessage: '合格范围',
            })}
          </span>
        ),
        dataIndex: 'acceptabilityLimit',
        width: '230px',
        render: (_text, record) => (
          <Form.Item>
            <Input.Group style={{ display: 'flex' }}>
              <Form.Item
                name={[record.fieldKey, 'startValue']}
                dependencies={[record.fieldKey, 'endValue']}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'common.form.input.placeholder', defaultMessage: '请输入' }),
                  },
                  {
                    validator: (r, v, c) => validatorByte(r, v, c, 40),
                  },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input style={{ width: 80, textAlign: 'center' }} />
              </Form.Item>

              <Input
                style={{
                  width: 30,
                  borderLeft: 0,
                  borderRight: 0,
                  pointerEvents: 'none',
                  backgroundColor: '#fff',
                }}
                placeholder="~"
                disabled
              />
              <Form.Item
                name={[record.fieldKey, 'endValue']}
                dependencies={[record.fieldKey, 'startValue']}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'common.form.input.placeholder', defaultMessage: '请输入' }),
                  },
                  {
                    validator: (r, v, c) => validatorByte(r, v, c, 40),
                  },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input style={{ width: 80, textAlign: 'center' }} />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({
          id: 'classAndProperty.class.check.column.inspectionInstructions',
          defaultMessage: '检验说明',
        }),
        dataIndex: 'inspectionInstructions',
        width: 200,
        render: (text, record, index) => (
          <Form.Item
            name={[record.fieldKey, 'inspectionInstructions']}
            initialValue={record.inspectionInstructions}
            rules={[
              {
                validator: (rule, value, callback) => validatorByte(rule, value, callback, 80),
              },
            ]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'classAndProperty.class.check.column.ops', defaultMessage: '操作' }),
        dataIndex: 'ops',
        width: 90,
        fixed: 'right',
        render: (_text, record, index) => (
          <Button
            type="link"
            onClick={() => {
              handleDelete(record.fieldKey)
            }}
            style={{ margin: '0 5px' }}
          >
            {intl.formatMessage({
              id: 'classAndProperty.class.check.column.ops.btn2',
              defaultMessage: '删除',
            })}
          </Button>
        ),
      },
    ]
  }

  return (
    <Fragment>
      <Form.Item
        name="inspectionTypes"
        label={intl.formatMessage({
          id: 'classAndProperty.class.check.checkType',
          defaultMessage: '检验方式',
        })}
      >
        <Checkbox.Group options={plainOptions} />
      </Form.Item>
      <Form.Item
        label={intl.formatMessage({
          id: 'classAndProperty.class.check.checkItem',
          defaultMessage: '检验项目',
        })}
        wrapperCol={{ span: 24 }}
      >
        <Form.List name="categoryInspections">
          {(fields, { add, remove }) => (
            <div>
              <Table
                dataSource={fields}
                rowKey="fieldKey"
                columns={columnConfig({
                  handleDelete: (index: number) => remove(index),
                  changeStatus,
                  setGrouping,
                  grouping,
                  addGrouping,
                })}
                scroll={{ x: 1020 }}
                pagination={false}
              />
              <Button onClick={add} style={{ marginTop: 10 }} icon={<PlusIcon />} block>
                {intl.formatMessage({
                  id: 'classAndProperty.class.check.addCheckItem',
                  defaultMessage: '添加检测项目',
                })}
              </Button>
            </div>
          )}
        </Form.List>
      </Form.Item>
    </Fragment>
  )
}

export default DetectionForm
