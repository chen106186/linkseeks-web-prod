import React, { useEffect, useState } from 'react'
import { Button, message, Pagination, Spin, Empty, Input } from 'antd'
import { SearchIcon } from '@linkseeks/icons'
import { PageHeaderWrapper } from '@apps/components'
import { useIntl } from '@linkseeks/i18n'
import {
  getMemberSupplierAbilityMaintenancePlatformQueryByCategory,
  postMemberSupplierAbilitySubDiscoverInvitation,
  GetMemberSupplierAbilityMaintenancePlatformQueryByCategoryResponseDetail,
} from '@apps/apis'
import useFilterParams from '../hooks/useFilterParams'
import SupplierList from '../components/SupplierList'
import { FILTER_SEARCH_TYPE } from '../components/CommonFilter/types'
import { LAYOUT_TYPE } from '@/constants'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

const SupplierFind: React.FC = () => {
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalCount, setTotalCount] = useState<number>(0)
  const REQUEST_FILTER_TYPE = FILTER_SEARCH_TYPE.silence
  const [keyword, setKeyword] = useState<string>()
  const [supplierList, setSupplierList] = useState<
    GetMemberSupplierAbilityMaintenancePlatformQueryByCategoryResponseDetail[]
  >([])
  const [loading, setLoading] = useState<boolean>(false)
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

    getMemberSupplierAbilityMaintenancePlatformQueryByCategory(param)
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
      const res = await postMemberSupplierAbilitySubDiscoverInvitation({ memberId, roleId })
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
                  id: 'common.material.vendorMemberName.search',
                  defaultMessage: '搜索供应商名称',
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

export default SupplierFind
