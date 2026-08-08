/*
 * @Description: 供应商
 */
import React from 'react'
import { useRouter } from '@apps/mobile-services/utils/taro'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import Select from '@/components/Select'
import Cell from '@/components/Cell'
import './index.scss'

type SupplierAbilityHomeRouteParams = {}

const SupplierAbilityHome: React.FC = () => {
  const router = useRouter<SupplierAbilityHomeRouteParams>()
  const {
    params: {},
  } = router

  const handleSearch = (value: string) => {
    console.log('value', value)
  }

  const handleLoadMore = () => {
    console.log('????', '加载更多')
  }

  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar title="供应商" />
        </>
      }
    >
      <Cell>
        <Cell.Item title="test" value="123" />
        <Cell.Item
          title="部门"
          value={
            <Select
              title="选择部门"
              placeholder="请输入用户名称/机构/职位"
              searchPlaceholder="请输入用户名称/机构"
              options={[
                {
                  label: '选项1',
                  value: 1,
                },
                {
                  label: '选项2',
                  value: 2,
                },
                {
                  label: '选项3',
                  value: 3,
                  description: '我是描述333',
                },
                {
                  label: '选项4',
                  value: 4,
                  description: '我是描述333',
                },
                {
                  label: '选项5',
                  value: 5,
                  description: '我是描述333',
                },
                {
                  label: '选项6',
                  value: 6,
                  description: '我是描述333',
                },
                {
                  label: '选项7',
                  value: 7,
                  description: '我是描述333',
                },
                {
                  label: '选项8',
                  value: 8,
                  description: '我是描述333',
                },
              ]}
              onSearch={handleSearch}
              onScrollToLower={handleLoadMore}
              customStyle={{
                width: '60%',
              }}
              contentAlign="right"
              multiple
              showSearch
            />
          }
        />
      </Cell>
    </PageLayout>
  )
}

export default SupplierAbilityHome
