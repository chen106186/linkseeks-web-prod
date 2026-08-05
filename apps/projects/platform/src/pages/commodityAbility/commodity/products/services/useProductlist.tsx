import { useMemo } from 'react'
import {
  getProductCustomerGetCustomerCategoryTree,
  getProductSelectGetSelectBrand,
  postProductCommodityGetCommodityList,
} from '@apps/apis'
import { EyeAuthButton, ImageBox, RecordColumns } from '@apps/components'
import { useRequestApi } from '@linkseeks/hooks'
import { useIntl } from '@linkseeks/i18n'
import { CommodityPriceEnum, priceTypeLabel, productStatusColor, productStatusLabel } from '../constant'
import { useControl } from './useControl'
import { useWebIntl } from '@apps/locales'
export const useProductList = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const { data: _categoryData } = useRequestApi(getProductCustomerGetCustomerCategoryTree)
  const { data: brandData } = useRequestApi(getProductSelectGetSelectBrand)

  const categoryData = useMemo(() => {
    const transform = (list) =>
      list.map((v) => ({
        label: v.name,
        value: v.id,
        children: v.children ? transform(v.children) : null,
      }))
    return _categoryData ? transform(_categoryData) : []
  }, [_categoryData])

  const { clickCopy, clickSubmitCheck, clickModify, confirmDelete, previewUpper, clickUp, upModalFn, handleArchive } =
    useControl()

  // 商品列表列
  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      width: 100,
      searchField: {
        type: 'Input',
        placeholder: translate('web.resource.commodity.ID'),
        name: 'commodityId',
        order: 10,
      },
      fixed: 'left',
    },
    {
      title: translate('web.resource.commodity.shanpintupian'),
      dataIndex: 'mainPic',
      key: 'mainPic',
      width: 100,
      fixed: 'left',
      render: (logoUrl) => <ImageBox width={48} height={48} src={logoUrl} preview />,
    },
    {
      title: translate('web.resource.commodity.name'),
      key: 'name',
      className: 'commonPickColor',
      width: 240,
      fixed: 'left',
      searchField: {
        main: true,
      },
      render: (text: any, record: any) => (
        <EyeAuthButton url={`/commodityAbility/commodity/products/detail?id=${record.id}`}>{text}</EyeAuthButton>
      ),
    },
    {
      title: translate('web.resource.commodity.category'),
      dataIndex: 'customerCategoryName',
      key: 'customerCategoryName',
      searchField: {
        type: 'Cascader',
        name: 'customerCategoryId',
        valueEnum: categoryData,
      },
    },
    {
      title: translate('web.resource.commodity.brand'),
      dataIndex: 'brandName',
      key: 'brandName',
      searchField: {
        type: 'SearchSelect',
        name: 'brandId',
        valueEnum: brandData?.map((v) => ({
          label: v.name,
          value: v.id,
        })),
        order: 30,
      },
    },
    {
      title: translate('web.common.unit'),
      key: 'unitName',
    },
    {
      title: translate('web.resource.commodity.shanpindingjia'),
      key: 'priceType',
      searchField: {
        type: 'Select',
        name: 'priceTypeList',
        valueEnum: CommodityPriceEnum,
        placeholder: translate('web.resource.commodity.shanpindingjia'),
        order: 20,
      },
      render: (text) => priceTypeLabel[text],
    },
    {
      title: translate('web.resource.commodity.shanpinleixing'),
      key: 'type',
      render: (t) => {
        const text_arr = [
          '',
          intl.formatMessage({ id: 'commodity.products.columns.type.1' }),
          intl.formatMessage({ id: 'commodity.products.columns.type.2' }),
          intl.formatMessage({ id: 'commodity.products.columns.type.3' }),
        ]
        return text_arr[t]
      },
    },
    {
      title: translate('web.resource.member.gongyinghuiyuan'),
      key: 'upperMemberName',
      render: (t) => (t ? t : intl.formatMessage({ id: 'commodity.products.columns.upperMemberName.1' })),
      searchField: {
        type: 'Input',
        placeholder: translate('web.resource.commodity.shangyougongyinshang'),
      },
    },
    {
      title: translate('web.resource.commodity.price'),
      key: 'min',
      searchField: {
        type: 'NumberRanage',
        name: ['min', 'max'],
        placeholder: [translate('web.resource.commodity.zuidijiage'), translate('web.resource.commodity.zuigaojiage')],
      },
      render: (text, record) => {
        if (record.priceType === 1 || record.priceType === 4) {
          if (record.max === record.min) return <>{translate.formatCurrencyWith(record.min)}</>
          else
            return (
              <>
                {translate.formatCurrencyWith(record.min)} ~ {translate.formatCurrencyWith(record.max)}
              </>
            )
        }
        if (record.priceType === 3) {
          if (record.max === record.min) return <>{record.min}</>
          else
            return (
              <>
                {record.min} ~ {record.max}
              </>
            )
        }
        if (record.priceType === 2) return null
      },
    },
    {
      title: translate('web.resource.commodity.shenqingshenheshijian'),
      key: 'applyTime',
      format: 'Date',
    },
    {
      title: translate('web.common.status'),
      key: 'status',
      format: 'Status',
      formatPayload: {
        statusColors: productStatusColor,
        statusLabels: productStatusLabel,
      },
      width: 120,
      fixed: 'right',
    },
    {
      title: translate('web.common.control'),
      key: 'option',
      format: 'Control',
      width: 180,
      fixed: 'right',
      formatPayload: {
        controlList: [
          {
            children: translate('web.common.copy'),
            key: 'copy',
            onClick: (record) => clickCopy(record),
          },
          {
            children: intl.formatMessage({ id: 'commodity.products.buttonGroup.2' }),
            key: 'examine',
            onClick: (record) => clickSubmitCheck(record),
            show: (record) => record.isSubmit,
          },
          {
            children: translate('web.common.edit'),
            key: 'edit',
            onClick: (record) => clickModify(record.id),
            show: (record) => record.isUpdate,
          },
          {
            children: translate('web.common.delete'),
            key: 'delete',
            onClick: (record) => confirmDelete(record.id),
            show: (record) => record.isDelete,
          },
          {
            children: translate('web.resource.commodity.shangjia'),
            key: 'state',
            onClick: (record) => clickUp(1, record),
            show: (record) => record.isOnPublish,
          },
          {
            children: translate('web.resource.commodity.xiajia'),
            key: 'state',
            onClick: (record) => clickUp(0, record),
            show: (record) => record.isOffPublish,
          },
          {
            children: intl.formatMessage({ id: 'commodity.products.buttonGroup.8' }),
            key: 'supply',
            onClick: (record) => previewUpper(record.upperCommodityId),
            show: (record) => record.isUpperCommodity,
          },
          {
            children: intl.formatMessage({ id: 'commodity.products.buttonGroup.7' }),
            key: '',
            onClick: (record) => upModalFn(record.id),
            show: (record) => record.type === 2,
          },
          {
            children: translate('web.resource.commodity.guidang'),
            key: 'archive',
            onClick: (record) => record.id && handleArchive(record.id),
            show: (record) => record.status === 3 || record.status === 4 || record.status === 6,
          },
        ],
      },
    },
  ]

  const fetchData = (params) => {
    const searchParams = {
      // ...searchData,
      ...params,
    }

    if (searchParams?.statusList) {
      searchParams['statusList'] =
        searchParams?.statusList !== '0'
          ? Array.isArray(searchParams?.statusList)
            ? searchParams?.statusList
            : searchParams?.statusList?.split(',').map((status) => status.trim())
          : undefined
    }

    if (searchParams?.priceTypeList) {
      searchParams['priceTypeList'] = [searchParams?.priceTypeList]
    }

    return new Promise((resolve) => {
      postProductCommodityGetCommodityList(searchParams, { ctlType: 'none' }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  return {
    columns,
    fetchData,
  }
}
