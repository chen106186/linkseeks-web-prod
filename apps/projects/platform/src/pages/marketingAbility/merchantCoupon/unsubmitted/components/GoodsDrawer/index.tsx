/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-24 16:11:55
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-24 14:05:33
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
  getProductCustomerGetCustomerCategoryTree,
  getProductSelectGetSelectBrand,
  postProductCommodityCommonGetCommoditySkuListByShopId,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

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
  /**
   * 商城id
   */
  shopIds: number[]
  /**
   * 是否支持多选，默认为 true
   */
  multiple?: boolean
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

const translate = getWebIntl()
const GoodsDrawer: React.FC<IProps> = (props) => {
  const intl = useIntl()
  const { visible, checkeds, onSubmit, onClose, shopIds, multiple = true } = props
  const [rowSelection, rowCtl] = useRowSelectionTable({ type: multiple ? 'checkbox' : 'radio', customKey: 'id' })

  useEffect(() => {
    if (checkeds) {
      rowCtl.setSelectRow(checkeds)
      rowCtl.setSelectedRowKeys(checkeds.map((item) => item.id))
    }
  }, [checkeds])

  const fetchData = async (params: ExtraFetchType) => {
    if (!shopIds || !shopIds.length) {
      return
    }
    const res = await postProductCommodityCommonGetCommoditySkuListByShopId(
      {
        ...params,
        shopIdList: shopIds,
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
      title: `${intl.formatMessage({ id: 'merchantCoupon.commodityId' })}`,
      dataIndex: 'id',
      align: 'center',
      width: 120,
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.mainPic' })}`,
      dataIndex: 'mainPic',
      align: 'center',
      width: 120,
      render: (text) => <img src={text} className={styles['product-img']} />,
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.name' })}`,
      dataIndex: 'name',
      ellipsis: true,
      width: 300,
      render: (name, record) => `${name}/${record.commodityAttribute || ''}`,
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
  ]

  const handleConfirm = () => {
    if (!rowCtl.selectRow.length) {
      message.warning(`${intl.formatMessage({ id: 'merchantCoupon.Pleaseselectitems' })}`)
      return
    }
    if (onSubmit) {
      onSubmit(rowCtl.selectRow)
    }
  }

  // 获取品牌
  const fetchBrand = async (name = '') => {
    const res = await getProductSelectGetSelectBrand({
      name,
    })
    if (res.code === 1000) {
      return res.data
    }
    return []
  }

  // 获取会员品类
  const fetchCustomerCategory = async () => {
    const res = await getProductCustomerGetCustomerCategoryTree()
    if (res.code === 1000) {
      return res.data
    }
    return []
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'merchantCoupon.Choosetoapplyitems' })}
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
            {intl.formatMessage({ id: 'merchantCoupon.cancel' })}
          </Button>
          <Button onClick={handleConfirm} type="primary">
            {intl.formatMessage({ id: 'common.button.confirm' })}
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
