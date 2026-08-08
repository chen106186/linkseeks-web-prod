import { Card } from 'antd'
import React from 'react'

function PayInfo() {
  return (
    <Card id="PayInfo" title="支付信息" className="mt-10">
      <div className="payinfo grid grid-cols-4 gap-4">
        <div className="payinfo_item relative border-dashed leading-9 border-gray-300 p-8">
          <div className="text-gray-400">支付比例</div>
          <div className="proportion text-6xl font-medium mt-2 mb-2">30%</div>
          <div className="price font-medium text-lg">￥48,000.00</div>

          <div className="list_item flex">
            <div className="flex-4 flex-grow-0 text-gray-400">支付环节：</div>
            <div className="flex-auto value font-medium">订单确认后支付</div>
          </div>

          <div className="list_item flex">
            <div className="flex-4 flex-grow-0 text-gray-400">支付方式：</div>
            <div className="flex-auto value font-medium">线上支付</div>
          </div>

          <div className="list_item flex">
            <div className="flex-4 flex-grow-0 text-gray-400">支付渠道：</div>
            <div className="flex-auto value font-medium">支付宝</div>
          </div>

          <div className="absolute top-0 right-0 bg-green-100 text-green-700 p-1">确认到账</div>
        </div>
      </div>
    </Card>
  )
}

export default PayInfo
