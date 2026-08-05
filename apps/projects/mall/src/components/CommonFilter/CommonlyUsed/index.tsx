import React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { getWebIntl } from '@/utils/locales'
import FilterBox from '../FilterBox'
import { CommonlyUseItemType } from '../types'
import './index.less'

interface CommonlyUsedPropsType {
  source: CommonlyUseItemType[]
  onDelete?: (id: number) => void
  onClick?: (id: number) => void
  match?: any
  location?: {
    pathname: string
  }
}

const CommonlyUsed: React.FC<CommonlyUsedPropsType> = (props) => {
  const { source: commonlyUseFilter, onDelete, onClick } = props
  const translate = getWebIntl()

  const handleDeleteItem = (e: any, id: number) => {
    e.stopPropagation()
    onDelete && onDelete(id)
  }

  const handleFilter = (id: number) => {
    onClick && onClick(id)
  }

  return commonlyUseFilter && commonlyUseFilter.length > 0 ? (
    <FilterBox title={translate('web.resource.mall.commonlyUseFilter')}>
      <ul className="commonly_used_list">
        {commonlyUseFilter.map((item, index) => (
          <li
            key={`commonly_used_list_item-${index}`}
            className="commonly_used_list_item"
            onClick={() => handleFilter(item.id)}
          >
            {item.name}
            <CloseOutlined
              translate={undefined}
              className="commonly_used_list_item_icon"
              onClick={(e) => handleDeleteItem(e, item.id)}
            />
          </li>
        ))}
      </ul>
    </FilterBox>
  ) : null
}

export default CommonlyUsed
