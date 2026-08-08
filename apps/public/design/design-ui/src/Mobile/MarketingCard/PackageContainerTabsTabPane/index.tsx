import React, { useMemo } from 'react'

import { Row, Col } from 'antd'

interface PackageContainerTabsTabPaneProps {
  children?: any
  // 商品或优惠券item的占比，跟antd中的col span属性一致 默认8
  span?: number
  // 商品或优惠券row的gutter，跟andt中row gutter属性一致，默认12
  gutter?: any
  // 容器是否滑动
  containerScorll?: boolean
  className?: string
}

const PackageContainerTabsTabPane: React.FC<
  PackageContainerTabsTabPaneProps
> = (props: PackageContainerTabsTabPaneProps) => {
  const {
    children,
    span = 8,
    gutter = 12,
    containerScorll = false,
    className,
    ...other
  } = props
  const _children = useMemo(() => {
    if (children && !children.length) {
      return [children]
    } else {
      return children
    }
  }, [children])
  return (
    <div
      style={containerScorll ? { overflowX: 'scroll' } : {}}
      className={className}
      {...other}
    >
      <Row gutter={gutter} wrap={false}>
        {_children?.map((child: any, childIndex: number) => (
          <Col key={childIndex} span={span}>
            {child}
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default PackageContainerTabsTabPane
