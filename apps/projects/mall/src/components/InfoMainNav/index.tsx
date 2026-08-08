import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import {
  getManageMemberCategoryAll,
  getManageContentCategoryAll,
  getManageMemberCategoryRecommend,
  getManageContentCategoryRecommend,
} from '@apps/apis'
import { Popover, Space } from 'antd'
import { useGlobalConext } from '@/context/globalProvider'
import useLink from '@/hooks/useLink'
import { LinkTo } from '@/utils'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

const MainNav: React.FC = (props) => {
  const { mallInfo } = useGlobalConext()
  const { linkPrefix } = useLink()
  const translate = getWebIntl()
  const pathname = '/'
  const menuDataDesc: any[] | (() => any[]) = []
  const [menuData, setMenuData] = useState(menuDataDesc)
  const [recommendList, setRecommendList] = useState(menuDataDesc)
  /**
   * 获取所有分类
   */
  const fnGetContentCategoryAll = () => {
    const requestApi = mallInfo?.isMemberOperate ? getManageMemberCategoryAll : getManageContentCategoryAll
    requestApi({
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    } as any).then((res) => {
      setMenuData(res.data)
    })
  }
  const fnGetManageContentCategoryRecommend = () => {
    const requestApi = mallInfo?.isMemberOperate ? getManageMemberCategoryRecommend : getManageContentCategoryRecommend
    requestApi({
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    } as any).then((res) => {
      setRecommendList(res.data)
    })
  }
  /**
   * 整合分类悬浮内容
   * @param newObj 分类数据
   */
  const fnGetPopoverDom = (newObj: any) => {
    let domList = []
    domList = newObj.list.map((item: any, index: number) => {
      return (
        <li className={cx(styles['more-warp'])} key={item.id + 'newObj' + index}>
          <div className={cx(styles['more-key'])}>{item.name}</div>
          <div className={cx(styles['more-value'])}>
            <Space size={16}>
              {item.list.map((second: any, secodn: number) => {
                return (
                  <span key={second.id + 'newObj' + secodn}>
                    <a href={linkPrefix(`/info/labelSearch/${second.id}`)}>{second.name}</a>
                  </span>
                )
              })}
            </Space>
          </div>
        </li>
      )
    })
    return <ul style={{ marginBottom: 0 }}>{domList}</ul>
  }

  useEffect(() => {
    fnGetContentCategoryAll()
    fnGetManageContentCategoryRecommend()
  }, [])

  return (
    <div className={cx(styles.main_nav)}>
      <div className={styles.main_nav_container}>
        <ul className={styles.nav}>
          <li className={styles.nav_item} onClick={() => LinkTo(linkPrefix('/info'))}>
            {translate('web.resource.home.shou-ye')}
          </li>
          {menuData &&
            menuData.map((item: any, index: number) => {
              return (
                <Popover placement="bottomLeft" content={() => fnGetPopoverDom(item)} key={index + 'popover'}>
                  <li
                    className={cx(styles.nav_item, item.path === pathname ? styles.active : '')}
                    key={item.key + 'cx' + index}
                  >
                    <span style={{ cursor: 'pointer' }}>{item.name}</span>
                  </li>
                </Popover>
              )
            })}
        </ul>
      </div>
      <div className={styles['scond-nav-main']}>
        <ul className={styles['scond-nav-warp']}>
          {recommendList.map((item: any) => {
            return (
              <li className={styles['second-nav']} key={item.id + 'recommend'}>
                <span className={`${styles['second-nav-key']} ${styles['commoney-mar-ri']}`}>{item.name}</span>
                {item.list.map((second: any, index: number) => {
                  return (
                    <span
                      key={item.id + 'secondRecomend' + index}
                      className={`${styles['second-nav-value']} ${styles['commoney-mar-ri']}`}
                    >
                      <a href={linkPrefix(`/info/labelSearch/${second.id}`)}>{second.name}</a>
                    </span>
                  )
                })}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default MainNav
