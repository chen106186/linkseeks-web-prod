import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Drawer, Table, Button, Space, Pagination } from 'antd'
import { useIntl, getIntl } from '@linkseeks/i18n'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { ColumnsType } from 'antd/es/table'
import { GetMarketingAdornMerchantActivityListAdornResponseDetail } from '@apps/apis'
import StatusTag from '@/components/StatusTag'
import schema from './schema'
import styles from './activityProductDrawer.less'
import ActivityItem from './activityItem'

const intl = getIntl()

const actions = createFormActions()
interface Iprops {
  visible: boolean
  onCancel: (() => void) | null
  fetchData?: ((params: any) => Promise<any>) | null
  onOk?: ((data: any) => void) | null
  /** 传入的已选择的活动商品 */
  products: any[]
  activityImage: string
  mode?: 'radio' | 'checked'
  disabledKeys?: number[]
}

type SubmitType = {
  id: number
  activityName: string
}

const columns: ColumnsType<GetMarketingAdornMerchantActivityListAdornResponseDetail['goodsList'][0]> = [
  {
    title: intl.formatMessage({ id: 'editor.drawer.activity.columns.productInfo' }),
    dataIndex: 'productInfo',
    render: (_text, _record) => {
      return (
        <Space align="center">
          <img src={_record.productImgUrl} className={styles.productImg} />
          <span className={styles.productName}>{_record.productName}</span>
        </Space>
      )
    },
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.category' }),
    dataIndex: 'category',
    render: (_text) => {
      return <StatusTag title={_text} type="default" />
    },
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.brand' }),
    dataIndex: 'brand',
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.unit' }),
    dataIndex: 'unit',
    render: (_text, _record) => {
      return (
        <div className={styles.priceInfo}>
          <span>
            {getIntl().formatMessage({ id: 'common.money' })}
            {_record.price}
          </span>
          <span className={styles.unit}>({_record.unit})</span>
        </div>
      )
    },
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.activityPrice' }),
    dataIndex: 'activityPrice',
    render: (_text, _record) => {
      return (
        <div className={styles.priceInfo}>
          <span>
            {getIntl().formatMessage({ id: 'common.money' })}
            {_record.activityPrice || _record.price}
          </span>
          <span className={styles.unit}>({_record.unit})</span>
        </div>
      )
    },
  },
]

const ActivityProductDrawer: React.FC<Iprops> = (props: Iprops) => {
  const {
    visible,
    onCancel,
    fetchData = null,
    onOk,
    products = [],
    activityImage,
    disabledKeys,
    mode = 'checked',
  } = props
  const [current, setPage] = useState<number>(1)
  const [currentPageSize, setPageSize] = useState<number>(10)
  const [dataSource, setDataSource] = useState<GetMarketingAdornMerchantActivityListAdornResponseDetail[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [selectedKey, setSelectKey] = useState<number | null>(null)
  const [selectedActivityProductList, setSelectedActivityProductList] =
    useState<GetMarketingAdornMerchantActivityListAdornResponseDetail['goodsList']>()
  const [checkedProduct, setCheckedProduct] = useState<
    GetMarketingAdornMerchantActivityListAdornResponseDetail['goodsList']
  >([])
  const [loading, setLoading] = useState<boolean>(false)
  const intl = useIntl()

  const selectedRowKeys = useMemo(
    () => checkedProduct.map((_item) => `${_item.activityId!}-${_item.id!}`),
    [checkedProduct],
  )

  const fetchList = useCallback(
    async (params: any) => {
      if (fetchData === null) {
        return
      }
      setLoading(true)
      const { data, code } = await fetchData(params)
      if (code === 1000) {
        batchedUpdates(() => {
          setLoading(false)
          setDataSource(data.data)
          setTotalCount(data.totalCount)
        })
      }
    },
    [fetchData],
  )

  useEffect(() => {
    if (!visible) {
      return
    }
    setCheckedProduct(products)
    fetchList({ current, pageSize: currentPageSize })
  }, [current, currentPageSize, visible])

  const onSubmit = (value: SubmitType) => {
    console.log(value)
    fetchList({ current, pageSize: currentPageSize, ...value })
  }

  const onReset = () => {
    // actions.reset();
    fetchList({ current, pageSize: currentPageSize })
  }

  // useEffect(() => {})
  const handleCancel = () => {
    setSelectedActivityProductList([])
    onCancel?.()
  }

  const onChange = (page: number, pageSize?: number) => {
    batchedUpdates(() => {
      setPage(page)
      setPageSize(pageSize || 10)
    })
  }

  const onSelect = (id: number) => {
    setSelectKey(id)
    const target = dataSource.filter((_item) => _item.id === id)[0]
    setSelectedActivityProductList(target.goodsList)
  }

  const handleOk = () => {
    onOk?.(checkedProduct)
  }

  const handleRowSelect = (
    record: GetMarketingAdornMerchantActivityListAdornResponseDetail['goodsList'][0],
    selected: boolean,
    selectedRows: GetMarketingAdornMerchantActivityListAdornResponseDetail['goodsList'],
  ) => {
    if (mode === 'checked') {
      if (selected) {
        setCheckedProduct((prev) => prev.concat(record))
      } else {
        const key = `${record.activityId!}-${record.id!}`
        setCheckedProduct((prev) =>
          prev.filter((_item) => {
            const tempKey = `${_item.activityId}-${_item.id}`
            return key !== tempKey
          }),
        )
      }
      return
    }
    setCheckedProduct([record])
  }

  const rowSelection = {
    type: mode,
    onSelect: handleRowSelect,
    selectedRowKeys: selectedRowKeys,
    getCheckboxProps: (record: any) => ({
      disabled: disabledKeys?.includes(record.id), // Column configuration not to be checked
    }),
  }

  const drawerStyle = { background: '#FAFBFC' }

  return (
    <Drawer
      onClose={handleCancel}
      headerStyle={drawerStyle}
      bodyStyle={drawerStyle}
      footerStyle={drawerStyle}
      title={intl.formatMessage({ id: 'editor.drawer.activity.product.title' })}
      open={visible}
      width={950}
      footer={
        <div className={styles.drawerFooter}>
          <Space>
            <Button onClick={handleCancel}>{intl.formatMessage({ id: 'common.button.cancel' })}</Button>
            <Button onClick={handleOk}>{intl.formatMessage({ id: 'common.button.confirm' })}</Button>
          </Space>
        </div>
      }
    >
      <div className={styles.container}>
        <div className={styles.form}>
          <NiceForm
            schema={schema}
            actions={actions}
            onReset={onReset}
            onSubmit={onSubmit}
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'id', FORM_FILTER_PATH)
            }}
          ></NiceForm>
        </div>
        <div className={styles.table}>
          {dataSource?.map((_item) => {
            const { outerStatusName, id, activityName, activityTypeName } = _item
            const isActive = selectedKey === id
            const hasChildSelected = selectedRowKeys.some((_rowKey) => _rowKey.split('-')[0] === id.toString())
            return (
              <div key={_item.id} className={styles.activeItem}>
                <ActivityItem
                  onSelect={onSelect}
                  isActive={isActive}
                  id={id}
                  activityName={activityName}
                  statusName={outerStatusName}
                  activityTypeName={activityTypeName}
                  hasChildSelected={hasChildSelected}
                  activityImage={activityImage}
                />
              </div>
            )
          })}
        </div>
        <div className={styles.expandableTable}>
          <Table
            rowSelection={rowSelection as any}
            rowKey={(_record) => `${_record.activityId!}-${_record.id!}`}
            loading={loading}
            pagination={false}
            columns={columns}
            dataSource={selectedActivityProductList}
          ></Table>
        </div>
        <div className={styles.pagination}>
          <Pagination
            pageSize={currentPageSize}
            current={current}
            showQuickJumper
            total={totalCount}
            onChange={onChange}
          />
        </div>
      </div>
    </Drawer>
  )
}

export default ActivityProductDrawer
