import React, { useState, PropsWithChildren } from 'react'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import '../index.less'

interface FilterBoxPropsType {
  title?: string
}

const FilterBox: React.FC<PropsWithChildren<FilterBoxPropsType>> = (props) => {
  const [expand, setExpand] = useState<boolean>(true)
  const { title, children } = props

  return (
    <div className="filter_box">
      <div className="filter_box_header" onClick={() => setExpand(!expand)}>
        <span>{title}</span>
        {expand ? (
          <MinusOutlined translate={undefined} className="filter_box_header_icon" />
        ) : (
          <PlusOutlined translate={undefined} className="filter_box_header_icon" />
        )}
      </div>
      {expand && <div className="filter_box_body">{children}</div>}
    </div>
  )
}

export default FilterBox
