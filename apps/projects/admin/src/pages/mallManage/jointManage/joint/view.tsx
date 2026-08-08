import React, { useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import MallItem from '../../services/components/MallItem'
import { Empty, Space } from '@linkseeks/ui'
import { ENVIRONMENT_OPTIONS } from '../../services/constants'
import useMallList from '../../services/hooks/useMallList'

const Joint: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>(ENVIRONMENT_OPTIONS[0].key)
  const { mallList, getDefaultMall, refresh } = useMallList({ environment: activeKey })

  return (
    <PageHeaderWrapper backDom={false} isTabs items={ENVIRONMENT_OPTIONS} onTabChange={(key) => setActiveKey(key)}>
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
    </PageHeaderWrapper>
  )
}

export default Joint
