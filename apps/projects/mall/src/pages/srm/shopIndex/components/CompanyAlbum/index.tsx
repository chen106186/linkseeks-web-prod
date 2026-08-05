import React from 'react'
import { getWebIntl } from '@/utils/locales'
import bannerImg from './1.png'
import styles from './index.module.less'

interface Props {
  companyImgList?: Array<any>
  shopMessageId?: string
}
const CompanyAlbum: React.FC<Props> = (props) => {
  const { companyImgList = [bannerImg, bannerImg], shopMessageId } = props
  const translate = getWebIntl()

  return (
    <div className={styles['img-warp']}>
      <div className={styles['title']}>{translate('web.resource.mall.gongsixiangce')}</div>
      <ul className={styles['box-warp']}>
        <li className={styles['img-left']}>
          <img src={companyImgList[0]} alt="" />
        </li>
        <li className={styles['img-right']}>
          {companyImgList[1] && (
            <div className={styles['img-rifht-top']}>
              <img src={companyImgList[1]} alt="" />
            </div>
          )}
          {companyImgList.length > 2 && (
            <li className={styles['box-warp']}>
              <div className={styles['box-left']}>
                <img src={companyImgList[2]} alt="" />
              </div>
              {companyImgList.length > 3 && (
                <div className={`${styles['box-left']} ${styles['show-more']}`}>
                  {translate('web.resource.mall.gengduozhaopian')}
                  <a href={`/aboutUs/${shopMessageId}`} className="all-jump"></a>
                </div>
              )}
            </li>
          )}
        </li>
      </ul>
    </div>
  )
}

export default CompanyAlbum
