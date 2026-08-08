/**
 * 采购询价
 */
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Table } from 'antd'
import {
  getCommodityWebMemberPurchaseWebFindByMemberIdAndRoleId,
  getPurchaseInviteTenderGetInviteTenderByWeb,
  getPurchaseInviteTenderGetInviteTenderListByDoorWeb,
  getPurchaseInviteTenderGetInviteTenderListByEnterpriseWeb,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import BiddingRight from './components/BiddingRight'
import { LAYOUT_TYPE } from '@/types/global'
import { integrationTime } from '@/utils'
import ShopTitle from '../../components/ShopTitle'
import styles from './index.module.less'

const InquiryDetail: React.FC = () => {
  const { id } = useParams()
  const { mallInfo, userInfo, currentCity, layoutType } = useGlobalConext()
  const translate = getWebIntl()

  const [dataSource, setDataSource] = useState<any>([])

  const columns = [
    {
      title: translate('web.resource.commodity.wuliaobianhao'),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: translate('web.resource.commodity.wuliaomingcheng'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: translate('web.resource.commodity.guigexinghao'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: translate('web.resource.commodity.category'),
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: translate('web.resource.mall.brand'),
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: translate('web.resource.order.caigoushuliang'),
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: translate('web.resource.member.fujian'),
      dataIndex: 'file',
      key: 'file',
      render: (newSelect: any) => {
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
  const [infoMessage, setInfoMessage] = useState<any>()
  const [biddingList, setBiddingList] = useState<any>([])
  const [shopMessage, setshopMessage] = useState<any>({})

  /**
   * 获取用户信息
   * @param infoMessage
   */
  const getMemberPurchaseMain = () => {
    const par: any = {
      memberId: infoMessage?.memberId,
      roleId: infoMessage?.memberRoleId,
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
      category: '',
      overdue: '',
      ids: '',
      memberId: infoMessage?.memberId,
      memberRoleId: infoMessage?.memberRoleId,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
    }

    const headers = {
      type: mallInfo ? mallInfo.type : '1',
      shopId: mallInfo ? mallInfo.id + '' : '1',
    }
    if (layoutType === LAYOUT_TYPE.shopIndex) {
      getPurchaseInviteTenderGetInviteTenderListByDoorWeb(data, { headers }).then((res: any) => {
        setBiddingList(res.data.data)
      })
    } else {
      getPurchaseInviteTenderGetInviteTenderListByEnterpriseWeb(data, { headers }).then((res: any) => {
        setBiddingList(res.data.data)
      })
    }
  }
  /**
   * 获取招标详情
   */

  const fnGetInviteTender = () => {
    if (id) {
      const data: any = {
        inviteTenderId: id,
      }
      getPurchaseInviteTenderGetInviteTenderByWeb(data).then((res) => {
        setInfoMessage(res.data)
        setDataSource(res.data.materielList)
      })
    }
  }

  useEffect(() => {
    fnGetInviteTender()
  }, [])

  useEffect(() => {
    if (!infoMessage?.memberId) {
      return
    }
    getMemberPurchaseMain()
    fnGetPurchaseList()
  }, [infoMessage])
  /**
   * 获取归属地
   */
  const fnGetInviteTenderAreaList = () => {
    if (!infoMessage.inviteTenderAreaList) {
      return '-'
    }
    const areasDesc = infoMessage.inviteTenderAreaList.map((item: any) => {
      return item.provinceName + '/' + item.cityName
    })
    return areasDesc.join(',')
  }

  return infoMessage ? (
    <div className={styles['inquiry-main']}>
      <ul className={styles['inquiry-warp']}>
        <li>
          <ShopTitle
            timer={infoMessage.registerEndTime}
            projectName={infoMessage.projectName}
            projectType={translate('web.resource.mall.caigouzhaobiaodan')}
            days={infoMessage.days}
            hours={infoMessage.hours}
            minutes={infoMessage.minutes}
            id={infoMessage.id}
            isRegister={infoMessage.isRegister ? 1 : 0}
            purchaseInquiryNo={infoMessage.purchaseInquiryNo}
            userInfo={userInfo}
            canRegister={!!infoMessage.canRegister}
            isSubMember={infoMessage.isSubMember}
            memberRoleId={infoMessage.memberRoleId}
            memberId={infoMessage.memberId}
          />
        </li>
        <li className={styles['demand-warp']}>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.zhaobiaobianhao')}：</div>
            <div className={styles['card-value']}>{infoMessage.code}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.zhaobiaoxiangmu')}：</div>
            <div className={styles['card-value']}>{infoMessage.projectName}</div>
          </div>

          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.fabushijian')}：</div>
            <div className={styles['card-value']}>{integrationTime(infoMessage.createTime, 'YMDMS')}</div>
          </div>

          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.shiyongdishi')}：</div>
            <div className={styles['card-value']}>
              {infoMessage.isAllArea ? translate('web.resource.mall.buxianzhiquyu') : fnGetInviteTenderAreaList()}
            </div>
          </div>
        </li>
        <li className={styles['materiel-warp']}>
          <div className={styles['card-title']}>{translate('web.resource.mall.caigouwuliao')}</div>
          <Table pagination={false} dataSource={dataSource} columns={columns} />
        </li>

        <li className={styles['materiel-warp']}>
          <div className={styles['card-title']}>{translate('web.resource.mall.zhaobiaoyaoqiu')}</div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.toubiaoyaoqiushijian')}:</div>
            <div className={styles['card-value']}>
              {integrationTime(infoMessage.inviteTenderStartTime, 'YMDMS') || '-'}
              &ensp;{translate('web.common.zhi')}&ensp;
              {integrationTime(infoMessage.inviteTenderEndTime, 'YMDMS') || '-'}
            </div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.kaibiaoshijian')}：</div>
            <div className={styles['card-value']}>{integrationTime(infoMessage.openTenderTime, 'YMDMS') || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.jiaofuriqi')}：</div>
            <div className={styles['card-value']}>{integrationTime(infoMessage.hopeDate, 'YMD') || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.zhaobiaoyaoqiu')}：</div>
            <div className={styles['card-value']}>{infoMessage.inviteTenderRequirement || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.zhaobiaowenjian')}：</div>
            <div className={styles['card-filer']}>
              {infoMessage.inviteTenderFile &&
                infoMessage.inviteTenderFile.map((item: any) => {
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
          <div className={styles['card-title']}>{translate('web.resource.mall.baomingyaoqiu')}</div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.baomingyaoqiushijian')}:</div>
            <div className={styles['card-value']}>
              {integrationTime(infoMessage.registerStartTime, 'YMDMS') || '-'}
              &ensp;{translate('web.common.zhi')}&ensp;
              {integrationTime(infoMessage.registerEndTime, 'YMDMS') || '-'}
            </div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.baomingyaoqiu')}：</div>
            <div className={styles['card-value']}>{infoMessage.registerRequirement || '-'}</div>
          </div>
          {infoMessage.registerFile && infoMessage.registerFile.length > 0 && (
            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.mall.baomingyaoqiufujian')}：</div>
              <div className={styles['card-filer']}>
                {infoMessage.registerFile.map((item: any) => {
                  return (
                    <a target="_blank" key={item.id} href={item.url}>
                      {item.name}
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </li>

        {infoMessage.isQualificationCheck && (
          <li className={styles['materiel-warp']}>
            <div className={styles['card-title']}>{translate('web.resource.mall.zigeyushenyaoqiu')}</div>
            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.mall.zigeyushenshijian')}:</div>
              <div className={styles['card-value']}>
                {integrationTime(infoMessage.preCheckStartTime, 'YMDMS') || '-'}
                &ensp;至&ensp;
                {integrationTime(infoMessage.preCheckEndTime, 'YMDMS') || '-'}
              </div>
            </div>
            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.mall.zigeyushenyaoqiu')}：</div>
              <div className={styles['card-value']}>{infoMessage.preCheckRequirement || '-'}</div>
            </div>
            {infoMessage.preCheckFile && infoMessage.preCheckFile.length > 0 && (
              <div className={styles['card-item']}>
                <div className={styles['card-key']}>{translate('web.resource.mall.zigeyushenyaoqiufujian')}：</div>
                <div className={styles['card-filer']}>
                  {infoMessage.preCheckFile &&
                    infoMessage.preCheckFile.map((item: any) => {
                      return (
                        <a target="_blank" key={item.id} href={item.url}>
                          {item.name}
                        </a>
                      )
                    })}
                </div>
              </div>
            )}
          </li>
        )}

        <li className={styles['materiel-warp']}>
          <div className={styles['card-title']}>{translate('web.resource.mall.qitayaoqiu')}</div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.member.fukuanfangshi')}：</div>
            <div className={styles['card-value']}>{infoMessage.payType || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.jiaofuyaoqiu')}：</div>
            <div className={styles['card-value']}>{infoMessage.deliverRequirement || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.shuifeiyaoqiu')}：</div>
            <div className={styles['card-value']}>{infoMessage.taxationRequirement || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.wuliuyaoqiu')}：</div>
            <div className={styles['card-value']}>{infoMessage.logisticsRequirement || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.baozhuangyaoqiu')}：</div>
            <div className={styles['card-value']}>{infoMessage.packingRequirement || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.qitayaoqiu')}：</div>
            <div className={styles['card-value']}>{infoMessage.otherRequirement || '-'}</div>
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
