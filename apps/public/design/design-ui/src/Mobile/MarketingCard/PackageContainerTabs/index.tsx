import React, { useMemo, useEffect } from 'react'

import { Tabs } from 'antd'

const { TabPane } = Tabs

interface PackageContainerTabsProps {
  children?: any
  className?: string
  onTabsChange?: any
}

const PackageContainerTabs: React.FC<PackageContainerTabsProps> = (
  props: PackageContainerTabsProps,
) => {
  const { children, className, onTabsChange, ...other } = props
  const _children = useMemo(() => {
    if (children && !children.length) {
      return [children]
    } else {
      return children
    }
  }, [children])
  const _onChange = (activeKey: any) => {
    const _props = _children[activeKey].props
    onTabsChange?.({
      groupPrice: _props.groupPrice,
      groupOriginalPrice: _props.groupOriginalPrice,
    })
  }
  useEffect(() => {
    let _child
    if (children && !children.length) {
      _child = [children]
    } else {
      _child = children
    }
    if (_child) {
      const _props = _child?.[0].props
      onTabsChange?.({
        groupPrice: _props?.groupPrice,
        groupOriginalPrice: _props?.groupOriginalPrice,
      })
    }
  }, [])
  return (
    <div className={className} {...other}>
      <Tabs defaultActiveKey="0" onChange={_onChange}>
        {_children?.map((item: any) => {
          return (
            <TabPane tab={item.props.title} key={item.key}>
              {item}
            </TabPane>
          )
        })}
      </Tabs>
    </div>
  )
}

export default PackageContainerTabs
