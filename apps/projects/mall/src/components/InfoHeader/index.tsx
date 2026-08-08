import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Input, AutoComplete } from 'antd'
import { getWebIntl } from '@/utils/locales'
import { useLocation } from 'react-router-dom'
import { getQueryString } from '@/utils/getUrlParam'
import useLink from '@/hooks/useLink'
import { LinkTo } from '@/utils'
import ImageBox from '@apps/components/src/web/ImageBox'
import styles from './index.module.less'

interface HeaderPropsType {
  logo: string | undefined
}

const Header: React.FC<HeaderPropsType> = (props) => {
  const { logo } = props
  const [searchValue, setSearchValue] = useState<string>('')
  const translate = getWebIntl()
  const [options] = useState<{ value: string }[]>([])
  const { search } = useLocation()
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
      list.forEach((item: string | any[]) => {
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
    if (search) {
      const searchText = getQueryString('searchText', search)
      setSearchValue(decodeURIComponent(searchText || ''))
    } else {
      setSearchValue('')
    }
  }, [search])

  const handleSearchCommodity = () => {
    LinkTo(linkPrefix(`/info/searchResult?searchText=${searchValue}`))
  }

  const onSelect = (data: string) => {
    setSearchValue(data)
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.header_container}>
          <div className={styles.logo}>
            {logo && (
              <a href={linkPrefix()}>
                <ImageBox width={190} height={48} src={logo} />
              </a>
            )}
          </div>
          <div className={styles.mall_search}>
            <div className={styles.mall_search_box}>
              <AutoComplete
                className={styles.mall_search_input}
                value={searchValue}
                options={options}
                onSelect={onSelect}
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
            <ImageBox width={145} height={50} src={logo} />
          </div>
          <div className={styles.mall_search}>
            <div className={styles.mall_search_box}>
              <AutoComplete
                className={styles.mall_search_input}
                value={searchValue}
                options={options}
                onSelect={onSelect}
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

export default Header
