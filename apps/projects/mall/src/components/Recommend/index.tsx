import React, { useState, useEffect } from 'react'
import {
  getManageMemberInformationFindAllByRecommendLabel,
  getManageContentInformationFindAllByRecommendLabel,
  getManageMemberColumnHot,
  getManageContentColumnHot,
  getManageMemberInformationRelated,
  getManageContentInformationRelated,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import useLink from '@/hooks/useLink'
import { integrationTime } from '@/utils'
import imgUrl from './1.png'
import styles from './index.module.less'

interface Props {
  id?: string
  hiddenrelated?: boolean
}

const Recommend: React.FC<Props> = (props) => {
  const { id = '', hiddenrelated = false } = props
  const { mallInfo } = useGlobalConext()
  const [recommendReadList, setRecommendReadList] = useState<any>([])
  const [columnHot, setColumnHot] = useState<any>([])
  const [relatedList, setRelatedList] = useState<any>([])
  const { linkPrefix } = useLink()
  const translate = getWebIntl()

  /**
   * 推荐阅读
   */
  const fnGetRecommendReadList = () => {
    const data: any = {
      recommendLabel: '4',
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    }
    const requestApi = mallInfo?.isMemberOperate
      ? getManageMemberInformationFindAllByRecommendLabel
      : getManageContentInformationFindAllByRecommendLabel
    requestApi(data).then((res) => {
      setRecommendReadList(res.data)
    })
  }

  /**
   * 热门栏目
   */
  const fnGetColumnHot = () => {
    const requestApi = mallInfo?.isMemberOperate ? getManageMemberColumnHot : getManageContentColumnHot
    requestApi({
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    } as any).then((res) => {
      setColumnHot(res.data)
    })
  }

  /**
   * 同类资讯
   */
  const fnGetRelated = () => {
    if (!id || hiddenrelated) {
      return
    }
    const data: any = {
      id: id,
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    }
    const requestApi = mallInfo?.isMemberOperate
      ? getManageMemberInformationRelated
      : getManageContentInformationRelated
    requestApi(data)
      .then((res) => {
        setRelatedList(res.data)
      })
      .catch(() => {
        setRelatedList([])
      })
  }

  useEffect(() => {
    fnGetRecommendReadList() // 推荐阅读
    fnGetColumnHot() // 热门栏目
    fnGetRelated() // 同类资讯
  }, [])

  return (
    <>
      <ul className={styles['recommend-right-warp']}>
        <li className={styles['recommend-text']}>
          <span>{translate('web.resource.mall.tuijianyuedu')}</span>
        </li>
        {recommendReadList && recommendReadList.length > 0 && (
          <li className={styles['recommend-img-warp']}>
            <img
              className={styles['recommend-img']}
              src={recommendReadList[0] ? recommendReadList[0].imageUrl : imgUrl}
              alt=""
            />
            <div className={styles['recommend-img-title']}>{recommendReadList[0].title}</div>
            <div className={styles['recommend-img-second-title']}>
              {integrationTime(recommendReadList[0].createTime, 'YMD')}
            </div>
            <a
              href={linkPrefix(`/info/infoDetail/${recommendReadList[0] ? recommendReadList[0].id : ''}`)}
              className="all-jump"
            ></a>
          </li>
        )}
        {recommendReadList.map((item: any, index: number) => {
          if (index == 0) {
            return
          }
          return (
            <li className={styles['recommend-content']} key={item + 'recommended' + index}>
              <div className={styles['recommend-content-img']}>
                <img src={item ? item.imageUrl : imgUrl} alt="" />
              </div>
              <div className={styles['recommend-content-right-warp']}>
                <div className={styles['recommend-content-title']}>{item ? item.title : '-'}</div>
                <div className={styles['recommend-content-time']}>
                  {item ? integrationTime(item.createTime, 'YMD') : '2019-03-18'}
                </div>
              </div>
              <a href={linkPrefix(`/info/infoDetail/${item ? item.id : ''}`)} className="all-jump"></a>
            </li>
          )
        })}
      </ul>
      <div className={styles['recommend-right-warp']}>
        <div className={styles['recommend-text']}>
          <span>{translate('web.resource.mall.remenlanmu')}</span>
        </div>
        <ul className={styles['recommend-right-content']}>
          {columnHot.map((item: any) => {
            return (
              <li key={item.id + 'hot'} className={styles['recommend-right-content-item']}>
                {item.name}
                <a href={linkPrefix(`/info/infoList/${item ? item.id : ''}`)} className="all-jump"></a>
              </li>
            )
          })}
        </ul>
      </div>
      {id && !!relatedList.length && (
        <div className={styles['recommend-right-warp']}>
          <div className={styles['recommend-text']}>
            <span>{translate('web.resource.mall.tongleizixun')}</span>
          </div>
          <ul>
            {relatedList.map((item: any) => {
              return (
                <li className={styles['similar-warp']} key={item.id + 'related'}>
                  <div className={styles['similar-title']}>{item.title}</div>
                  <div className={styles['similar-time']}>[{integrationTime(item.createTime, 'MD')}]</div>
                  <a href={linkPrefix(`/info/infoDetail/${item ? item.id : ''}`)} className="all-jump"></a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </>
  )
}

export default Recommend
