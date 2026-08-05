import React, { useEffect, useMemo, useState } from 'react'
import { Input, Button, Pagination, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { useDebounce } from '@linkseeks/hooks'
import { Link } from '@linkseeks/router-core'
import moment from 'moment'
import { PageHeaderWrapper, AddAuthButton } from '@apps/components'
import ActivityItem from './components/ActivityItem'
import styles from './index.less'
import SearchPannel from './components/SearchPannel'
import {
  GetMarketingWebActivityPagePageResponseDetail,
  GetMarketingWebActivityPagePageRequest,
  getMarketingWebActivityPagePage,
  postMarketingWebActivityPageDelete,
  postMarketingWebActivityPageOpenOffLine,
} from '@apps/apis'

const { Search } = Input

type SearchParamsType = {
  status?: number[]
  startTime?: string
  endTime?: string
  environment?: number[]
  name?: string
}

const PLATFORM = 1

const ActivePage = () => {
  const [currentPage, setPage] = useState<number>(1)
  const [currentPageSize, setPageSize] = useState<number>(10)
  const [searchParams, setSearchParams] = useState<SearchParamsType | null>(null)
  const cacheData = useMemo(
    () => ({ ...searchParams, current: currentPage, pageSize: currentPageSize, type: PLATFORM }),
    [searchParams, currentPage, currentPageSize],
  )
  const debouncedValue = useDebounce(cacheData, 1500)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<GetMarketingWebActivityPagePageResponseDetail[]>([])
  const [total, setTotal] = useState<number>(0)
  const [searchInput, setSearchInput] = useState<string>('')

  const onPaginationChange = (page: number, pageSize?: number) => {
    batchedUpdates(() => {
      setPage(page)
      setPageSize(pageSize || 10)
    })
  }

  const onSearchChange = (values: SearchParamsType) => {
    const { startTime, endTime, ...rest } = values
    const postData = {
      startTime: (startTime && moment(startTime, 'YYYY-MM-DD HH:mm:ss').valueOf()) || null,
      endTime: (endTime && moment(endTime, 'YYYY-MM-DD HH:mm:ss').valueOf()) || null,
      ...rest,
    }
    setSearchParams(postData as any)
  }

  const getData = async (params: GetMarketingWebActivityPagePageRequest) => {
    setLoading(true)
    const { data, code } = await getMarketingWebActivityPagePage(params)
    setLoading(false)
    if (code === 1000) {
      setTotal(data.totalCount)
      setDataSource(data.data)
    }
  }

  useEffect(() => {
    getData({ ...debouncedValue, name: searchInput } as unknown as GetMarketingWebActivityPagePageRequest)
  }, [debouncedValue])

  const handleRemove = async (id: number) => {
    const { data, code } = await postMarketingWebActivityPageDelete({ id })
    if (code === 1000) {
      getData({ ...debouncedValue, name: searchInput } as unknown as GetMarketingWebActivityPagePageRequest)
    }
  }

  const onChangeStatus = async (id: number, status) => {
    const { data, code } = await postMarketingWebActivityPageOpenOffLine({
      id,
      status,
    })
    if (code === 1000) {
      getData({ ...debouncedValue, name: searchInput } as unknown as GetMarketingWebActivityPagePageRequest)
    }
  }

  const onChange = (value: string) => {
    setSearchInput(value)
  }

  const handleSearch = () => {
    getData({ ...debouncedValue, name: searchInput } as unknown as GetMarketingWebActivityPagePageRequest)
  }

  return (
    <PageHeaderWrapper backDom={false}>
      <div className={styles.page}>
        <div className={styles.searchPannel}>
          <SearchPannel onFormValueChange={onSearchChange} />
        </div>
        <div className={styles.tablePanenl}>
          <div className={styles.header}>
            <div className={styles.search}>
              <Search placeholder="搜索" onChange={(e) => onChange(e.target.value)} onSearch={handleSearch} />
            </div>
            <AddAuthButton>
              <Link to="/marketingManage/marketing/activePage/add">
                <Button icon={<PlusOutlined />} type="primary">
                  新增
                </Button>
              </Link>
            </AddAuthButton>
          </div>
          <Spin spinning={loading} wrapperClassName={styles.body}>
            <div className={styles.table}>
              {dataSource.map((_item, key) => {
                return (
                  <div className={styles.tableItem} key={key}>
                    <ActivityItem
                      id={_item.id}
                      templatePicUrl={_item.templatePicUrl}
                      title={_item.name}
                      statusName={_item.statusName}
                      shopName={_item.shopName}
                      startTime={_item.startTime}
                      endTime={_item.endTime}
                      environment={_item.environment}
                      status={_item.status}
                      onRemove={handleRemove}
                      onChangeStatus={onChangeStatus}
                      url={_item.url}
                    />
                  </div>
                )
              })}
            </div>
            <div className={styles.footer}>
              {(total > 0 && (
                <div className={styles.pagination}>
                  <Pagination
                    showQuickJumper
                    total={total}
                    pageSize={currentPageSize}
                    current={currentPage}
                    onChange={onPaginationChange}
                  />
                </div>
              )) ||
                null}
            </div>
          </Spin>
        </div>
      </div>
    </PageHeaderWrapper>
  )
}

export default ActivePage
