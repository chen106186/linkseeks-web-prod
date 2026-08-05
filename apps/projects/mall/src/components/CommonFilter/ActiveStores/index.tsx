import React from 'react'
import ImageBox from '@apps/components/src/web/ImageBox'
import top1Icon from '@/assets/imgs/top1_icon.png'
import top2Icon from '@/assets/imgs/top2_icon.png'
import top3Icon from '@/assets/imgs/top3_icon.png'
import { getWebIntl } from '@/utils/locales'
import './index.less'
import useLink from '@/hooks/useLink'

interface ActiveStoresProps {
  source: any[]
  path?: string
}

const ActiveStores: React.FC<ActiveStoresProps> = (props) => {
  const { source: shopList, path } = props
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

  const renderRank = (index: number) => {
    switch (index) {
      case 1:
        return (
          <div className="rankBox">
            <img src={top1Icon} />
            <span className="first">TOP{index}</span>
          </div>
        )
      case 2:
        return (
          <div className="rankBox">
            <img src={top2Icon} />
            <span className="second">TOP{index}</span>
          </div>
        )
      case 3:
        return (
          <div className="rankBox">
            <img src={top3Icon} />
            <span className="third">TOP{index}</span>
          </div>
        )
      default:
        return (
          <div className="rankBox">
            <span>TOP{index}</span>
          </div>
        )
    }
  }

  return (
    <div className="active_stores">
      <div className="active_stores_title">
        <label>{translate('web.resource.mall.activestores')}</label>
      </div>
      <div className="active_stores_list">
        {shopList &&
          shopList.map((item, index) => (
            <div className="active_stores_list_item" key={`${item.memberShopId}_${index}`}>
              <div className="active_stores_logo">
                <ImageBox width={32} height={32} src={item.memberLogo} />
              </div>
              <div className="active_stores_name">
                {renderRank(index + 1)}
                <a href={linkPrefix(`${path}/${item.memberShopId}`)}>{item.name || item.memberName}</a>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

ActiveStores.defaultProps = {
  path: '/shop',
}

export default ActiveStores
