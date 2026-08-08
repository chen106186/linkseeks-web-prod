/**
 * 专题页
 */
import React from 'react'
import { Pagination, Spin } from 'antd'
import useCpecialPage from './hooks'
import styles from './index.less'

const CpecialPage = () => {
  const { loading, total, dataSource, currentPage, currentPageSize, onPageChange } = useCpecialPage()

  return (
    <div className={styles.page}>
      <div className={styles.tablePanenl}>
        <div className={styles.header}>
          <div className={styles.search}>
            {/* <Search
              placeholder={intl.formatMessage({ id: 'activityPage.searchshousuo' })}
              onChange={(e) => onChange(e.target.value)}
              onSearch={handleSearch}
            /> */}
          </div>
          {/* <AuthButton type="custom" code="add">
            <Link to="/marketingAbility/marketingActivitiesManagement/activePage/add">
              <Button icon={<PlusOutlined />} type="primary">
                {intl.formatMessage({ id: 'activityPage.add' })}
              </Button>
            </Link>
          </AuthButton> */}
        </div>
        <Spin spinning={loading} wrapperClassName={styles.body}>
          <div className={styles.table}>
            {dataSource.map((_item, key) => {
              return (
                <div className={styles.tableItem} key={key}>
                  {/* <ActivityItem
                    {..._item}
                    title={_item.name}
                    startTime={_item.startTime as unknown as string}
                    endTime={_item.endTime as unknown as string}
                    onRemove={handleRemove}
                    onChangeStatus={onChangeStatus}
                  /> */}
                </div>
              )
            })}
          </div>
          {total && (
            <div className={styles.footer}>
              <div className={styles.pagination}>
                <Pagination
                  showQuickJumper
                  total={total}
                  pageSize={currentPageSize}
                  current={currentPage}
                  onChange={onPageChange}
                />
              </div>
            </div>
          )}
        </Spin>
      </div>
    </div>
  )
}

export default CpecialPage
