import React, { useEffect, useState } from 'react'
import type { FormInstance } from 'antd'
import { Form, Table, Tooltip, Button, Select, Input, Popconfirm, Typography } from 'antd'
import type { ColumnType } from 'antd/lib/table'
import { EditOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Card as CardLayout } from '@linkseeks/ui'
import { isEmpty } from 'lodash'
import CouponsLayout from '../../../../components/couponsLayout'
import { formatTimeString } from '@/utils'
import {
  getMarketingPlatformActivityDetailGoodsCouponSelect,
  getMarketingPlatformActivityDetailPrizeCouponSelect,
} from '@apps/apis'

const levelList = [
  { value: 1, name: '一等奖' },
  { value: 2, name: '二等奖' },
  { value: 3, name: '三等奖' },
  { value: 4, name: '四等奖' },
  { value: 5, name: '五等奖' },
]

const typeList = [
  { value: 1, name: '商品' },
  { value: 2, name: '优惠卷' },
  { value: 3, name: '现金' },
  { value: 4, name: '积分' },
  { value: 5, name: '谢谢参与' },
]

interface PrizeListProps {
  form?: FormInstance
  /** 回显数据 */
  prizeList?: any[]
  /** 活动类型 */
  focus$?: number
}

const PrizeListLayout: React.FC<PrizeListProps> = (props: any) => {
  const { form, prizeList, focus$ } = props
  const [dataSource, setDataSource] = useState<any[]>([])
  const [levelIds, setLevelIds] = useState<number[]>([])
  const [tableModalVisible, setTableModalVisible] = useState<boolean>(false)
  const [_type, setType] = useState<number>()
  const [_index_, setIndex] = useState<number>()
  const [coupon, setCoupon] = useState<any>({})

  const toggle = (flag: boolean) => {
    if (!flag) {
      setCoupon({})
    }
    setTableModalVisible(flag)
  }

  /** 更新form回显 */
  const handleSetFieldsValue = (prams: any[]) => {
    prams.forEach((_item, index) => {
      form.setFieldsValue({
        [`level_${index}`]: _item.level,
        [`type_${index}`]: _item.type,
        [`probability_${index}`]: _item.probability,
        [`prize_${index}`]: _item.prize,
      })
    })
  }

  /** 选择奖项等级 */
  const handleChangeLevel = (e, _index) => {
    const fields = [...dataSource]
    const ids = [...levelIds]
    ids[_index] = e
    setLevelIds(ids)
    const newData = fields.map((_item, _i) => {
      if (_i === _index) {
        return {
          ..._item,
          level: e,
        }
      }
      return _item
    })
    setDataSource(newData)
  }

  /** 选择奖品类别 */
  const handleChangeType = (e, _index) => {
    const fields = [...dataSource]
    const newData = fields.map((_item, _i) => {
      if (_i === _index) {
        return {
          ..._item,
          type: e,
        }
      }
      return _item
    })
    setDataSource(newData)
  }

  /** 输入中奖概率 */
  const handleChangeProbability = (e, _index) => {
    const { value } = e.target
    const fields = [...dataSource]
    const newData = fields.map((_item, _i) => {
      if (_i === _index) {
        return {
          ..._item,
          probability: Number(value),
        }
      }
      return _item
    })
    setDataSource(newData)
  }

  /** 奖项 */
  const handleChangePrize = (e, _index) => {
    const { value } = e.target
    const fields = [...dataSource]
    const newData = fields.map((_item, _i) => {
      if (_i === _index) {
        return {
          ..._item,
          prize: value,
        }
      }
      return _item
    })
    setDataSource(newData)
  }

  /** 删除一条奖项 */
  const handleDelete = (_index, _record) => {
    const fields = [...dataSource]
    const ids = [...levelIds]
    fields.splice(_index, 1)
    handleSetFieldsValue(fields)
    if (_record.level) {
      setLevelIds(ids.filter((_item) => _item !== _record.level))
    }
    setDataSource(fields)
  }

  /** 选择优惠券 */
  const handleClickButton = (value, _index, _record) => {
    setCoupon(_record)
    setType(value)
    setIndex(_index)
    toggle(true)
  }

  const columns: ColumnType<any>[] = [
    {
      title: '奖项等级',
      key: 'level',
      dataIndex: 'level',
      width: 240,
      render: (_text, _record, _index) => (
        <Form.Item
          style={{ margin: 0 }}
          name={`level_${_index}`}
          rules={[{ required: true, message: '请选择奖项等级' }]}
        >
          <Select onChange={(e) => handleChangeLevel(e, _index)}>
            {levelList.map((_item) => (
              <Select.Option disabled={levelIds.includes(_item.value)} key={_item.value} value={_item.value}>
                {_item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: '奖品类别',
      key: 'type',
      dataIndex: 'type',
      width: 240,
      render: (_text, _record, _index) => (
        <Form.Item
          style={{ margin: 0 }}
          name={`type_${_index}`}
          rules={[{ required: true, message: '请选择奖品类别' }]}
        >
          <Select onChange={(e) => handleChangeType(e, _index)}>
            {typeList.map((_item) => (
              <Select.Option key={_item.value} value={_item.value}>
                {_item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
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
      render: (_text, _record, _index) => (
        <Form.Item
          style={{ margin: 0 }}
          name={`probability_${_index}`}
          rules={[
            {
              required: true,
              validator: (_rule, value) => {
                const pattern = /^-?[1-9]\d*(\.\d{1,2})?$/
                if (!value) {
                  return Promise.reject(new Error('请输入中奖概率'))
                }
                if (!pattern.test(value)) {
                  return Promise.reject(new Error(`中奖概率必须大于0最多保留2位小数`))
                }
                if (Number(value) > 100) {
                  return Promise.reject(new Error(`中奖概率必须小于或等于100`))
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input style={{ width: 176 }} addonAfter="%" onChange={(e) => handleChangeProbability(e, _index)} />
        </Form.Item>
      ),
    },
    {
      title: '奖品',
      key: 'prize',
      dataIndex: 'prize',
      width: 350,
      render: (_text, _record, _index) => (
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues[`type_${_index}`] !== currentValues[`type_${_index}`]}
        >
          {({ getFieldValue }) =>
            getFieldValue([`type_${_index}`]) === 1 ? (
              <Form.Item
                style={{ margin: 0 }}
                name={`prize_${_index}`}
                rules={[{ required: true, message: '请输选择商品' }]}
              >
                {!isEmpty(_record.coupon) && (
                  <Typography.Text>
                    {_record.coupon.id}/{_record.coupon.typeName}/有效期：
                    {formatTimeString(_record.coupon.effectiveTimeStart)}至
                    {formatTimeString(_record.coupon.effectiveTimeEnd)}/适用商品：
                    {_record.coupon.suitableProduct?.productId}/{_record.coupon.suitableProduct?.productName}
                  </Typography.Text>
                )}
                <Button
                  icon={<EditOutlined />}
                  type="text"
                  onClick={() => handleClickButton(getFieldValue([`type_${_index}`]), _index, _record)}
                >
                  {!_record.coupon && '选择0元购买抵扣券'}
                </Button>
              </Form.Item>
            ) : getFieldValue([`type_${_index}`]) === 2 ? (
              <Form.Item
                style={{ margin: 0 }}
                name={`prize_${_index}`}
                rules={[{ required: true, message: '请输选择优惠券' }]}
              >
                {!isEmpty(_record.coupon) && (
                  <Typography.Text>
                    {_record.coupon.id}/{_record.coupon.typeName}/￥
                    {Number(_record.coupon.useConditionMoney).toFixed(2)}/有效期：
                    {formatTimeString(_record.coupon.effectiveTimeStart)}至
                    {formatTimeString(_record.coupon.effectiveTimeEnd)}
                  </Typography.Text>
                )}
                <Button
                  icon={<EditOutlined />}
                  type="text"
                  onClick={() => handleClickButton(getFieldValue([`type_${_index}`]), _index, _record)}
                >
                  {!_record.coupon && '选择优惠券'}
                </Button>
              </Form.Item>
            ) : getFieldValue([`type_${_index}`]) === 3 ? (
              <Form.Item
                style={{ margin: 0 }}
                name={`prize_${_index}`}
                rules={[
                  {
                    required: true,
                    validator: (_rule, value) => {
                      const pattern = /^-?[1-9]\d*(\.\d{1,2})?$/
                      if (!value) {
                        return Promise.reject(new Error('请输入金额'))
                      }
                      if (!pattern.test(value)) {
                        return Promise.reject(new Error(`金额必须大于0最多保留2位小数`))
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input addonAfter="元" onChange={(e) => handleChangePrize(e, _index)} />
              </Form.Item>
            ) : getFieldValue([`type_${_index}`]) === 4 ? (
              <Form.Item
                style={{ margin: 0 }}
                name={`prize_${_index}`}
                rules={[
                  {
                    required: true,
                    validator: (_rule, value) => {
                      const pattern = /^-?[1-9]\d*$/
                      if (!value) {
                        return Promise.reject(new Error('请输入积分'))
                      }
                      if (!pattern.test(value)) {
                        return Promise.reject(new Error(`积分必须大于0`))
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input addonAfter="积分" onChange={(e) => handleChangePrize(e, _index)} />
              </Form.Item>
            ) : (
              '无'
            )
          }
        </Form.Item>
      ),
    },
    {
      title: '操作',
      key: 'level',
      dataIndex: 'level',
      width: 128,
      render: (_text, _record, _index) => (
        <Popconfirm title="是否删除?" onConfirm={() => handleDelete(_index, _record)}>
          <Button type="link">删除</Button>
        </Popconfirm>
      ),
    },
  ]

  /** 添加新奖项 */
  const handleApped = () => {
    const field_Obj = {
      level: null,
      type: null,
      probability: null,
      prize: null,
    }
    const field = [...dataSource]
    const newData = [...field, field_Obj]
    handleSetFieldsValue(newData)
    setDataSource(newData)
  }

  useEffect(() => {
    form.setFieldsValue({
      activityDefined: {
        prizeList: dataSource,
      },
    })
  }, [dataSource])

  useEffect(() => {
    if (!isEmpty(prizeList)) {
      handleSetFieldsValue(prizeList)
      setLevelIds(
        prizeList.map((_item) => {
          return _item.level
        }),
      )
      setDataSource(prizeList)
    }
  }, [prizeList])

  const handleCouponSubmit = (selectRowRecord: any) => {
    const fields = [...dataSource]
    const prize = selectRowRecord[0].id
    const newData = fields.map((_item, _i) => {
      if (_i === _index_) {
        return {
          ..._item,
          prize,
          coupon: selectRowRecord[0],
        }
      }
      return _item
    })
    handleSetFieldsValue(newData)
    setDataSource(newData)
    toggle(false)
  }

  useEffect(() => {
    if (focus$) {
      setLevelIds([])
      setDataSource([])
    }
  }, [focus$])

  return (
    <CardLayout id="activityProductLayout" title="奖品设置">
      <Form.Item name={['activityDefined', 'prizeList']} rules={[{ required: true, message: '请选择奖品设置！' }]}>
        <Table
          rowKey={(_record, _index) => `table_${_index! + 1}`}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Form.Item>
      <Button style={{ marginBottom: '16px' }} block type="dashed" icon={<PlusOutlined />} onClick={handleApped}>
        添加新奖项
      </Button>
      {/* 选择优惠券 */}
      <CouponsLayout
        mode="radio"
        fieldApi={
          _type === 1
            ? getMarketingPlatformActivityDetailPrizeCouponSelect
            : getMarketingPlatformActivityDetailGoodsCouponSelect
        }
        visible={tableModalVisible}
        onClose={() => toggle(false)}
        onSubmit={handleCouponSubmit}
        value={coupon}
      />
    </CardLayout>
  )
}

export default PrizeListLayout
