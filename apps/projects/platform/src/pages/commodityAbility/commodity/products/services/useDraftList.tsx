import { useMemo, useRef } from 'react'
import { getProductCommodityDraftGetCommodityDraftList } from '@apps/apis'
import { RecordColumns } from '@apps/components'
import { useIntl } from '@linkseeks/i18n'
import { priceTypeLabel } from '../constant'
import { Button, Tag } from 'antd'
import { useControl } from './useControl'

export const useDraftList = () => {
  const intl = useIntl()
  const { clickDraftModify, clickDraftDelete } = useControl()

  // 草稿列
  const draftColumns: RecordColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: intl.formatMessage({ id: 'commodity.products.columns.name' }),
      dataIndex: ['draft', 'name'],
      key: 'name',
      // className: 'commonPickColor',
      width: 240,
      ellipsis: true,
      // render: (text: any, record: any) => <EyeAuthButton url={`/commodityAbility/commodity/products/detail?id=${record.id}`}>
      //   {text}
      // </EyeAuthButton>
    },
    {
      title: intl.formatMessage({ id: 'commodity.products.columns.customerCategory' }),
      dataIndex: ['draft', 'customerCategoryFullName'],
      key: 'customerCategoryFullName',
    },
    // {
    //   title: intl.formatMessage({ id: 'commodity.products.columns.brand' }),
    //   dataIndex: ['draft', 'brandName'],
    //   key: 'brandName',
    // },
    {
      title: intl.formatMessage({ id: 'commodity.products.columns.unitName' }),
      dataIndex: ['draft', 'unitName'],
      key: 'unitName',
    },
    // {
    //   title: intl.formatMessage({ id: 'commodity.products.columns.priceType' }),
    //   dataIndex: ['draft', 'priceType'],
    //   key: 'priceType',
    //   render: (text) => priceTypeLabel[text],
    // },
    {
      title: intl.formatMessage({ id: 'commodity.products.columns.type' }),
      dataIndex: ['draft', 'type'],
      key: 'type',
      render: (t) => {
        if (t === 1) {
          return intl.formatMessage({ id: 'commodity.products.columns.type.1' })
        } else if (t === 2) {
          return intl.formatMessage({ id: 'commodity.products.columns.type.2' })
        } else if (t === 3) {
          return intl.formatMessage({ id: 'commodity.products.columns.type.3' })
        }
      },
    },
    // {
    //   title: intl.formatMessage({ id: 'commodity.products.columns.min' }),
    //   dataIndex: ['draft', 'min'],
    //   key: 'min',
    //   render: (text, record) => {
    //     const { min = null, max = null, priceType } = record.draft
    //     if (priceType === 1 && min && max) {
    //       if (max === min)
    //         return (
    //           <>
    //             {intl.formatMessage({ id: 'commodity.products.columns.currency' })}
    //             {min}
    //           </>
    //         )
    //       else
    //         return (
    //           <>
    //             {intl.formatMessage({ id: 'commodity.products.columns.currency' })}
    //             {min} ~ {intl.formatMessage({ id: 'commodity.products.columns.currency' })}
    //             {max}
    //           </>
    //         )
    //     }
    //     if (priceType === 3) {
    //       if (max === min) return <>{min}</>
    //       else
    //         return (
    //           <>
    //             {min} ~ {max}
    //           </>
    //         )
    //     }
    //     if (priceType === 2) return null
    //   },
    // },
    {
      title: intl.formatMessage({ id: 'commodity.products.columns.status' }),
      dataIndex: ['draft', 'status'],
      key: 'status',
      render: () => <Tag>{intl.formatMessage({ id: 'commodity.products.products.button.draft' })}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'commodity.products.columns.option' }),
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      width: 160,
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => clickDraftModify(record)}>
            {intl.formatMessage({ id: 'commodity.products.products.button.draft.option1' })}
          </Button>
          <Button type="link" onClick={() => clickDraftDelete(record)}>
            {intl.formatMessage({ id: 'commodity.products.products.button.draft.option2' })}
          </Button>
        </>
      ),
    },
  ]

  const fetchDraftData = (params) => {
    return new Promise((resolve) => {
      getProductCommodityDraftGetCommodityDraftList(params).then((res) => {
        const { data } = res
        console.log(data, 'draft')
        resolve(data)
      })
    })
  }

  return {
    draftColumns,
    fetchDraftData,
  }
}
