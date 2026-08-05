import React from 'react'
import { Row, Col } from 'antd'
import styles from './index.less'

interface I_ExpandedRowRender_Props {
  material: any
}

const ExpandedRowRender: React.FC<I_ExpandedRowRender_Props> = ({ material }) => {
  return (
    <div className={styles.expanded_row}>
      <div className={styles.expanded_row_label}>
        <span>关联</span>
        <span>报价商品</span>
      </div>
      <div className={styles.expanded_row_content}>
        <Row style={{ width: 1455 }}>
          <Col flex="1">
            <div>
              <span>商品ID：</span>
              {material.relevanceProductId || ''}
            </div>
            <div>
              <span>商品名称：</span>
              {material.relevanceProductName || ''}
            </div>
          </Col>
          <Col flex="1">
            <div>
              <span>规格：</span>
              {material.relevanceProductType || ''}
            </div>
            <div>
              <span>品类：</span>
              {material.relevanceProductCategory || ''}
            </div>
          </Col>
          <Col flex="1">
            <div>
              <span>品牌：</span>
              {material.relevanceProductBrand || ''}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ExpandedRowRender
