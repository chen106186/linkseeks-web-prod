import React, { useEffect, useState } from 'react'
import { Anchor } from 'antd'
import {
  postCommodityWebMemberLogisticsWebCollect,
  getMemberMainpageUpperInquiry,
  getCommodityWebMemberLogisticsWebMemberLogisticsMain,
} from '@apps/apis'
import { useParams } from 'react-router-dom'
import { integrationTime } from '@/utils'
import { useGlobalConext } from '@/context/globalProvider'
import HelmetProvider from '@/context/helmetProvider'
import CompanyTitle from './CompanyTitle'
import Album from './Album'
import CompanyBrief from './CompanyBrief'
import Award from './img/Award.svg'
import Company from './img/Company.svg'
import Briefcase from './img/Briefcase.svg'
import Image from './img/Image.svg'
import styles from './index.module.less'

const { Link } = Anchor

const briefListDesc = [
  { title: '地区', secondTitle: '广东广州', icon: 'address' },
  { title: '成立年份', secondTitle: '2008年', icon: 'data' },
]

const PortalAbout = () => {
  const { mallInfo, userInfo, mallUrl } = useGlobalConext()
  const [mewssage, setMessage] = useState<any>('10')
  const [briefList, setBriefList] = useState<any>(briefListDesc)
  const [HonorPics, setHonorPics] = useState<any>([])
  const [companyPics, setCompanyPics] = useState<any>([])
  const [ismember, setIsMember] = useState(false)
  const { id } = useParams()

  const fnGetMessage = () => {
    const data: any = {
      id,
    }
    getCommodityWebMemberLogisticsWebMemberLogisticsMain(data).then((res) => {
      console.log(res)
      const messageDesc = res.data
      setMessage(messageDesc)

      briefList[0].secondTitle = messageDesc.areas // 地区
      briefList[1].secondTitle = integrationTime(String(messageDesc.createTime), 'YMD') // 成立年份
      setBriefList([...briefList])
      try {
        const honorPicsDescArr = messageDesc.honorPics.map((item: any) => {
          let obj = {
            url: item,
            width: '238px',
            height: '161px',
          }
          return obj
        })
        setHonorPics([...honorPicsDescArr])
      } catch (error) {
        console.log(error)
      }

      try {
        const companyPicsDescArr = messageDesc.companyPics.map((item: any) => {
          let obj = {
            url: item,
            width: '238px',
            height: '161px',
          }
          return obj
        })
        setCompanyPics([...companyPicsDescArr])
      } catch (error) {
        console.log(error)
      }
    })
  }
  const fnGetUserStatus = () => {
    if (!mewssage?.memberId) {
      return
    }
    let obj = {
      memberId: mewssage?.memberId,
      roleId: mewssage?.roleId,
    }
    getMemberMainpageUpperInquiry(obj).then((res) => {
      console.log(res)
      setIsMember(res.data)
    })
  }
  /**
   * 修改收藏
   */
  const fnChangeStatus = () => {
    const obj = {
      id: mewssage.id,
      status: mewssage.collectStatus ? false : true,
    }
    postCommodityWebMemberLogisticsWebCollect(obj).then((res: any) => {
      console.log(res)
      fnGetMessage()
    })
  }

  useEffect(() => {
    fnGetMessage()
  }, [])

  useEffect(() => {
    fnGetUserStatus()
  }, [mewssage])
  return (
    <HelmetProvider title={'门户详情'}>
      <div className={styles['about-main']}>
        <div className={styles['login-main']}>
          <div className={styles['login-warp']}>
            <a href="/" style={{ display: 'inlineBlock' }}>
              <img src={mallInfo?.logoUrl || mallUrl?.defaultEnterprise?.logoUrl} alt="" />
            </a>
          </div>
        </div>
        <div className={styles['detail-warp']}>
          <div className={styles['detail-left']}>
            <Anchor showInkInFixed={false} className={`${styles['detail-left']} detail-left`}>
              <Link
                href="#brief"
                title={
                  <div>
                    {/* <IconFont type='icon-gongsi' className={styles['detail-icon']} /> */}
                    <img src={Company} alt="" className={styles['detail-icon']} />
                    公司简介
                  </div>
                }
              />
              {companyPics.length > 0 ? (
                <Link
                  href="#album"
                  title={
                    <div>
                      {/* <PictureOutlined translate={undefined} className={styles['detail-icon']} /> */}
                      <img src={Image} alt="" className={styles['detail-icon']} />
                      公司相册
                    </div>
                  }
                />
              ) : (
                <div></div>
              )}

              {HonorPics.length > 0 ? (
                <Link
                  href="#honor"
                  title={
                    <div>
                      {/* <IconFont type='icon-badge' className={styles['detail-icon']} /> */}
                      <img src={Award} alt="" className={styles['detail-icon']} />
                      资质荣誉
                    </div>
                  }
                />
              ) : (
                <div></div>
              )}
              {mewssage?.albumUrl && (
                <Link
                  href="#propaganda"
                  title={
                    <div>
                      {/* <IconFont type='icon-data' className={styles['detail-icon']} /> */}
                      <img src={Briefcase} alt="" className={styles['detail-icon']} />
                      宣传手册
                    </div>
                  }
                />
              )}
            </Anchor>
          </div>
          <div className={styles['detail-right']}>
            <CompanyTitle
              companyName={mewssage?.memberName}
              companyNumber={mewssage?.creditPoint}
              companyTime={mewssage?.registerYears}
              identification={mewssage?.avgTradeCommentStar}
              fnChangeStatus={fnChangeStatus}
              collectStatus={mewssage?.collectStatus}
              useStatus={ismember}
              userInfo={userInfo}
              memberId={mewssage?.memberId}
              roleId={mewssage?.roleId}
              mallInfo={mallInfo}
            />
            <div className={styles['compont-bot']} id="brief">
              <CompanyBrief
                companyBrief={mewssage?.describe}
                companyBusiness={mewssage?.mainBusiness}
                briefList={briefList}
              />
            </div>
            <div id="album">
              <Album albumTitle="公司相册" albumImg={companyPics} />
            </div>
            <div id="honor">
              <Album albumTitle="资质荣誉" albumImg={HonorPics} />
            </div>
            {mewssage?.albumUrl && (
              <div id="propaganda" className={styles['iframe-main']}>
                <div className={styles['album-title']}>宣传手册</div>
                <div className={styles['iframe-warp']}>
                  <iframe src={mewssage.albumUrl} className={styles['iframe-content']} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default PortalAbout
