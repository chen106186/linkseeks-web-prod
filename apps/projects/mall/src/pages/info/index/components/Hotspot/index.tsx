import React from 'react'
import { getWebIntl } from '@/utils/locales'
import { RightOutlined, HistoryOutlined, EyeOutlined } from '@ant-design/icons'
import useLink from '@/hooks/useLink'
import { integrationTime } from '@/utils'
import styles from './index.module.less'

interface Props {
  hotspotTitle?: string
  arrList?: Array<any>
  hotspotId?: string
}

const Hotspot: React.FC<Props> = (props) => {
  const { hotspotTitle = '', arrList = [], hotspotId = undefined } = props
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

  return (
    <div className={styles['hotspot-main']}>
      <div className={styles['hotspot-nav-warp']}>
        <div className={styles['hotspot-nav-title']}>{hotspotTitle}</div>
        <div className={styles['hotspot-nav-more']}>
          <a href={linkPrefix(`/info/infoList/${hotspotId}`)} style={{ color: '#909399' }}>
            {translate('web.common.more')}
            <RightOutlined translate={undefined} />
          </a>
        </div>
      </div>
      <div className={styles['hotspot-content-warp']}>
        <div className={styles['hotspot-content-left']}>
          <img className={styles['hotspot-content-img']} src={arrList[0].imageUrl} alt="" />
          <div className={styles['hotspot-content-title']}>{arrList[0].title}</div>
          <div className={styles['hotspot-content-second-title']}>{arrList[0].digest}</div>
          <div className={styles['hotspot-time-main']}>
            <div className={styles['hotspot-time-warp']}>
              <HistoryOutlined translate={undefined} className={styles['hotspot-time-icon']} />{' '}
              {integrationTime(arrList[0].createTime, 'YMD')}
            </div>
            <div className={styles['hotspot-time-warp']}>
              <EyeOutlined translate={undefined} className={styles['hotspot-time-icon']} /> {arrList[0].readCount}
            </div>
          </div>
          <a href={linkPrefix(`/info/infoDetail/${arrList[0].id}`)} className="all-jump"></a>
        </div>
        <ul className={styles['hotspot-content-right']}>
          {arrList.map((item: any, index: number) => {
            if (index == 0) {
              return
            }
            return (
              <li className={styles['hotspot-content-right-item']} key={item.id + 'right'}>
                <div className={styles['hotspot-content-title']}>{item.title}</div>
                <div className={styles['hotspot-content-second-title']}>{item.digest}</div>
                <div className={styles['hotspot-time-main']}>
                  <div className={styles['hotspot-time-warp']}>
                    <HistoryOutlined translate={undefined} className={styles['hotspot-time-icon']} />{' '}
                    {integrationTime(item.createTime, 'YMD')}
                  </div>
                  <div className={styles['hotspot-time-warp']}>
                    <EyeOutlined translate={undefined} className={styles['hotspot-time-icon']} /> {item.readCount}
                  </div>
                </div>
                <a href={linkPrefix(`/info/infoDetail/${item.id}`)} className="all-jump"></a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Hotspot
