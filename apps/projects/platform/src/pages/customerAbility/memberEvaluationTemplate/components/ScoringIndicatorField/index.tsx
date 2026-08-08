/*
 * @Description: 标准指标 Field
 */
import React from 'react'
import { Button, Input } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { PlusOutlined } from '@ant-design/icons'
import { ISchema, Schema, SchemaField } from '@apps/formily'
import PolymericTable from '@/components/PolymericTable'
import { FormPath } from '@apps/formily'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

export interface I_Indicator {
  id?: number
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

interface MemberScoringIndicatorSubmitListFieldProps {
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

let mockId = Number.MIN_SAFE_INTEGER

/** 供应商评分模板 > 供应商标准指标定义 > 标准指标字段 */
const MemberScoringIndicatorSubmitListField = (props: any) => {
  const { value, schema, path, editable, mutators } = props
  const { groupName }: MemberScoringIndicatorSubmitListFieldProps = schema.getExtendsComponentProps() || {}

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
      title: translate('web.resource.member.zhibiaofenzu'),
      dataIndex: 'indicatorGrouping',
      width: 256,
    },
    {
      title: translate('web.resource.member.biaozhunzhibiao'),
      dataIndex: 'standardIndicator',
      width: 256,
      render: (standardIndicator, indicator, index) => {
        return createSchemaField(index, {
          standardIndicator: {
            type: 'string',
            'x-component-props': {
              style: { width: 232, ...commonInputStyle },
              placeholder: translate('web.common.tip_byteLengthLimit', { byteNum: 30, chineseNum: 15 }),
            },
            'x-rules': [
              {
                required: true,
                message: translate('web.common.qingtianxie'),
              },
              {
                limitByte: true,
                maxByte: 30,
                message: translate('web.common.tip_byteLengthLimit', { byteNum: 30, chineseNum: 15 }),
              },
            ],
          },
        })
      },
    },
    {
      title: translate('web.resource.member.fenzhifanwei'),
      dataIndex: 'scoreMin',
      width: 256,
      render: (scoreMin, indicator, index) => {
        return (
          <Input.Group
            style={{
              ...commonInputStyle,
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            {createSchemaField(index, {
              scoreMin: {
                type: 'number',
                'x-component-props': {
                  style: { width: 97, textAlign: 'center', ...commonInputStyle },
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
              },
            })}
            {editable ? (
              <Input
                style={{
                  flexShrink: 0,
                  width: 30,
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
                  style: { width: 97, textAlign: 'center', ...commonInputStyle },
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
              },
            })}
          </Input.Group>
        )
      },
    },
    {
      title: translate('web.resource.member.biaozhunzhibiaoshuoming'),
      dataIndex: 'indicatorDescribe',
      width: 704,
      render: (indicatorDescribe, indicator, index) => {
        return createSchemaField(index, {
          indicatorDescribe: {
            type: 'string',
            'x-component': 'textarea',
            'x-component-props': {
              style: { width: 688, ...commonInputStyle },
              placeholder: translate('web.common.tip_byteLengthLimit', { byteNum: 40, chineseNum: 20 }),
              rows: 1,
            },
            'x-rules': [
              {
                limitByte: true,
                maxByte: 40,
                message: translate('web.common.tip_byteLengthLimit', { byteNum: 40, chineseNum: 20 }),
              },
            ],
          },
        })
      },
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'id',
      width: 128,
      fixed: 'right',
      render: (id, indicator) => (
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
      ),
    },
  ].map((column) => ({ ...column, ellipsis: true }))

  return (
    <div className={styles['scoring-indicator']}>
      <div className={styles['scoring-indicator-title']}>{groupName}</div>
      <PolymericTable
        rowKey="id"
        pagination={null}
        dataSource={value}
        scroll={{ x: 1200 }}
        columns={indicatorTableColumns}
        rowClassName={() => 'editable-row'}
      />
      <Button
        block
        icon={<PlusOutlined />}
        style={{ marginTop: -16, border: 'none' }}
        onClick={() => {
          mutators.push?.({
            id: mockId++,
            indicatorGrouping: groupName,
            standardIndicator: undefined,
            scoreMin: undefined,
            scoreMax: undefined,
            indicatorDescribe: undefined,
          })
        }}
      >
        {translate('web.resource.member.tianjiabiaozhunzhibiao')}
      </Button>
    </div>
  )
}

MemberScoringIndicatorSubmitListField.isFieldComponent = true

export default MemberScoringIndicatorSubmitListField
