import React, { useState, useEffect } from 'react'
import EnterprisesLeft from '../EnterprisesLeft'
import styles from './index.module.less'

interface Props {
  searchSelect: any
}

const LogisticsSearch: React.FC<Props> = (props) => {
  const { searchSelect = {} } = props
  const [imgList, setImgList] = useState<any>([])

  useEffect(() => {
    const list = JSON.parse(searchSelect.companyPics)

    if (list) {
      setImgList(list)
    }
  }, [searchSelect])

  return (
    <div className={styles['enterprises-main']}>
      <EnterprisesLeft
        cardTitle={searchSelect.memberName}
        cardImg={searchSelect.logo}
        registerYears={searchSelect.registerYears}
        creditPoint={searchSelect.creditPoint}
        identification={searchSelect.avgTradeCommentStar}
        business={searchSelect.categoryBOList}
        cardAddress={searchSelect.areas}
        staffNum={searchSelect.staffNum}
        plantArea={searchSelect.plantArea}
        yearProcessAmount={searchSelect.yearProcessAmount}
        levelTag={searchSelect.levelTag}
      />
      <div className={styles['enterprises-right']}>
        {imgList.map((item: any, index: number) => {
          if (index > 2) {
            return
          }
          return <img className={styles['img-item']} src={item} alt="" key={item} />
        })}
      </div>
    </div>
  )
}

export default LogisticsSearch
