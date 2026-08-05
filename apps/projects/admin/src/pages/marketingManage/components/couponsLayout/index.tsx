import React, { useEffect, useState, useCallback } from 'react'
import { Drawer, Space, Form, Select, Input, Button, Row, Col, Checkbox, Empty, Pagination, Radio } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import styles from './index.less'
import { isEmpty } from 'lodash'
import CouponItem from '../couponItem'
import { getMarketingMerchantActivityDetailGoodsCouponSelectCondition } from '@apps/apis'

interface CouponsLayoutProps {
  /** 显示 */
  visible?: boolean
  /** 关闭 */
  onClose?: () => void
  /** 提交 */
  onSubmit?: (e: any) => void
  /** 已选择的id */
  value?: any
  /** 多选&单选 */
  mode?: 'checkbox' | 'radio'
  /** 接口api */
  fieldApi?: () => Promise<unknown>
}

const CouponsLayout: React.FC<CouponsLayoutProps> = (props: any) => {
  const { visible, onClose, onSubmit, value, mode = 'checkbox', fieldApi } = props
  const [form] = Form.useForm()
  const [state, setState] = useState({
    filterSearch: false,
  })
  const [params, setParams] = useState({
    current: 1,
    pageSize: 10,
  })
  const [total, setTotal] = useState<number>(0)
  const [couponList, setCouponList] = useState<any[]>([])
  const [chekedId, setCheckedId] = useState<number[]>([]) // 已选择的优惠券
  const [selectCouponList, setSelectCouponList] = useState<any[]>([]) // checkbox 勾选到的数据 需要去重
  const [couponsList, setCouponsList] = useState<any[]>([]) // 提交的优惠券
  const [options, setOptions] = useState<any[]>([]) // 选择附属优惠券查询条件

  const changeFilterVisible = () => {
    setState({
      filterSearch: !state.filterSearch,
    })
  }

  // 提交搜索
  const handleSubmit = async () => {
    await form.validateFields().then((res) => {
      fieldApi({ ...res, ...params }).then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { data, totalCount } = res.data
        setCouponList(data)
        setTotal(totalCount)
      })
    })
  }

  // 重置
  const handleResetForm = () => {
    form.resetFields()
    handleSubmit()
  }

  const handleCondition = useCallback(async () => {
    await getMarketingMerchantActivityDetailGoodsCouponSelectCondition().then((res) => {
      if (res.code !== 1000) {
        return
      }
      setOptions(
        res.data.map((_item) => {
          return {
            label: _item.name,
            value: _item.value,
          }
        }),
      )
    })
  }, [])

  useEffect(() => {
    if (visible) {
      handleSubmit()
      handleCondition()
    }
  }, [visible, params])

  const handleOnOk = () => {
    onSubmit(couponsList)
  }

  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={handleOnOk} type="primary">
          提交
        </Button>
      </div>
    )
  }

  /** checkbox 选择 */
  const _setCheckList = (_e, _item) => {
    const ids = [...chekedId]
    const selcetLits = [...selectCouponList]
    if (!ids.includes(_e)) {
      setCheckedId([...ids, _e])
      setSelectCouponList([...selcetLits, _item])
    } else {
      setCheckedId(ids.filter((_item) => _item !== _e))
      setSelectCouponList(selcetLits.filter((_item) => _item.id !== _e))
    }
  }

  /** radio 选择 */
  const _setRadioList = (_e) => {
    const { value } = _e.target
    const _item = _e.target['data-item']
    setCheckedId([value])
    setSelectCouponList([_item])
  }

  useEffect(() => {
    const newData = selectCouponList.filter((_item) => chekedId.includes(_item.id))
    setCouponsList(newData)
  }, [chekedId])

  useEffect(() => {
    if (!isEmpty(value)) {
      if (mode === 'checkbox') {
        const newChekedId = value.list.map((_item: any) => _item.id)
        setCheckedId(newChekedId)
        setSelectCouponList(value.list)
      } else {
        if (value.coupon !== undefined) {
          setCheckedId([value.coupon.id])
          setSelectCouponList([value.coupon])
          form.setFieldsValue({ radio: value.coupon.id })
        } else {
          setCheckedId([])
          setSelectCouponList([])
          form.setFieldsValue({ radio: undefined })
        }
      }
    }
  }, [value])

  const handlePagination = (page, pageSize) => {
    setParams({
      current: page,
      pageSize: pageSize,
    })
  }

  return (
    <Drawer width={630} title="选择优惠券" visible={visible} onClose={onClose} footer={renderFooter()} destroyOnClose>
      <Form form={form} onFinish={handleSubmit}>
        {/* 头部搜索 */}
        <Space size={20} style={{ marginBottom: '24px' }}>
          <Form.Item name="type" style={{ marginBottom: 0 }}>
            <Select style={{ width: '160px' }} placeholder="优惠券类型" options={options} />
          </Form.Item>
          <Form.Item name="name" style={{ marginBottom: 0 }}>
            <Input.Search onSearch={handleSubmit} placeholder="优惠券名称" />
          </Form.Item>
          <Button onClick={changeFilterVisible}>
            高级筛选 <CaretDownOutlined rotate={state.filterSearch ? 180 : 0} />
          </Button>
          <Button onClick={handleResetForm}>重置</Button>
        </Space>
        {state.filterSearch && (
          <Space size={20} style={{ marginBottom: '24px' }}>
            <Form.Item name="id" style={{ marginBottom: 0 }}>
              <Input style={{ width: '160px' }} placeholder="优惠券ID" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Space>
        )}
        {/* 优惠券列表 */}
        {couponList.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Row>
            {mode === 'checkbox' && (
              <>
                {couponList.map((item: any, index: number) => {
                  return (
                    <Col span={22} key={`Col_${index}`} style={{ marginBottom: 24 }}>
                      <Checkbox
                        checked={chekedId.includes(item.id)}
                        value={item.id}
                        className={styles.customsCheckbox}
                        onChange={(_e) => _setCheckList(_e.target.value, item)}
                      >
                        <CouponItem fieldListData={item} />
                      </Checkbox>
                    </Col>
                  )
                })}
              </>
            )}
            {mode === 'radio' && (
              <Form.Item style={{ margin: 0, flex: 1 }} name="radio">
                <Radio.Group style={{ width: '100%' }} onChange={(_e) => _setRadioList(_e)}>
                  {couponList.map((item: any, index: number) => {
                    return (
                      <Col span={22} key={`Col_${index}`} style={{ marginBottom: 24 }}>
                        <Radio
                          checked={chekedId.includes(item.id)}
                          value={item.id}
                          data-item={item}
                          className={styles.customsCheckbox}
                        >
                          <CouponItem fieldListData={item} />
                        </Radio>
                      </Col>
                    )
                  })}
                </Radio.Group>
              </Form.Item>
            )}
            <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Pagination size="small" total={total} current={params.current} onChange={handlePagination} />
            </Col>
          </Row>
        )}
      </Form>
    </Drawer>
  )
}
export default CouponsLayout
