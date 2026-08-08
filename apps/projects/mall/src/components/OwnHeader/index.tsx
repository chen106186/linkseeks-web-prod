import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Input, AutoComplete } from 'antd'
import { useGlobalConext } from '@/context/globalProvider'
import useHistory from '@/hooks/useHistory'
import { getWebIntl } from '@/utils/locales'
import { LinkTo, processText } from '@/utils'
import { getQueryString } from '@/utils/getUrlParam'
import { FileTextOutlined } from '@ant-design/icons'
import { getProductShopCommonGetCommodityCompletion } from '@apps/apis'
import ImageBox from '@apps/components/src/web/ImageBox'
import { usePurchaseOrderContext } from '@/context/purchaseOrderProvider'
import useLink from '@/hooks/useLink'
import styles from './index.module.less'
import { validateLoginWrapper } from '@/utils/validateLogin'

const OwnHeader: React.FC = () => {
  const translate = getWebIntl()
  const { userInfo, mallInfo, pathname } = useGlobalConext()
  const history = useHistory()
  const [searchValue, setSearchValue] = useState<string>('')
  const keyword = getQueryString('keyword', history.location.search)
  const { purchaseCount } = usePurchaseOrderContext()
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
    window.addEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (keyword) {
      setSearchValue(decodeURIComponent(keyword))
    } else {
      setSearchValue('')
    }
  }, [history.location.search])

  const handleSearchCommodity = () => {
    if (searchValue && searchValue.trim() !== '') {
      if (history.location.pathname.indexOf('inquiry') > -1) {
        LinkTo(linkPrefix(`/inquiry?keyword=${encodeURIComponent(searchValue)}`))
      } else {
        LinkTo(linkPrefix(`/commodity?keyword=${encodeURIComponent(searchValue)}`))
      }
    }
  }

  const handleSearch = (searchText: string) => {
    const param: any = {
      name: searchText,
      memberId: mallInfo?.memberId,
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
    LinkTo(linkPrefix(`/purchaseOrder`))
  })

  return (
    <>
      <div className={styles.header}>
        <div className={styles.header_container}>
          <div className={styles.logo}>
            <a href={linkPrefix()}>
              <ImageBox width={190} height={48} src={mallInfo?.logoUrl} />
            </a>
          </div>
          <div className={styles.mall_search}>
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
                  placeholder={translate('web.resource.mall.qingshuruguanjianci')}
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
            <span>{translate('web.resource.marketing.jinhuodan')}</span>
            {userInfo ? <div className={styles.badge}>{purchaseCount}</div> : null}
          </div>
        </div>
      </div>

      <div id="floatSearch" className={cx(styles.header, styles.float)}>
        <div className={styles.header_container}>
          <div className={styles.logo}>
            {mallInfo?.logoUrl && <ImageBox width={145} height={50} src={mallInfo.logoUrl} />}
          </div>
          <div className={styles.mall_search}>
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
                  placeholder={translate('web.resource.mall.qingshuruguanjianci')}
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
            {purchaseCount && userInfo ? <div className={styles.badge}>{purchaseCount}</div> : null}
            <FileTextOutlined className={styles.card_icon} translate={undefined} />
            <span>{translate('web.resource.marketing.jinhuodan')}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default OwnHeader
