import React, { useEffect, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { useIntl } from '@linkseeks/i18n'
import {
  getMemberCustomerAbilityMaintenancePlatformQueryByCategory,
  postMemberCustomerAbilitySubDiscoverInvitation,
  GetMemberCustomerAbilityMaintenancePlatformQueryByCategoryResponseDetail,
} from '@apps/apis'
import useFilterParams from '../hooks/useFilterParams'
import styles from './index.less'
import SupplierList from '../components/SupplierList'
import { Button, message, Pagination, Spin, Empty, Input } from 'antd'
import { SearchIcon } from '@linkseeks/icons'
import { FILTER_SEARCH_TYPE } from '../components/CommonFilter/types'
import { LAYOUT_TYPE } from '@/constants'
import { useWebIntl } from '@apps/locales'

const CustomerFind: React.FC = () => {
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalCount, setTotalCount] = useState<number>(0)
  const REQUEST_FILTER_TYPE = FILTER_SEARCH_TYPE.silence
  const [supplierList, setSupplierList] = useState<
    GetMemberCustomerAbilityMaintenancePlatformQueryByCategoryResponseDetail[]
  >([])
  const [loading, setLoading] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>()
  const translate = useWebIntl()

  const { filterParam, dispatchFilterParam } = useFilterParams({
    filterType: REQUEST_FILTER_TYPE,
    layoutType: LAYOUT_TYPE.mall,
  })

  const intl = useIntl()

  useEffect(() => {
    setCurrent(1)
    fetchDataList(1)
  }, [filterParam])

  const fetchDataList = (currentParam?: number, size?: number) => {
    let param: any = {
      current: currentParam ? currentParam : current,
      pageSize: size ? size : pageSize,
      ...filterParam,
    }

    setLoading(true)

    getMemberCustomerAbilityMaintenancePlatformQueryByCategory(param)
      .then((res) => {
        if (res.code === 1000) {
          setSupplierList(res.data.data)
          setTotalCount(res.data.totalCount)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const handlePageChange = (page: number, size?: number) => {
    setCurrent(page)
    size && setPageSize(size)
    fetchDataList(page, size)
  }

  const handleClick = async (memberId: number, roleId: number) => {
    try {
      const res = await postMemberCustomerAbilitySubDiscoverInvitation({ memberId, roleId })
      if (res.code === 1000) {
        message.destroy()
        message.success(translate('web.resource.member.yaoqingchenggong'))
        fetchDataList(1)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <PageHeaderWrapper>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.tool_bar_wrap}>
            <div className={styles.search_input_wrap}>
              <Input
                placeholder={intl.formatMessage({
                  id: 'customerAbility.memberInspection.common.schema.add.searchMemberName',
                  defaultMessage: '搜索客户名称',
                })}
                allowClear
                className={styles.search_input}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={(e: any) => {
                  dispatchFilterParam({
                    memberName: e.target.value,
                  })
                }}
              />
              <div
                className={styles.search_btn}
                onClick={() => {
                  dispatchFilterParam({
                    memberName: keyword,
                  })
                }}
              >
                <SearchIcon className={styles.search_icon} />
              </div>
            </div>
          </div>
          <Spin spinning={loading}>
            {supplierList.length > 0 ? (
              <SupplierList source={supplierList} itemOnClick={handleClick} />
            ) : (
              <Empty style={{ marginTop: 150 }} />
            )}
          </Spin>
          {totalCount > 10 ? (
            <div className={styles.pagination_wrap}>
              <Pagination
                showQuickJumper={{
                  goButton: (
                    <Button style={{ position: 'relative', top: '-2px', marginLeft: 12 }}>
                      {intl.formatMessage({ id: 'agentOrder.btn.sure' })}
                    </Button>
                  ),
                }}
                showTotal={(total) => (
                  <span style={{ color: '#91959B' }}>
                    {intl.formatMessage({ id: 'agentOrder.text.common' })} {Math.ceil(total / pageSize)}{' '}
                    {intl.formatMessage({ id: 'agentOrder.text.page' })}
                  </span>
                )}
                onChange={handlePageChange}
                current={current}
                pageSize={pageSize}
                total={totalCount}
              />
            </div>
          ) : null}
        </div>
      </div>
    </PageHeaderWrapper>
  )
}

export default CustomerFind
