import { useState } from 'react'
import { Spin, Space, Empty } from '@linkseeks/ui'
import { PageHeaderWrapper } from '@apps/components'
import { ENVIRONMENT_OPTIONS } from '@/constants/environment'
import MallItem from '../../services/components/MallItem'
import useMallList from '../../services/hooks/useMallList'

const OwnMallConfigure = () => {
  const [activeKey, setActiveKey] = useState<string>('0')
  const { mallList, loading, getDefaultMall, refresh } = useMallList({ environment: activeKey })

  const getItems = () => {
    return ENVIRONMENT_OPTIONS.map((item) => ({
      label: item.label,
      key: item.key,
    }))
  }

  return (
    <PageHeaderWrapper isTabs items={getItems()} onTabChange={(key) => setActiveKey(key)}>
      <Spin spinning={loading}>
        {mallList && mallList.length > 0 ? (
          <Space size={8} direction="vertical" style={{ width: '100%' }}>
            {mallList.map((item, index) => (
              <MallItem
                mallInfo={item}
                key={`${item.id}-${index}`}
                defaultMall={getDefaultMall(item)}
                onRefresh={refresh}
              />
            ))}
          </Space>
        ) : (
          <Empty style={{ paddingTop: 88 }} />
        )}
      </Spin>
    </PageHeaderWrapper>
  )
}
export default OwnMallConfigure
