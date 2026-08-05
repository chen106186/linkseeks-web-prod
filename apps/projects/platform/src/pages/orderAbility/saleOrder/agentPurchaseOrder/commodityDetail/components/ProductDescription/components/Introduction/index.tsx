import React from 'react'
import { ScienceTemplate } from './template'
import { observer } from 'mobx-react'
import styles from './index.less'

interface IntroductionPropsType {
  commodityDetail: any
}

const Introduction: React.FC<IntroductionPropsType> = (props) => {
  const { commodityDetail } = props

  const renderIntroduction = () => {
    if (commodityDetail?.commodityRemark) {
      const templateName = 'science'
      switch (templateName) {
        case 'science':
          return <ScienceTemplate {...commodityDetail?.commodityRemark} />
        default:
          return <ScienceTemplate {...commodityDetail?.commodityRemark} />
      }
    }
    return null
  }

  return (
    <div id="introduction" className={styles.introduction}>
      <div className={styles.introduction_list}>
        {commodityDetail?.commodityAttributeList &&
          commodityDetail?.commodityAttributeList.map(
            (
              item: {
                customerAttribute: {
                  name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined
                }
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
      </div>
      {renderIntroduction()}
    </div>
  )
}

export default observer(Introduction)
