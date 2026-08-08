import React from 'react'
import { Tooltip, Image, Form, Input, Popconfirm } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
const columns_3 = ({ dataSource, setDataSource, handleDelete, form }) => {
  /** 输入  */
  const handleInputChange = (e, name, index) => {
    const { value } = e.target
    const params = [...dataSource]
    const newData = params.map((_item, _i) => {
      if (_i === index) {
        if (name === 'discount') {
          return {
            ..._item,
            [name]: Number(value),
            activityPrice: (Number(_item.price) * Number(value)) / 100,
          }
        } else {
          return {
            ..._item,
            [name]: Number(value),
          }
        }
      }
      return _item
    })
    form.setFieldsValue({
      productList: newData,
    })
    setDataSource(newData)
  }
  return [
    {
      title: 'skuId',
      key: 'skuId',
      dataIndex: 'skuId',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.shangpintupian' }),
      key: 'productImgUrl',
      dataIndex: 'productImgUrl',
      render: (text) => <Image width={32} height={32} src={text} />,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.shangpinmingcheng' }),
      key: 'productName',
      dataIndex: 'productName',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinlei' }),
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinpai' }),
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.danwei' }),
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.shangpinjiage' }),
      key: 'price',
      dataIndex: 'price',
      render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
    },
    {
      title: (
        <Tooltip placement="top" title={intl.formatMessage({ id: 'transaction_components.zhekouweishangpinjiagede' })}>
          {intl.formatMessage({ id: 'transaction_components.zhekou' })} <QuestionCircleOutlined />
        </Tooltip>
      ),
      key: 'discount',
      dataIndex: 'discount',
      render: (_text, _record, index) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          initialValue={_text}
          name={`discount_${index}`}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'transaction_components.qingshuruzhekou' }),
            },
            () => ({
              validator: (_rule, value) => {
                const pattern = /^(\-)?\d+(\.\d{1,3})?$/
                if (!pattern.test(value)) {
                  return Promise.reject(new Error(intl.formatMessage({ id: 'transaction_components.zhekoubixudayu0' })))
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input
            style={{ width: '112px' }}
            addonAfter={intl.formatMessage({ id: 'transaction_components.zhe' })}
            onPressEnter={(e) => handleInputChange(e, 'discount', index)}
            onBlur={(e) => handleInputChange(e, 'discount', index)}
          />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.huodongjiage' }),
      key: 'activityPrice',
      dataIndex: 'activityPrice',
      render: (text) =>
        text
          ? `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`
          : `${intl.formatMessage({ id: 'common.money' })}0`,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.gerenxiangoushuliang' }),
      key: 'restrictNum',
      dataIndex: 'restrictNum',
      render: (_text, _record, index) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          initialValue={_text}
          name={`restrictNum_${index}`}
          dependencies={[`restrictTotalNum_${index}`]}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'transaction_components.qingshurugerenxiangoushu' }),
            },
            ({ getFieldValue }) => ({
              validator: (_rule, value) => {
                const pattern = /^(\-)?\d+(\.\d{1,3})?$/
                const restrictTotalNum = getFieldValue(`restrictTotalNum_${index}`)
                if (!pattern.test(value) || !(Number(value) < Number(restrictTotalNum))) {
                  return Promise.reject(
                    new Error(intl.formatMessage({ id: 'transaction_components.bixudayu0qiexiaoyu1' })),
                  )
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input
            style={{ width: '112px' }}
            onPressEnter={(e) => handleInputChange(e, 'restrictNum', index)}
            onBlur={(e) => handleInputChange(e, 'restrictNum', index)}
          />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.huodongxiangouzongshuliang' }),
      key: 'restrictTotalNum',
      dataIndex: 'restrictTotalNum',
      render: (_text, _record, index) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          initialValue={_text}
          name={`restrictTotalNum_${index}`}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'transaction_components.qingshuruhuodongxiangouzong' }),
            },
            ({ getFieldValue }) => ({
              validator: (_rule, value) => {
                const pattern = /^(\-)?\d+(\.\d{1,3})?$/
                const restrictNum = getFieldValue(`restrictNum_${index}`)
                if (!pattern.test(value) || !(Number(value) > Number(restrictNum))) {
                  return Promise.reject(
                    new Error(intl.formatMessage({ id: 'transaction_components.bixudayu0qiedayu' })),
                  )
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input
            style={{ width: '112px' }}
            onPressEnter={(e) => handleInputChange(e, 'restrictTotalNum', index)}
            onBlur={(e) => handleInputChange(e, 'restrictTotalNum', index)}
          />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.caozuo' }),
      key: 'operation',
      dataIndex: 'operation',
      render: (_text, _record) => (
        <Popconfirm
          title={intl.formatMessage({ id: 'transaction_components.shifoushanchu' })}
          onConfirm={() => handleDelete(_record.skuId)}
        >
          <a>{intl.formatMessage({ id: 'transaction_components.shanchu' })}</a>
        </Popconfirm>
      ),
    },
  ]
}
export default columns_3
