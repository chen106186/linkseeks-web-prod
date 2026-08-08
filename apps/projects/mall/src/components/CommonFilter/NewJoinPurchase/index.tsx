import React from 'react'
import { getWebIntl } from '@/utils/locales'
import './index.less'
import useLink from '@/hooks/useLink'

interface NewJoinPropsType {
  source: any[]
  path?: string
}

const NewJoin: React.FC<NewJoinPropsType> = (props) => {
  const { source: newJoinShopList, path } = props
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

  return newJoinShopList && newJoinShopList.length > 0 ? (
    <div className="new_join">
      <div className="new_join_title">
        <label>{translate('web.resource.mall.newJoin')}</label>
      </div>
      <div className="new_join_list">
        {newJoinShopList.map(
          (item: any) =>
            item && (
              <div className="new_join_list_item" key={`new_join_list_item_${item.id}`}>
                <div className="new_join_info">
                  <a className="new_join_info_name" href={linkPrefix(`${path}/${item.id}`)}>
                    {item.name || item.memberName}
                  </a>
                  <div className="new_join_info_area">
                    <span>{item.areas}</span>
                  </div>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  ) : null
}

NewJoin.defaultProps = {
  path: '/shopIndex',
}

export default NewJoin
