import React from 'react'
import styles from './search.less'
import { Input } from 'antd'
import { CarOutlined } from '@ant-design/icons'

const Search: React.FC<{ logo?: string }> = (props) => {
  return (
    <div className={styles.header}>
      <div className={styles['site-logo']}>{props?.logo && <img src={props?.logo} />}</div>
      <div className={styles.search}>
        <div className={styles['search-type']}>
          <span>商品</span>
          <span>店铺</span>
        </div>
        <div className={styles['search-input']}>
          <div className={styles['search-input-inner']}>
            <Input placeholder="请输入关键字" />
          </div>
          <div className={styles['search-btn']}>搜索</div>
        </div>
      </div>
      <div className={styles['header-right']}>
        <div className={styles.btn}>
          <CarOutlined style={{ fontSize: '14px' }} />
          <span className={styles['btn-text']}>购物车</span>
        </div>
      </div>
    </div>
  )
}

export default Search
