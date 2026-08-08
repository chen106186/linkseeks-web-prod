import React from 'react'
import { Row, Col, Space } from 'antd'
import { FormOutlined } from '@ant-design/icons'

import styles from './index.less'

const GoodsItem = () => {
  return (
    <div className={styles.goodsItem}>
      <Row gutter={8} wrap={false}>
        <Col>
          <div className={styles.goodsItem_img}></div>
        </Col>
        <Col flex="auto">
          <div className={styles.goodsItem_title}>0.8-1.0mm黑色手折纹胎水牛皮【厂价供应】</div>
          <div className={styles.goodsItem_price}>
            <span>￥179.00</span>/尺
          </div>
          <div className={styles.goodsItem_info}>品类：成品皮--&gt;牛皮--&gt;黄牛皮</div>
          <div className={styles.goodsItem_info}>品牌：PELLE 颜色：红色 规格：XXL</div>
        </Col>
      </Row>
      <FormOutlined className={styles.goodsItem_edit} />
    </div>
  )
}

export default GoodsItem
