import React, { useState } from 'react'
import cx from 'classnames'
import { Input, message } from 'antd'
import { SelectAreaItemType } from '@/types/global'
import ImageBox from '@apps/components/src/web/ImageBox'
import { useGlobalConext } from '@/context/globalProvider'
import SelectCity from '../SelectCity'
import SelectCategory, { SelectCategoryType } from '../SelectCategory'
import SelectYearRange, { SelectYearValueType } from '../SelectYearRange'
import { LinkTo } from '@/utils'
import { getWebIntl } from '@/utils/locales'
import { MEMBER_CENTER_URL } from '@/constants/domain'
import useDomainPath from '@/hooks/useDomainPath'
import { GetProductPlatformGetCategoryTreeResponse } from '@apps/apis'
import processIcon from '../icons/process_icon.png'
import formBg from './imgs/process_form_bg.png'
import companyIcon from './imgs/company_icon.png'
import supplyIcon from './imgs/supply_icon.png'
import styles from './index.module.less'

interface ProcessItemType {
  id: number
  describe: string
  logo: string
  memberName: string
  categoryBOList: string
  plantArea: number // 厂房面积
  yearProcessAmount: number // 年加工额
}

interface ProcessInfo {
  advertImg: string
  link: string
  advertTitle: string
  advertDescribe: string
  processMerchantList: ProcessItemType[]
}

interface ProcessProps {
  dataInfo: ProcessInfo
  anchor: string
  areaData: SelectAreaItemType[]
  categoryList: GetProductPlatformGetCategoryTreeResponse
  templateId: number | undefined
  currentCity: SelectAreaItemType | undefined
}

const Process: React.FC<ProcessProps> = (props) => {
  const { dataInfo, anchor, areaData, categoryList } = props
  const [tabType, setTabType] = useState<number>(1)
  const [startArea, setStartArea] = useState<SelectAreaItemType>()
  const [categoryInfo, setCategoryInfo] = useState<SelectCategoryType>()
  const [processCount, setProcessCount] = useState<string>()
  const [yearRange, setYearRange] = useState<SelectYearValueType>()
  const { mallUrl, userInfo, pathname } = useGlobalConext()
  const translate = getWebIntl()
  const { LOGIN_DOMAIN } = useDomainPath(pathname)

  const renderPlantArea = (type: number) => {
    switch (type) {
      case 1:
        return '100m2' + '以下'
      case 2:
        return '100-200m2'
      case 3:
        return '201-500m2'
      case 4:
        return '501-1000m2'
      case 5:
        return '1001-5000m2'
      case 6:
        return '5000m2' + '以上'
      default:
        return ''
    }
  }

  const renderYearProcessAmount = (type: number) => {
    switch (type) {
      case 1:
        return '50' + '万以下'
      case 2:
        return '50-100' + '万'
      case 3:
        return '101-500' + '万'
      case 4:
        return '501-1000' + '万'
      case 5:
        return '1001-2000' + '万'
      case 6:
        return '2000' + '万以上'
      default:
        return ''
    }
  }

  const handleSubmit = () => {
    if (userInfo) {
      let linkUrl = ''
      switch (tabType) {
        case 1:
          linkUrl = `${mallUrl?.processlUrl}`
          break
        case 2:
          linkUrl = `${MEMBER_CENTER_URL}/handling/assign/tobeAddQuery/add`
          break
        default:
          break
      }
      if (tabType === 1) {
        if (!categoryInfo) {
          message.info(translate('web.resource.mall.qingxuanzejiagonghuowuzhonglei'))
          return
        }
        let urlParam = ''
        if (categoryInfo.thirdCategoryId) {
          urlParam += `categoryId=${categoryInfo.thirdCategoryId}`
        } else if (categoryInfo.secondCategoryId) {
          urlParam += `categoryId=${categoryInfo.secondCategoryId}`
        } else if (categoryInfo.firstCateogryId) {
          urlParam += `categoryId=${categoryInfo.firstCateogryId}`
        }
        if (startArea) {
          urlParam += `&provinceCode=${startArea.provinceCode}&cityCode=${startArea.cityCode}`
        }

        if (processCount) {
          urlParam += `&processCount=${processCount}`
        }

        if (yearRange) {
          urlParam += `&yearProcessAmount=${yearRange.value}`
        }
        LinkTo(`${mallUrl?.processlUrl}/portal/search?${urlParam}`)
      } else {
        LinkTo(linkUrl)
      }
    } else {
      LinkTo(LOGIN_DOMAIN)
    }
  }

  return (
    <div className={styles.process} id={anchor}>
      <div className={cx(styles.module_card, styles.autoWidth)}>
        <div className={styles.module_card_title}>
          <i className={styles.module_card_title_icon}>
            <img src={processIcon} />
          </i>
          <label className={styles.module_card_title_label}>{'加工服务'}</label>
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
          {dataInfo?.processMerchantList &&
            dataInfo?.processMerchantList.map((item, index) => (
              <div className={styles.list_item} key={`process_list_item_${item.id}_${index}`}>
                <div className={styles.line}>
                  <div className={styles.imgbox}>
                    <ImageBox width={24} height={24} src={item.logo} />
                  </div>
                  <a href={`${mallUrl?.processlUrl}/aboutUs/${item.id}`} target="_blank" className={styles.name}>
                    {item.memberName}
                  </a>
                </div>
                <div className={cx(styles.line, styles.martop16)}>
                  <div className={styles.line_item}>
                    <img className={styles.icon} src={companyIcon} />
                    <span>{renderPlantArea(item.plantArea)}</span>
                  </div>
                  <div className={styles.line_item}>
                    <img className={styles.icon} src={supplyIcon} />
                    <span>{renderYearProcessAmount(item.yearProcessAmount)}</span>
                  </div>
                </div>
                <div className={styles.text_line}>
                  <label>{translate('web.resource.mall.zhuyaojiagong')}：</label>
                  <span>{item.categoryBOList} </span>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className={cx(styles.form_box, styles.log)} style={{ backgroundImage: `url(${formBg})` }}>
        <div className={styles.tab}>
          <div
            style={{ textAlign: 'center' }}
            className={cx(styles.tab_item, tabType === 1 && styles.active)}
            onClick={() => setTabType(1)}
          >
            {translate('web.resource.mall.kuaisuzhaojiagong')}
          </div>
          <div className={cx(styles.tab_item, tabType === 2 && styles.active)} onClick={() => setTabType(2)}>
            {translate('web.resource.mall.kuaisupaidan')}
          </div>
        </div>
        <div className={styles.form_body}>
          <div className={styles.form_item}>
            <label>{translate('web.resource.mall.huowu')}：</label>
            <SelectCategory
              value={categoryInfo}
              categoryList={categoryList}
              placeholder={translate('web.resource.mall.qingxuanzejiagonghuowuzhonglei')}
              onChange={(value) => setCategoryInfo(value)}
            />
          </div>
          <div className={styles.form_item}>
            <label>{translate('web.common.diqu')}：</label>
            <SelectCity
              value={startArea}
              areaData={areaData}
              placeholder={translate('web.resource.mall.qingxuanzejiagongdidian')}
              onChange={(value) => setStartArea(value)}
            />
          </div>
          <div className={styles.form_item}>
            <label>{translate('web.resource.mall.shuliang')}：</label>
            <Input
              value={processCount}
              onChange={(e) => setProcessCount(e.target.value)}
              placeholder={translate('web.resource.mall.qingshurujiagongshuliang')}
              className={styles.inputbox}
              maxLength={15}
            />
          </div>
          <div className={styles.form_item}>
            <label>{translate('web.resource.mall.guimo')}：</label>
            <SelectYearRange
              value={yearRange}
              placeholder={translate('web.resource.mall.qingxuanzenianjiagongefanwei')}
              onChange={(val) => setYearRange(val)}
            />
          </div>
          <div className={cx(styles.form_btn, styles.process_btn)} onClick={handleSubmit}>
            {translate('web.common.submit')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Process
