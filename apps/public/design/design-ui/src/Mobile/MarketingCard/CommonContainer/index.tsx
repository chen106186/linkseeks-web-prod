import React, { useMemo } from 'react'
import cx from 'classnames'

import { Row, Col } from 'antd'

import styles from './index.less'

interface CommonContainerProps {
  // 商品或优惠券item的占比，跟antd中的col span属性一致 默认8
  span?: number
  // 商品或优惠券row的gutter，跟andt中row gutter属性一致，默认12
  gutter?: any
  // 容器是否滑动
  containerScorll?: boolean
  children?: React.ReactNode[]
  className?: string
}

const CommonContainer: React.FC<CommonContainerProps> = (
  props: CommonContainerProps,
) => {
  const {
    span = 8,
    gutter = 12,
    containerScorll = false,
    children = [],
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
      className={cx(styles[`lingxi-marketingCard-commonContanier`], className)}
      style={containerScorll ? { overflowX: 'scroll' } : {}}
      {...other}
    >
      <Row gutter={gutter} wrap={false}>
        {_children?.map((item: any, index: any) => (
          <Col span={span} key={`${index}`}>
            {item}
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default CommonContainer
