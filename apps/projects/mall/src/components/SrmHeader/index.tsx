import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Input, AutoComplete } from 'antd'
import { useGlobalConext } from '@/context/globalProvider'
import useHistory from '@/hooks/useHistory'
import { getWebIntl } from '@/utils/locales'
import { LinkTo } from '@/utils'
import { getQueryString } from '@/utils/getUrlParam'
import { getProductShopCommonGetCommodityCompletion } from '@apps/apis'
import ImageBox from '@apps/components/src/web/ImageBox'
import { usePurchaseOrderContext } from '@/context/purchaseOrderProvider'
import styles from './index.module.less'
import { validateLoginWrapper } from '@/utils/validateLogin'
import isEmpty from 'lodash/isEmpty'

const SrmHeader: React.FC = () => {
  const translate = getWebIntl()
  const { userInfo, mallInfo, pathname } = useGlobalConext()
  const history = useHistory()
  const [searchType, setSearchType] = useState<number>(1) // 1:商品； 2：店铺
  const [searchValue, setSearchValue] = useState<string>('')
  const keyword = getQueryString('keyword', history.location.search)
  const { purchaseCount } = usePurchaseOrderContext()
  const isAskPurchase = history.location.pathname.indexOf('askPurchase') > -1
  const type = isAskPurchase ? 3 : getQueryString('searchType', history.location.search)
  const [options, setOptions] = useState<{ value: string }[]>([])

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

  const handleSearchCommodity = () => {
    let url = ''
    if (searchType === 1) {
      url = '/purchaseInquiry?priceTypeList=1&searchType=1'
    } else if (searchType === 2) {
      url = '/purchaseBidding?priceTypeList=2&searchType=2'
    } else if (searchType === 3) {
      url = '/purchaseCompete?priceTypeList=3&searchType=3'
    } else if (searchType === 4) {
      url = '/enterprisePurchasing?&searchType=4'
    }
    if (!isEmpty(searchValue)) {
      url = `${url}&keyword=${encodeURIComponent(searchValue)}`
    }
    LinkTo(url)
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
                value: item,
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
            <div className={styles.mall_search_tags}>
              <div
                className={cx(styles.mall_search_tags_item, searchType === 1 ? styles.active : '')}
                onClick={() => handleChangeSearchType(1)}
              >
                {translate('web.resource.mall.xunjia')}
              </div>
              <div className={styles.mall_search_tags_item_split}></div>
              <div
                className={cx(styles.mall_search_tags_item, searchType === 2 ? styles.active : '')}
                onClick={() => handleChangeSearchType(2)}
              >
                {translate('web.resource.mall.zhaobiao')}
              </div>
              <div className={styles.mall_search_tags_item_split}></div>
              <div
                className={cx(styles.mall_search_tags_item, searchType === 3 ? styles.active : '')}
                onClick={() => handleChangeSearchType(3)}
              >
                {translate('web.resource.mall.jingjia')}
              </div>
              <div className={styles.mall_search_tags_item_split}></div>
              <div
                className={cx(styles.mall_search_tags_item, searchType === 4 ? styles.active : '')}
                onClick={() => handleChangeSearchType(4)}
              >
                {translate('web.resource.mall.caigoushang')}
              </div>
            </div>
            <div className={styles.mall_search_box}>
              <AutoComplete
                className={styles.mall_search_input}
                value={searchValue}
                options={options}
                onSelect={onSelect}
                onSearch={handleSearch}
              >
                <Input
                  value={searchValue}
                  placeholder={translate('web.resource.mall.qingshuruguanjianci')}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onPressEnter={() => handleSearchCommodity()}
                />
              </AutoComplete>
              <div className={styles.search_btn} onClick={() => handleSearchCommodity()}>
                {translate('web.common.search')}
              </div>
            </div>
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
              <AutoComplete
                className={styles.mall_search_input}
                value={searchValue}
                options={options}
                onSelect={onSelect}
                onSearch={handleSearch}
              >
                <Input
                  value={searchValue}
                  placeholder={translate('web.resource.mall.qingshuruguanjianci')}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onPressEnter={() => handleSearchCommodity()}
                />
              </AutoComplete>
              <div className={styles.search_btn} onClick={() => handleSearchCommodity()}>
                {translate('web.common.search')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SrmHeader
