/*
 * @Author: ghua
 * @Date: 2020-08-10 14:59:23
 * @LastEditTime: 2022-03-25 15:29:13
 * @LastEditors: GHua
 * @Description: In User Settings Edit
 * @FilePath: /lingxi-business-paltform/src/pages/lxMall/components/Filter/components/FilterBox/index.tsx
 */
import React, { useState } from 'react'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import styles from '../index.less'

interface FilterBoxPropsType {
  title: string
}

const FilterBox: React.FC<FilterBoxPropsType> = (props) => {
  const [expand, setExpand] = useState<boolean>(true)
  const { title, children } = props

  return (
    <div className={styles.filter_box}>
      <div className={styles.filter_box_header} onClick={() => setExpand(!expand)}>
        <span>{title}</span>
        {expand ? (
          <MinusOutlined translate={undefined} className={styles.filter_box_header_icon} />
        ) : (
          <PlusOutlined translate={undefined} className={styles.filter_box_header_icon} />
        )}
      </div>
      {expand && <div className={styles.filter_box_body}>{children}</div>}
    </div>
  )
}

export default FilterBox
