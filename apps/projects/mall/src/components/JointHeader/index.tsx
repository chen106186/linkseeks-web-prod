import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Input, AutoComplete } from 'antd'
import { useGlobalConext } from '@/context/globalProvider'
import useHistory from '@/hooks/useHistory'
import { getWebIntl } from '@/utils/locales'
import { LinkTo, processText } from '@/utils'
import { getQueryString, removeURLArg } from '@/utils/getUrlParam'
import { DownOutlined, FileTextOutlined } from '@ant-design/icons'
import { getProductShopCommonGetCommodityCompletion } from '@apps/apis'
import ImageBox from '@apps/components/src/web/ImageBox'
import { usePurchaseOrderContext } from '@/context/purchaseOrderProvider'
import styles from './index.module.less'
import { validateLoginWrapper } from '@/utils/validateLogin'
import { useLocation } from 'react-router-dom'
import useLink from '@/hooks/useLink'

const JointHeader: React.FC = () => {
  const translate = getWebIntl()
  const { userInfo, mallInfo, pathname } = useGlobalConext()
  const history = useHistory()
  const { search } = useLocation()
  const [searchType, setSearchType] = useState<number>(1) // 1:商品； 2：店铺
  const [searchValue, setSearchValue] = useState<string>('')
  const keyword = getQueryString('keyword', history.location.search)
  const { purchaseCount } = usePurchaseOrderContext()
  const isAskPurchase = history.location.pathname.indexOf('askPurchase') > -1
  const type = isAskPurchase ? 3 : getQueryString('searchType', history.location.search)
  const [options, setOptions] = useState<{ value: string }[]>([])
  const [autoCompleteVisible, setAutoCompleteVisible] = useState<boolean>(false)
  const { linkPrefix } = useLink()

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const floatSearch = document.getElementById('floatSearch')
    if (floatSearch) {
      if (scrollTop > 500) {
        if (!hasClass(floatSearch.classList, 'show')) {
          floatSearch.classList.add(styles.show)
        }
      } else {
        if (hasClass(floatSearch.classList, 'show')) {
          floatSearch.classList.remove(styles.show)
        }
      }
    }
  }

  const hasClass = (list: any[] | DOMTokenList, className: string) => {
    let result = false
    list &&
      list.forEach((item: string | string[]) => {
        if (item && item.indexOf(className) > -1) {
          result = true
        }
      })
    return result
  }

  useEffect(() => {
    if (type) {
      setSearchType(Number(type))
    }
    window.addEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (keyword) {
      setSearchValue(decodeURIComponent(keyword))
    } else {
      setSearchValue('')
    }
  }, [history.location.search])

  const handleChangeSearchType = (type: number) => {
    if (searchType !== type) {
      setSearchType(type)
    }
  }

  const handleSearchCommodity = (value?: string) => {
    const inputValue = value || searchValue
    if (inputValue && inputValue.trim() !== '') {
      if (searchType === 1) {
        if (history.location.pathname.indexOf('inquiry') > -1) {
          LinkTo(linkPrefix(`/inquiry?keyword=${encodeURIComponent(searchValue)}&searchType=${searchType}`))
        } else {
          LinkTo(linkPrefix(`/commodity?keyword=${encodeURIComponent(searchValue)}&searchType=${searchType}`))
        }
      } else if (searchType === 3) {
        LinkTo(linkPrefix(`/askPurchase?keyword=${encodeURIComponent(inputValue)}&searchType=${searchType}`))
      } else {
        LinkTo(linkPrefix(`/stores?keyword=${encodeURIComponent(searchValue)}&searchType=${searchType}`))
      }
    } else {
      LinkTo(removeURLArg(`${pathname}${search}`, 'keyword'))
    }
  }

  const handleSearch = (searchText: string) => {
    const param = {
      name: searchText,
    }

    const headers: any = {
      shopId: mallInfo?.id,
    }

    getProductShopCommonGetCommodityCompletion(param, { headers }).then((res) => {
      if (res.code === 1000) {
        if (res.data) {
          setOptions(
            res.data.map((item: any) => {
              return {
                value: processText(item),
                label: <div dangerouslySetInnerHTML={{ __html: item }}></div>,
              }
            }),
          )
        }
      }
    })
  }

  const onSelect = (data: string) => {
    setSearchValue(data)
  }

  const handleLink = validateLoginWrapper(() => {
    LinkTo(linkPrefix('/purchaseOrder'))
  })

  return (
    <>
      <div className={styles.header}>
        <div className={styles.header_container}>
          <div className={styles.logo}>
            {mallInfo?.logoUrl && (
              <a href="/">
                <ImageBox width={190} height={48} src={mallInfo?.logoUrl} />
              </a>
            )}
          </div>
          <div className={styles.mall_search}>
            {searchType !== 3 && (
              <div className={styles.mall_search_tags}>
                <div
                  className={cx(styles.mall_search_tags_item, searchType === 1 ? styles.active : '')}
                  onClick={() => handleChangeSearchType(1)}
                >
                  {translate('web.resource.mall.commodity')}
                </div>
                <div className={styles.mall_search_tags_item_split}></div>
                <div
                  className={cx(styles.mall_search_tags_item, searchType === 2 ? styles.active : '')}
                  onClick={() => handleChangeSearchType(2)}
                >
                  {translate('web.resource.mall.store')}
                </div>
              </div>
            )}
            <div className={styles.mall_search_box}>
              <AutoComplete
                className={styles.mall_search_input}
                value={searchValue}
                options={options}
                onSelect={onSelect}
                onSearch={handleSearch}
                onDropdownVisibleChange={(open) => {
                  setAutoCompleteVisible(open)
                }}
              >
                <Input
                  value={searchValue}
                  placeholder={
                    isAskPurchase
                      ? translate('web.resource.mall.qingshuruqiugouwuliaomingchen')
                      : translate('web.resource.mall.qingshuruguanjianci')
                  }
                  onChange={(e) => setSearchValue(e.target.value)}
                  onPressEnter={() => {
                    if (!autoCompleteVisible) {
                      handleSearchCommodity()
                    }
                  }}
                />
              </AutoComplete>
              <div className={styles.search_btn} onClick={() => handleSearchCommodity()}>
                {translate('web.common.search')}
              </div>
            </div>
          </div>
          <div className={cx(styles.shopping_cart, styles.mall)} onClick={handleLink}>
            <FileTextOutlined className={styles.card_icon} translate={undefined} />
            <span>购物车</span>
            {userInfo ? <div className={styles.badge}>{purchaseCount}</div> : null}
          </div>
        </div>
      </div>

      <div id="floatSearch" className={cx(styles.header, styles.float)}>
        <div className={styles.header_container}>
          <div className={styles.logo}>
            {mallInfo?.logoUrl && <ImageBox width={145} height={50} src={mallInfo?.logoUrl} />}
          </div>
          <div className={styles.mall_search}>
            <div className={styles.mall_search_box}>
              {searchType !== 3 && (
                <div className={styles.search_type}>
                  <div className={styles.search_type_item}>
                    <span className={styles.search_type_item_text}>
                      {searchType === 1
                        ? translate('web.resource.mall.commodity')
                        : translate('web.resource.mall.store')}
                    </span>
                    <DownOutlined className={styles.search_type_item_icon} translate={undefined} />
                  </div>
                  <div className={styles.more_type} onClick={() => handleChangeSearchType(searchType === 1 ? 2 : 1)}>
                    <span className={styles.search_type_item_text}>
                      {searchType === 1
                        ? translate('web.resource.mall.store')
                        : translate('web.resource.mall.commodity')}
                    </span>
                  </div>
                </div>
              )}
              <AutoComplete
                className={styles.mall_search_input}
                value={searchValue}
                options={options}
                onSelect={onSelect}
                onSearch={handleSearch}
                onDropdownVisibleChange={(open) => {
                  setAutoCompleteVisible(open)
                }}
              >
                <Input
                  value={searchValue}
                  placeholder={
                    isAskPurchase
                      ? translate('web.resource.mall.qingshuruqiugouwuliaomingchen')
                      : translate('web.resource.mall.qingshuruguanjianci')
                  }
                  onChange={(e) => setSearchValue(e.target.value)}
                  onPressEnter={() => {
                    if (!autoCompleteVisible) {
                      handleSearchCommodity()
                    }
                  }}
                />
              </AutoComplete>
              <div className={styles.search_btn} onClick={() => handleSearchCommodity()}>
                {translate('web.common.search')}
              </div>
            </div>
          </div>
          <div className={cx(styles.shopping_cart, styles.mall)} onClick={handleLink}>
            <FileTextOutlined className={styles.card_icon} translate={undefined} />
            <span>{translate('web.resource.mall.purchaseOrder')}</span>
            {userInfo ? <div className={styles.badge}>{purchaseCount}</div> : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default JointHeader
