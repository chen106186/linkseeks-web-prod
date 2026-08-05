import React, { useEffect, useState } from 'react'
import { Drawer, Button, Form, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import CollapseLayout from '../collapseLayout'
import { isArray, isEmpty } from 'lodash'
import ProductLayout from './components/productLayout'
import CollocationLayout from '../collocationLayout'

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

interface ListModalLayoutProps {
  idNotInList?: number[]
  /** messges */
  remind?: RemindLayoutProps
  /** 数据回显 */
  value?: any[]
  /** 设置标题 */
  title?: string
  /** 显示隐藏 */
  visible?: boolean
  /** 适用商城 */
  shopIdList?: number[]
  /** 关闭 */
  onClose?: () => void
  /** 确定 */
  onConfirm?: (fields: any[]) => void
  /** 查看 */
  isPreview?: boolean
}

type ListProps = {
  /** id */
  id?: number
  /** skuid */
  skuId?: number
  /** 商品id */
  productId: number
  /** 商品名称 */
  productName: string
  /** 品类 */
  category?: string
  /** 品牌 */
  brand?: string
  /** 单位 */
  unit?: string
  /** 商品价格 */
  price?: number
  /** 换购价格 */
  swapPrice?: number
  /** 允许换购数量赠送数量搭配数量 */
  num: number
  /** 赠品主图 */
  productImgUrl?: string
}

interface GoodsSubsidiaryListProps {
  /**分组编号优惠阶梯换购阶梯 */
  groupNo?: number
  /** 换购门槛优惠门槛数量或金额 */
  limitValue?: number
  /** 套餐价格 */
  groupPrice?: number
  /** 明细 */
  list: ListProps[]
}

const ListModalLayout: React.FC<ListModalLayoutProps> = (props: any) => {
  const { idNotInList, remind, value, shopIdList, title, visible, onClose, onConfirm, isPreview } = props
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<GoodsSubsidiaryListProps[]>([])
  const [tableModalVisible, setTableModalVisible] = useState<boolean>(false)
  const [idx, setIdx] = useState<number>(0)

  const toggle = (flag: boolean) => {
    setTableModalVisible(flag)
  }
  /** 组合数据到dataSource */
  const handleComposed = (selectRowRecord?: any) => {
    const fields: GoodsSubsidiaryListProps[] = [...dataSource]
    fields[idx].groupNo = idx + 1
    fields[idx].groupPrice = !isArray(selectRowRecord) ? selectRowRecord : 0
    if (isArray(selectRowRecord)) {
      fields[idx].list = [
        ...fields[idx].list,
        ...selectRowRecord.map((item: any) => {
          return {
            skuId: item.skuId,
            productId: item.productId,
            productName: item.productName,
            category: item.category,
            brand: item.brand,
            unit: item.unit,
            price: item.price,
            swapPrice: item.swapPrice,
            num: item.num || 1,
            productImgUrl: item.productImgUrl,
          }
        }),
      ]
    }
    fields.forEach((item, _index) => {
      item.list.forEach((_item, __index) => {
        form.setFieldsValue({
          [`dataSource_${idx}`]: fields[idx].list,
          [`limitValue_${_index}`]: item.limitValue,
          [`num_${_index}_${__index}`]: _item.num,
          [`swapPrice_${_index}_${__index}`]: _item.swapPrice,
        })
      })
    })
    setDataSource(fields)
  }

  const handleSubmit = (selectRowRecord: any) => {
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
      onConfirm(dataSource)
    })
  }

  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button type="primary" onClick={handleClick}>
          提交
        </Button>
      </div>
    )
  }

  /** 添加一个 */
  const handleAppend = () => {
    const GoodsSubsidiary: GoodsSubsidiaryListProps = {
      groupNo: 0,
      limitValue: remind.type === 'limitValue' ? 1 : 0,
      groupPrice: remind.type === 'groupPrice' ? 1 : 0,
      list: [],
    }
    setDataSource([...dataSource, GoodsSubsidiary])
  }
  /** 删除一个 */
  const handleDeletion = (index: number) => {
    const fields = [...dataSource]
    fields.splice(index, 1)
    fields.forEach((item, _index) => {
      item.list.forEach((_item, __index) => {
        form.setFieldsValue({
          [`limitValue_${_index}`]: item.limitValue,
          [`groupPrice_${_index}`]: item.groupPrice,
          [`num_${_index}_${__index}`]: _item.num,
          [`swapPrice_${_index}_${__index}`]: _item.swapPrice,
        })
      })
    })
    setDataSource(fields)
  }

  /** 选择搭配商品 */
  const handleCollocation = (_idx: number) => {
    const fields = [...dataSource]
    fields.forEach((item, _index) => {
      item.list.forEach((_item, __index) => {
        form.setFieldsValue({
          [`limitValue_${_index}`]: item.limitValue,
          [`groupPrice_${_index}`]: item.groupPrice,
          [`num_${_index}_${__index}`]: _item.num,
          [`swapPrice_${_index}_${__index}`]: _item.swapPrice,
        })
      })
    })
    setIdx(_idx)
    toggle(true)
  }

  /** 删除一个搭配商品 */
  const handleDeletionColloCation = (index: number, _index: number) => {
    const fields: GoodsSubsidiaryListProps[] = [...dataSource]
    fields[index].list.splice(_index, 1)
    fields.forEach((item, _index) => {
      item.list.forEach((_item, __index) => {
        form.setFieldsValue({
          [`limitValue_${_index}`]: item.limitValue,
          [`groupPrice_${_index}`]: item.groupPrice,
          [`num_${_index}_${__index}`]: _item.num,
          [`swapPrice_${_index}_${__index}`]: _item.swapPrice,
        })
      })
    })
    setDataSource(fields)
  }

  /** 输入一个价格或者数量 */
  const handleEntryNumber = (index: number, name: string, num: number, _index?: number) => {
    const fields: GoodsSubsidiaryListProps[] = [...dataSource]
    if (name === 'groupPrice' || name === 'limitValue') {
      fields[index][name] = Number(num)
    } else {
      fields[index].list[_index!][name] = Number(num)
    }
    setDataSource(fields)
  }

  useEffect(() => {
    const fields = [...value]
    fields.forEach((item, _index) => {
      item.list.forEach((_item, __index) => {
        form.setFieldsValue({
          [`dataSource_${_index}`]: fields[_index].list,
          [`limitValue_${_index}`]: item.limitValue,
          [`groupPrice_${_index}`]: item.groupPrice,
          [`num_${_index}_${__index}`]: _item.num,
          [`swapPrice_${_index}_${__index}`]: _item.swapPrice,
        })
      })
    })
    setDataSource(value)
  }, [value])

  return (
    <Drawer
      width={600}
      title={title}
      visible={visible}
      destroyOnClose
      onClose={onClose}
      footer={!isPreview && renderFooter()}
    >
      {/* 分组列表 */}
      <Form {...layout} form={form}>
        {dataSource.map((item: GoodsSubsidiaryListProps, index: number) => (
          <Form.Item
            style={{ marginBottom: '0px' }}
            name={`dataSource_${index}`}
            rules={[{ required: true, message: remind.message[3] }]}
            key={`CollapseLayout_${index}`}
          >
            <CollapseLayout index={index} remind={remind} deletion={handleDeletion} isPreview={isPreview}>
              {!isEmpty(item.list) && (
                <ProductLayout
                  form={form}
                  index={index}
                  remind={remind}
                  list={item.list}
                  isPreview={isPreview}
                  onDeletion={(_index: number) => handleDeletionColloCation(index, _index)}
                  onEntry={(name: string, num: number, _index?: number) => handleEntryNumber(index, name, num, _index)}
                />
              )}
              {/* 选择搭配商品 */}
              {remind.name !== 'swapValue' && !isPreview && (
                <Button type="dashed" block icon={<PlusOutlined />} onClick={() => handleCollocation(index)}>
                  {remind.buttonTitle}
                </Button>
              )}
              {remind.name === 'swapValue' && item.list.length === 0 && !isPreview && (
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
          添加
        </Button>
      )}
      {/* 弹框: -> 商品 */}
      <CollocationLayout
        moda={remind.name === 'swapValue' ? 'radio' : 'checkbox'}
        visible={tableModalVisible}
        idNotInList={idNotInList}
        shopIdList={shopIdList}
        toggle={toggle}
        onConfirm={handleSubmit}
      />
    </Drawer>
  )
}
export default ListModalLayout
