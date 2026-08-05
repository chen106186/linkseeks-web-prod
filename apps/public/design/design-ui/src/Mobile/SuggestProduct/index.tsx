import React, { useMemo, useState } from 'react'
import { Row, Col } from 'antd'
import cx from 'classnames'

import Commodity from './Commodity'
import Store from './Store'
import Brand from './Brand'
import Information from './Information'

import styles from './index.less'

import Items from './Items'

interface SuggestProductProps {
  children?: any
  className?: string
  visible?: boolean
}

type ItemProps = {
  Items: typeof Items
  Commodity: typeof Commodity
  Store: typeof Store
  Brand: typeof Brand
  Information: typeof Information
}

const SuggestProduct: React.FC<SuggestProductProps> & ItemProps = (
  props: SuggestProductProps,
) => {
  const { children, className, visible = true } = props
  const [tabIndex, setTabIndex] = useState(0)
  const [botChild, setBotChild] = useState<any>()
  const [tabColumn, setTabColumn] = useState<number>(2)
  const _children = useMemo(() => {
    if (children && !children.length) {
      return children ? [children] : []
    } else {
      return children
    }
  }, [children])

  const _tabs = (index: any) => {
    setTabIndex(index)
  }

  const _childrenRender = useMemo(() => {
    return _children?.map((child: any, childIndex: any) => {
      if (tabIndex === childIndex && child?.props?.column) {
        setTabColumn(child?.props?.column)
      }
      const _ele = React.cloneElement(child, {
        active: tabIndex === childIndex,
        index: childIndex,
        tab: _tabs,
        setBotChild: setBotChild,
      })
      return _ele
    })
  }, [_children, tabIndex])

  return visible ? (
    <div className={cx(styles['lingxi-suggestProduct'], className)}>
      <div className={styles['lingxi-suggestProduct-wrap']}>
        {_childrenRender}
      </div>
      <div style={{ padding: 8 }}>
        <Row wrap={true} gutter={[8, 8]}>
          {botChild?.map((item: any, index: any) => {
            return (
              <Col span={24 / tabColumn} key={`suggestProduct-child-${index}`}>
                {item}
              </Col>
            )
          })}
        </Row>
      </div>
    </div>
  ) : null
}

SuggestProduct.Items = Items
SuggestProduct.Commodity = Commodity
SuggestProduct.Store = Store
SuggestProduct.Brand = Brand
SuggestProduct.Information = Information

export default SuggestProduct
