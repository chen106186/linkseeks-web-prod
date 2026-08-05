/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-19 14:19:31
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-13 15:38:09
 * @Description: 适用商品 Form Item
 */
import React, { useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PolymericTable, { EditableColumns } from '@/components/PolymericTable'
import { normalizeUnitPrice } from '../../../utils'
import GoodsDrawer, { ProductItemType } from '../GoodsDrawer'
import styles from './index.less'

const ApplicableGoodsFormItem = (props) => {
  const { value, mutators, editable } = props

  const [visibleGoodsDrawer, setVisibleGoodsDrawer] = useState(false)

  const handleDelete = (id: number) => {
    const newData = [...value]
    const index = value.findIndex((item) => item.id === id)
    if (index !== -1) {
      newData.splice(index, 1)
    }
    mutators.change(newData)
  }

  const columns: EditableColumns<ProductItemType>[] = [
    {
      title: '商品ID',
      dataIndex: 'commodityId',
      align: 'center',
    },
    {
      title: '商品图片',
      dataIndex: 'mainPic',
      align: 'center',
      render: (text) => <img src={text} className={styles['product-img']} />,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '品类',
      dataIndex: 'customerCategoryName',
      align: 'center',
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
      align: 'center',
    },
    {
      title: '单位',
      dataIndex: 'unitName',
      align: 'center',
    },
    {
      title: '商品价格',
      dataIndex: 'unitPrice',
      align: 'center',
      render: (text) => {
        const unitPrice = normalizeUnitPrice(text)
        const start = unitPrice[0]?.price
        const end = unitPrice[unitPrice.length - 1]?.price
        return start !== end ? `¥ ${start}~${end}` : `¥ ${start}`
      },
    },
    editable
      ? {
          title: '操作',
          dataIndex: 'option',
          align: 'center',
          render: (_, record) => (
            <>
              <Button type="link" onClick={() => handleDelete(record.id)}>
                删除
              </Button>
            </>
          ),
        }
      : null,
  ].filter(Boolean) as EditableColumns<ProductItemType>[]

  const handleVisibleGoodsDrawer = (flag?: boolean) => {
    setVisibleGoodsDrawer(!!flag)
  }

  const handleSelectGoods = () => {
    handleVisibleGoodsDrawer(true)
  }

  const handleGoodsDrawerSubmit = (values: ProductItemType[]) => {
    handleVisibleGoodsDrawer(false)
    mutators.change(values)
  }

  return (
    <div>
      {editable && (
        <Button icon={<PlusOutlined />} onClick={handleSelectGoods} type="dashed" className={styles.action} block>
          选择商品
        </Button>
      )}

      <PolymericTable dataSource={value} columns={columns} pagination={null} />

      <GoodsDrawer
        visible={visibleGoodsDrawer}
        onClose={handleVisibleGoodsDrawer}
        checkeds={value}
        onSubmit={handleGoodsDrawerSubmit}
      />
    </div>
  )
}

ApplicableGoodsFormItem.isFieldComponent = true

export default ApplicableGoodsFormItem
