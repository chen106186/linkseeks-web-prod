import React, { useEffect, useRef } from 'react'
import { Button, Card, Input, InputNumber, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { librarySearch } from '../schema'
import { history } from '@linkseeks/router-manager'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { getProductPriceMaterielGetMaterielPriceList, getProductPriceMaterielAddMaterielPrice } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getWebIntl } from '@apps/locales'

const formActions = createFormActions()

const translate = getWebIntl()
const PriceLibrary: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const { code } = useQuery()
  const { pathname } = useLocation()

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.wuliaobianhao',
      }),
      dataIndex: 'materielCode',
      key: 'materielCode',
      width: 120,
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.wuliaomingcheng',
      }),
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.guigexinghao',
      }),
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.pinlei',
      }),
      dataIndex: 'customerCategory',
      key: 'customerCategory',
      width: 120,
      render: (text) => text?.name,
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.pinpai',
      }),
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
      render: (text) => text?.name,
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.danwei',
      }),
      dataIndex: 'unitName',
      key: 'unitName',
      width: 120,
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.mulujia',
      }),
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 120,
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.shichangjia',
      }),
      dataIndex: 'marketPrice',
      key: 'marketPrice',
      width: 120,
      render: (text, record) => {
        return (
          <InputNumber
            prefix={translate('web.common.currencySymbol')}
            defaultValue={text}
            onBlur={(e: any) => updatePrice(record, e)}
            onPressEnter={(e: any) => updatePrice(record, e)}
            precision={3}
          />
        )
      },
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.hetongdingdanjia',
      }),
      dataIndex: 'orderPrice',
      key: 'orderPrice',
      width: 160,
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.hetongdingdan',
      }),
      dataIndex: 'code',
      key: 'code',
      width: 160,
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.gongyinghuiyuanID',
      }),
      dataIndex: 'upperMemberId',
      key: 'upperMemberId',
      width: 160,
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.gongyinghuiyuanmingcheng',
      }),
      dataIndex: 'upperMemberName',
      key: 'upperMemberName',
      width: 160,
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.jiageyouxiaocong',
      }),
      dataIndex: 'effectiveStartTime',
      key: 'effectiveStartTime',
      width: 160,
      render: (text) => {
        if (text) {
          const t = text * Math.pow(10, 13 - text.toString().length)
          return formatTimeString(t, 'YYYY-MM-DD')
        }
      },
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.jiageyouxiaodao',
      }),
      dataIndex: 'effectiveEndTime',
      key: 'effectiveEndTime',
      width: 160,
      render: (text) => {
        if (text) {
          const t = text * Math.pow(10, 13 - text.toString().length)
          return formatTimeString(t, 'YYYY-MM-DD')
        }
      },
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.priceStrategy.columns.option',
      }),
      dataIndex: 'option',
      width: 128,
      render: (_text: any, record: any) => {
        return (
          <AuthButton type="custom" code="historicalPrice">
            <Button type="link" className="padLeft0" onClick={() => handleModify(record)}>
              {intl.formatMessage({
                id: 'priceManage.schema.formProduct.zhakanlishijiage',
              })}
            </Button>
          </AuthButton>
        )
      },
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getProductPriceMaterielGetMaterielPriceList({ code, ...params }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const handleModify = (record: any) => {
    history.push(`${pathname}/detail?goodsPriceId=${record.id}`)
  }
  const updatePrice = (record, e) => {
    const val = e.target.value
    if (!val || val === record.marketPrice) {
      return
    }
    const params = {
      materielPriceId: record.id,
      marketPrice: val,
    }
    getProductPriceMaterielAddMaterielPrice(params).then((res) => {
      if (res.code === 1000) {
        message.success(res.message)
      } else {
        message.error(
          intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
        )
      }
    })
  }
  useEffect(() => {
    if (code) {
      formActions.setFieldValue('code', code)
    }
  }, [code])
  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          columns={columns}
          currentRef={ref}
          tableProps={{ rowKey: 'id' }}
          fetchTableData={(params: any) => fetchData(params)}
          scroll={{ x: 1800 }}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              schema={librarySearch}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'code', FORM_FILTER_PATH)
              }}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default PriceLibrary
