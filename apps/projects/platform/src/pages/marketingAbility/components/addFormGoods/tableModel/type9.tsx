import { useIntl } from '@linkseeks/i18n'
import React, { useEffect, useState } from 'react'
import { ColumnType } from 'antd/lib/table/interface'
import { Tooltip, Badge, Button, Form, Input, Row, Col, DatePicker, Select } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

import { priceFormat } from '@/utils/numberFomat'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
// 拼团
const columns = (props: any) => {
  const intl = useIntl()
  const { dataSource, setDataSource, deleteRow } = props
  const _changeActivityPrice = (record: any, value: any) => {
    const _val = value.replace(/^\D*(\d*(?:\.\d{0,4})?).*$/g, '$1')
    const _dataSource = [...dataSource]
    const _i = _dataSource.findIndex((item) => item.id === record.id)
    let _item = { ..._dataSource[_i] }
    _item.groupPrice = _val
    _dataSource[_i] = _item
    setDataSource(_dataSource)
  }
  const _changeSelfCount = (record: any, value: any) => {
    const _val = value.replace(/[^\d]/g, '')
    const _dataSource = [...dataSource]
    const _i = _dataSource.findIndex((item) => item.id === record.id)
    let _item = { ..._dataSource[_i] }
    _item.selfCount = _val
    _dataSource[_i] = _item
    setDataSource(_dataSource)
  }

  const _changeTotal = (record: any, value: any) => {
    const _val = value.replace(/[^\d]/g, '')
    const _dataSource = [...dataSource]
    const _i = _dataSource.findIndex((item) => item.id === record.id)
    let _item = { ..._dataSource[_i] }
    _item.total = _val
    _dataSource[_i] = _item
    setDataSource(_dataSource)
  }
  return [
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.shangpintupian' })}`,
      key: 'goodsImg',
      dataIndex: 'goodsImg',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.shangpinID' })}`,
      key: 'goodsId',
      dataIndex: 'goodsId',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.shangpinmingcheng' })}`,
      key: 'goodsName',
      dataIndex: 'goodsName',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.pinlei' })}`,
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.pinpai' })}`,
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.danwei' })}`,
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.shangpinjiage' })}`,
      key: 'price',
      dataIndex: 'price',
      render: (text: any, record: any, index: number) =>
        `${translate('web.common.currencySymbol')}${priceFormat(text)}`,
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.tuangoujiage' })}`,
      key: 'groupPrice',
      dataIndex: `${intl.formatMessage({ id: 'marketingAbility.tuangoujiage' })}`,
      render: (text: any, record: any, index: number) => (
        <Form.Item
          style={{ margin: 0 }}
          initialValue={text}
          key={`groupPrice_${record.id}`}
          name={`groupPrice_${record.id}`}
          rules={[
            { required: true, message: `${intl.formatMessage({ id: 'marketingAbility.qingshuruhuodongjiage' })}` },
          ]}
        >
          <Input
            value={record.groupPrice}
            onChange={(e) => {
              _changeActivityPrice(record, e.target.value)
            }}
            addonBefore="¥"
            placeholder={intl.formatMessage({ id: 'marketingAbility.qingshurujine' })}
          />
        </Form.Item>
      ),
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.gerenxiangoushuliang' })}`,
      key: 'selfCount',
      dataIndex: 'selfCount',
      render: (text: any, record: any, index: number) => (
        <Form.Item
          style={{ margin: 0 }}
          initialValue={text}
          key={`selfCount_${record.id}`}
          name={`selfCount_${record.id}`}
          rules={[{ required: true, message: `${intl.formatMessage({ id: 'marketingAbility.qingshurushuliang' })}` }]}
        >
          <Input
            value={record.selfCount}
            onChange={(e) => {
              _changeSelfCount(record, e.target.value)
            }}
            placeholder={intl.formatMessage({ id: 'marketingAbility.qingshurushuliang' })}
          />
        </Form.Item>
      ),
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.huodongxiangouzongshuliang' })}`,
      key: 'total',
      dataIndex: 'total',
      render: (text: any, record: any, index: number) => (
        <Form.Item
          style={{ margin: 0 }}
          initialValue={text}
          key={`total_${record.id}`}
          name={`total_${record.id}`}
          rules={[{ required: true, message: `${intl.formatMessage({ id: 'marketingAbility.qingshurushuliang' })}` }]}
        >
          <Input
            value={record.total}
            onChange={(e) => {
              _changeTotal(record, e.target.value)
            }}
            placeholder={intl.formatMessage({ id: 'marketingAbility.qingshurushuliang' })}
          />
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
