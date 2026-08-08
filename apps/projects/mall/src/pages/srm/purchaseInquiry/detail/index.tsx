/**
 * 采购询价
 */
import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import {
  getCommodityWebMemberPurchaseWebFindByMemberIdAndRoleId,
  getPurchasePurchaseInquiryHomeDetails,
  getPurchasePurchaseInquirySearchSourceList,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { integrationTime } from '@/utils'
import ShopTitle from '@/pages/srm/components/ShopTitle'
import { useParams } from 'react-router-dom'
import { useGlobalConext } from '@/context/globalProvider'
import BiddingRight from './components/BiddingRight'
import styles from './index.module.less'

const InquiryDetail: React.FC = (props) => {
  const { id } = useParams()
  const [dataSource, setDataSource] = useState<any>([])
  const [shopMessage, setshopMessage] = useState<any>([])
  const { mallInfo, userInfo, currentCity, layoutType } = useGlobalConext()
  const translate = getWebIntl()

  const columns = [
    {
      title: translate('web.resource.commodity.wuliaobianhao'),
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: translate('web.resource.commodity.wuliaomingcheng'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: translate('web.resource.commodity.guigexinghao'),
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: translate('web.resource.commodity.category'),
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: translate('web.resource.mall.brand'),
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: translate('web.common.unit'),
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: translate('web.resource.order.caigoushuliang'),
      dataIndex: 'purchaseCount',
      key: 'purchaseCount',
    },
    {
      title: translate('web.resource.member.fujian'),
      dataIndex: 'urls',
      key: 'urls',
      render: (newSelect: any, key: any) => {
        if (!newSelect || newSelect.length == 0) {
          return '-'
        }
        return newSelect.map((item: any) => {
          return (
            <div className="ellipsis-warp">
              <a target="_blank" key={item.name} href={item.url}>
                {item.name}
              </a>
            </div>
          )
        })
      },
    },
  ]

  const getMemberPurchaseMain = (infoMessage: any) => {
    const par: any = {
      memberId: infoMessage.memberId,
      roleId: infoMessage.memberRoleId,
      adornId: 1,
    }
    getCommodityWebMemberPurchaseWebFindByMemberIdAndRoleId(par).then((res) => {
      if (res.code === 1000) {
        setshopMessage(res.data)
      }
    })
  }

  const [infoMessage, setInfoMessage] = useState<any>([])
  const [inquiryList, setInquiryList] = useState<any>([])

  const fnGetPurchaseList = (infoMessage: any) => {
    let data = {
      current: '1',
      pageSize: '3',
      startTime: '',
      endTime: '',
      //   area: '',
      category: '',
      overdue: '',
      ids: '',
      memberId: infoMessage.memberId,
      roleId: infoMessage.memberRoleId,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
    }
    const headers = {
      type: mallInfo ? mallInfo.type : '1',
      shopId: mallInfo ? mallInfo.id + '' : '1',
    }
    getPurchasePurchaseInquirySearchSourceList(data, { headers }).then((res: any) => {
      setInquiryList(res.data.data)
    })
  }

  /**
   * 获取详情信息
   */
  const fnGetInquiryDetails = () => {
    const data = {
      id: id,
      number: '',
      current: '1',
      pageSize: '1',
    }
    getPurchasePurchaseInquiryHomeDetails(data).then((res) => {
      setInfoMessage(res.data)
      setDataSource(res.data.materiels)
      getMemberPurchaseMain(res.data)
      fnGetPurchaseList(res.data)
    })
  }

  useEffect(() => {
    fnGetInquiryDetails()
  }, [])
  /**
   * 比价方式
   */
  const fnInviteTenderType = () => {
    const valueList = ['', '密封比价', '非密封比价']
    return valueList[infoMessage.priceContrast]
  }

  /**
   * 获取归属地
   */
  const fnGetInviteTenderAreaList = (areas: any) => {
    if (!areas || areas.length == 0) {
      return ''
    }
    const areasDesc = areas.map((item: any) => {
      return item.province + '/' + item.city
    })
    return areasDesc.join(',')
  }

  return (
    <div className={styles['inquiry-main']}>
      <ul className={styles['inquiry-warp']}>
        <li>
          <ShopTitle
            timer={infoMessage.offerEndTime}
            projectName={infoMessage.details}
            projectType={translate('web.resource.mall.caigouxunjiadan')}
            days={infoMessage.days}
            hours={infoMessage.hours}
            minutes={infoMessage.minutes}
            id={infoMessage.id}
            isRegister={infoMessage.isRegister}
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
            <div className={styles['card-key']}>{translate('web.resource.mall.xuqiudanhao')}：</div>
            <div className={styles['card-value']}>{infoMessage.purchaseInquiryNo}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.xuqiuzhaiyao')}：</div>
            <div className={styles['card-value']}>{infoMessage.details}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.caigouxunjialeixing')}：</div>
            <div className={styles['card-value']}>
              {infoMessage.purchaseType == 1
                ? translate('web.resource.mall.yougudingcaigoujine')
                : translate('web.resource.mall.wugudingcaigoujine')}
              {infoMessage.purchaseType == 1 && (
                <div className={styles['card-value-tips']}>
                  {translate('web.resource.mall.caigoujinegudinghetongqineibukechaoguocaigoujine')}
                </div>
              )}
              {infoMessage.purchaseType == 2 && (
                <div className={styles['card-value-tips']}>
                  {translate('web.resource.mall.caigoujinebugudingkezaihetongqineianxucaigou')}
                </div>
              )}
            </div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{translate('web.resource.mall.bijiafangshi')}：</div>
            <div className={styles['card-value']}>
              {fnInviteTenderType()}
              {infoMessage.priceContrast == 1 && (
                <div className={styles['card-value-tips']}>
                  {translate('web.resource.mall.zhinengkandaogongyingshangshifouyoubaojia')}
                </div>
              )}
              {infoMessage.priceContrast == 2 && (
                <div className={styles['card-value-tips']}>
                  {translate('web.resource.mall.keyizaigongyingshagnbaowanjiahoulijikandao')}
                </div>
              )}
            </div>
          </div>

          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'发布时间'}：</div>
            <div className={styles['card-value']}>{integrationTime(infoMessage.createTime, 'YMDMS')}</div>
          </div>

          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'适用地市'}：</div>
            <div className={styles['card-value']}>
              {infoMessage.isAllArea ? '不限制区域' : fnGetInviteTenderAreaList(infoMessage.areas)}
            </div>
          </div>
        </li>
        <li className={styles['materiel-warp']}>
          <div className={styles['card-title']}>{'采购物料'}</div>
          <Table pagination={false} dataSource={dataSource} columns={columns} />
        </li>

        <li className={styles['materiel-warp']}>
          <div className={styles['card-title']}>{'交易条件'}</div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'交付日期'}:</div>
            <div className={styles['card-value']}>{integrationTime(infoMessage.deliveryTime, 'YMD') || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'交付地址'}：</div>
            <div className={styles['card-value']}>{infoMessage.address || '-'}</div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-key']}>{'报价截止时间'}：</div>
            <div className={styles['card-value']}>{integrationTime(infoMessage.offerEndTime, 'YMDMS') || '-'}</div>
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
            <div className={styles['card-key']}>{'附件'}：</div>
            <div className={styles['card-filer']}>
              {infoMessage.transactionUurls &&
                infoMessage.transactionUurls.map((item: any, index: number) => {
                  return (
                    <a target="_blank" key={item.name + index} href={item.url}>
                      {item.name}
                    </a>
                  )
                })}
              {(infoMessage.transactionUurls && infoMessage.transactionUurls.length == 0) ||
                (!infoMessage.transactionUurls && <span>-</span>)}
            </div>
          </div>
        </li>
      </ul>
      <div className={styles['inquiry-nav-main']}>
        <BiddingRight
          companyTitle={shopMessage.memberName}
          creditPoint={shopMessage.creditPoint}
          inquiryNum={shopMessage.inquiryNum}
          inviteTenderNum={shopMessage.inviteTenderNum}
          biddingNum={shopMessage.biddingNum}
          purchaseAmount={shopMessage.purchaseAmount}
          recommendList={inquiryList}
        />
      </div>
    </div>
  )
}

export default InquiryDetail
