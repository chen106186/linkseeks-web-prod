import React from 'react'
import { CurrentSkuItemType } from '@/pages/commodityDetail/types'
import { getWebIntl } from '@/utils/locales'
import { ScienceTemplate } from './template'
import styles from './index.module.less'

interface IntroductionPropsType {
  commodityDetail: any
  currentSku?: CurrentSkuItemType
}

const Introduction: React.FC<IntroductionPropsType> = (props) => {
  const { commodityDetail, currentSku } = props
  const translate = getWebIntl()

  const renderIntroduction = () => {
    if (commodityDetail?.commodityRemarkList) {
      const templateName = 'science'
      switch (templateName) {
        case 'science':
          return <ScienceTemplate commodityRemarkList={commodityDetail?.commodityRemarkList} />
        default:
          return <ScienceTemplate commodityRemarkList={commodityDetail?.commodityRemarkList} />
      }
    }
    return null
  }

  return (
    <div id="introduction" className={styles.introduction}>
      <div className={styles['product-descriptions-titleWrap']}>
        <div className={styles['product-descriptions-title-line']} />
        <div className={styles['product-descriptions-title']}>{translate('web.resource.mall.guigecanshu')}</div>
        <div className={styles['product-descriptions-title-line']} />
      </div>
      <div className={styles.introduction_list}>
        <div className={styles.introduction_list_item}>
          <div className={styles.label}>{translate('web.resource.commodity.category')}</div>
          <div className={styles.breif}>{commodityDetail?.customerCategoryName}</div>
        </div>
        <div className={styles.introduction_list_item}>
          <div className={styles.label}>{translate('web.resource.mall.brand')}</div>
          <div className={styles.breif}>{commodityDetail?.brandName}</div>
        </div>
        <div className={styles.introduction_list_item}>
          <div className={styles.label}>{translate('web.resource.mall.guigebianma')}</div>
          <div className={styles.breif}>
            <span>{currentSku?.code}</span>
          </div>
        </div>
        {commodityDetail?.commodityAttributeList &&
          commodityDetail?.commodityAttributeList.length > 0 &&
          commodityDetail?.commodityAttributeList.map(
            (
              item: {
                customerAttribute: { name: boolean | React.ReactPortal | null | undefined }
                customerAttributeValueList: any[]
              },
              index: any,
            ) => (
              <div className={styles.introduction_list_item} key={`introduction_list_item_${index}`}>
                <div className={styles.label}>{item.customerAttribute.name}</div>
                <div className={styles.breif}>
                  {item.customerAttributeValueList.map((attrItem, attrIndex) => (
                    <span key={`introduction_list_item_item_${attrItem.id}`}>
                      {attrItem.value}
                      {attrIndex !== item.customerAttributeValueList.length - 1 ? '、' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ),
          )}
        {currentSku &&
          currentSku.commoditySkuAttributeList &&
          currentSku.commoditySkuAttributeList.length > 0 &&
          currentSku.commoditySkuAttributeList.map((item) => (
            <div className={styles.introduction_list_item} key={`sku_item_${item.id}`}>
              <div className={styles.label}>{item.customerAttribute?.name}</div>
              <div className={styles.breif}>{item.customerAttributeValue?.value}</div>
            </div>
          ))}
        {commodityDetail?.packing && (
          <div className={styles.introduction_list_item}>
            <div className={styles.label}>{translate('web.resource.commodity.baozhuangqingdan')}</div>
            <div className={styles.breif}>{commodityDetail?.packing}</div>
          </div>
        )}
        {commodityDetail?.afterService && (
          <div className={styles.introduction_list_item}>
            <div className={styles.label}>{translate('web.resource.mall.afterSaleService')}</div>
            <div className={styles.breif}>{commodityDetail?.afterService}</div>
          </div>
        )}
      </div>
      <div className={styles['product-descriptions-titleWrap']}>
        <div className={styles['product-descriptions-title-line']} />
        <div className={styles['product-descriptions-title']}>{translate('web.resource.shop.shangpinxiangqing')}</div>
        <div className={styles['product-descriptions-title-line']} />
      </div>
      {renderIntroduction()}
    </div>
  )
}

export default Introduction
