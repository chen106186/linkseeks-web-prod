/*
 * @Description: 平台会员等级 - 适用会员角色FormField
 */
import React, { useState, useEffect } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { Schema, SchemaField, SchemaMarkupField as Field } from '@apps/formily'
import { toArr, FormPath } from '@apps/formily'
import { PATTERN_MAPS } from '@/constants/regExp'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import themeConfig from '@apps/config/lingxi.theme.config'
import { MEMBER_RIGHT_SETTING } from '../../config'
import MemberRightDrawer, { MemberRightDrawerSubmitValue, MemberRightDrawerProps } from '../MemberRightDrawer'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

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
  const translate = useWebIntl()

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
        content: translate('web.common.changingloading'),
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
        content: translate('web.common.changingloading'),
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
      title: translate('web.resource.member.huiyuanquanyiid'),
      dataIndex: 'rightId',
    },
    {
      title: translate('web.resource.member.huiyuanquanyimingcheng'),
      dataIndex: 'name',
    },
    {
      title: translate('web.resource.member.huiyuanquanyishuoming'),
      dataIndex: 'remark',
    },
    {
      title: translate('web.resource.member.quanyihuoqufangshi'),
      dataIndex: 'acquireWayName',
    },
    {
      title: translate('web.resource.member.canshushezhifangshi'),
      dataIndex: 'paramWayName',
    },
    {
      title: translate('web.resource.member.canshu'),
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
                          message: translate('web.resource.member.qingshurucanshu'),
                        },
                        {
                          pattern: PATTERN_MAPS.money,
                          message: translate('web.resource.member.qingshuruzhengshuhuoxiaoshuwei'),
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
      title: translate('web.common.status'),
      dataIndex: 'statusName',
    },
  ]

  const columns: ColumnType<MemberRightFormFieldType>[] = [
    ...normalColumns,
    editable
      ? {
          title: translate('web.common.control'),
          dataIndex: 'option',
          align: 'center',
          render: (_, record, index) => (
            <>
              <Button type="link" onClick={() => handleRemoveItem(record)} disabled={!editable}>
                {translate('web.common.delete')}
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
                      {record.status === 1 ? translate('web.common.tingyong') : translate('web.common.qiyong')}
                    </Button>
                  ) : null}
                  <Button
                    type="link"
                    onClick={() => handleChangeParameter(index)}
                    disabled={!editable}
                    loading={index === parameterLoadingKey}
                  >
                    {translate('web.resource.member.xiugaicanshu')}
                  </Button>
                </>
              ) : null}
            </>
          ),
        }
      : null,
  ].filter(Boolean) as any

  return (
    <div id={MEMBER_RIGHT_SETTING}>
      <MellowCard
        title={translate('web.resource.member.huiyuanquanyishezhi')}
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
            {translate('web.resource.member.xuanzehuiyuanquanyi')}
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
    </div>
  )
}

MemberRightFormField.isFieldComponent = true

export default MemberRightFormField
