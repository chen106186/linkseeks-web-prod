import { useIntl } from '@linkseeks/i18n'
import React, { useEffect, useMemo, useState } from 'react'
import { Drawer, Space, Button, Pagination, Spin } from 'antd'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { GetCommodityWebPageTemplateWebFindAllActivityTemplateResponseDetail } from '@apps/apis'
import ActivityTemplateItem from '../ActivityTemplateItem'

type ValueType = {
  templateId: number
  templateName: string
  templatePicUrl: string
}

interface Iprops {
  visible: boolean
  submitLoading?: boolean
  onSubmit?: ((data: any) => void) | null
  onCancel?: (() => void) | null
  fetchData?: ((params: any) => Promise<any>) | null
  value?: ValueType | null
}

const TemplateDrawer: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { visible, onSubmit = null, onCancel = null, submitLoading = false, value = null, fetchData = null } = props
  const [selectRow, setSelectRow] = useState<null | ValueType>(value)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [dataSource, setDataSource] = useState<GetCommodityWebPageTemplateWebFindAllActivityTemplateResponseDetail[]>(
    [],
  )
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!visible) {
      return
    }
    setSelectRow(value)
  }, [visible, value])

  const fetchList = async (params: { current: number; pageSize: number }) => {
    if (!fetchData) {
      return
    }
    setLoading(true)
    const res = await fetchData(params)
    batchedUpdates(() => {
      setLoading(false)
      setDataSource(res.data)
      setTotal(res.totalCount)
    })
  }

  useEffect(() => {
    if (!visible) {
      return
    }
    fetchList({ current: page, pageSize: pageSize })
  }, [visible, page, pageSize])

  const drawerStyle = useMemo(() => {
    return {
      backgroundColor: '#FAFBFC',
    }
  }, [])

  /** 这里需要修改类型 */
  const handleSubmit = () => {
    console.log('submit', selectRow)
    onSubmit?.(selectRow as any)
  }

  const handleCancel = () => {
    setSelectRow(value)
    onCancel?.()
  }

  const onSelect = (
    selected: boolean,
    postData: GetCommodityWebPageTemplateWebFindAllActivityTemplateResponseDetail,
  ) => {
    if (!selected) {
      return
    }
    const data = {
      templateId: postData.id,
      templateName: postData.templateName,
      templatePicUrl: postData.templatePicUrl,
    }
    setSelectRow(data)
  }

  const onChange = (current: number, currentPageSize?: number) => {
    batchedUpdates(() => {
      setPage(current)
      setPageSize(currentPageSize || 10)
    })
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'activityPage.chooseActivityTemplate' })}
      width={800}
      onClose={handleCancel}
      visible={visible}
      drawerStyle={drawerStyle}
      headerStyle={drawerStyle}
      footerStyle={drawerStyle}
      footer={
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Space>
            <Button onClick={handleCancel}>{intl.formatMessage({ id: 'common.button.cancel' })}</Button>
            <Button type="primary" loading={submitLoading} onClick={handleSubmit}>
              {intl.formatMessage({ id: 'common.button.confirm' })}
            </Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1 }}>
          {dataSource?.map((_item) => {
            const checked = selectRow?.templateId === _item.id
            return <ActivityTemplateItem key={_item.id} dataSource={_item} checked={checked} onSelect={onSelect} />
          })}
        </div>
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'row-reverse' }}>
          <Pagination showQuickJumper total={total} onChange={onChange} />
        </div>
      </div>
    </Drawer>
  )
}

export default TemplateDrawer
