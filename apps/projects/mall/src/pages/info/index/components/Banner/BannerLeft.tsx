import React, { useState, useEffect } from 'react'
import { getWebIntl } from '@/utils/locales'
import {
  getManageContentInformationFindAllByRecommendLabel,
  getManageMemberInformationFindAllByRecommendLabel,
} from '@apps/apis'
import { useGlobalConext } from '@/context/globalProvider'
import useLink from '@/hooks/useLink'
import styles from './index.module.less'

const BannerLeft: React.FC = () => {
  const { mallInfo } = useGlobalConext()
  const [bannerLeftList, setBannerLeftList] = useState<any>([])
  const { linkPrefix } = useLink()
  const translate = getWebIntl()

  const fnGetBannerLeft = () => {
    const data: any = {
      recommendLabel: '1',
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    }
    const requestApi = mallInfo?.isMemberOperate
      ? getManageMemberInformationFindAllByRecommendLabel
      : getManageContentInformationFindAllByRecommendLabel
    requestApi(data).then((res) => {
      setBannerLeftList(res.data)
    })
  }

  useEffect(() => {
    fnGetBannerLeft()
  }, [])

  const fnGetClass = (index: number) => {
    const classArr = ['first', 'second', 'third', 'fourth']
    return classArr[index]
  }
  return (
    <ul className={styles['banner-left']}>
      <li className={styles['banner-left-title']}>
        <div className={styles['banner-left-text']}>{translate('web.resource.mall.toutiaozixun')}</div>
      </li>
      <li style={{ height: '368px', overflowY: 'hidden' }}>
        {bannerLeftList.map((item: any, index: number) => {
          return (
            <div className={`${styles['banner-left-content-warp']} ${fnGetClass(index)}`} key={item.id}>
              <img src={item.imageUrl} alt={item.title} />
              <div className={styles['banner-left-content']}>{item.title}</div>
              <a href={linkPrefix(`/info/infoDetail/${item.id}`)} className="all-jump"></a>
            </div>
          )
        })}
      </li>
    </ul>
  )
}

export default BannerLeft
