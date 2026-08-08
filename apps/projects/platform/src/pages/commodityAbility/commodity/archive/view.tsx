/** 归档商品 */
import React, { useMemo } from 'react'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import { ProductProvider, useProduct } from '../products/services/context'
import { useProductList } from '../products/services/useProductlist'

const ArchiveCommodity: React.FC = () => {
  const { mainTableRef } = useProduct()
  const { columns, fetchData } = useProductList()

  const archiveColumns = useMemo(() => {
    return columns
      .map((item) => {
        if (item.key === 'option') {
          return {
            ...item,
            width: 80,
            formatPayload: {
              controlList: item.formatPayload?.controlList.filter((child) => child.key === 'copy'),
            },
          }
        }
        return item
      })
      .filter((item) => item.key !== 'applyTime')
  }, [columns])

  return (
    <PageHeaderWrapper backDom>
      <StandardFormTable
        columns={archiveColumns}
        actionRef={mainTableRef}
        rowKey="id"
        isRowSelection
        tabsDefaultAll={false}
        autoScrollX
        request={(params) => fetchData({ ...params, statusList: [8] })}
      />
    </PageHeaderWrapper>
  )
}

export default () => (
  <ProductProvider>
    <ArchiveCommodity />
  </ProductProvider>
)
