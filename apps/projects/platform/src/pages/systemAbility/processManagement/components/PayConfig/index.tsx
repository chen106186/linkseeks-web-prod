import React, { memo, useState, useEffect } from 'react'
import { Form, Input, Table, Tabs } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useIntl } from '@linkseeks/i18n'
import NumberInput from '@/components/NumberInput'
import { validatorByte } from '@/utils/regExp'
import CommonFormValueChange from '../CommonFormValueChange'
import { toChinesNum } from '@/utils'

export interface PropsType {
  onChange?: (value: any) => void
  value?: any
  disabled?: boolean
}

const PayConfig = (props: PropsType) => {
  const intl = useIntl()

  const { onChange, value, disabled } = props

  const onInputChange = (batchNo: number, filed: string, val: any) => {
    const newValue = value?.map((item) => {
      return {
        ...item,
        nodes: item.nodes.map((i) => {
          return i.batchNo === batchNo
            ? {
                ...i,
                [filed]: val,
              }
            : i
        }),
      }
    })
    onChange?.(newValue)
  }

  // 支付配置
  const columns: ColumnsType<any> = [
    {
      title: intl.formatMessage({ id: 'processRuleSetting.zhifucishu', defaultMessage: '支付次数' }),
      dataIndex: 'batchNo',
      key: 'batchNo',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'processRuleSetting.zhifuhuanjie', defaultMessage: '支付环节' }),
      dataIndex: 'payNode',
      key: 'payNode',
      width: 480,
      render: (t, r) => (
        <Form.Item
          name={`payNode_${r.batchNo}`}
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: !disabled,
              message: `${intl.formatMessage({ id: 'common.enter', defaultMessage: '请填写' })}${intl.formatMessage({
                id: 'processRuleSetting.zhifuhuanjie',
                defaultMessage: '支付环节',
              })}`,
            },
            { validator: (rule, value, callback) => validatorByte(rule, value, callback, 24) },
          ]}
          initialValue={t}
        >
          <CommonFormValueChange
            onValueChange={(val) => {
              onInputChange(r.batchNo, 'payNode', val)
            }}
          >
            <Input maxLength={24} disabled={disabled} />
          </CommonFormValueChange>
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'processRuleSetting.zhifubili', defaultMessage: '支付比例' }),
      dataIndex: 'payRate',
      key: 'payRate',
      render: (t, r) => (
        <Form.Item
          name={`payRate_${r.batchNo}`}
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: !disabled,
              message: `${intl.formatMessage({ id: 'common.enter', defaultMessage: '请填写' })}${intl.formatMessage({
                id: 'processRuleSetting.zhifubili',
                defaultMessage: '支付比例',
              })}`,
            },
          ]}
          initialValue={t}
        >
          <CommonFormValueChange
            onValueChange={(val) => {
              onInputChange(r.batchNo, 'payRate', val)
            }}
          >
            <NumberInput
              style={{ width: '100%', verticalAlign: 'middle', position: 'relative', top: -1 }}
              decimals={2}
              max={100}
              min={0}
              addonAfter="%"
              disabled={disabled}
            />
          </CommonFormValueChange>
        </Form.Item>
      ),
    },
  ]

  return (
    <div>
      {!!value?.length && (
        <Tabs defaultActiveKey={value[0]?.serialNo + ''}>
          {value?.map((item) => (
            <Tabs.TabPane
              tab={`${intl.formatMessage({
                id: 'processRuleSetting.zhifupici',
                defaultMessage: '支付批次',
              })}${toChinesNum(item.serialNo)}`}
              key={item.serialNo + ''}
              forceRender
            >
              <Table rowKey="batchNo" columns={columns} dataSource={item.nodes || []} pagination={false} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      )}
    </div>
  )
}
export default memo(PayConfig)
