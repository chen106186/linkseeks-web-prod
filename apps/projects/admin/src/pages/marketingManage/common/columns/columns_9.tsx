import React from 'react'
import { Tooltip, Typography } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import { formatTimeString } from '@/utils'

const levelList = {
  1: '一等奖',
  2: '二等奖',
  3: '二等奖',
  4: '四等奖',
  5: '五等奖',
  6: '六等奖',
}

const typeList = {
  1: '商品',
  2: '优惠卷',
  3: '现金',
  4: '积分',
  5: '谢谢参与',
}

const columns_9 = () => {
  return [
    {
      title: '奖项等级',
      key: 'level',
      dataIndex: 'level',
      width: 240,
      render: (_text) => <Typography.Text>{levelList[_text]}</Typography.Text>,
    },
    {
      title: '奖品类别',
      key: 'type',
      dataIndex: 'type',
      width: 240,
      render: (_text) => <Typography.Text>{typeList[_text]}</Typography.Text>,
    },
    {
      title: (
        <Tooltip
          placement="top"
          title="中奖概率为当前奖项等级的中奖概率，如设置一等奖的中奖概率为10%，则表示用户抽中一等奖的概率是10%"
        >
          中奖概率 <QuestionCircleOutlined />
        </Tooltip>
      ),
      key: 'probability',
      dataIndex: 'probability',
      width: 176,
      render: (_text) => <Typography.Text>{_text}&nbsp;%</Typography.Text>,
    },
    {
      title: '奖品',
      key: 'prize',
      dataIndex: 'prize',
      render: (_text, record) => (
        <>
          {record.type === 3 ? (
            <Typography.Text>{Number(_text).toFixed(2)}&nbsp;元</Typography.Text>
          ) : record.type === 4 ? (
            <Typography.Text>{_text}&nbsp;积分</Typography.Text>
          ) : record.type === 5 ? (
            '无'
          ) : record.type === 1 ? (
            !isEmpty(record.coupon) && (
              <Typography.Text>
                {record.coupon.id}/{record.coupon.typeName}/有效期：{formatTimeString(record.coupon.effectiveTimeStart)}
                至{formatTimeString(record.coupon.effectiveTimeEnd)}/适用商品：
                {record.coupon.suitableProduct?.productId}/{record.coupon.suitableProduct?.productName}
              </Typography.Text>
            )
          ) : (
            !isEmpty(record.coupon) && (
              <Typography.Text>
                {record.coupon.id}/{record.coupon.typeName}/￥{Number(record.coupon.useConditionMoney).toFixed(2)}
                /有效期：{formatTimeString(record.coupon.effectiveTimeStart)}至
                {formatTimeString(record.coupon.effectiveTimeEnd)}
              </Typography.Text>
            )
          )}
        </>
      ),
    },
  ]
}
export default columns_9
