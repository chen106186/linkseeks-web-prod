import React, { useEffect, useState } from 'react'
import { Form, Table, Tooltip, Button, Select, Input, Popconfirm, Typography, FormInstance } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { EditOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Card as CardLayout } from '@linkseeks/ui'
import { isEmpty } from 'lodash'
import CouponsLayout from '../couponsLayout'
import { formatTimeString } from '@/utils'
import {
  getMarketingMerchantActivityDetailGoodsCouponSelect,
  getMarketingMerchantActivityDetailPrizeCouponSelect,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const levelList = [
  { value: 1, name: `${intl.formatMessage({ id: 'selfManagement.theFirstPrize' })}` },
  { value: 2, name: `${intl.formatMessage({ id: 'selfManagement.theSecondPrize' })}` },
  { value: 3, name: `${intl.formatMessage({ id: 'selfManagement.theThirdPrize' })}` },
  { value: 4, name: `${intl.formatMessage({ id: 'selfManagement.zhongWanxie' })}` },
  { value: 5, name: `${intl.formatMessage({ id: 'selfManagement.fiveAward' })}` },
]

const typeList = [
  { value: 1, name: `${intl.formatMessage({ id: 'selfManagement.goods' })}` },
  { value: 2, name: `${intl.formatMessage({ id: 'selfManagement.coupons' })}` },
  { value: 3, name: `${intl.formatMessage({ id: 'selfManagement.cash' })}` },
  { value: 4, name: `${intl.formatMessage({ id: 'selfManagement.integral' })}` },
  { value: 5, name: `${intl.formatMessage({ id: 'selfManagement.thankYouForYourParticipation' })}` },
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
      title: `${intl.formatMessage({ id: 'selfManagement.levelOfAward' })}`,
      key: 'level',
      dataIndex: 'level',
      width: 240,
      render: (_text, _record, _index) => (
        <Form.Item
          style={{ margin: 0 }}
          name={`level_${_index}`}
          rules={[{ required: true, message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectAPrize' })}` }]}
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
      title: `${intl.formatMessage({ id: 'selfManagement.awardCategories' })}`,
      key: 'type',
      dataIndex: 'type',
      width: 240,
      render: (_text, _record, _index) => (
        <Form.Item
          style={{ margin: 0 }}
          name={`type_${_index}`}
          rules={[
            { required: true, message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectAPrizeCategories' })}` },
          ]}
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
        <Tooltip placement="top" title={intl.formatMessage({ id: 'selfManagement.WinningProbability' })}>
          {intl.formatMessage({ id: 'selfManagement.theOdds' })}
          <QuestionCircleOutlined />
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
                  return Promise.reject(new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseEnterTheOdds' })}`))
                }
                if (!pattern.test(value)) {
                  return Promise.reject(
                    new Error(`${intl.formatMessage({ id: 'selfManagement.WinningProbability02' })}`),
                  )
                }
                if (Number(value) > 100) {
                  return Promise.reject(
                    new Error(`${intl.formatMessage({ id: 'selfManagement.WinningProbabilit100' })}`),
                  )
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
      title: `${intl.formatMessage({ id: 'selfManagement.thePrize' })}`,
      key: 'prize',
      dataIndex: 'prize',
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
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectTheGoodsLost' })}`,
                  },
                ]}
              >
                {!isEmpty(_record.coupon) && (
                  <Typography.Text>
                    {_record.coupon.id}/{_record.coupon.typeName}/
                    {intl.formatMessage({ id: 'selfManagement.validTime' })}：
                    {formatTimeString(_record.coupon.effectiveTimeStart)}
                    {intl.formatMessage({ id: 'selfManagement.to' })}
                    {formatTimeString(_record.coupon.effectiveTimeEnd)}/
                    {intl.formatMessage({ id: 'selfManagement.suitCommodity' })}：
                    {_record.coupon.suitableProduct?.productId}/{_record.coupon.suitableProduct?.productName}
                  </Typography.Text>
                )}
                <Button
                  icon={<EditOutlined />}
                  type="text"
                  onClick={() => handleClickButton(getFieldValue([`type_${_index}`]), _index, _record)}
                >
                  {!_record.coupon && `${intl.formatMessage({ id: 'selfManagement.0YuanBuyingBuckleSecurities' })}`}
                </Button>
              </Form.Item>
            ) : getFieldValue([`type_${_index}`]) === 2 ? (
              <Form.Item
                style={{ margin: 0 }}
                name={`prize_${_index}`}
                rules={[
                  { required: true, message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectCoupons' })}` },
                ]}
              >
                {!isEmpty(_record.coupon) && (
                  <Typography.Text>
                    {_record.coupon.id}/{_record.coupon.typeName}/{intl.formatMessage({ id: 'common.money' })}
                    {Number(_record.coupon.useConditionMoney).toFixed(2)}/有效期：
                    {formatTimeString(_record.coupon.effectiveTimeStart)}
                    {intl.formatMessage({ id: 'selfManagement.to' })}
                    {formatTimeString(_record.coupon.effectiveTimeEnd)}
                  </Typography.Text>
                )}
                <Button
                  icon={<EditOutlined />}
                  type="text"
                  onClick={() => handleClickButton(getFieldValue([`type_${_index}`]), _index, _record)}
                >
                  {!_record.coupon && `${intl.formatMessage({ id: 'selfManagement.chooseACoupon' })}`}
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
                        return Promise.reject(
                          new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseEnterTheAmount' })}`),
                        )
                      }
                      if (!pattern.test(value)) {
                        return Promise.reject(
                          new Error(`${intl.formatMessage({ id: 'selfManagement.amountGreaterDecimalPlaces' })}`),
                        )
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input
                  addonAfter={intl.formatMessage({ id: 'selfManagement.yuan' })}
                  onChange={(e) => handleChangePrize(e, _index)}
                />
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
                        return Promise.reject(
                          new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseEnterTheIntegral' })}`),
                        )
                      }
                      if (!pattern.test(value)) {
                        return Promise.reject(
                          new Error(`${intl.formatMessage({ id: 'selfManagement.pointsGreater' })}`),
                        )
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input
                  addonAfter={intl.formatMessage({ id: 'selfManagement.integral' })}
                  onChange={(e) => handleChangePrize(e, _index)}
                />
              </Form.Item>
            ) : (
              `${intl.formatMessage({ id: 'selfManagement.thereIsNo' })}`
            )
          }
        </Form.Item>
      ),
    },
    {
      title: `${intl.formatMessage({ id: 'selfManagement.operation' })}`,
      key: 'level',
      dataIndex: 'level',
      width: 128,
      render: (_text, _record, _index) => (
        <Popconfirm
          title={intl.formatMessage({ id: 'selfManagement.whetherOrNotToDelete?' })}
          onConfirm={() => handleDelete(_index, _record)}
        >
          <Button type="link">{intl.formatMessage({ id: 'selfManagement.delete' })}</Button>
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
    <CardLayout id="activityProductLayout" title={intl.formatMessage({ id: 'selfManagement.thePrizeSet' })}>
      <Form.Item
        name={['activityDefined', 'prizeList']}
        rules={[
          { required: true, message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectThePrizeSet!' })}` },
        ]}
      >
        <Table
          rowKey={(_record, _index) => `table_${_index + 1}`}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Form.Item>
      <Button style={{ marginBottom: '16px' }} block type="dashed" icon={<PlusOutlined />} onClick={handleApped}>
        {intl.formatMessage({ id: 'selfManagement.addANewAward' })}
      </Button>
      {/* 选择优惠券 */}
      <CouponsLayout
        mode="radio"
        fieldApi={
          _type === 1
            ? getMarketingMerchantActivityDetailPrizeCouponSelect
            : getMarketingMerchantActivityDetailGoodsCouponSelect
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
