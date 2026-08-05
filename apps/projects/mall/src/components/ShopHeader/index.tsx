import React, { useState, useEffect } from 'react'
import { CaretDownOutlined } from '@ant-design/icons'
import { AutoComplete, Input, message, Button } from 'antd'
import { useLocation } from 'react-router-dom'
import { getWebIntl } from '@/utils/locales'
import isEmpty from 'lodash/isEmpty'
import ImageBox from '@apps/components/src/web/ImageBox'
import ApplyMemberButton from '@/components/ApplyMemberButton'
import StarRate from '@/components/StarRate'
import { LinkTo, processText } from '@/utils'
import cx from 'classnames'
import { getProductShopCommonGetCommodityCompletion, postCommodityWebStoreWebCollect } from '@apps/apis'
import { getQueryString } from '@/utils/getUrlParam'
import { useGlobalConext } from '@/context/globalProvider'
import { useStoreContext } from '@/context/storeProvider'
import ShopCredit from '../ShopCredit'
import CustomerServiceList from '../CustomerServiceList'
import styles from './index.module.less'
import { validateLoginWrapper } from '@/utils/validateLogin'
import useLink from '@/hooks/useLink'

const ShopHeader: React.FC = () => {
  const translate = getWebIntl()
  const { shopInfo, mallInfo } = useGlobalConext()
  const { collectState, updatecollectState } = useStoreContext()
  const [searchValue, setSearchValue] = useState<string>('')
  const { search, pathname } = useLocation()
  const keyword = getQueryString('keyword', search)
  const path = pathname.indexOf('inquiry') > -1 ? 'inquiry' : 'commodity'
  const [options, setOptions] = useState<{ value: string }[]>([])
  const [autoCompleteVisible, setAutoCompleteVisible] = useState<boolean>(false)
  const [visible, toggle] = useState(false)
  const { linkPrefix } = useLink()

  useEffect(() => {
    if (keyword) {
      setSearchValue(decodeURIComponent(keyword))
    } else {
      setSearchValue('')
    }
  }, [search])

  const handleSearchCommodity = () => {
    if (!isEmpty(searchValue)) {
      LinkTo(linkPrefix(`/shop/${shopInfo?.id}/${path}?keyword=${encodeURIComponent(searchValue)}`))
    } else {
      LinkTo(linkPrefix(`/shop/${shopInfo?.id}/${path}`))
    }
  }

  const handleSearchAllCommodity = () => {
    if (!isEmpty(searchValue)) {
      LinkTo(linkPrefix(`/${path}?keyword=${encodeURIComponent(searchValue)}`))
    } else {
      LinkTo(linkPrefix(`/${path}`))
    }
  }

  const handleOk = () => {
    toggle(true)
  }

  const handleCollect = validateLoginWrapper(() => {
    const status = !collectState
    const param: any = {
      id: shopInfo?.id,
      status,
    }
    postCommodityWebStoreWebCollect(param, { ctlType: 'none' }).then((res) => {
      if (res.code === 1000) {
        // updateShopInfo()
        message.destroy()
        if (status) {
          message.success(translate('web.resource.mall.shoucangchenggong'))
          updatecollectState?.(true)
        } else {
          message.success(translate('web.resource.mall.quxiaoshoucangchenggong'))
          updatecollectState?.(false)
        }
      }
    })
  })

  const onSelect = (data: string) => {
    setSearchValue(data)
  }

  const handleSearch = (searchText: string) => {
    const param: any = {
      name: searchText,
      memberId: shopInfo?.memberId,
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

  return (
    <div className={styles.shop_header}>
      <div className={styles.shop_header_container}>
        <div className={styles.logo}>
          <a href={linkPrefix()}>
            <ImageBox width={145} height={50} src={mallInfo?.logoUrl} />
          </a>
        </div>
        {shopInfo ? (
          <>
            <div className={styles.shop_header_split}></div>
            <div className={styles.shop_header_info}>
              <div className={styles.shop_header_info_logo}>
                {shopInfo?.logo && (
                  <a href={linkPrefix(`/shop/${shopInfo?.id}`)}>
                    <img src={shopInfo?.logo} />
                  </a>
                )}
              </div>
              <div className={styles.shop_header_info_content}>
                <div className={styles.shop_header_info_content_name}>
                  <span>{shopInfo?.name || shopInfo?.memberName}</span>
                  <CaretDownOutlined translate={undefined} className={styles.shop_header_info_content_icon} />
                </div>
                <div className={styles.shop_header_info_content_about}>
                  <ShopCredit creditPoint={shopInfo?.creditPoint || 0} />
                </div>
              </div>
              <div className={styles.shop_info}>
                <div className={styles.shop_info_title}>
                  <div className={styles.shop_info_title_split}></div>
                  <div className={styles.shop_info_title_text}>{translate('web.resource.mall.huiyuanrenzheng')}</div>
                  <div className={styles.shop_info_title_split}></div>
                </div>
                <div className={styles.shop_info_body}>
                  <div className={styles.shop_info_list}>
                    <div className={styles.shop_info_list_item}>
                      <div className={styles.label}>{translate('web.resource.mall.xinyu')}：</div>
                      <div className={styles.breif}>
                        <ShopCredit creditPoint={shopInfo?.creditPoint || 0} />
                      </div>
                    </div>
                    <div className={styles.shop_info_list_item}>
                      <div className={styles.label}>{translate('web.resource.member.zhuceziben')}：</div>
                      <div className={styles.breif}>{shopInfo?.registeredCapital || ''}</div>
                    </div>
                    <div className={styles.shop_info_list_item}>
                      <div className={styles.label}>{translate('web.resource.mall.chengliriqi')}：</div>
                      <div className={styles.breif}>{shopInfo?.establishmentDate}</div>
                    </div>
                    <div className={styles.shop_info_list_item}>
                      <div className={styles.label}>{translate('web.resource.mall.yingyezhizhao')}：</div>
                      <div className={styles.breif}>
                        <span className={styles.certified}>
                          {shopInfo?.businessLicence
                            ? translate('web.resource.mall.yirenzheng')
                            : translate('web.resource.mall.weirenzheng')}
                        </span>
                      </div>
                    </div>
                    <div className={styles.shop_info_list_item}>
                      <div className={styles.label}>{translate('web.resource.mall.manyidu')}：</div>
                      <div className={styles.breif}>
                        <StarRate value={shopInfo?.avgTradeCommentStar || 0} />
                      </div>
                    </div>

                    <div className={styles.shop_info_list_item}>
                      <div className={styles.label}>{translate('web.resource.mall.customerService')}：</div>
                      <div className={styles.breif}>
                        <Button type="link" onClick={handleOk}>
                          {translate('web.resource.mall.dianjilianxikefu')}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className={styles.dashed_split}></div>
                  <div className={styles.shop_info_btn_group}>
                    <div className={styles.shop_info_btn}>
                      <a href={linkPrefix(`/shop/${shopInfo?.id}`)}>{translate('web.resource.mall.jinrudianpu')}</a>
                    </div>
                    <div
                      className={cx(styles.shop_info_btn, collectState ? styles.active : '')}
                      onClick={() => handleCollect()}
                    >
                      {collectState
                        ? translate('web.resource.mall.yishoucangbendian')
                        : translate('web.resource.mall.shoucangbendian')}
                    </div>
                  </div>
                  <ApplyMemberButton className={styles.apply_member_btn} />
                </div>
              </div>
            </div>
          </>
        ) : null}
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
                className={styles.mall_search_input}
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
              {translate('web.resource.mall.soubendian')}
            </div>
          </div>
          <div className={styles.search_all_btn} onClick={() => handleSearchAllCommodity()}>
            {translate('web.resource.mall.souquanzhan')}
          </div>
        </div>
      </div>
      <CustomerServiceList visible={visible} onClose={toggle} memberId={shopInfo?.memberId} />
    </div>
  )
}

export default ShopHeader
