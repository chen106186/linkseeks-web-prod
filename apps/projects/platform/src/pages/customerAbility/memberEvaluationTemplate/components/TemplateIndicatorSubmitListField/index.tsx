import React from 'react'

import { Button, Input } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { ISchema, Schema, SchemaField } from '@apps/formily'
import PolymericTable from '@/components/PolymericTable'

import { FormPath } from '@apps/formily'

import styles from './index.less'
import { useWebIntl } from '@apps/locales'

export interface I_Indicator {
  id: number
  indicatorGrouping?: string
  standardIndicator?: string
  scoreMin?: number
  scoreMax?: number
  scoreStandard?: string
  weight?: number
  indicatorDescribe?: string
}

export interface I_IndicatorGroup {
  groupName: string
  elements: Array<I_Indicator>
}

interface I_TemplateIndicatorSubmitListField_Props {
  /**
   * 组名
   */
  groupName: string
}

const commonInputStyle: React.CSSProperties = {
  background: '#F5F6F7',
  border: 'none',
  borderRadius: 4,
}

/** 供应商评分模板 > 供应商评分模板配置 > 新增供应商评分模板 > 标准指标字段 */
const TemplateIndicatorSubmitListField = (props: any) => {
  const { value, schema, path, editable, mutators } = props
  const { groupName }: I_TemplateIndicatorSubmitListField_Props = schema.getExtendsComponentProps() || {}

  const translate = useWebIntl()
  /** 创建表格内的表单项schema */
  const createSchemaField = (index: number, properties: { [key: string]: ISchema }) => {
    return (
      <SchemaField
        path={FormPath.parse(path).concat(index)}
        schema={
          new Schema({
            type: 'object',
            properties,
          })
        }
      />
    )
  }

  const indicatorTableColumns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 0,
      render: (id, indicator, index) => {
        return createSchemaField(index, {
          id: {
            type: 'string',
            editable: false,
            default: id,
          },
        })
      },
    },
    {
      title: translate('web.resource.member.biaozhunzhibiao'),
      dataIndex: 'standardIndicator',
      width: 176,
      render: (standardIndicator, indicator, index) => {
        return createSchemaField(index, {
          standardIndicator: {
            type: 'string',
            editable: false,
            default: standardIndicator,
          },
        })
      },
    },
    {
      title: translate('web.resource.member.fenzhifanwei'),
      dataIndex: 'scoreMin',
      width: 192,
      render: (scoreMin, indicator, index) => {
        return (
          <Input.Group style={{ display: 'flex', alignItems: 'center', width: 176 }}>
            {createSchemaField(index, {
              scoreMin: {
                type: 'number',
                'x-component-props': {
                  style: { width: 72, textAlign: 'center', ...commonInputStyle },
                  placeholder: translate('web.common.min'),
                  min: 0,
                  max: 99,
                  precision: 0,
                },
                'x-rules': [
                  {
                    required: true,
                    message: translate('web.common.qingtianxie'),
                  },
                ],
                default: scoreMin,
              },
            })}
            {editable ? (
              <Input
                style={{
                  flexShrink: 0,
                  width: 30,
                  height: 30.85,
                  border: 'none',
                  pointerEvents: 'none',
                }}
                placeholder="~"
                disabled
              />
            ) : (
              '~'
            )}
            {createSchemaField(index, {
              scoreMax: {
                type: 'number',
                'x-component-props': {
                  style: { width: 72, textAlign: 'center', ...commonInputStyle },
                  placeholder: translate('web.common.max'),
                  min: 1,
                  max: 100,
                  precision: 0,
                },
                'x-rules': [
                  {
                    required: true,
                    message: translate('web.common.qingtianxie'),
                  },
                ],
                default: indicator?.scoreMax,
              },
            })}
          </Input.Group>
        )
      },
    },
    {
      title: translate('web.resource.commodity.quanzhong'),
      dataIndex: 'weight',
      width: 180,
      render: (weight, indicator, index) => {
        return (
          <Input.Group style={{ display: 'flex', alignItems: 'flex-start', width: 180 }}>
            {createSchemaField(index, {
              weight: {
                type: 'number',
                'x-component-props': {
                  style: { width: 107, ...commonInputStyle },
                  placeholder: translate('web.resource.commodity.quanzhong'),
                  min: 0,
                  max: 100,
                  precision: 1,
                },
                'x-rules': [
                  {
                    required: true,
                    message: translate('web.common.qingtianxie'),
                  },
                ],
                default: weight,
              },
            })}
            {editable ? (
              <Input
                style={{
                  width: 35,
                  height: 30.85,
                  border: 'none',
                  pointerEvents: 'none',
                }}
                placeholder="%"
                disabled
              />
            ) : (
              '%'
            )}
          </Input.Group>
        )
      },
    },
    {
      title: translate('web.resource.commodity.fenzhibiaozhun'),
      dataIndex: 'scoreStandard',
      width: 400,
      render: (scoreStandard, indicator, index) => {
        return createSchemaField(index, {
          scoreStandard: {
            type: 'string',
            // 'x-component': 'textarea',
            'x-component-props': {
              style: { width: 384, ...commonInputStyle },
              placeholder: translate('web.common.tip_byteLengthLimit', { byteNum: 80, chineseNum: 40 }),
              rows: 1,
            },
            'x-rules': [
              {
                limitByte: true,
                maxByte: 80,
                message: translate('web.common.tip_byteLengthLimit', { byteNum: 80, chineseNum: 40 }),
              },
            ],
            default: scoreStandard,
          },
        })
      },
    },
    {
      title: translate('web.resource.member.biaozhunzhibiaoshuoming'),
      dataIndex: 'indicatorDescribe',
      width: 512,
      render: (indicatorDescribe, indicator, index) => {
        return createSchemaField(index, {
          indicatorDescribe: {
            type: 'string',
            editable: false,
            default: indicatorDescribe,
          },
        })
      },
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'id',
      width: 128,
      fixed: 'right',
      render: (id, indicator) =>
        editable ? (
          <Button
            type="link"
            onClick={() => {
              const index = value.findIndex((element) => element.id === id)
              if (index > -1) {
                mutators.remove(index)
              }
            }}
          >
            {translate('web.common.delete')}
          </Button>
        ) : undefined,
    },
  ].map((column) => ({ ...column, ellipsis: true }))

  return (
    <div className={styles['scoring-indicator']}>
      <div>
        <div className={styles['scoring-indicator-title']}>{groupName}</div>
        <PolymericTable
          rowKey="id"
          pagination={null}
          dataSource={value}
          scroll={{ x: 1200 }}
          columns={indicatorTableColumns}
          rowClassName={() => 'editable-row'}
        />
      </div>
    </div>
  )
}

TemplateIndicatorSubmitListField.isFieldComponent = true

export default TemplateIndicatorSubmitListField
