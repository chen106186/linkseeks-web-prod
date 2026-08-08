import React, { useState, useEffect, useMemo, useContext } from 'react'
import { ISchema, createFormActions } from '@apps/formily'
import { Drawer, Pagination, Button, Space } from 'antd'
import { useSelector } from '@apps/design-react'
import styles from './branchList.less'
import BrandItem from './brandItem'
import { context } from '../../common/context/context'
import { useFilterSameOption } from '../../common/hooks/useFilterSameOption'
import NiceForm from '@/components/NiceForm'
import { getProductCommodityTemplateGetBrandList } from '@apps/apis'

const actions = createFormActions()

const BranchList = (props) => {
  const { visible, value, onCancel, onConfirm } = props
  const fixtureContext = useContext(context)
  const sameKeyState = useFilterSameOption()
  const { activeKey: categoryId } = useSelector<any, 'activeKey'>(['activeKey'])
  const disabledBrandKeys = useMemo(() => sameKeyState[`tabItem_${categoryId}_brand`], [sameKeyState, categoryId])

  const [dataSource, setDataSource] = useState<any>([])
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [innerCheckedKey, setInnerCheckedKey] = useState<null | { name: string; icon: string; id: number }>(null)

  useEffect(() => {
    if (!value || !visible) {
      return
    }
    setInnerCheckedKey(value)
  }, [value, visible])

  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'object',
        'x-component': 'mega-layout',
        'x-component-props': {
          grid: true,
          columns: 3,
        },
        properties: {
          name: {
            type: 'string',
            'x-component-props': {
              placeholder: '搜索',
            },
          },
          btn: {
            type: 'string',
            'x-component': 'Submit',
          },
        },
      },
    },
  }

  const onPaginationChange = (page: number, pageSize?: number) => {
    setCurrent(page)
    setPageSize(pageSize || 10)
    fetchData({
      shopId: fixtureContext?.shopId.toString(),
      categoryId: categoryId.toString(),
      current: page.toString(),
      pageSize: pageSize?.toString() || '10',
    })
  }

  const onSubmit = (values: { name?: string }) => {
    const withName = values.name ? { name: values.name } : {}
    fetchData({
      shopId: fixtureContext?.shopId.toString(),
      categoryId: categoryId.toString(),
      current: current.toString(),
      pageSize: pageSize.toString(),
      ...withName,
    })
  }

  const Submit = () => {
    return (
      <Button type="primary" onClick={() => actions.submit()}>
        提交
      </Button>
    )
  }

  const fetchData = async (params: any) => {
    const { data, code } = await getProductCommodityTemplateGetBrandList(params)
    if (code === 1000) {
      setDataSource(data.data)
      setTotal(data.totalCount)
    }
  }

  useEffect(() => {
    if (!visible) {
      return
    }
    fetchData({
      shopId: fixtureContext?.shopId.toString(),
      categoryId: categoryId.toString(),
      current: current.toString(),
      pageSize: pageSize.toString(),
    })
  }, [visible])

  const onSelect = (checked: boolean, options: { name: string; icon: string; id: number }) => {
    setInnerCheckedKey(options)
  }

  const handleCancel = () => {
    onCancel?.()
  }

  const handleConfirm = () => {
    onConfirm?.(innerCheckedKey)
  }

  return (
    <Drawer
      visible={visible}
      onClose={handleCancel}
      title="选择品牌"
      width={520}
      bodyStyle={{ display: 'flex', flexDirection: 'column', padding: '12px 0 0 12px' }}
      footer={
        <div className={styles.footer}>
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" onClick={handleConfirm}>
              确认
            </Button>
          </Space>
        </div>
      }
    >
      <div className={styles.form}>
        <NiceForm schema={schema} components={{ Submit }} actions={actions} onSubmit={onSubmit} />
      </div>
      <div className={styles.list}>
        {dataSource?.map((_item) => {
          const isChecked = _item.id === innerCheckedKey?.id
          const isDisabled = disabledBrandKeys.includes(_item.id)
          return (
            <div key={_item.id} className={styles.branchItem}>
              <BrandItem
                onSelect={onSelect}
                disabled={isDisabled}
                isChecked={isChecked}
                name={_item.name}
                icon={_item.logoUrl}
                id={_item.id}
              />
            </div>
          )
        })}
      </div>
      <div className={styles.footer}>
        <Pagination onChange={onPaginationChange} current={current} pageSize={pageSize} total={total} />
      </div>
    </Drawer>
  )
}

export default BranchList
