import React, { useState } from 'react'
import cx from 'classnames'
import { Input, message } from 'antd'
import { LinkTo } from '@/utils'
import { getWebIntl } from '@/utils/locales'
import { GetProductPlatformGetCategoryTreeResponse } from '@apps/apis'
import { useGlobalConext } from '@/context/globalProvider'
import { SelectAreaItemType } from '@/types/global'
import { MEMBER_CENTER_URL } from '@/constants/domain'
import useDomainPath from '@/hooks/useDomainPath'
import ImageBox from '@apps/components/src/web/ImageBox'
import formBg from './imgs/logistics_form_bg.png'
import logisticsIcon from '../icons/logistics_icon.png'
import SelectCity from '../SelectCity'
import SelectCategory, { SelectCategoryType } from '../SelectCategory'
import styles from './index.module.less'

export interface LogisticsItemType {
  id: number
  describe: string
  logo: string
  memberName: string
  mainBusiness: string
}

interface LogisticsInfo {
  advertImg: string
  link: string
  advertTitle: string
  advertDescribe: string
  logisticsMerchantList: LogisticsItemType[]
}

interface LogisticsProps {
  dataInfo: LogisticsInfo
  anchor: string
  areaData: SelectAreaItemType[]
  categoryList: GetProductPlatformGetCategoryTreeResponse
  templateId: number | undefined
  currentCity: SelectAreaItemType | undefined
}

const Logistics: React.FC<LogisticsProps> = (props) => {
  const { dataInfo, anchor, areaData, categoryList } = props
  const [tabType, setTabType] = useState<number>(1)
  const [startArea, setStartArea] = useState<SelectAreaItemType>()
  const [endArea, setEndArea] = useState<SelectAreaItemType>()
  const [categoryInfo, setCategoryInfo] = useState<SelectCategoryType>()
  const [goodsWeight, setGoodsWeight] = useState<string>()
  const { mallUrl, userInfo, pathname } = useGlobalConext()
  const { LOGIN_DOMAIN } = useDomainPath(pathname)
  const translate = getWebIntl()

  const handleSubmit = () => {
    if (userInfo) {
      let linkUrl = ''
      switch (tabType) {
        case 1:
          linkUrl = `${mallUrl?.logisticslUrl}`
          break
        case 2:
          linkUrl = `${MEMBER_CENTER_URL}/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill/add`
          break
        default:
          break
      }
      if (tabType === 1) {
        if (!startArea) {
          message.info('请选择装货地点')
          return
        }
        let urlParam = `provinceCodePretend=${startArea.provinceCode}&cityCodePretend=${startArea.cityCode}`
        if (endArea) {
          urlParam += `&provinceCodeDischarge=${endArea.provinceCode}&cityCodeDischarge=${endArea.cityCode}`
        }
        if (categoryInfo) {
          if (categoryInfo.thirdCategoryId) {
            urlParam += `&categoryId=${categoryInfo.thirdCategoryId}`
          } else if (categoryInfo.secondCategoryId) {
            urlParam += `&categoryId=${categoryInfo.secondCategoryId}`
          } else if (categoryInfo.firstCateogryId) {
            urlParam += `&categoryId=${categoryInfo.firstCateogryId}`
          }
        }
        if (goodsWeight) {
          urlParam += `&weight=${goodsWeight}`
        }
        LinkTo(`${mallUrl?.logisticslUrl}/portal/search?${urlParam}`)
      } else {
        LinkTo(linkUrl)
      }
    } else {
      LinkTo(LOGIN_DOMAIN)
    }
  }

  return (
    <div className={styles.logistics} id={anchor}>
      <div className={cx(styles.module_card, styles.autoWidth)}>
        <div className={styles.module_card_title}>
          <i className={styles.module_card_title_icon}>
            <img src={logisticsIcon} />
          </i>
          <label className={styles.module_card_title_label}>物流服务</label>
          <div
            className={styles.advert_box}
            title={`${dataInfo.advertTitle}_${dataInfo.advertDescribe}`}
            onClick={() => {
              if (dataInfo.link) {
                LinkTo(dataInfo.link, 'open')
              }
            }}
          >
            {dataInfo.advertImg && <ImageBox width={400} height={48} src={dataInfo.advertImg} />}
          </div>
        </div>
        <div className={styles.list}>
          {dataInfo?.logisticsMerchantList &&
            dataInfo?.logisticsMerchantList.map(
              (item, index) =>
                index < 6 && (
                  <div className={styles.list_item} key={`logistics_item_${item.id}_${index}`}>
                    <div className={styles.line}>
                      <div className={styles.imgbox}>
                        <ImageBox width={24} height={24} src={item.logo} />
                      </div>
                      <a href={`${mallUrl?.logisticslUrl}/aboutUs/${item.id}`} target="_blank" className={styles.name}>
                        {item.memberName}
                      </a>
                    </div>
                    <div className={styles.tag}>{item.describe}</div>
                    <div className={styles.text_line}>
                      <label>主营 ：</label>
                      <span>{item.mainBusiness}</span>
                    </div>
                  </div>
                ),
            )}
        </div>
      </div>
      <div id="form_box" className={cx(styles.form_box, styles.log)} style={{ backgroundImage: `url(${formBg})` }}>
        <div className={styles.tab}>
          <div className={cx(styles.tab_item, tabType === 1 && styles.active)} onClick={() => setTabType(1)}>
            快速找车
          </div>
          <div className={cx(styles.tab_item, tabType === 2 && styles.active)} onClick={() => setTabType(2)}>
            快速派单
          </div>
        </div>
        <div className={styles.form_body}>
          <div className={styles.form_item}>
            <label>装点 ：</label>
            <SelectCity
              value={startArea}
              areaData={areaData}
              placeholder={'请选择装货地点'}
              onChange={(value) => setStartArea(value)}
            />
          </div>
          <div className={styles.form_item}>
            <label>卸点 ：</label>
            <SelectCity
              value={endArea}
              areaData={areaData}
              placeholder={'请选择卸货地点'}
              onChange={(value) => setEndArea(value)}
            />
          </div>
          <div className={styles.form_item}>
            <label>货物 ：</label>
            <SelectCategory
              value={categoryInfo}
              categoryList={categoryList}
              placeholder={'请选择货物种类(选填)'}
              onChange={(value) => setCategoryInfo(value)}
            />
          </div>
          <div className={styles.form_item}>
            <label>吨位 ：</label>
            <Input
              style={{ textOverflow: 'ellipsis' }}
              value={goodsWeight}
              onChange={(e) => setGoodsWeight(e.target.value)}
              placeholder={'请输入货物吨数(选填)'}
              className={styles.inputbox}
            />
          </div>
          <div className={styles.form_btn} onClick={handleSubmit}>
            提交
          </div>
        </div>
      </div>
    </div>
  )
}

export default Logistics
