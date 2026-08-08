import React, { useState, useEffect, useMemo } from 'react'
import Recommend from '@/components/Recommend'
import TimeFrequency from '@/components/TimeFrequency'
import { StarOutlined } from '@ant-design/icons'
import Share from '@/components/Share'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import {
  getManageContentInformationFindById,
  getManageMemberInformationFindById,
  postManageContentInformationCollect,
  postManageMemberInformationCollect,
} from '@apps/apis'
import { useParams } from 'react-router-dom'
import { useGlobalConext } from '@/context/globalProvider'
import { REQUEST_HEADER, TOP_DOMAIN } from '@apps/constants'
import useLink from '@/hooks/useLink'
import HelmetProvider from '@/context/helmetProvider'
import useHelmet from '@/hooks/useHelmet'
import styles from './index.module.less'

const Index: React.FC = () => {
  const { userInfo, mallInfo } = useGlobalConext()
  const { id } = useParams()
  const { linkPrefix } = useLink()
  const translate = getWebIntl()
  const [infoMessage, setInfoMessage] = useState<any>([])

  const fnGetHotspot = () => {
    const data: any = {
      id: id,
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    }
    const requestApi = mallInfo?.isMemberOperate
      ? getManageMemberInformationFindById
      : getManageContentInformationFindById
    requestApi(data).then((res) => {
      setInfoMessage(res.data)
    })
  }

  const fnChangeCollectStatus = () => {
    const urlPath = `${REQUEST_HEADER}${mallInfo?.url}${TOP_DOMAIN}${linkPrefix(`/info/infoDetail/${id}`)}`

    const obj: any = {
      informationId: infoMessage.id,
      status: !infoMessage.collectStatus,
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
      url: urlPath,
    }
    const requestApi = mallInfo?.isMemberOperate
      ? postManageMemberInformationCollect
      : postManageContentInformationCollect
    requestApi(obj, { ctlType: 'none' }).then((res: any) => {
      const { code } = res
      if (code === 1000) {
        infoMessage.collectStatus = !infoMessage.collectStatus
        setInfoMessage({ ...infoMessage })
      }
    })
  }

  useEffect(() => {
    fnGetHotspot()
  }, [])

  const seoState = useMemo(() => {
    return {
      title: translate('web.resource.shop.zixunxiangqing'),
      keyword: translate('web.resource.shop.zixunxiangqing'),
      description: translate('web.resource.shop.zixunxiangqing'),
    }
  }, [])

  return (
    <HelmetProvider {...seoState}>
      <div className={styles['list-main']}>
        <div className={styles['search-tips']}>
          {translate('web.resource.mall.nindeweizhi')}：{translate('web.resource.marketing.hangqingzixun')}
          &gt;
          {translate('web.resource.shop.zixunxiangqing')}
        </div>
        <div className={styles['search-content-warp']}>
          <div className={cx(styles['search-content-left'], styles['search-content-main'])}>
            <div>
              <ul className={styles['detail-title-warp']}>
                <li className={styles['detail-title']}>{infoMessage?.title}</li>
                <li className={styles['detail-time']}>
                  <TimeFrequency time={infoMessage.createTime} count={infoMessage.readCount}></TimeFrequency>
                  {userInfo && (
                    <div className={styles['detail-collection']} onClick={fnChangeCollectStatus}>
                      <StarOutlined
                        className={infoMessage.collectStatus ? styles.isCollect : ''}
                        style={{ marginRight: '6px' }}
                      />
                      {!infoMessage.collectStatus
                        ? translate('web.resource.mall.shoucangwenzhang')
                        : translate('web.resource.mall.quxiaoshoucang')}
                    </div>
                  )}
                </li>
              </ul>
              <div dangerouslySetInnerHTML={{ __html: infoMessage.content }}></div>
            </div>
            <div className={styles['search-content-left-around']}>
              {infoMessage.nextContentLabel && (
                <a href={linkPrefix(`/info/infoDetail/${infoMessage.nextContentLabel.id}`)}>
                  {translate('web.resource.mall.xiayipian')}：{infoMessage.nextContentLabel.title}
                </a>
              )}
              {infoMessage.lastContentLabel && (
                <a href={linkPrefix(`/info/infoDetail/${infoMessage.lastContentLabel.id}`)}>
                  {translate('web.resource.mall.shangyipian')}：{infoMessage.lastContentLabel.title}
                </a>
              )}
            </div>
          </div>
          <div className={styles['search-content-right']}>
            <Recommend id={id} />
          </div>
          {useMemo(
            () => (
              <Share title={infoMessage?.title} id={id} />
            ),
            [infoMessage?.title],
          )}
        </div>
      </div>
    </HelmetProvider>
  )
}

export default Index
