import React, { useEffect, useMemo, useState } from 'react'
import { Input, Button, Pagination, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { useDebounce } from '@linkseeks/hooks'
import { Link } from '@linkseeks/router-core'
import moment from 'moment'
import ActivityItem from './components/ActivityItem'
import styles from './index.less'
import SearchPannel from './components/SearchPannel'
import {
  getMarketingWebActivityPagePage,
  GetMarketingWebActivityPagePageRequest,
  GetMarketingWebActivityPagePageResponseDetail,
  postMarketingWebActivityPageDelete,
  postMarketingWebActivityPageOpenOffLine,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { AuthButton } from '@apps/components'

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
  const intl = useIntl()
  const [currentPage, setPage] = useState<number>(1)
  const [currentPageSize, setPageSize] = useState<number>(10)
  const [searchParams, setSearchParams] = useState<SearchParamsType | null>(null)
  const cacheData = useMemo(
    () => ({ ...searchParams, current: currentPage, pageSize: currentPageSize, type: PLATFORM }),
    [searchParams, currentPage, currentPageSize],
  )
  const debouncedValue = useDebounce(cacheData, 1000)
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
    const { startTime, endTime, status, environment, ...rest } = values
    console.log(values, 'values')
    const postData = {
      startTime: (startTime && moment(startTime, 'YYYY-MM-DD HH:mm:ss').valueOf()) || null,
      endTime: (endTime && moment(endTime, 'YYYY-MM-DD HH:mm:ss').valueOf()) || null,
      status: status?.join(''),
      environment: environment?.join(''),
      ...rest,
    }
    setSearchParams(postData as any)
  }

  const getData = async (params: GetMarketingWebActivityPagePageRequest) => {
    setLoading(true)
    /** 这里type = 2 是能力中心， 因为平台后台跟能力中心用的是同一个接口 */
    const { data, code } = await getMarketingWebActivityPagePage({ ...params, type: '2' })
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
    getData({ ...debouncedValue, name: searchInput } as any)
  }

  return (
    <div className={styles.page}>
      <div className={styles.searchPannel}>
        <SearchPannel onFormValueChange={onSearchChange} />
      </div>
      <div className={styles.tablePanenl}>
        <div className={styles.header}>
          <div className={styles.search}>
            <Search
              placeholder={intl.formatMessage({ id: 'activityPage.searchshousuo' })}
              onChange={(e) => onChange(e.target.value)}
              onSearch={handleSearch}
            />
          </div>
          <AuthButton type="custom" code="add">
            <Link to="/marketingAbility/marketingActivitiesManagement/activePage/add">
              <Button icon={<PlusOutlined />} type="primary">
                {intl.formatMessage({ id: 'activityPage.add' })}
              </Button>
            </Link>
          </AuthButton>
        </div>
        <Spin spinning={loading} wrapperClassName={styles.body}>
          <div className={styles.table}>
            {dataSource.map((_item, key) => {
              return (
                <div className={styles.tableItem} key={key}>
                  <ActivityItem
                    {..._item}
                    title={_item.name}
                    startTime={_item.startTime as unknown as string}
                    endTime={_item.endTime as unknown as string}
                    onRemove={handleRemove}
                    onChangeStatus={onChangeStatus}
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
  )
}

export default ActivePage
