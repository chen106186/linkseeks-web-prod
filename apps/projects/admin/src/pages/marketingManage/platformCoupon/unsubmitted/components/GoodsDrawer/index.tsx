/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-24 16:11:55
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-24 14:12:08
 * @Description: 商品选择抽屉
 */
import React, { useEffect } from 'react'
import { Drawer, Button, message } from 'antd'
import { FormEffectHooks } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import PolymericTable, { EditableColumns, FetchParamsType } from '@/components/PolymericTable'
import { normalizeUnitPrice } from '../../../utils'
import { querySchema } from './schema'
import styles from './index.less'
import {
  getProductPlatformGetCategoryTree,
  getProductSelectGetSelectPlatformBrand,
  postProductCommodityCommonGetCommodityListByPlatform,
} from '@apps/apis'

const { onFormInit$ } = FormEffectHooks

export type ProductItemType = {
  /**
   * 数据id
   */
  id: number
  /**
   * 商品id
   */
  commodityId: number
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品图片
   */
  mainPic: string
  /**
   * 会员分类名称
   */
  customerCategoryName: string
  /**
   * 品牌名称
   */
  brandName: string
  /**
   * 单位名称
   */
  unitName: string
  /**
   * 阶梯价格
   */
  unitPrice: {
    [key: string]: number
  }
}

interface IProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   *
   */
  checkeds: ProductItemType[]
  /**
   * Form 确认事件
   */
  onSubmit: (values: ProductItemType[]) => void
  /**
   * 抽屉关闭事件
   */
  onClose: () => void
}

type ExtraFetchType = FetchParamsType & {
  /**
   * 商品名称
   */
  commodityName?: string
  /**
   * 会员品类id
   */
  customerCategoryId?: number
  /**
   * 品牌id
   */
  brandId?: number
}

const GoodsDrawer: React.FC<IProps> = (props) => {
  const { visible, checkeds, onSubmit, onClose } = props
  const [rowSelection, rowCtl] = useRowSelectionTable({ type: 'checkbox', customKey: 'id' })

  useEffect(() => {
    if (checkeds) {
      rowCtl.setSelectRow(checkeds)
      rowCtl.setSelectedRowKeys(checkeds.map((item) => item.id))
    }
  }, [checkeds])

  const fetchData = async (params: ExtraFetchType) => {
    const res = await postProductCommodityCommonGetCommodityListByPlatform(
      {
        priceTypeList: [1],
        ...params,
      },
      {
        ctlType: 'none',
      },
    )
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const columns: EditableColumns<any>[] = [
    {
      title: '商品ID',
      dataIndex: 'id',
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
  ]

  const handleConfirm = () => {
    if (!rowCtl.selectRow.length) {
      message.warning('请选择商品')
      return
    }
    if (onSubmit) {
      onSubmit(rowCtl.selectRow)
    }
  }

  // 获取品牌
  const fetchBrand = async (name = '') => {
    const res = await getProductSelectGetSelectPlatformBrand({
      name,
    })
    if (res.code === 1000) {
      return res.data
    }
    return []
  }

  // 获取会员品类
  const fetchCustomerCategory = async () => {
    const res = await getProductPlatformGetCategoryTree()
    if (res.code === 1000) {
      return res.data
    }
    return []
  }

  return (
    <Drawer
      title="选择适用商品"
      width={1200}
      onClose={handleClose}
      visible={visible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={handleClose} style={{ marginRight: 16 }}>
            取消
          </Button>
          <Button onClick={handleConfirm} type="primary">
            确 定
          </Button>
        </div>
      }
      bodyStyle={{
        paddingBottom: 0,
      }}
    >
      <PolymericTable
        columns={columns}
        fetchDataSource={fetchData}
        rowSelection={rowSelection}
        searchFormProps={{
          schema: querySchema,
          effects: ($, actions) => {
            const linkage = useLinkageUtils()

            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)

            useAsyncSelect('brandId', fetchBrand, ['name', 'id'])

            onFormInit$().subscribe(() => {
              // 初始化远程检索逻辑
              fetchCustomerCategory().then((res) => {
                linkage.componentProps('customerCategoryId', {
                  dataoption: res,
                })
              })
            })
          },
        }}
        full
      />
    </Drawer>
  )
}

export default GoodsDrawer
