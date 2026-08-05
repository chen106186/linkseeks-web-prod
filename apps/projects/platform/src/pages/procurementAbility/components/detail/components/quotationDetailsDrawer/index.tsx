import React, { useRef, useCallback, useEffect } from 'react'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { Space, Button, Typography, Drawer } from 'antd'

import { priceFormat } from '@/utils/numberFomat'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchSelectGetSelectCategoryOptionEffect } from '@/pages/transaction/effect/index'
import { Numberify } from '@ctrl/tinycolor'
import { getIntl } from '@linkseeks/i18n'

const { Text } = Typography
const formActions = createFormActions()

const intl = getIntl()
interface QuotationDetailsDrawerProps {
  visible: boolean
  effects: any
  fetch: Promise<any>
  quotationDetailsId: any
  onClose: () => void
}

const QuotationDetailsDrawer: React.FC<QuotationDetailsDrawerProps> = (props: any) => {
  const { visible, onClose, effects, fetch, quotationDetailsId } = props
  const tableRef = useRef<any>({})
  useEffect(() => {
    tableRef.current?.reload && tableRef.current?.reloadCurrent()
  }, [quotationDetailsId])
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.id' }),
      align: 'center',
      dataIndex: 'id',
      key: 'id',
      render: (t, r, i) => ++i,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.materialCode2' }),
      key: 'number',
      dataIndex: 'number',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">{text}</Text>
          <Text type="secondary">{record.name}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.nameCode' }),
      key: 'model',
      dataIndex: 'model',
      render: (text: any, record: any) => text,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
      key: 'category',
      dataIndex: 'category',
      render: (text: any, record: any) => text,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.brand' }),
      key: 'brand',
      dataIndex: 'brand',
      render: (text: any, record: any) => text,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.purchaseCount1' }),
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">{text}</Text>
          <Text type="secondary">{record.unit}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.isTax1' }),
      key: 'isTax',
      dataIndex: 'isTax',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">
            {text === 1
              ? intl.formatMessage({ id: 'detail.purchase.okText' })
              : intl.formatMessage({ id: 'detail.purchase.cancelText' })}
          </Text>
          <Text type="secondary">{record.taxRate}%</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.taxUnitPrice' }),
      key: 'unitPrice',
      dataIndex: 'unitPrice',
      render: (text: any, record: any) => `${intl.formatMessage({ id: 'common.money' })}${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.taxPrice' }),
      key: 'price',
      dataIndex: 'price',
      render: (text: any, record: any) => `${intl.formatMessage({ id: 'common.money' })}${priceFormat(text)}`,
    },
  ]

  /** 列表数据 */
  const fetchData = useCallback(
    (params?: any) => {
      return new Promise((resolve, reject) => {
        visible &&
          fetch({
            memberId: quotationDetailsId.memberId,
            memberRoleId: quotationDetailsId.memberRoleId,
            onlineBiddingId: quotationDetailsId.onlineBiddingId,
            ...params,
          })
            .then((res) => {
              resolve(res.data)
            })
            .catch((error) => {
              console.warn(error)
            })
      })
    },
    [quotationDetailsId],
  )

  // 搜索
  const search = (values: any) => {
    tableRef.current.reload(values)
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'detail.purchase.modalTitle13' })}
      width={1000}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'detail.purchase.cancel' })}
          </Button>
          <Button onClick={onClose} type="primary">
            {intl.formatMessage({ id: 'table.purchase.confirm' })}
          </Button>
        </div>
      }
    >
      <StandardTable
        keepAlive={false}
        currentRef={tableRef}
        columns={columns}
        tableProps={{ rowKew: 'id' }}
        fetchTableData={(params: any) => fetchData(params)}
        controlRender={
          <NiceForm
            actions={formActions}
            onSubmit={(values) => search(values)}
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, effects, FORM_FILTER_PATH)
              FormEffectHooks.onFieldChange$('category').subscribe((state) => {
                searchSelectGetSelectCategoryOptionEffect(actions, 'category')
              })
            }}
          ></NiceForm>
        }
      />
    </Drawer>
  )
}
export default QuotationDetailsDrawer
