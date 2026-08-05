/**
 * 采购询价
 */
import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import {
  getCommodityWebMemberPurchaseWebFindByMemberIdAndRoleId,
  getPurchaseBiddingSearchSourceList,
  getPurchaseBiddingSearchSourceDetails,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { useParams } from 'react-router-dom'
import { useGlobalConext } from '@/context/globalProvider'
import BiddingRight from './components/BiddingRight'
import ShopTitle from '../../components/ShopTitle'
import styles from './index.module.less'
import { integrationTime } from '@/utils'

const InquiryDetail: React.FC = () => {
  const { id } = useParams()
  const { mallInfo, userInfo, currentCity, layoutType } = useGlobalConext()
  const [dataSource, setDataSource] = useState<any>([])
  const [infoMessage, setInfoMessage] = useState<any>([])
  const [biddingList, setBiddingList] = useState<any>([])
  const [shopMessage, setshopMessage] = useState<any>({})
  const translate = getWebIntl()

  const columns = [
    {
      title: '物料编号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '物料名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '规格型号',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '品类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '采购数量',
      dataIndex: 'purchaseCount',
      key: 'purchaseCount',
    },
    {
      title: '附件',
      dataIndex: 'urls',
      key: 'urls',
      render: (newSelect: any, key: any) => {
        if (newSelect.length == 0) {
          return <span>-</span>
        }
        return newSelect.map((item: any) => {
          return (
            <div className="ellipsis-warp">
              <a target="_blank" key={item.id} href={item.url}>
                {item.name}
              </a>
            </div>
          )
        })
      },
    },
  ]

  /**
   * 获取用户信息
   * @param infoMessage
   */
  const getMemberPurchaseMain = (infoMessage: any) => {
    const par: any = {
      memberId: infoMessage.createMemberId,
      roleId: infoMessage.createMemberRoleId,
      adornId: 1,
    }
    getCommodityWebMemberPurchaseWebFindByMemberIdAndRoleId(par).then((res) => {
      if (res.code === 1000) {
        setshopMessage(res.data)
      }
    })
  }
  /**
   * 获取右侧推荐
   */
  const fnGetPurchaseList = () => {
    let data = {
      current: '1',
      pageSize: '3',
      startTime: '',
      endTime: '',
      //   area: '',
      category: '',
      overdue: '',
      ids: '',
      // provinceCode: currentCity?.provinceCode,
      // cityCode: currentCity?.cityCode,
    }
    const headers = {
      type: mallInfo ? mallInfo.type : '1',
      shopId: mallInfo ? mallInfo.id + '' : '1',
    }
    getPurchaseBiddingSearchSourceList(data, { headers }).then((res: any) => {
      setBiddingList(res.data.data)
    })
  }

  const fnGetSourceDetails = () => {
    const data = {
      id: id,
      number: '',
      current: '1',
      pageSize: '1',
    }
    getPurchaseBiddingSearchSourceDetails(data).then((res) => {
      setInfoMessage(res.data)
      setDataSource(res.data.materiels)
      getMemberPurchaseMain(res.data)
    })
  }

  useEffect(() => {
    fnGetSourceDetails()
    fnGetPurchaseList()
  }, [])

  /**
   *
   * @param areas 适用地区数组
   * 获取适用地区字符串
   */
  const fnGetInviteTenderAreaList = (areas: Array<any>) => {
    if (!areas || areas.length == 0) {
      return ''
    }
    const areasDesc = areas.map((item: any) => {
      return item.province + '/' + item.city
    })
    return areasDesc.join(',')
  }

  return infoMessage ? (
    <div className={styles['inquiry-main']}>
      <ul className={styles['inquiry-warp']}>
        <li>
          <ShopTitle
            timer={infoMessage.endSignUp}
            projectName={infoMessage.details}
            projectType={'采购竞价单'}
            days={infoMessage.days}
            hours={infoMessage.hours}
            minutes={infoMessage.minutes}
            id={infoMessage.id}
            isRegister={infoMessage.turn}
            purchaseInquiryNo={infoMessage.purchaseInquiryNo}
            userInfo={userInfo}
            isSignUp={infoMessage.isSignUp}
            canRegister={!!infoMessage.canRegister}
            isMePublish={infoMessage.isMePublish}
            isSubMember={infoMessage.isSubMember}
            memberRoleId={infoMessage.createMemberRoleId || infoMessage.memberRoleId}
            memberId={infoMessage.createMemberId || infoMessage.memberId}
          />
        </li>
        <li className={styles['demand-warp']}>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'竞价单号'}：</div>
            <div className={styles['card-value']}>{infoMessage.biddingNo || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'竞价单摘要'}：</div>
            <div className={styles['card-value']}>{infoMessage.details || '-'}</div>
          </div>

          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'会员名称'}：</div>
            <div className={styles['card-value']}>{infoMessage.createMemberName || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'单据时间'}：</div>
            <div className={styles['card-value']}>{integrationTime(infoMessage.createTime, 'YMDMS')}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'适用地市'}：</div>
            <div className={styles['card-value']}>
              {!!!infoMessage.isAreas ? '不限制区域' : fnGetInviteTenderAreaList(infoMessage.areas)}
            </div>
          </div>
        </li>
        <li className={styles['materiel-warp']}>
          <div className={styles['card-title']}>{'采购物料'}</div>
          <Table pagination={false} dataSource={dataSource} columns={columns} />
        </li>

        <li className={styles['materiel-warp']}>
          <div className={styles['card-title']}>{'竞价规则'}</div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'竞价时间'}:</div>
            <div className={styles['card-value']}>
              {integrationTime(infoMessage.biddingStartTime, 'YMDMS') || '-'}
              &ensp;至&ensp;
              {integrationTime(infoMessage.biddingEndTime, 'YMDMS') || '-'}
            </div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'起拍价'}：</div>
            <div className={styles['card-value']}>
              {'¥'}
              {infoMessage.startingPrice || '-'}
            </div>
            {infoMessage.startingPrice == 1 && (
              <div className={styles['card-value-tips']}>{'初始起拍价，首次报价要低于或等于起拍价'}</div>
            )}
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'最小价差'}：</div>
            <div className={styles['card-value']}>
              {'¥'}
              {infoMessage.minPrice || '-'}
            </div>
            {infoMessage.startingPrice == 1 && (
              <div className={styles['card-value-tips']}>{'初始起拍价，首次报价要低于或等于起拍价'}</div>
            )}
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'允许报价次数'}：</div>
            <div className={styles['card-value']}>{infoMessage.allowPurchaseCount || '-'}</div>
            {infoMessage.startingPrice == 1 && (
              <div className={styles['card-value-tips']}>{'允许每个供应商最多可以报价的次数'}</div>
            )}
          </div>
        </li>

        <li className={styles['materiel-warp']}>
          <div className={styles['card-title']}>{'报名要求'}</div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'报名要求时间'}:</div>
            <div className={styles['card-value']}>
              {integrationTime(infoMessage.startSignUp, 'YMDMS') || '-'}
              &ensp;{'至'}&ensp;
              {integrationTime(infoMessage.endSignUp, 'YMDMS') || '-'}
            </div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'报名要求'}：</div>
            <div className={styles['card-value']}>{infoMessage.demand || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'报名要求附件'}：</div>
            <div className={styles['card-filer']}>
              {infoMessage.demandUrls &&
                infoMessage.demandUrls.map((item: any) => {
                  return (
                    <a target="_blank" key={item.id} href={item.url}>
                      {item.name}
                    </a>
                  )
                })}
            </div>
          </div>
        </li>

        <li className={styles['materiel-warp']}>
          <div className={styles['card-title']}>{'交易条件'}</div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'交付日期'}：</div>
            <div className={styles['card-value']}>{integrationTime(infoMessage.deliver, 'YMD') || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'交付地址'}：</div>
            <div className={styles['card-value']}>{infoMessage.address || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'报价要求'}：</div>
            <div className={styles['card-value']}>{infoMessage.offer || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'付款方式'}：</div>
            <div className={styles['card-value']}>{infoMessage.paymentType || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'税费要求'}：</div>
            <div className={styles['card-value']}>{infoMessage.taxes || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'物流要求'}：</div>
            <div className={styles['card-value']}>{infoMessage.logistics || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'包装要求'}：</div>
            <div className={styles['card-value']}>{infoMessage.packRequire || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'其他要求'}：</div>
            <div className={styles['card-value']}>{infoMessage.otherRequire || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'报名要求附件'}：</div>
            <div className={styles['card-filer']}>
              {infoMessage.urls &&
                infoMessage.urls.map((item: any) => {
                  return (
                    <a target="_blank" key={item.id} href={item.url}>
                      {item.name}
                    </a>
                  )
                })}
              {(infoMessage.urls && infoMessage.urls.length == 0) || (!infoMessage.urls && <span>-</span>)}
            </div>
          </div>
        </li>
      </ul>
      <div className={styles['inquiry-nav-main']}>
        <BiddingRight
          companyTitle={shopMessage.memberName}
          recommendList={biddingList}
          creditPoint={shopMessage.creditPoint}
          inquiryNum={shopMessage.inquiryNum}
          inviteTenderNum={shopMessage.inviteTenderNum}
          biddingNum={shopMessage.biddingNum}
          purchaseAmount={shopMessage.purchaseAmount}
        />
      </div>
    </div>
  ) : null
}

export default InquiryDetail
