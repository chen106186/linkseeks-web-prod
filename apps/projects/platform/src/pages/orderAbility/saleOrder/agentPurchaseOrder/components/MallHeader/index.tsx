/*
 * @Author: GHua
 * @Date: 2022-03-29 18:39:04
 * @LastEditTime: 2022-04-07 09:38:07
 * @LastEditors: GHua
 * @Description:
 */
import React, { useState } from 'react'
import { AutoComplete, Input } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { useHistory } from '@linkseeks/router-core'
import cx from 'classnames'
import { ImageBox } from '@apps/components'
import { FileTextOutlined } from '@ant-design/icons'
import './index.less'

interface MallHeaderProps {
  logo: string
  purchaseCount: number
  /** 购物车链接 */
  purchaseOrderPath: string
  searchOptions: { value: string }[]
  onSearch?: (value: string) => void
  onCommoditySearch: (value: string) => void
}

const MallHeader: React.FC<MallHeaderProps> = (props) => {
  const { logo, purchaseCount = 0, searchOptions = [], purchaseOrderPath, onSearch, onCommoditySearch } = props
  const [searchValue, setSearchValue] = useState<string>('')
  const history = useHistory()
  const intl = useIntl()

  const onSelect = (data: string) => {
    setSearchValue(data)
  }

  const handleSearch = (searchText: string) => {
    onSearch && onSearch(searchText)
  }

  const handleSearchCommodity = () => {
    onCommoditySearch && onCommoditySearch(searchValue)
  }

  const handleLink = () => {
    history.push(purchaseOrderPath)
  }

  return (
    <div className="header">
      <div className="header_container">
        <div className="logo">
          <ImageBox width={190} height={48} src={logo} />
        </div>
        <div className="mall_search">
          <div className="mall_search_box">
            <AutoComplete
              className="mall_search_input"
              value={searchValue}
              options={searchOptions}
              onSelect={onSelect}
              onSearch={handleSearch}
            >
              <Input
                value={searchValue}
                placeholder={intl.formatMessage({ id: 'mallHeader.keyword.placeholder' })}
                onChange={(e) => setSearchValue(e.target.value)}
                onPressEnter={() => handleSearchCommodity()}
              />
            </AutoComplete>
            <div className="search_btn" onClick={() => handleSearchCommodity()}>
              {intl.formatMessage({ id: 'mallHeader.btn.search' })}
            </div>
          </div>
        </div>
        <div className={cx('shopping_cart', 'mall')} onClick={handleLink}>
          <FileTextOutlined className="card_icon" translate={undefined} />
          <span>{intl.formatMessage({ id: 'mallHeader.btn.purchaseOrder' })}</span>
          <div className="badge">{purchaseCount}</div>
        </div>
      </div>
    </div>
  )
}

export default MallHeader
