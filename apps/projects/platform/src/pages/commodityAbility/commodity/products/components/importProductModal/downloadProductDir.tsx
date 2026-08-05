import React, { useMemo } from 'react'
import { LineTitle, StandardFormTable } from '@apps/components'
import { Alert } from 'antd'
import { useWebIntl } from '@apps/locales'
import { getProductCustomerGetCustomerCategoryTree } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useProductList } from '../../services/useProductlist'

interface IProps {
  tableRef: any
}

const DownloadProductDir: React.FC<IProps> = ({ tableRef }) => {
  const translate = useWebIntl()
  const { fetchData } = useProductList()
  const { data: _categoryData } = useRequestApi(getProductCustomerGetCustomerCategoryTree)

  const categoryData = useMemo(() => {
    const transform = (list) =>
      list.map((v) => ({
        label: v.name,
        value: v.id,
        children: v.children ? transform(v.children) : null,
      }))
    return _categoryData ? transform(_categoryData) : []
  }, [_categoryData])

  const columns = StandardFormTable.createColumns([
    {
      title: translate('web.resource.commodity.ID'),
      key: 'id',
      searchField: 'Input',
    },
    {
      title: translate('web.resource.commodity.name'),
      key: 'name',
      searchField: {
        main: true,
        type: 'Input',
      },
    },
    {
      title: translate('web.resource.commodity.category'),
      dataIndex: 'customerCategoryName',
      key: 'customerCategoryName',
      searchField: {
        type: 'Cascader',
        name: 'customerCategoryId',
        valueEnum: categoryData,
      },
    },
    {
      title: translate('web.resource.commodity.brand'),
      key: 'brandName',
    },
    {
      title: translate('web.common.unit'),
      key: 'unitName',
    },
  ])

  return (
    <div>
      <Alert
        showIcon
        message={translate('web.resource.commodity.shangjiazhongdeshangpinbuzhichidaorutupian')}
        type="warning"
      />
      <LineTitle style={{ marginTop: 16 }}>{translate('web.resource.commodity.xuanzeshangpin')}</LineTitle>
      <StandardFormTable
        bodyStyle={{ padding: 0 }}
        actionRef={tableRef}
        isRowSelection
        columns={columns}
        request={(params) => fetchData({ ...params, statusList: [1, 3, 4, 6] })}
      />
    </div>
  )
}

export default DownloadProductDir
