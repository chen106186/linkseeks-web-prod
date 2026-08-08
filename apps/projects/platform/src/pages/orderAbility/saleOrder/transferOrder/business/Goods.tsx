import React, { useState } from 'react'
import { Card, Table, Modal, Button, Form, Select, Input, Tag } from 'antd'
import { TransferOrderCloums, TransferOrderGoodsCloums } from '../types/table-props'
import AutoCancelModel from '../components/AutoCancelModel'

const FormItem = Form.Item

function GoodsTable() {
  const [showModel, setShowModel] = useState(0)

  return (
    <Card
      id="OrderInfo"
      title="订单商品"
      className="mt-10"
      extra={
        <div className="flex flex-row order_total space-x-10">
          <div className="order_total">
            <div className="title text-gray-400">合计金额</div>
            <div className="total">￥1200.00</div>
          </div>

          <div className="order_total">
            <div className="title">合计金额</div>
            <div className="total">￥1200.00</div>
          </div>

          <div className="order_total">
            <div className="title">合计金额</div>
            <div className="total">￥1200.00</div>
          </div>

          <div className="order_total">
            <div className="title">合计金额</div>
            <div className="total">￥1200.00</div>
          </div>
        </div>
      }
    >
      <Table
        columns={TransferOrderCloums}
        expandable={{
          expandedRowRender: (record) => {
            return <Table columns={TransferOrderGoodsCloums} />
          },
          rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
      />

      <Button
        onClick={() => {
          console.log(showModel)
          setShowModel(showModel + 2)
        }}
      >
        转单功能封装
      </Button>

      <AutoCancelModel isShow={showModel} title="转单">
        <Form layout="vertical">
          <FormItem label="上游供应链" required>
            <Select>
              <Select.Option value="1">上游供应会员名称S1</Select.Option>
            </Select>
          </FormItem>

          <FormItem label="上商品" required>
            <Select>
              <Select.Option value="1">1110/进口头层黄牛荔枝纹</Select.Option>
            </Select>
          </FormItem>

          <FormItem label="上游商品库存">1,000</FormItem>

          <FormItem label="转单数量" required>
            <Input />
          </FormItem>

          <FormItem label="转单单价" required>
            <Input />
          </FormItem>

          <FormItem label="转单金额" required>
            <Input />
          </FormItem>

          <FormItem label="转单金额">
            <Tag color={'yellow'}>转单金额</Tag>
          </FormItem>
        </Form>
      </AutoCancelModel>
    </Card>
  )
}

export default GoodsTable
