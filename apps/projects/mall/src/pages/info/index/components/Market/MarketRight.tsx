import React, { useState, useEffect } from 'react'
import { RightOutlined } from '@ant-design/icons'
import DailyQuotation from '@/components/DailyQuotation'
import { Empty, Spin } from 'antd'
import { getWebIntl } from '@/utils/locales'
import cx from 'classnames'
import {
  getManageContentColumnAllByMarket,
  getManageContentInformationPageByColumnLabel,
  getManageMemberColumnAllByMarket,
  getManageMemberInformationPageByColumnLabel,
} from '@apps/apis'
import { useGlobalConext } from '@/context/globalProvider'
import useLink from '@/hooks/useLink'
import { integrationTime } from '@/utils'
import styles from './index.module.less'

const MarketRight: React.FC = () => {
  const { mallInfo } = useGlobalConext()
  const [navList, setNavList] = useState<any>([])
  const [newNav, setNewNat] = useState<any>(9)
  const [recommendList, setRecommendList] = useState<any>([])
  const [recommendTop, setRecommendTop] = useState<number>(0)
  const [contentList, setContentList] = useState<any>([])
  const [load, setLoad] = useState(true)
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

  /**
   * 获取导航分类的栏目nav
   */
  const fnGetNavList = () => {
    const requestApi = mallInfo?.isMemberOperate ? getManageMemberColumnAllByMarket : getManageContentColumnAllByMarket
    requestApi({
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    } as any).then((res) => {
      setNavList(res.data)
      if (res.data) {
        setNewNat(res.data[0].id)
      }
    })
  }

  const fnGetContentForNav = () => {
    let data: any = {
      id: newNav,
      current: '1',
      pageSize: '13',
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    }
    setLoad(true)
    const requestApi = mallInfo?.isMemberOperate
      ? getManageMemberInformationPageByColumnLabel
      : getManageContentInformationPageByColumnLabel
    requestApi(data).then((res) => {
      setContentList([...res.data.data])
      const recommendListDesc = res.data.data.splice(0, 3)
      if (recommendListDesc[0]) {
        recommendListDesc.push(recommendListDesc[0]) // 顺滑滚动必须多一个首项的
      }
      setLoad(false)
      setRecommendList([...recommendListDesc])
    })
  }

  const autoChangeTop = () => {
    let newTop = recommendTop - 48
    if (newTop == -192) {
      newTop = 0
    }
    setRecommendTop(newTop)
  }

  const fnChangeNavNew = (id: any) => {
    setNewNat(id)
  }
  useEffect(() => {
    fnGetNavList()
  }, [])

  useEffect(() => {
    fnGetContentForNav()
  }, [newNav])

  useEffect(() => {
    setTimeout(() => {
      autoChangeTop()
    }, 3500)
  }, [autoChangeTop])

  return (
    <div className={styles['market-right-warp']}>
      <div className={styles['nav-warp']}>
        <div className={styles['nav-title']}>{'市场行情'}</div>
        <ul className={styles['nav-search-warp']}>
          {navList.map((item: any, index: number) => {
            if (index > 4) {
              return
            }
            return (
              <li
                className={cx(styles['nav-search-item'], newNav == item.id ? styles['nav-search-item-select'] : '')}
                onClick={() => {
                  fnChangeNavNew(item.id)
                }}
                key={item.id + 'nav'}
              >
                {item.name}
              </li>
            )
          })}
        </ul>
        <div className={styles['nav-search-more']}>
          {translate('web.common.more')}
          <RightOutlined translate={undefined} />
          <a href={linkPrefix(`/info/infoList/${newNav}`)} className="all-jump"></a>
        </div>
      </div>
      <Spin tip={`${translate('web.common.loading')}...`} spinning={load}>
        <div className={styles['newest-message-main']}>
          <ul
            className={`${styles['newest-message-warp']} ${recommendTop == 0 ? '' : styles['has-transition']}`}
            style={{ top: recommendTop + 'px' }}
          >
            {recommendList.map((item: any, index: number) => {
              if (!item) {
                return
              }
              return (
                <li className={styles['newest-message']} key={item.id + 'recommend' + index}>
                  <div className={styles['newest-message-left']}>
                    <span className={styles['newest-tips']}>{translate('web.common.zuixin')}</span>
                    {integrationTime(item.createTime, 'YMD')} [{item.columnName}]：{item.title}
                  </div>
                  <div className={styles['newest-message-right']}>
                    {translate('web.resource.mall.chakanxiangqing')}
                    <RightOutlined translate={undefined} />
                    <a href={linkPrefix(`/info/infoDetail/${item.id}`)} className="all-jump"></a>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        <ul className={styles['market-right-content-warp']}>
          {contentList.map((item: any) => {
            return (
              <DailyQuotation
                key={item.id + 'title-right'}
                content={item.title}
                time={item.createTime}
                columnName={item.columnName}
                detailId={item.id}
                item={item}
              />
            )
          })}
        </ul>
        {recommendList.length == 0 && (
          <div style={{ paddingBottom: '100px' }}>
            <Empty description={<div>{translate('web.resource.mall.zanwuhangqing')}</div>} />
          </div>
        )}
      </Spin>
    </div>
  )
}

export default MarketRight
