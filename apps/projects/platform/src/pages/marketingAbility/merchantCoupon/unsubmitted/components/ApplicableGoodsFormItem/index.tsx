/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-19 14:19:31
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-28 11:01:30
 * @Description: 适用商品 Form Item
 */
import React, { useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PolymericTable, { EditableColumns } from '@/components/PolymericTable'
import { normalizeUnitPrice } from '../../../utils'
import GoodsDrawer, { ProductItemType } from '../GoodsDrawer'
import styles from './index.less'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
const ApplicableGoodsFormItem = (props) => {
  const { value, mutators, editable } = props
  const XComponentProps = props.props['x-component-props'] || {}

  const [visibleGoodsDrawer, setVisibleGoodsDrawer] = useState(false)

  const intl = useIntl()

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
      title: `${intl.formatMessage({ id: 'merchantCoupon.commodityId' })}`,
      dataIndex: 'commodityId',
      align: 'center',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.mainPic' })}`,
      dataIndex: 'mainPic',
      align: 'center',
      render: (text) => <img src={text} className={styles['product-img']} />,
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.name' })}`,
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.customerCategoryName' })}`,
      dataIndex: 'customerCategoryName',
      align: 'center',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.brandName' })}`,
      dataIndex: 'brandName',
      align: 'center',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.unitName' })}`,
      dataIndex: 'unitName',
      align: 'center',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.unitPrice' })}`,
      dataIndex: 'unitPrice',
      align: 'center',
      render: (text) => {
        const unitPrice = normalizeUnitPrice(text)
        const start = unitPrice[0]?.price
        const end = unitPrice[unitPrice.length - 1]?.price
        return start !== end
          ? `${translate('web.common.currencySymbol')} ${start}~${end}`
          : `${translate('web.common.currencySymbol')} ${start}`
      },
    },
    editable
      ? {
          title: `${intl.formatMessage({ id: 'merchantCoupon.operation' })}`,
          dataIndex: 'option',
          align: 'center',
          render: (_, record) => (
            <>
              <Button type="link" onClick={() => handleDelete(record.id)}>
                {intl.formatMessage({ id: 'merchantCoupon.delete' })}
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
    if (!XComponentProps.shopIds) {
      message.warning(`${intl.formatMessage({ id: 'merchantCoupon.Pleasechoosethemallfirst' })}`)
      return
    }
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
          {intl.formatMessage({ id: 'merchantCoupon.chooseGoods' })}
        </Button>
      )}

      <PolymericTable dataSource={value} columns={columns} pagination={null} />

      <GoodsDrawer
        visible={visibleGoodsDrawer}
        shopIds={XComponentProps.shopIds}
        multiple={XComponentProps.multiple}
        onClose={handleVisibleGoodsDrawer}
        checkeds={value}
        onSubmit={handleGoodsDrawerSubmit}
      />
    </div>
  )
}

ApplicableGoodsFormItem.isFieldComponent = true

export default ApplicableGoodsFormItem
