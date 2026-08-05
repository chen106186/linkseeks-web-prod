import { useIntl } from '@linkseeks/i18n'
import React, { useEffect, useState } from 'react'
import { Drawer, Button, Form, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import CollapseLayout from '../collapseLayout'
import { isArray, isEmpty } from 'lodash'
import ProductLayout from './components/productLayout'
import CouponsLayout from '../../selfManagement/readySubmitExamine/components/couponsLayout'
import { getMarketingMerchantActivityDetailGoodsCouponSelect } from '@apps/apis'

const layout: any = {
  labelCol: { style: { width: '100px' } },
  labelAlign: 'left',
}

type RemindLayoutProps = {
  /** 弹窗标题 */
  modalTitle?: string
  /** 选择商品按钮名称 */
  buttonTitle?: string
  /** 列表标题 */
  listTitle?: string
  /** 列表label */
  label?: { [key: number]: string }
  /** 提醒 */
  message?: { [key: number]: string }
}

interface CouponsListLayoutProps {
  /** messges */
  remind?: RemindLayoutProps
  /** 数据回显 */
  value?: any[]
  /** 设置标题 */
  title?: string
  /** 显示隐藏 */
  visible?: boolean
  /** 关闭 */
  onClose?: () => void
  /** 确定 */
  onConfirm?: (fields: any[]) => void
  /** 查看 */
  isPreview?: boolean
}

interface CouponGroupListProps {
  /**分组编号优惠阶梯换购阶梯 */
  groupNo?: number
  /** 换购门槛优惠门槛数量或金额 */
  limitValue?: number
  /** 明细 */
  list?: any[]
}

const CouponsListLayout: React.FC<CouponsListLayoutProps> = (props: any) => {
  const intl = useIntl()
  const { remind, value, title, visible, onClose, onConfirm, isPreview } = props
  const [form] = Form.useForm()
  const [couponSource, setCouponSource] = useState<CouponGroupListProps[]>([])
  const [tableModalVisible, setTableModalVisible] = useState<boolean>(false)
  const [idx, setIdx] = useState<number>(0)

  const toggle = (flag: boolean) => {
    setTableModalVisible(flag)
  }

  /** 添加一个 */
  const handleAppend = () => {
    const CouponGroup: CouponGroupListProps = {
      groupNo: 0,
      limitValue: remind.type === 'limitValue' ? 1 : 0,
      list: [],
    }
    setCouponSource([...couponSource, CouponGroup])
  }

  /** 组合数据到dataSource */
  const handleComposed = (selectRowRecord?: any) => {
    const fields: CouponGroupListProps[] = [...couponSource]
    fields[idx].groupNo = idx + 1
    if (isArray(selectRowRecord)) {
      fields[idx].list = [...selectRowRecord]
    }
    fields.forEach((item, _index) => {
      item.list.forEach((_item, __index) => {
        form.setFieldsValue({
          [`dataSource_${idx}`]: fields[idx].list,
          [`limitValue_${_index}`]: item.limitValue,
          [`num_${_index}_${__index}`]: _item.num,
        })
      })
    })
    setCouponSource(fields)
  }

  const handleCouponSubmit = (selectRowRecord: any) => {
    if (isEmpty(selectRowRecord)) {
      message.warning(remind.message[1])
      return
    }
    handleComposed(selectRowRecord)
    toggle(false)
  }

  const handleClick = () => {
    form.validateFields().then((_res) => {
      if (isEmpty(_res)) {
        message.warning(remind.message[2])
        return
      }
      let limitValue: number[] = []
      couponSource.forEach((_item) => {
        limitValue.push(_item.limitValue)
      })
      if (new Set(limitValue).size !== limitValue.length) {
        message.error(`${remind.label[1]}阶梯必须大于或小于其他${remind.label[1]}阶梯`)
      } else {
        onConfirm(couponSource)
      }
    })
  }

  /** 删除一个 */
  const handleDeletion = (index: number) => {
    const fields = [...couponSource]
    fields.splice(index, 1)
    fields.forEach((item, _index) => {
      item.list.forEach((_item, __index) => {
        form.setFieldsValue({
          [`limitValue_${_index}`]: item.limitValue,
          [`num_${_index}_${__index}`]: _item.num,
        })
      })
    })
    setCouponSource(fields)
  }

  /** 选择搭配优惠券 */
  const handleCollocation = (_idx: number) => {
    const fields = [...couponSource]
    fields.forEach((item, _index) => {
      item.list.forEach((_item, __index) => {
        form.setFieldsValue({
          [`limitValue_${_index}`]: item.limitValue,
          [`num_${_index}_${__index}`]: _item.num,
        })
      })
    })
    setIdx(_idx)
    toggle(true)
  }

  /** 输入一个价格或者数量 */
  const handleEntryNumber = (index: number, name: string, num: number, _index?: number) => {
    const fields: CouponGroupListProps[] = [...couponSource]
    if (name === 'limitValue') {
      fields[index][name] = Number(num)
    } else {
      fields[index].list[_index][name] = Number(num)
    }
    setCouponSource(fields)
  }

  /** 删除一个赠送优惠券 */
  const handleDeletionColloCation = (index: number, _index: number) => {
    const fields: CouponGroupListProps[] = [...couponSource]
    fields[index].list.splice(_index, 1)
    fields.forEach((item, _index) => {
      item.list.forEach((_item, __index) => {
        form.setFieldsValue({
          [`limitValue_${_index}`]: item.limitValue,
          [`num_${_index}_${__index}`]: _item.num,
        })
      })
    })
    setCouponSource(fields)
  }

  useEffect(() => {
    const fields = [...value]
    fields.forEach((item, _index) => {
      item.list.forEach((_item, __index) => {
        form.setFieldsValue({
          [`dataSource_${_index}`]: fields[_index].list,
          [`limitValue_${_index}`]: item.limitValue,
          [`num_${_index}_${__index}`]: _item.num,
        })
      })
    })
    setCouponSource(value)
  }, [value])

  return (
    <Drawer
      width={600}
      title={title}
      visible={visible}
      destroyOnClose
      onClose={onClose}
      footer={
        !isPreview && (
          <div style={{ textAlign: 'right' }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              {intl.formatMessage({ id: 'marketingAbility.quxiao' })}
            </Button>
            <Button type="primary" onClick={handleClick}>
              {intl.formatMessage({ id: 'marketingAbility.tijiao' })}
            </Button>
          </div>
        )
      }
    >
      {/* 分组列表 */}
      <Form {...layout} form={form}>
        {couponSource.map((item: CouponGroupListProps, index: number) => (
          <Form.Item
            style={{ marginBottom: '0px' }}
            name={`dataSource_${index}`}
            rules={[{ required: true, message: remind.message[3] }]}
            key={`CollapseLayout_${index}`}
          >
            <CollapseLayout index={index} remind={remind} isPreview={isPreview} deletion={handleDeletion}>
              {!isEmpty(item.list) && (
                <ProductLayout
                  form={form}
                  index={index}
                  remind={remind}
                  isPreview={isPreview}
                  list={item.list as any}
                  onDeletion={(_index: number) => handleDeletionColloCation(index, _index)}
                  onEntry={(name: string, num: number, _index?: number) => handleEntryNumber(index, name, num, _index)}
                />
              )}
              {/* 选择搭配商品 */}
              {!isPreview && (
                <Button type="dashed" block icon={<PlusOutlined />} onClick={() => handleCollocation(index)}>
                  {remind.buttonTitle}
                </Button>
              )}
            </CollapseLayout>
          </Form.Item>
        ))}
      </Form>
      {/* 添加分组 */}
      {!isPreview && (
        <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAppend}>
          {intl.formatMessage({ id: 'marketingAbility.tianjia' })}
        </Button>
      )}

      {/* 弹框: 优惠券 */}
      <CouponsLayout
        fieldApi={getMarketingMerchantActivityDetailGoodsCouponSelect}
        visible={tableModalVisible}
        onClose={() => toggle(false)}
        onSubmit={handleCouponSubmit}
        value={couponSource[idx]}
      />
    </Drawer>
  )
}
export default CouponsListLayout
