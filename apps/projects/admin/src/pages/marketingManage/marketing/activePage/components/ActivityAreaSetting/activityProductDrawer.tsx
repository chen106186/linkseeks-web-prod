import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Drawer, Table, Button, Space, Pagination, Spin } from 'antd'
import { differenceWith, omit } from 'lodash'
import { createFormActions } from '@apps/formily'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import schema from './schema'
import styles from './activityProductDrawer.less'
import ActivityItem from './activityItem'
import StatusTag from '@/components/StatusTag'
import {
  GetMarketingAdornPlatformActivityListAdornResponseDetail,
  getMarketingPlatformActivityGetActivityTypeList,
} from '@apps/apis'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import NiceForm from '@/components/NiceForm'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'

const actions = createFormActions()
type GoodListType = GetMarketingAdornPlatformActivityListAdornResponseDetail['goodsList']
interface Iprops {
  visible: boolean
  onCancel: (() => void) | null
  fetchData?: ((params: any) => Promise<any>) | null
  onOk?: ((data: any) => void) | null
  /** 传入的已选择的活动商品 */
  products: GoodListType[]
  activityImage: string
  mode?: 'radio' | 'checked'
  /**  mode === 'radio'的时候， 禁用的的活动商品 [`${id}_${activityId}`]   */
  disabledList?: string[]
  /** 去除某些高级筛选 */
  ignoresFilters?: string[]
}

type SubmitType = {
  id: number
  activityName: string
  activityType: number
  productName: string
  merchantName: string
  startTime: string
  endTime: string
}

const columns: ColumnsType<GoodListType[0]> = [
  {
    title: '商品信息',
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
    title: '品类',
    dataIndex: 'category',
    render: (_text) => {
      return <StatusTag title={_text} type="default" />
    },
  },
  {
    title: '品牌',
    dataIndex: 'brand',
  },
  {
    title: '商家名称',
    dataIndex: 'memberName',
  },
  {
    title: '单价',
    dataIndex: 'unit',
    render: (_text, _record) => {
      return (
        <div className={styles.priceInfo}>
          <span>￥{_record.price}</span>
          <span className={styles.unit}>({_record.unit})</span>
        </div>
      )
    },
  },
  {
    title: '活动价',
    dataIndex: 'activityPrice',
    render: (_text, _record) => {
      return (
        <div className={styles.priceInfo}>
          <span>￥{_record.activityPrice || _record.plummetPrice || _record.price}</span>
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
    mode = 'checked',
    disabledList = [],
    ignoresFilters = [],
  } = props
  const [current, setPage] = useState<number>(1)
  const [currentPageSize, setPageSize] = useState<number>(10)
  const [dataSource, setDataSource] = useState<GetMarketingAdornPlatformActivityListAdornResponseDetail[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [selectedKey, setSelectKey] = useState<number | null>(null)
  const [selectedActivityProductList, setSelectedActivityProductList] = useState<GoodListType>([])
  const [checkedProduct, setCheckedProduct] = useState<GoodListType>([])
  const [loading, setLoading] = useState<boolean>(false)

  const selectedRowKeys = useMemo(
    () => checkedProduct.map((_item) => `${_item.activityId!}-${_item.id!}`),
    [checkedProduct],
  )

  const ignoredSchema = useMemo(() => {
    const ignoreData = ignoresFilters.map(
      (_item) => `properties.megaLayout.properties.FORM_FILTER_PATH.properties.${_item}`,
    )
    return omit(schema, ignoreData)
  }, [ignoresFilters])

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
          setSelectedActivityProductList([])
          setSelectKey(null)
        })
      }
    },
    [fetchData],
  )

  useEffect(() => {
    if (!visible) {
      setSelectedActivityProductList([])
      return
    }
    setCheckedProduct(products as any[])
    fetchList({ current, pageSize: currentPageSize })
  }, [current, currentPageSize, visible])

  const onSubmit = (value: SubmitType) => {
    const { startTime, endTime, ...rest } = value
    const time = startTime
      ? {
          startTime: moment(startTime).valueOf(),
          endTime: moment(endTime).valueOf(),
        }
      : {}
    const postData = {
      ...time,
      ...rest,
    }
    fetchList({ current, pageSize: currentPageSize, ...postData })
  }

  const onReset = () => {
    // actions.reset();
    fetchList({ current, pageSize: currentPageSize })
  }

  // useEffect(() => {})
  const handleCancel = () => {
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

  const fetchPrimaryOption = async () => {
    const { data, code } = await getMarketingPlatformActivityGetActivityTypeList()
    if (code !== 1000) {
      return []
    }
    return data
  }

  const handleRowSelect = (record: GoodListType[0], selected: boolean, selectedRows: GoodListType) => {
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

  const handleSelectAll = (
    selected: boolean,
    selectedRows: any[],
    changeRows: GetMarketingAdornPlatformActivityListAdornResponseDetail['goodsList'],
  ) => {
    if (selected) {
      setCheckedProduct((prev) => prev.concat(changeRows as any))
      return
    }
    const differentList = differenceWith(checkedProduct, changeRows, (a, b) => {
      return a.activityId === b.activityId && a.id === b.id
    })
    setCheckedProduct(differentList)
  }

  const rowSelection = {
    type: mode,
    onSelect: handleRowSelect,
    onSelectAll: handleSelectAll,
    selectedRowKeys: selectedRowKeys,
    getCheckboxProps: (_record: GoodListType[0]) => ({
      disabled: mode === 'radio' ? disabledList.includes(`${_record.id}_${_record.activityId}`) : false,
    }),
  }

  const drawerStyle = { background: '#FAFBFC' }

  return (
    <Drawer
      onClose={handleCancel}
      headerStyle={drawerStyle}
      bodyStyle={drawerStyle}
      footerStyle={drawerStyle}
      title="选择活动商品"
      open={visible}
      width={950}
      footer={
        <div className={styles.drawerFooter}>
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button onClick={handleOk}>确定</Button>
          </Space>
        </div>
      }
    >
      <div className={styles.container}>
        <div className={styles.form}>
          <NiceForm
            schema={ignoredSchema}
            actions={actions}
            onReset={onReset}
            onSubmit={onSubmit}
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'id', FORM_FILTER_PATH)
              useAsyncSelect('activityType', fetchPrimaryOption, ['name', 'status'])
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
          />
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
