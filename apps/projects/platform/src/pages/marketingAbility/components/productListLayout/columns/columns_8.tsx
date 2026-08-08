import { getIntl } from '@linkseeks/i18n'
import React from 'react'
import { Image, Form, Input, Popconfirm } from 'antd'
import { normalizeUnitPrice } from '@/pages/marketingAbility/merchantCoupon/utils'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
const columns_8 = ({ dataSource, setDataSource, handleDelete, form, current }) => {
  /** 输入  */
  const intl = getIntl()
  const handleInputChange = (e, name, index) => {
    const { value } = e.target
    const params = [...dataSource]
    params[index][name] = Number(value)
    form.setFieldsValue({
      productList: params,
    })
    setDataSource(params)
  }
  return [
    {
      title: 'skuId',
      key: 'skuId',
      dataIndex: 'skuId',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.shangpintupian' })}`,
      key: 'productImgUrl',
      dataIndex: 'productImgUrl',
      render: (text) => <Image width={32} height={32} src={text} />,
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.shangpinmingcheng' })}`,
      key: 'productName',
      dataIndex: 'productName',
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
      render: (text) => {
        if (typeof text === 'number') {
          return `${translate('web.common.currencySymbol')}${text}`
        } else {
          const unitPrice = normalizeUnitPrice(text)
          const start = unitPrice[0]?.price
          const end = unitPrice[unitPrice.length - 1]?.price
          return start !== end
            ? `${translate('web.common.currencySymbol')}${start}~${end}`
            : `${translate('web.common.currencySymbol')}${start}`
        }
      },
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.yushoujiage' })}`,
      key: 'preSelPrice',
      dataIndex: 'preSelPrice',
      render: (_text, _record, index) => {
        const _index = Number((current - 1) * 10 + index)
        return (
          <Form.Item
            style={{ marginBottom: 0 }}
            initialValue={_text}
            validateFirst
            name={`preSelPrice_${_index}`}
            rules={[
              {
                required: true,
                message: `${intl.formatMessage({ id: 'marketingAbility.qingshuruyushoujiage' })}`,
              },
              ({}) => ({
                validator: (_rule, value) => {
                  const pattern = /(^[1-9](\d+)?(\.\d{1,4})?$)|(^\d\.\d{1,4}$)/
                  if (!pattern.test(value) || Number(value) >= Number(_record.price)) {
                    return Promise.reject(
                      new Error(`${intl.formatMessage({ id: 'marketingAbility.bixudayu0qiexiaoyushangpinjiage' })}`),
                    )
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input
              maxLength={10}
              style={{ width: '112px' }}
              addonBefore={intl.formatMessage({ id: 'common.money' })}
              onPressEnter={(e) => handleInputChange(e, 'preSelPrice', _index)}
              onBlur={(e) => handleInputChange(e, 'preSelPrice', _index)}
            />
          </Form.Item>
        )
      },
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.danweidingjin' })}`,
      key: 'activityPrice',
      dataIndex: 'activityPrice',
      render: (_text, _record, index) => {
        const _index = Number((current - 1) * 10 + index)
        return (
          <Form.Item
            style={{ marginBottom: 0 }}
            initialValue={_text}
            dependencies={[`preSelPrice_${_index}`]}
            name={`activityPrice_${_index}`}
            rules={[
              {
                required: true,
                message: `${intl.formatMessage({ id: 'marketingAbility.qingshurudanweidingjin' })}`,
              },
              ({ getFieldValue }) => ({
                validator: (_rule, value) => {
                  const pattern = /(^[1-9](\d+)?(\.\d{1,4})?$)|(^\d\.\d{1,4}$)/
                  const preSelPrice = getFieldValue(`preSelPrice_${_index}`)
                  if (!pattern.test(value) || !(Number(value) < Number(preSelPrice))) {
                    return Promise.reject(
                      new Error(`${intl.formatMessage({ id: 'marketingAbility.bixudayu0qiexiaoyuyushoujiage' })}`),
                    )
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input
              maxLength={10}
              style={{ width: '112px' }}
              addonBefore={intl.formatMessage({ id: 'common.money' })}
              onPressEnter={(e) => handleInputChange(e, 'activityPrice', _index)}
              onBlur={(e) => handleInputChange(e, 'activityPrice', _index)}
            />
          </Form.Item>
        )
      },
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.dingjindikoudanjia' })}`,
      key: 'deductionPrice',
      dataIndex: 'deductionPrice',
      render: (_text, _record, index) => {
        const _index = Number((current - 1) * 10 + index)
        return (
          <Form.Item
            style={{ marginBottom: 0 }}
            initialValue={_text}
            dependencies={[`preSelPrice_${_index}`]}
            name={`deductionPrice_${_index}`}
            rules={[
              {
                required: true,
                message: `${intl.formatMessage({ id: 'marketingAbility.qingshurudingjindikoudanjia' })}`,
              },
              ({ getFieldValue }) => ({
                validator: (_rule, value) => {
                  const pattern = /(^[1-9](\d+)?(\.\d{1,4})?$)|(^\d\.\d{1,4}$)/
                  const preSelPrice = getFieldValue(`preSelPrice_${_index}`)
                  if (!pattern.test(value) || !(Number(value) < Number(preSelPrice))) {
                    return Promise.reject(
                      new Error(`${intl.formatMessage({ id: 'marketingAbility.bixudayu0qiexiaoyuyushoujiage' })}`),
                    )
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input
              maxLength={10}
              style={{ width: '112px' }}
              addonBefore={intl.formatMessage({ id: 'common.money' })}
              onPressEnter={(e) => handleInputChange(e, 'deductionPrice', _index)}
              onBlur={(e) => handleInputChange(e, 'deductionPrice', _index)}
            />
          </Form.Item>
        )
      },
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.gerenxiangoushuliang' })}`,
      key: 'restrictNum',
      dataIndex: 'restrictNum',
      render: (_text, _record, index) => {
        const _index = Number((current - 1) * 10 + index)
        return (
          <Form.Item
            style={{ marginBottom: 0 }}
            initialValue={_text}
            validateFirst
            name={`restrictNum_${_index}`}
            dependencies={[`restrictTotalNum_${_index}`]}
            rules={[
              {
                required: true,
                message: `${intl.formatMessage({ id: 'marketingAbility.qingshurugerenxiangoushuliang' })}`,
              },
              ({ getFieldValue }) => ({
                validator: (_rule, value) => {
                  const pattern = /(^[1-9](\d+)?(\.\d{1,3})?$)|(^\d\.\d{1,3}$)/
                  const restrictTotalNum = getFieldValue(`restrictTotalNum_${_index}`)
                  if (!pattern.test(value) || !(Number(value) <= Number(restrictTotalNum))) {
                    return Promise.reject(new Error(`必须大于0且小于等于活动限购数量`))
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input
              maxLength={10}
              style={{ width: '112px' }}
              onPressEnter={(e) => handleInputChange(e, 'restrictNum', _index)}
              onBlur={(e) => handleInputChange(e, 'restrictNum', _index)}
            />
          </Form.Item>
        )
      },
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.huodongxiangouzongshuliang' })}`,
      key: 'restrictTotalNum',
      dataIndex: 'restrictTotalNum',
      render: (_text, _record, index) => {
        const _index = Number((current - 1) * 10 + index)
        return (
          <Form.Item
            style={{ marginBottom: 0 }}
            initialValue={_text}
            validateFirst
            name={`restrictTotalNum_${_index}`}
            rules={[
              {
                required: true,
                message: `${intl.formatMessage({ id: 'marketingAbility.qingshuruhuodongxiangouzongshuliang' })}`,
              },
              ({ getFieldValue }) => ({
                validator: (_rule, value) => {
                  const pattern = /(^[1-9](\d+)?(\.\d{1,3})?$)|(^\d\.\d{1,3}$)/
                  const restrictNum = getFieldValue(`restrictNum_${_index}`)
                  if (!pattern.test(value) || !(Number(value) >= Number(restrictNum))) {
                    return Promise.reject(new Error(`必须大于0且大于等于个人限购数量`))
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input
              maxLength={10}
              style={{ width: '112px' }}
              onPressEnter={(e) => handleInputChange(e, 'restrictTotalNum', _index)}
              onBlur={(e) => handleInputChange(e, 'restrictTotalNum', _index)}
            />
          </Form.Item>
        )
      },
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.caozuo' })}`,
      key: 'operation',
      dataIndex: 'operation',
      render: (_text, _record) => (
        <Popconfirm
          title={intl.formatMessage({ id: 'marketingAbility.shifoushanchu?' })}
          onConfirm={() => handleDelete(_record.skuId)}
        >
          <a>{intl.formatMessage({ id: 'marketingAbility.shanchu' })}</a>
        </Popconfirm>
      ),
    },
  ]
}
export default columns_8
