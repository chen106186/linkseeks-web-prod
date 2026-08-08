import React, { FC, useEffect, useState } from 'react'
import { PictureOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { observer } from 'mobx-react'
import {
  GetCommodityWebStoreWebMemberShopMainResponse,
  postCommodityWebStoreWebCollect,
} from '@/services/CommodityV2Api'
import ShopCredit from '@/components/ShopCredit'
import YearBox from '@/components/ShopCredit/year'
import StarRate from '@/components/StarRate'
import attestationIcon from '@/assets/icons/attestation_icon.png'
import captitalIcon from '@/assets/icons/capital_icon.png'
import areaIcon from '@/assets/icons/area_icon.png'
import saleAreaIcon from '@/assets/icons/sale_area_icon.png'
import registerYearIcon from '@/assets/icons/register_year_icon.png'
import { ImageBox } from '@linkseeks/lingxi-mall-components'
import { useMessageIntl } from '@linkseeks/lingxi-utils'
import prevArrowIcon from '@/assets/icons/prev_arrow_icon.png'
import nextArrowIcon from '@/assets/icons/next_arrow_icon.png'
import message from '@/utils/message'
import { LOGIN_DOMAIN } from '@/constants'
import { LinkTo } from '@/utils'
import IconFont from '@/utils/iconfont'
import { UserInfoType } from '@/store/userStore/modal'
import ApplyMemberButton from '@/components/ApplyMemberButton'
import cx from 'classnames'
import styles from './index.less'

interface ShopAboutPropsType {
  shopInfo: GetCommodityWebStoreWebMemberShopMainResponse
  userInfo: UserInfoType
  updateShopInfo: () => void
  location: any
}

const ShopAbout: FC<ShopAboutPropsType> = (props) => {
  const { getMessage } = useMessageIntl()
  const { shopInfo, userInfo, updateShopInfo } = props
  const [showDescribe, setShowDescribe] = useState<boolean>(false)
  const [collectState, setCollectState] = useState<boolean>(false)
  const [offSetLeft, setOffSetLeft] = useState<number>(0)
  const unitDistance = 288
  const [anchor, setAnchor] = useState<string>('describe')

  useEffect(() => {
    if (shopInfo && userInfo) {
      setCollectState(shopInfo.collectStatus)
    }
  }, [shopInfo, userInfo])

  const getYear = (value: string) => {
    if (value) {
      const temp = value.split('年')
      if (temp.length > 0) {
        return `${temp[0]}年`
      }
    }
    return null
  }

  const handlePrev = () => {
    if (offSetLeft < 0) {
      setOffSetLeft(offSetLeft + unitDistance)
    }
  }

  const handleNext = () => {
    const imgLength = shopInfo?.workshopPics.length
    const maxDistance = (imgLength - 3) * unitDistance

    if (maxDistance > Math.abs(offSetLeft)) {
      setOffSetLeft(offSetLeft - unitDistance)
    }
  }

  const changeAnchor = (id: string) => {
    setAnchor(id)
    window.location.href = `#${id}`
  }

  const handleCollect = () => {
    if (!userInfo) {
      LinkTo(LOGIN_DOMAIN, 'replace')
      return
    }
    const status = !collectState
    const param: any = {
      id: shopInfo.id,
      status,
    }
    postCommodityWebStoreWebCollect(param).then((res: { code: number }) => {
      if (res.code === 1000) {
        updateShopInfo()
        message.destroy()
        if (status) {
          message.success(getMessage('information.detail.CollectionSuccessful'))
          setCollectState(true)
        } else {
          message.success(getMessage('information.detail.CancelnCollectionSuccessful'))
          setCollectState(false)
        }
      }
    })
  }

  const formatAreas = (area: string) => {
    if (area) {
      const areaList = area.split('，')
      return areaList
        .map((item) => {
          const temp = item.split('/')
          const provice = temp[0]
          const city = temp[1]
          if (provice === city) {
            return provice
          } else {
            return `${provice}${city}`
          }
        })
        .join('、')
    }
    return ''
  }

  const formatAreasToProvice = (area: string) => {
    if (area) {
      const areaList = area.split('，')
      return areaList
        .map((item) => {
          const temp = item.split('/')
          const provice = temp[0]
          return provice
        })
        .join('、')
    }
    return ''
  }

  return (
    <div className={styles.shop_about}>
      <div className={styles.shop_about_left}>
        <div className={styles.nav_list}>
          <div
            className={cx(styles.nav_list_item, anchor === 'describe' ? styles.active : {})}
            onClick={() => changeAnchor('describe')}
          >
            <IconFont type="icon-gongsi" className={styles.nav_list_item_icon} />
            <span>{getMessage('shopAbout.index.CompanyProfile')}</span>
          </div>
          <div
            className={cx(styles.nav_list_item, anchor === 'album' ? styles.active : {})}
            onClick={() => changeAnchor('album')}
          >
            <PictureOutlined translate={undefined} className={styles.nav_list_item_icon} />
            <span>{getMessage('shopAbout.index.CompanyAlbum')}</span>
          </div>
          <div
            className={cx(styles.nav_list_item, anchor === 'honorpic' ? styles.active : {})}
            onClick={() => changeAnchor('honorpic')}
          >
            <IconFont type="icon-badge" className={styles.nav_list_item_icon} />
            <span>{getMessage('shopAbout.index.HonoraryQualification')}</span>
          </div>
          <div
            className={cx(styles.nav_list_item, anchor === 'brochure' ? styles.active : {})}
            onClick={() => changeAnchor('brochure')}
          >
            <IconFont type="icon-data" className={styles.nav_list_item_icon} />
            <span>{getMessage('shopAbout.index.Brochure')}</span>
          </div>
        </div>
      </div>
      <div className={styles.shop_about_main}>
        <div className={styles.shop_about_header}>
          <div className={styles.shop_about_header_main}>
            <div className={styles.shop_name}>
              <label>{shopInfo.memberName}</label>
              <StarRate value={shopInfo.avgTradeCommentStar || 0} />
            </div>
            <div style={{ display: 'flex' }}>
              <ShopCredit creditPoint={shopInfo.creditPoint || 0} />
              <YearBox year={shopInfo.registerYears || 0} style={{ marginLeft: '16px' }} />
            </div>
          </div>
          <div className={styles.shop_about_header_btn_group}>
            <Button
              style={{ marginRight: 16 }}
              type={collectState ? 'primary' : 'default'}
              onClick={() => handleCollect()}
            >
              {collectState
                ? getMessage('shopAbout.index.collectedStore')
                : getMessage('shopAbout.index.toCollectedStore')}
            </Button>
            <ApplyMemberButton shopInfo={shopInfo} />
            {/* {
              (applyState && !applyState.show && userInfo) ? null : <Button type='primary' loading={applyLoading} style={{ marginLeft: 16 }} disabled={applyState && applyState.disabled} onClick={handleApply}>{applyState ? applyState.value : '申请成为本店会员'}</Button>
            } */}
          </div>
        </div>
        <div className={styles.shop_about_card}>
          <div className={styles.shop_about_card_title} id="describe">
            <label>{getMessage('shopAbout.index.CompanyProfile')}</label>
            {shopInfo.businessLicence && (
              <div className={styles.auth_wrap}>
                <img src={attestationIcon} />
                <span>{getMessage('shopAbout.index.EnterpriseCertification')}</span>
              </div>
            )}
          </div>
          <div className={styles.shop_about_card_body}>
            <div className={styles.shop_ul}>
              <div className={styles.shop_ul_li}>
                <img className={styles.shop_ul_li_icon} src={areaIcon} />
                <div className={styles.shop_ul_li_main}>
                  <div className={styles.shop_ul_li_main_title}>{getMessage('shop.companyInfo.area')}</div>
                  <span title={formatAreas(shopInfo.areas)}>{formatAreas(shopInfo.areas)}</span>
                </div>
              </div>
              <div className={styles.shop_ul_li}>
                <img className={styles.shop_ul_li_icon} src={registerYearIcon} />
                <div className={styles.shop_ul_li_main}>
                  <div className={styles.shop_ul_li_main_title}>{getMessage('shopAbout.index.YearEstablishment')}</div>
                  <span>{getYear(shopInfo.establishmentDate)}</span>
                </div>
              </div>
              <div className={styles.shop_ul_li}>
                <img className={styles.shop_ul_li_icon} src={captitalIcon} />
                <div className={styles.shop_ul_li_main}>
                  <div className={styles.shop_ul_li_main_title}>{getMessage('ShopInfo.index.registeredCapital')}</div>
                  <span>{shopInfo.registeredCapital}</span>
                </div>
              </div>
              <div className={styles.shop_ul_li}>
                <img className={styles.shop_ul_li_icon} src={saleAreaIcon} />
                <div className={styles.shop_ul_li_main}>
                  <div className={styles.shop_ul_li_main_title}>{getMessage('shopAbout.index.SalesArea')}</div>
                  <span title={formatAreasToProvice(shopInfo.areas)}>{formatAreasToProvice(shopInfo.areas)}</span>
                </div>
              </div>
            </div>
            <div className={styles.shop_brief_wrap}>
              <div className={styles.shop_brief_item}>
                <label>{getMessage('shopAbout.index.briefIntroduction')}：</label>
                <div className={styles.shop_brief_item_content}>
                  <span className={!showDescribe ? styles.line_limit : {}}>{shopInfo.describe}</span>
                  {shopInfo.describe && shopInfo.describe.length > 100 && (
                    <div className={styles.showbtn} onClick={() => setShowDescribe(!showDescribe)}>
                      {!showDescribe ? '展开' : getMessage('order.index.payway.PutAway')}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.shop_brief_item}>
                <label>{getMessage('shopAbout.index.MainBusiness')}：</label>
                <div className={styles.shop_brief_item_content}>{shopInfo.customerCategoryName}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.shop_about_card}>
          <div className={styles.shop_about_card_title} id="album">
            <label>{getMessage('shopAbout.index.CompanyAlbum')}</label>
          </div>
          <div className={styles.shop_about_card_body}>
            <div className={styles.exhibition_toolbar}>
              <div className={cx(styles.exhibition_tool_item, styles.prev)} onClick={() => handlePrev()}>
                <img src={prevArrowIcon} />
              </div>
              <div className={styles.exhibition_list_contaner}>
                <div className={styles.exhibition_list} style={{ left: offSetLeft }}>
                  {shopInfo.workshopPics &&
                    shopInfo.workshopPics.map((url, index) => (
                      <div key={`exhibition_list_item_${index}`} className={cx(styles.exhibition_list_item)}>
                        <ImageBox src={url} width={280} height={186} />
                      </div>
                    ))}
                </div>
              </div>
              <div className={cx(styles.exhibition_tool_item, styles.next)} onClick={() => handleNext()}>
                <img src={nextArrowIcon} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.shop_about_card}>
          <div className={styles.shop_about_card_title} id="honorpic">
            <label>{getMessage('shopAbout.index.honor')}</label>
          </div>
          <div className={styles.shop_about_card_body}>
            <div className={styles.shop_honorpic_list}>
              {shopInfo.honorPics &&
                shopInfo.honorPics.map((url, index) => (
                  <div key={`shop_honorpic_list_${index}`} className={cx(styles.shop_honorpic_list_item)}>
                    <ImageBox src={url} width={282} height={198} />
                  </div>
                ))}
              <div></div>
            </div>
          </div>
        </div>
        {shopInfo.albumUrl && (
          <div className={styles.shop_about_card}>
            <div className={styles.shop_about_card_title} id="brochure">
              <label>{getMessage('shopAbout.index.Brochure')}</label>
            </div>
            <div className={styles.album_box}>
              <iframe className={styles.album_iframe} src={shopInfo.albumUrl}></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default observer(ShopAbout)
