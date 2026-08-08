import React from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from 'antd'
import Statement from '@/components/Statement'

/**
 * 物料报表
 */

const Index = () => {
  return (
    <PageHeaderWrapper>
      <Card>
        <Statement url="/superset/dashboard/categoryMaterial" params={{}} />
      </Card>
    </PageHeaderWrapper>
  )
}
export default Index
