import { useIntl } from '@linkseeks/i18n'
import React, { useCallback } from 'react'
import { ColumnType } from 'antd/lib/table'
import TableModal from '@/pages/transaction/components/tableModal'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  getProductSelectGetSelectBrand,
  getProductSelectGetSelectCustomerCategory,
  postProductCommodityCommonGetCommoditySkuListByShopId,
} from '@apps/apis'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { FormEffectHooks } from '@apps/formily'
import { normalizeUnitPrice } from '../../merchantCoupon/utils'
const { onFormMount$ } = FormEffectHooks

export interface CollocationLayoutProps {
  /** 活动类型 */
  isGift?: number
  moda?: 'checkbox' | 'radio'
  /** */
  idNotInList?: number[]
  /** 适用商城 */
  shopIdList?: number[]
  /** 显示隐藏 */
  visible?: boolean
  /** toggle */
  toggle: (e: boolean) => void
  /** 确定 */
  onConfirm: (selectRowRecord: any) => void
}

const CollocationLayout: React.FC<CollocationLayoutProps> = (props: any) => {
  const intl = useIntl()
  const { isGift, moda = 'checkbox', idNotInList, shopIdList, visible, toggle, onConfirm } = props
  /** 选择活动商品columns */
  const columns: ColumnType<any>[] = [
    {
      title: 'SKUID',
      key: 'skuId',
      dataIndex: 'skuId',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.shangpinmingcheng' })}`,
      key: 'productName',
      dataIndex: 'productName',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.pinlei' })}`,
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.pinpai' })}`,
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.shangpinzhuangtai' })}`,
      key: 'status',
      dataIndex: 'status',
      render: (text) => (
        <>
          {Number(text) === 1 && `${intl.formatMessage({ id: 'marketingAbility.daitijiaoshenhe' })}`}
          {Number(text) === 2 && `${intl.formatMessage({ id: 'marketingAbility.daishenhe' })}`}
          {Number(text) === 3 && `${intl.formatMessage({ id: 'marketingAbility.shenhebutongguo' })}`}
          {Number(text) === 4 && `${intl.formatMessage({ id: 'marketingAbility.shenhetongguo' })}`}
          {Number(text) === 5 && `${intl.formatMessage({ id: 'marketingAbility.shangjia' })}`}
          {Number(text) === 6 && `${intl.formatMessage({ id: 'marketingAbility.xiajia' })}`}
        </>
      ),
    },
  ]

  const handleFetchData = useCallback(
    (params: any) => {
      const newParams = {
        isMorePrice: false,
        idNotInList,
        shopIdList,
        ...params,
      }
      isGift === 6 && (newParams.isGift = true)
      return new Promise((resolve) => {
        postProductCommodityCommonGetCommoditySkuListByShopId({ ...newParams }, { ctlType: 'none' })
          .then((res) => {
            if (res.code !== 1000) {
              return
            }
            const { data } = res
            resolve({
              totalCount: data.totalCount,
              data: data.data.map((item) => {
                return {
                  skuId: item.id,
                  productId: item.commodityId,
                  productName: `${item.name}${item.commodityAttribute ? `/${item.commodityAttribute}` : ''}`,
                  category: item.customerCategoryName,
                  brand: item.brandName,
                  status: 5,
                  productImgUrl: item.mainPic,
                  unit: item.unitName,
                  price: item.unitPrice || 0,
                }
              }),
            })
          })
          .catch((error) => {
            console.warn(error)
          })
      })
    },
    [shopIdList, idNotInList, isGift],
  )

  const handleOk = (selectRowKeys: string[] | number[], selectRowRecord: any) => {
    const rowRecord: any[] = [...selectRowRecord]
    const productList = rowRecord.map((item) => {
      console.log(normalizeUnitPrice(item.price), 'normalizeUnitPrice')
      return {
        id: item.id,
        skuId: item.skuId,
        productImgUrl: item.productImgUrl,
        productId: item.productId,
        productName: item.productName,
        category: item.category,
        brand: item.brand,
        unit: item.unit,
        price: typeof item.price === 'object' ? normalizeUnitPrice(item.price)[0]?.price : item.price,
        plummetPrice: item.plummetPrice,
        activityPrice: item.activityPrice,
        deductionPrice: item.deductionPrice,
        discount: item.discount,
        restrictNum: item.restrictNum,
        restrictTotalNum: item.restrictTotalNum,
      }
    })
    onConfirm(productList)
  }

  const useBusinessEffects = () => {
    const linkage = useLinkageUtils()
    onFormMount$().subscribe(() => {
      getProductSelectGetSelectCustomerCategory({})
        .then((res) => {
          const _enum = res.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            }
          })
          linkage.enum('customerCategoryId', _enum)
        })
        .catch((error) => {
          console.warn(error)
        })
      getProductSelectGetSelectBrand({})
        .then((res) => {
          const _enum = res.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            }
          })
          linkage.enum('brandId', _enum)
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }

  return (
    <TableModal
      modalType="Drawer"
      visible={visible}
      title={intl.formatMessage({ id: 'marketingAbility.xuanzehuodongshangpin' })}
      fetchData={handleFetchData}
      columns={columns}
      mode={moda}
      tableProps={{
        rowKey: 'skuId',
      }}
      customKey="skuId"
      onClose={() => toggle(false)}
      onOk={handleOk}
      effects={($, actions) => {
        actions.reset()
        useStateFilterSearchLinkageEffect($, actions, 'commodityName', FORM_FILTER_PATH)
        useBusinessEffects()
      }}
      schema={{
        type: 'object',
        properties: {
          megalayout: {
            type: 'object',
            'x-component': 'mega-layout',
            properties: {
              commodityName: {
                type: 'string',
                'x-component': 'Search',
                'x-mega-props': {},
                'x-component-props': {
                  placeholder: `${intl.formatMessage({ id: 'marketingAbility.shangpinmingcheng' })}`,
                  align: 'flex-left',
                },
              },
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              rowStyle: {
                justifyContent: 'flex-start',
                flexWrap: 'nowrap',
              },
              colStyle: {
                //改变间隔
                marginRight: 20,
              },
            },
            properties: {
              PRO_LAYOUT: {
                type: 'object',
                'x-component': 'mega-layout',
                'x-mega-props': {
                  span: 5,
                },
                'x-component-props': {
                  inline: true,
                },
                properties: {
                  customerCategoryId: {
                    type: 'string',
                    'x-component-props': {
                      placeholder: `${intl.formatMessage({ id: 'marketingAbility.shangpinpinlei' })}`,
                      style: {
                        width: 160,
                      },
                    },
                    enum: [],
                  },
                  brandId: {
                    type: 'string',
                    'x-component-props': {
                      placeholder: `${intl.formatMessage({ id: 'marketingAbility.shangpinpinpai' })}`,
                      style: {
                        width: 160,
                      },
                    },
                    enum: [],
                  },
                },
              },
              sumbit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: `${intl.formatMessage({ id: 'marketingAbility.chaxun' })}`,
                },
              },
            },
          },
        },
      }}
    />
  )
}
export default CollocationLayout
