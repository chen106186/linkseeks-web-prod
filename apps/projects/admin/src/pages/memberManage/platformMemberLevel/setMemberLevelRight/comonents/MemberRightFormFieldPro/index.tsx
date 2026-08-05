/*
 * @Description: 平台会员等级 - 适用会员角色FormField
 */
import React, { useState, useEffect } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ColumnType } from 'antd/lib/table/interface'
import { Schema, SchemaField, FormPath } from '@apps/formily'
import { PATTERN_MAPS } from '@/constants/regExp'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import themeConfig from '@apps/config/lingxi.theme.config'
import { MEMBER_RIGHT_SETTING } from '../../config'
import type { MemberRightDrawerSubmitValue, MemberRightDrawerProps } from '../MemberRightDrawer'
import MemberRightDrawer from '../MemberRightDrawer'
import styles from './index.less'

export type MemberRightFormFieldType = MemberRightDrawerSubmitValue[0] & {
  /**
   * 参数
   */
  parameter?: number
  /**
   * 状态
   */
  status?: number
  /**
   * 状态名称
   */
  statusName?: string
  /**
   * 是否是新添加的
   */
  fresh?: boolean
}

export interface MemberRightFormFieldProps {
  // value?: MemberRightFormFieldType[],
  // onChange?: (value: MemberRightFormFieldType[]) => void,
  /**
   * 请求权益列表数据方法
   */
  fetchDataSource: MemberRightDrawerProps['fetchDataSource']
  /**
   * 点击改变状态触发事件
   * 直接传列表项会有闭包问题，可能拿不到最新值
   */
  onStatusChange?: (index: number) => Promise<void>
  /**
   * 点击修改参数触发事件
   * 直接传列表项会有闭包问题，可能拿不到最新值
   */
  onChangeParameter?: (index: number) => Promise<void>
}

export type MemberRightSetttingValue = MemberRightFormFieldType[]

const MemberRightFormField = (props) => {
  const { value, editable, path, mutators } = props
  const xComponentProps: MemberRightFormFieldProps = props.props['x-component-props'] || {}
  const { fetchDataSource, onStatusChange, onChangeParameter } = xComponentProps

  const [innerValue, setInnerValue] = useState<MemberRightFormFieldType[]>([])
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [parameterLoadingKey, setParameterLoadingKey] = useState<number | undefined>(undefined)
  const [statusLoadingKey, setStatusLoadingKey] = useState<number | undefined>(undefined)

  useEffect(() => {
    if ('value' in props) {
      setInnerValue(value!)
    }
  }, [value])

  const triggerChange = (next: MemberRightFormFieldType[]) => {
    mutators.change?.(next)
  }

  const handleVisibleDrawer = (flag?: boolean) => {
    setVisibleDrawer(!!flag)
  }

  const handleMemberRightDrawerSubmit = (next: MemberRightDrawerSubmitValue) => {
    const normalize = next.map((item) => ({
      ...item,
      parameter: (item as MemberRightFormFieldType).parameter || 0,
      fresh: /\d/.test(`${(item as MemberRightFormFieldType).status}`) ? false : true,
    }))
    if (!('value' in props)) {
      setInnerValue(normalize)
    }
    triggerChange(normalize)
    handleVisibleDrawer(false)
  }

  // 删除项
  const handleRemoveItem = (record: MemberRightFormFieldType) => {
    const newData = [...innerValue]
    const index = newData.findIndex((item) => item.rightType === record.rightType)
    if (index !== -1) {
      newData.splice(index, 1)
    }
    if (!('value' in props)) {
      setInnerValue(newData)
    }
    triggerChange(newData)
  }

  const handleChangeRightStatus = (index: number) => {
    if (onStatusChange) {
      const msg = message.loading({
        content: '正在更改，请稍候...',
        duration: 0,
      })
      setStatusLoadingKey(index)
      onStatusChange(index).finally(() => {
        msg()
        setStatusLoadingKey(undefined)
      })
    }
  }

  const handleChangeParameter = (index: number) => {
    if (onChangeParameter) {
      const msg = message.loading({
        content: '正在更改，请稍候...',
        duration: 0,
      })
      setParameterLoadingKey(index)
      onChangeParameter(index).finally(() => {
        msg()
        setParameterLoadingKey(undefined)
      })
    }
  }

  const normalColumns: ColumnType<MemberRightFormFieldType>[] = [
    {
      title: '会员权益ID',
      dataIndex: 'rightId',
    },
    {
      title: '会员权益名称',
      dataIndex: 'name',
    },
    {
      title: '会员权益说明',
      dataIndex: 'remark',
    },
    {
      title: '权益获取方式',
      dataIndex: 'acquireWayName',
    },
    {
      title: '参数设置方式',
      dataIndex: 'paramWayName',
    },
    {
      title: '参数',
      dataIndex: 'parameter',
      width: '15%',
      render: (text, record, index) =>
        editable ? (
          <div className={styles['member-rights-editable']}>
            <SchemaField
              path={FormPath.parse(path).concat(index)}
              schema={
                new Schema({
                  type: 'object',
                  properties: {
                    parameter: {
                      type: 'string',
                      'x-component-props': {
                        addonAfter: '%',
                      },
                      'x-rules': [
                        {
                          required: true,
                          message: '请输入参数',
                        },
                        {
                          pattern: PATTERN_MAPS.money,
                          message: '请输入整数或小数位不超过两位的小数',
                        },
                      ],
                    },
                  },
                })
              }
            />
          </div>
        ) : (
          `${text}%`
        ),
    },
    {
      title: '状态',
      dataIndex: 'statusName',
    },
  ]

  const columns: ColumnType<MemberRightFormFieldType>[] = [
    ...normalColumns,
    editable
      ? {
          title: '操作',
          dataIndex: 'option',
          align: 'center',
          render: (_, record, index) => (
            <>
              <Button type="link" onClick={() => handleRemoveItem(record)} disabled={!editable}>
                删除
              </Button>
              {!record.fresh ? (
                <>
                  {/\d/.test(record.status) ? (
                    <Button
                      type="link"
                      onClick={() => handleChangeRightStatus(index)}
                      disabled={!editable}
                      loading={index === statusLoadingKey}
                    >
                      {record.status === 1 ? '停用' : '启用'}
                    </Button>
                  ) : null}
                  <Button
                    type="link"
                    onClick={() => handleChangeParameter(index)}
                    disabled={!editable}
                    loading={index === parameterLoadingKey}
                  >
                    修改参数
                  </Button>
                </>
              ) : null}
            </>
          ),
        }
      : null,
  ].filter(Boolean) as any

  return (
    <MellowCard
      id={MEMBER_RIGHT_SETTING}
      title="会员权益设置"
      style={{
        marginTop: themeConfig['@margin-md'],
      }}
      bodyStyle={{
        paddingBottom: 0,
      }}
    >
      {editable && (
        <Button
          icon={<PlusOutlined />}
          onClick={() => handleVisibleDrawer(true)}
          style={{
            marginBottom: themeConfig['@margin-md'],
          }}
          block
        >
          选择会员权益
        </Button>
      )}
      <PolymericTable rowKey="rightType" columns={columns} dataSource={innerValue} pagination={null} />
      <MemberRightDrawer
        visible={visibleDrawer}
        onClose={() => handleVisibleDrawer(false)}
        value={innerValue}
        onSubmit={handleMemberRightDrawerSubmit}
        fetchDataSource={fetchDataSource}
      />
    </MellowCard>
  )
}

MemberRightFormField.isFieldComponent = true

export default MemberRightFormField
