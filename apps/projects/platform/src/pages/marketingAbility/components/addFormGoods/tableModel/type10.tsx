import React, { useEffect, useState } from 'react'
import { ColumnType } from 'antd/lib/table/interface'
import { Tooltip, Badge, Button, Form, Input, Row, Col, DatePicker, Select } from 'antd'
import { QuestionCircleOutlined, EditOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const awardsLevelOptions = [
  { lable: `${intl.formatMessage({ id: 'marketingAbility.yidengjiang' })}`, value: 1 },
  { lable: `${intl.formatMessage({ id: 'marketingAbility.erdengjiang' })}`, value: 2 },
  { lable: `${intl.formatMessage({ id: 'marketingAbility.sandengjiang' })}`, value: 3 },
  { lable: `${intl.formatMessage({ id: 'marketingAbility.sidengjiang' })}`, value: 4 },
  { lable: `${intl.formatMessage({ id: 'marketingAbility.wudengjiang' })}`, value: 5 },
]

const awardsTypeOptions = [
  { lable: `${intl.formatMessage({ id: 'marketingAbility.shangpin' })}`, value: 1 },
  { lable: `${intl.formatMessage({ id: 'marketingAbility.youhuiquan' })}`, value: 2 },
  { lable: `${intl.formatMessage({ id: 'marketingAbility.xianjin' })}`, value: 3 },
  { lable: `${intl.formatMessage({ id: 'marketingAbility.jifen' })}`, value: 4 },
  { lable: `${intl.formatMessage({ id: 'marketingAbility.xiexiecanyu' })}`, value: 5 },
]

// 抽奖
const columns = (props: any) => {
  const { dataSource, setDataSource, deleteRow } = props
  const _changeProbability = (index: any, value: any) => {
    const _val = value.replace(/[^\d]/g, '')
    const _dataSource = [...dataSource]
    let _item = { ..._dataSource[index] }
    _item.probability = _val
    _dataSource[index] = _item
    setDataSource(_dataSource)
  }
  const _changeAwardsLevel = (index: any, value: any) => {
    const _dataSource = [...dataSource]
    let _item = { ..._dataSource[index] }
    _item.awardsLevel = value
    _dataSource[index] = _item
    setDataSource(_dataSource)
  }
  const _changeAwardsType = (index: any, value: any) => {
    const _dataSource = [...dataSource]
    let _item = { ..._dataSource[index] }
    _item.awardsType = value
    _item.awards = ''
    _dataSource[index] = _item
    setDataSource(_dataSource)
  }
  const _awardsItem = (index: any, record: any) => {
    switch (record.awards) {
      case 1:
      case 2:
        return (
          <EditOutlined>
            {intl.formatMessage({ id: 'marketingAbility.xuanze' })}
            {record.awards === 1
              ? `${intl.formatMessage({ id: 'marketingAbility.jiangpin' })}`
              : `${intl.formatMessage({ id: 'marketingAbility.youhuiquan' })}`}
          </EditOutlined>
        )
      case 3:
        return (
          <Input
            value={record.awards}
            addonAfter={intl.formatMessage({ id: 'marketingAbility.yuan' })}
            placeholder={intl.formatMessage({ id: 'marketingAbility.qingshurujine' })}
          />
        )
      case 4:
        return (
          <Input
            value={record.awards}
            addonAfter={intl.formatMessage({ id: 'marketingAbility.jifen' })}
            placeholder={intl.formatMessage({ id: 'marketingAbility.qingshurujifen' })}
          />
        )
      default:
        return `${intl.formatMessage({ id: 'marketingAbility.wu' })}`
    }
  }
  return [
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.jiangxiangdengji' })}`,
      key: 'awardsLevel',
      dataIndex: 'awardsLevel',
      width: 180,
      render: (text: any, record: any, index: number) => (
        <Form.Item
          style={{ margin: 0 }}
          initialValue={text}
          key={`awardsLevel_${record.id}`}
          name={`awardsLevel_${record.id}`}
          rules={[
            { required: true, message: `${intl.formatMessage({ id: 'marketingAbility.qingxuanzejiangxiangdengji' })}` },
          ]}
        >
          <Select
            onChange={(value) => {
              _changeAwardsLevel(index, value)
            }}
            value={record.awardsLevel}
            options={awardsLevelOptions}
          />
        </Form.Item>
      ),
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.jiangpinleibie' })}`,
      key: 'awardsType',
      dataIndex: 'awardsType',
      width: 180,
      render: (text: any, record: any, index: number) => (
        <Form.Item
          style={{ margin: 0 }}
          initialValue={text}
          key={`awardsType_${record.id}`}
          name={`awardsType_${record.id}`}
          rules={[
            { required: true, message: `${intl.formatMessage({ id: 'marketingAbility.qingxuanzejiangxiangleibie' })}` },
          ]}
        >
          <Select
            onChange={(value) => {
              _changeAwardsType(index, value)
            }}
            value={record.awardsType}
            options={awardsTypeOptions}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <Tooltip
          placement="top"
          title={intl.formatMessage({
            id: 'marketingAbility.zhongjianggailüweidangqianjiangxiangdengjidezhongjianggailü，rushezhiyidengjiangdezhongjianggailüwei10%，zebiaoshiyonghuchouzhongyidengjiangdegailüshi10%',
          })}
        >
          {intl.formatMessage({ id: 'marketingAbility.zhongjianggailü' })}
          <QuestionCircleOutlined />
        </Tooltip>
      ),
      key: 'probability',
      dataIndex: 'probability',
      render: (text: any, record: any, index: number) => (
        <Form.Item
          style={{ margin: 0 }}
          initialValue={text}
          key={`probability_${record.id}`}
          name={`probability_${record.id}`}
          rules={[
            { required: true, message: `${intl.formatMessage({ id: 'marketingAbility.qingxuanzejiangxiangleibie' })}` },
          ]}
        >
          <Input
            value={record.probability}
            onChange={(e) => {
              _changeProbability(index, e.target.value)
            }}
            addonAfter="%"
            placeholder={intl.formatMessage({ id: 'marketingAbility.qingshuruzhongjianggailü' })}
          />
        </Form.Item>
      ),
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.jiangpin' })}`,
      key: 'awards',
      dataIndex: 'awards',
      render: (text: any, record: any, index: number) => (
        <Form.Item
          style={{ margin: 0 }}
          initialValue={text}
          key={`probability_${record.id}`}
          name={`probability_${record.id}`}
          rules={[
            { required: true, message: `${intl.formatMessage({ id: 'marketingAbility.qingxuanzejiangxiangleibie' })}` },
          ]}
        >
          {_awardsItem(index, record)}
        </Form.Item>
      ),
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.caozuo' })}`,
      key: 'operate',
      dataIndex: 'operate',
      render: (text: any, record: any, index: number) => (
        <Button type="link">{intl.formatMessage({ id: 'marketingAbility.shanchu' })}</Button>
      ),
    },
  ]
}

export default columns
