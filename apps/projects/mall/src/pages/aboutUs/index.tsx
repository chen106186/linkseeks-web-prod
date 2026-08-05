import React, { useState } from 'react'
import cx from 'classnames'
import { useGlobalConext } from '@/context/globalProvider'
import StarRate from '@/components/StarRate'
import ShopCredit from '@/components/ShopCredit'
import YearBox from '@/components/ShopCredit/year'
import { LAYOUT_TYPE } from '@/types/global'
import { message, Button } from 'antd'
import ApplyMemberButton from '@/components/ApplyMemberButton'
import ImageBox from '@apps/components/src/web/ImageBox'
import attestationIcon from '@/assets/icons/attestation_icon.png'
import captitalIcon from '@/assets/icons/capital_icon.png'
import areaIcon from '@/assets/icons/area_icon.png'
import saleAreaIcon from '@/assets/icons/sale_area_icon.png'
import registerYearIcon from '@/assets/icons/register_year_icon.png'
import prevArrowIcon from '@/assets/icons/prev_arrow_icon.png'
import nextArrowIcon from '@/assets/icons/next_arrow_icon.png'
import { getWebIntl } from '@/utils/locales'
import { postCommodityWebMemberPurchaseWebCollect, postCommodityWebStoreWebCollect } from '@apps/apis'
import { useStoreContext } from '@/context/storeProvider'
import AboutLayout from './layout'
import styles from './index.module.less'
import { validateLoginWrapper } from '@/utils/validateLogin'

interface IProps {
  shopInfo: any
}

const AboutUs: React.FC<IProps> = (props) => {
  const { shopInfo } = props
  const { userInfo, mallInfo, layoutType, url } = useGlobalConext()
  const { collectState, updatecollectState } = useStoreContext()
  const [offSetLeft, setOffSetLeft] = useState<number>(0)
  const [showDescribe, setShowDescribe] = useState<boolean>(false)
  const unitDistance = 288
  const translate = getWebIntl()

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

  const handleCollect = validateLoginWrapper(() => {
    const status = !collectState
    const param: any = {
      id: shopInfo.id,
      status,
    }
    let fn = postCommodityWebStoreWebCollect
    if (layoutType === LAYOUT_TYPE.shopIndex) {
      fn = postCommodityWebMemberPurchaseWebCollect
    }

    fn(param, { ctlType: 'none' }).then((res: { code: number }) => {
      if (res.code === 1000) {
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

  return (
    <AboutLayout>
      <div className={styles.shop_about_header}>
        <div className={styles.shop_about_header_main}>
          <div className={styles.shop_name}>
            <label>{shopInfo?.memberName || mallInfo?.memberName}</label>
            <StarRate value={shopInfo?.avgTradeCommentStar || 0} />
          </div>
          <div style={{ display: 'flex' }}>
            <ShopCredit creditPoint={shopInfo?.creditPoint || 0} />
            <YearBox year={shopInfo?.registerYears || 0} style={{ marginLeft: '16px' }} />
          </div>
        </div>
        <div className={styles.shop_about_header_btn_group}>
          {layoutType === LAYOUT_TYPE.shop && (
            <Button
              style={{ marginRight: 16 }}
              type={collectState ? 'primary' : 'default'}
              onClick={() => handleCollect()}
            >
              {collectState
                ? translate('web.resource.mall.yishoucangbendian')
                : translate('web.resource.mall.shoucangbendian')}
            </Button>
          )}
          {layoutType === LAYOUT_TYPE.shopIndex && (
            <Button
              style={{ marginRight: 16 }}
              type={collectState ? 'primary' : 'default'}
              onClick={() => handleCollect()}
            >
              {collectState ? translate('web.resource.mall.yishoucang') : translate('web.resource.mall.jiarushoucang')}
            </Button>
          )}
          <ApplyMemberButton />
        </div>
      </div>
      <div className={styles.shop_about_card}>
        <div className={styles.shop_about_card_title} id="describe">
          <label>{translate('web.resource.mall.gongsijianjie')}</label>
          {shopInfo?.businessLicence && (
            <div className={styles.auth_wrap}>
              <img src={attestationIcon} />
              <span>{translate('web.resource.mall.qiyexinxiyitongguorenzheng')}</span>
            </div>
          )}
        </div>
        <div className={styles.shop_about_card_body}>
          <div className={styles.shop_ul}>
            <div className={styles.shop_ul_li}>
              <img className={styles.shop_ul_li_icon} src={areaIcon} />
              <div className={styles.shop_ul_li_main}>
                <div className={styles.shop_ul_li_main_title}>{translate('web.common.diqu')}</div>
                <span title={formatAreas(shopInfo?.areas)}>{formatAreas(shopInfo?.areas)}</span>
              </div>
            </div>
            <div className={styles.shop_ul_li}>
              <img className={styles.shop_ul_li_icon} src={registerYearIcon} />
              <div className={styles.shop_ul_li_main}>
                <div className={styles.shop_ul_li_main_title}>{translate('web.resource.mall.chenglinianfen')}</div>
                <span>{getYear(shopInfo?.establishmentDate)}</span>
              </div>
            </div>
            <div className={styles.shop_ul_li}>
              <img className={styles.shop_ul_li_icon} src={captitalIcon} />
              <div className={styles.shop_ul_li_main}>
                <div className={styles.shop_ul_li_main_title}>{translate('web.resource.mall.zhuceziben')}</div>
                <span>{shopInfo?.registeredCapital}</span>
              </div>
            </div>
            <div className={styles.shop_ul_li}>
              <img className={styles.shop_ul_li_icon} src={saleAreaIcon} />
              <div className={styles.shop_ul_li_main}>
                <div className={styles.shop_ul_li_main_title}>{translate('web.resource.mall.xiaoshoudiqu')}</div>
                <span title={formatAreasToProvice(shopInfo?.areas)}>{formatAreasToProvice(shopInfo?.areas)}</span>
              </div>
            </div>
          </div>
          <div className={styles.shop_brief_wrap}>
            <div className={styles.shop_brief_item}>
              <label>{translate('web.resource.mall.jianjie')}：</label>
              <div className={styles.shop_brief_item_content}>
                <span className={!showDescribe ? styles.line_limit : ''}>{shopInfo?.describe}</span>
                {shopInfo?.describe && shopInfo?.describe.length > 100 && (
                  <div className={styles.showbtn} onClick={() => setShowDescribe(!showDescribe)}>
                    {!showDescribe ? translate('web.resource.mall.zhankai') : translate('web.resource.mall.shouqi')}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.shop_brief_item}>
              <label>{translate('web.resource.member.zhuying')}：</label>
              <div className={styles.shop_brief_item_content}>{shopInfo?.customerCategoryName}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.shop_about_card}>
        <div className={styles.shop_about_card_title} id="album">
          <label>{translate('web.resource.mall.gongsixiangce')}</label>
        </div>
        <div className={styles.shop_about_card_body}>
          <div className={styles.exhibition_toolbar}>
            <div className={cx(styles.exhibition_tool_item, styles.prev)} onClick={() => handlePrev()}>
              <img src={prevArrowIcon} />
            </div>
            <div className={styles.exhibition_list_contaner}>
              <div className={styles.exhibition_list} style={{ left: offSetLeft }}>
                {shopInfo?.workshopPics &&
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
          <label>{translate('web.resource.mall.zizhirongyu')}</label>
        </div>
        <div className={styles.shop_about_card_body}>
          <div className={styles.shop_honorpic_list}>
            {shopInfo?.honorPics &&
              shopInfo.honorPics.map((url, index) => (
                <div key={`shop_honorpic_list_${index}`} className={cx(styles.shop_honorpic_list_item)}>
                  <ImageBox src={url} width={282} height={198} />
                </div>
              ))}
            <div></div>
          </div>
        </div>
      </div>
      {shopInfo?.albumUrl && (
        <div className={styles.shop_about_card}>
          <div className={styles.shop_about_card_title} id="brochure">
            <label>{translate('web.resource.mall.xuanchuanshouce')}</label>
          </div>
          <div className={styles.album_box}>
            <iframe className={styles.album_iframe} src={shopInfo?.albumUrl}></iframe>
          </div>
        </div>
      )}
    </AboutLayout>
  )
}

export default AboutUs
