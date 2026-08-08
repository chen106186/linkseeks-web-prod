import React, { useEffect, useState } from 'react'
import { Form, Radio, Button, Table, message, Space, Typography, DatePicker, InputNumber, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import SelectProduct from './selectProduct'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { getIntl } from '@linkseeks/i18n'

const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 24 },
  labelAlign: 'left',
}

interface Materialprops {
  currentRef: any
  fetchdata: { [key: string]: any }
  onBadge?: Function
}
const intl = getIntl()
const Material: React.FC<Materialprops> = (props: any) => {
  const { currentRef, fetchdata, onBadge } = props
  const [form] = Form.useForm()
  const columns: ColumnType<Object>[] = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.type' }),
      key: 'number',
      dataIndex: 'number',
      render: (text: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Typography.Text>{text}</Typography.Text>
          <Typography.Text type="secondary">{record.name}</Typography.Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.goodsGroup' }),
      key: 'goodsGroup',
      dataIndex: 'goodsGroup',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.nameCode' }),
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.brand' }),
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.unitName' }),
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.needCount' }),
      key: 'needCount',
      dataIndex: 'needCount',
      render: (text: any, _rcod: any, index: number) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          name={`needCount${index}`}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'detail.purchase.message13' }),
            },
            {
              pattern: /^\d+(\.\d{1,3})?$/,
              message: intl.formatMessage({ id: 'detail.purchase.message14' }),
            },
          ]}
        >
          <InputNumber min={1} onChange={(val) => handleNeedCount(val, index)} />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.costPrice' }),
      key: 'costPrice',
      dataIndex: 'costPrice',
      render: (text: any) => (
        <Typography.Text>
          {text
            ? `${intl.formatMessage({ id: 'common.money' })}${text.toFixed(2)}`
            : `${intl.formatMessage({ id: 'common.money' })}0`}
        </Typography.Text>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.needPrice' }),
      key: 'needPrice',
      dataIndex: 'needPrice',
      render: (text: any) => (
        <Typography.Text>
          {text
            ? `${intl.formatMessage({ id: 'common.money' })}${text.toFixed(2)}`
            : `${intl.formatMessage({ id: 'common.money' })}0`}
        </Typography.Text>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.arriveTime' }),
      key: 'arriveTime',
      dataIndex: 'arriveTime',
      render: (text: any, _rcod: any, index: number) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          name={`arriveTime${index}`}
          rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message15' }) }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder' })}
            format="YYYY-MM-DD"
            disabledDate={disabledDate}
            onChange={(val) => handleArriveTime(val, index)}
          />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.option' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (_text: any, _record: any, index: number) => (
        <Popconfirm
          title={intl.formatMessage({ id: 'detail.purchase.placeholder1' })}
          onConfirm={() => handleRemove(index)}
          okText={intl.formatMessage({ id: 'detail.purchase.okText' })}
          cancelText={intl.formatMessage({ id: 'detail.purchase.cancelText' })}
        >
          <Button type="link">{intl.formatMessage({ id: 'detail.purchase.detele' })}</Button>
        </Popconfirm>
      ),
    },
  ]
  const [visible, setVisible] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<Array<any>>([])

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day')
  }

  const handleArriveTime = (val, index) => {
    const data = [...dataSource]
    if (val) {
      console.log(val)
      data[index].arriveTime = val.format('x')
    } else {
      data[index].arriveTime = undefined
    }
    setDataSource(data)
  }

  const handleConfirm = (e: any) => {
    if (isEmpty(e.selectRow)) {
      message.warning(intl.formatMessage({ id: 'detail.purchase.message17' }))
      return
    }
    console.log(e, 10086)
    setDataSource(
      e.selectRow.map((item: any) => {
        return {
          productId: item.id,
          number: item.code,
          name: item.name,
          goodsGroup: item.materialGroup?.name,
          model: item.type,
          category: !isEmpty(item.customerCategory) ? item.customerCategory.name : null,
          brand: !isEmpty(item.brand) ? item.brand.name : null,
          unit: item.unitName,
          needCount: item.needCount ? item.needCount : null,
          costPrice: item.costPrice,
          needPrice: item.needPrice ? item.needPrice : null,
          arriveTime: item.arriveTime ? item.arriveTime : null,
        }
      }),
    )
    setVisible(false)
  }

  const handleNeedCount = (val, index) => {
    const data = [...dataSource]
    data[index].needCount = val
    data[index].needPrice = Number(val) * Number(data[index].costPrice)
    setDataSource(data)
  }

  const handleRemove = (index: number) => {
    const data = [...dataSource]
    data.splice(index, 1)
    message.success(intl.formatMessage({ id: 'detail.purchase.message16' }))
    form.resetFields()
    data.forEach((item, index) => {
      console.log(moment(Number(item.arriveTime)))
      form.setFieldsValue({
        [`needCount${index}`]: item.needCount ? item.needCount : undefined,
        [`arriveTime${index}`]: item.arriveTime ? moment(Number(item.arriveTime)) : undefined,
      })
    })
    setDataSource(data)
  }

  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          form
            .validateFields()
            .then((_res) => {
              resolve({
                state: true,
                name: 'material',
                data: {
                  addType: _res.addType,
                  details: dataSource,
                },
              })
              onBadge(0, 1)
            })
            .catch((error) => {
              if (error && error.errorFields) {
                onBadge(error.errorFields.length, 1)
              }
            })
        }),
    }
  })

  useEffect(() => {
    /**编辑回显数据 */
    if (!isEmpty(fetchdata.details)) {
      const data = [...fetchdata.details]
      form.resetFields()
      data.forEach((item, index) => {
        form.setFieldsValue({
          [`needCount${index}`]: item.needCount ? item.needCount : undefined,
          [`arriveTime${index}`]: item.arriveTime ? moment(item.arriveTime) : undefined,
        })
      })
      setDataSource([...data])
    }
  }, [fetchdata.details])

  return (
    <Form {...layout} form={form}>
      <Form.Item
        label={intl.formatMessage({ id: 'detail.purchase.modalTitle3' })}
        name="addType"
        rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message12' }) }]}
        initialValue={1}
      >
        <Radio.Group>
          <Radio value={1}>{intl.formatMessage({ id: 'detail.purchase.modalTitle27' })}</Radio>
          {/* <Radio value={2}>导入计划采购物料</Radio> */}
        </Radio.Group>
      </Form.Item>
      <Button
        type="dashed"
        block
        style={{
          marginBottom: '24px',
        }}
        onClick={() => setVisible(true)}
      >
        <PlusOutlined />
        {intl.formatMessage({ id: 'detail.purchase.added' })}
      </Button>
      <Table rowKey="id" columns={columns} dataSource={dataSource} pagination={false} />
      {/* 选择货品 */}
      <SelectProduct
        visible={visible}
        onclose={() => setVisible(false)}
        confirm={handleConfirm}
        rowCtlData={dataSource}
      />
    </Form>
  )
}
export default Material
