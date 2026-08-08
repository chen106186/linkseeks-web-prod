import React, { useEffect, useState, useMemo } from 'react'
import { Table, Radio, Button, Form, Input, Row, Col, DatePicker, Select, FormInstance, Space } from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'

import { Card } from '@linkseeks/ui'
import TableModel from './tableModel'

import AddGoodsDrawer from './modal/addGoodsDrawer'
import AddCouponsDrawer from './modal/addCouponsDrawer'
import GiveCouponDrawer from './modal/giveCouponDrawer'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

interface AddFormGoodsProps {
  currentRef?: any
  layoutId?: string
  layoutTitle?: string
  ruleType?: number
}

const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 24 },
  labelAlign: 'left',
}

const AddFormGoods: React.FC<AddFormGoodsProps> = (props: any) => {
  const { currentRef, layoutId, layoutTitle, ruleType } = props
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<any>([
    {
      goodsId: 1,
      goodsName: '111',
      category: '111',
      brand: '111',
      unit: '1111',
      price: '20',
      activityPrice: '',
      selfCount: '',
      total: '',
    },
  ])
  const [visible, setVisible] = useState<boolean>(false)
  const [couponVisible, setCouponVisible] = useState<boolean>(false)
  const [giveCouponVisible, setGiveCouponVisible] = useState<boolean>(false)

  const _deleteRow = (record: any) => {
    const _dataSource = [...dataSource]
    const _i = _dataSource.findIndex((item) => item.id === record.id)
    _dataSource.splice(_i, 1)
    setDataSource(_dataSource)
  }

  const columns = useMemo(() => {
    const _obj = {
      dataSource,
      setDataSource,
      deleteRow: _deleteRow,
    }
    console.log(TableModel[`type${ruleType}`]?.(_obj), 10086)
    return TableModel[`type${ruleType}`]?.(_obj)
  }, [ruleType, dataSource, setDataSource, _deleteRow])

  useEffect(() => {
    console.log(dataSource)
  }, [dataSource])

  const addTableRow = (list: any) => {
    const _dataSource = [...dataSource]
    _dataSource.push({})
    setDataSource(_dataSource)
  }

  return (
    <Card id={layoutId} title={layoutTitle}>
      <Form
        form={form}
        {...layout}
        onValuesChange={(changedValues, allValues) => {
          console.log(allValues)
        }}
        autoComplete="off"
      >
        <Space direction="vertical" style={{ display: 'flex' }}>
          {ruleType != 10 && (
            <Button
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={() => {
                setCouponVisible(true)
              }}
            >
              {intl.formatMessage({ id: 'marketingAbility.xuanzehuodongshangpin' })}
            </Button>
          )}
          <Table columns={columns} dataSource={dataSource} pagination={ruleType != 10 ? {} : false} />
          {ruleType === 10 && (
            <Button type="dashed" block icon={<PlusOutlined />}>
              {intl.formatMessage({ id: 'marketingAbility.tianjiaxinjiangxiang' })}
            </Button>
          )}
        </Space>
      </Form>
      <AddGoodsDrawer
        visible={visible}
        onConfirm={addTableRow}
        effects="name"
        onClose={() => {
          setVisible(false)
        }}
      />
      <AddCouponsDrawer
        visible={couponVisible}
        onClose={() => {
          setCouponVisible(false)
        }}
      />
      <GiveCouponDrawer
        visible={giveCouponVisible}
        onClose={() => {
          setGiveCouponVisible(false)
        }}
      />
    </Card>
  )
}

AddFormGoods.defaultProps = {
  layoutId: 'goodsLayout',
  layoutTitle: `${intl.formatMessage({ id: 'marketingAbility.huodongshangpin' })}`,
}

export default AddFormGoods
