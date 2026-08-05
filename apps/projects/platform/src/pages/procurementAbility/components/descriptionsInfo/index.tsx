import React, { useContext, useState } from 'react'
import { Row, Col, Modal } from 'antd'
import MellowCard from '@/components/MellowCard'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import { formatTimeString } from '@/utils'
import style from './index.less'
import { CaretDownOutlined, CaretUpOutlined, ExclamationCircleFilled, FileFilled } from '@ant-design/icons'
import { Chart, Interval, Coordinate, Legend, View, Annotation } from 'bizcharts'
// import { Annotation } from 'bizcharts/lib'
import moment from 'moment'
import { PURCHASE_TYPE } from '@/constants/procurement'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
/**
 * 描述信息列表
 */

export interface BasicInfoProps {
  /** title标题 */
  cardTitle?: string
  /** 显示信息类型
   * 'basicInfo' 基本信息 | 'bidNeed' 招标要求 | 'registerNeed' 报名要求 | | 'registerInfo' 报名信息 | 'registerFile' 报名文件 | 'checkNeed' 资格预审要求 | 'checkQualifyFile' 资格证明文件 | 'remarkNeed' 评标要求 | 'otherNeed' 其他要求
   * 'bidResult' 中标结果
   */
  type?:
    | 'basicInfo'
    | 'bidNeed'
    | 'registerNeed'
    | 'registerInfo'
    | 'registerFile'
    | 'checkNeed'
    | 'checkQualifyFile'
    | 'remarkNeed'
    | 'otherNeed'
    | 'bidResult'
}

const DescriptionsInfo: React.FC<BasicInfoProps> = ({ cardTitle, type }) => {
  const bidDetailContext = useContext(BidDetailContext)
  const { data: _data, address, ctl, apiType } = bidDetailContext
  const [showMore, setShowMore] = useState<boolean>(false)
  const [previewThank, setPreviewThank] = useState<boolean>(false)
  const { pathname } = useLocation()
  // 处理和投标有关的数据格式
  const data = apiType === 'callForBid' ? _data : _data.inviteTender
  // console.log(data, _data)
  const toogleMore = () => {
    setShowMore(!showMore)
  }

  // 基本信息——招标
  // const fieldList = apiType === 'tenderInCallForBid' ? [
  const fieldList =
    apiType[0] === 't'
      ? [
          { title: intl.formatMessage({ id: 'table.purchase.projectName' }), name: 'projectName' },
          { title: intl.formatMessage({ id: 'table.purchase.zhaobiaohuiyuan' }), name: 'memberName' },
          { title: intl.formatMessage({ id: 'table.purchase.zhaobiaozhaiyao' }), name: 'remark' },
        ]
      : [
          { title: intl.formatMessage({ id: 'table.purchase.projectName' }), name: 'projectName' },
          {
            title: intl.formatMessage({ id: 'table.purchase.xiangmuyusuan' }),
            name: 'budget',
            render: (t) => (t ? `${translate('web.common.currencySymbol')}${t}` : null),
          },
          {
            title: intl.formatMessage({ id: 'table.purchase.caigouleixing' }),
            name: 'purchaseType',
            render: (text) => PURCHASE_TYPE[text],
          },
          { title: intl.formatMessage({ id: 'table.purchase.zhaobiaohuiyuan' }), name: 'memberName' },
          { title: intl.formatMessage({ id: 'table.purchase.zhaobiaozhaiyao' }), name: 'remark' },
        ]
  const basicColumnList = [
    {
      span: 8,
      fieldList: [
        { title: intl.formatMessage({ id: 'table.purchase.numbering' }), name: 'code' },
        {
          title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }),
          name: 'inviteTenderOutStatusValue',
          render: () =>
            apiType === 'callForBid' ? data['inviteTenderOutStatusValue'] : _data['submitTenderOutStatusValue'],
        },
        {
          title: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
          name: 'inviteTenderInStatusValue',
          render: () =>
            apiType === 'callForBid' ? data['inviteTenderInStatusValue'] : _data['submitTenderInStatusValue'],
        },
        {
          title: intl.formatMessage({ id: 'table.purchase.bidCreateTime' }),
          name: 'createTime',
          render: (text) => formatTimeString(text),
        },
      ],
    },
    {
      span: 8,
      fieldList: fieldList,
    },
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.shiyongdizhi' }),
          name: 'inviteTenderAreaList',
          render: (t, r) => {
            const showDataSource = showMore
              ? data['inviteTenderAreaList']
              : [...data['inviteTenderAreaList']].splice(0, 3)
            return (
              <>
                <p>
                  {showDataSource.map((_item, _i) => (
                    <p key={`address${_i}`}>{_item.provinceName + '/' + (_item.cityName || '')}</p>
                  ))}
                </p>
                {data['inviteTenderAreaList']['length'] > 3 ? (
                  <p onClick={toogleMore} style={{ cursor: 'pointer' }} className="commonPickColor">
                    {intl.formatMessage({ id: 'detail.purchase.label26' })}
                    {showMore ? <CaretDownOutlined /> : <CaretUpOutlined />}
                  </p>
                ) : null}
              </>
            )
          },
        },
      ],
    },
  ]
  // @基本信息——投标
  const basicTenderColumnList = [
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.toubiaobianhao' }),
          name: 'code',
          render: () => _data['code'],
        },
        { title: intl.formatMessage({ id: 'table.purchase.toubiaoxiangmu' }), name: 'projectName' },
        {
          title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }),
          name: 'submitTenderOutStatusValue',
          render: () => _data['submitTenderOutStatusValue'],
        },
        {
          title: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
          name: 'submitTenderInStatusValue',
          render: () => _data['submitTenderInStatusValue'],
        },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.toubiaozhaiyao' }),
          name: 'remark',
          render: () => _data?.submitTender?.remark,
        },
        {
          title: intl.formatMessage({ id: 'table.purchase.toubiaowenjian' }),
          name: 'inviteTenderFile',
          render: (t, r) => (
            <div>
              {_data?.submitTender?.file?.length
                ? _data['submitTender']['file'].map((_item, _i) => (
                    <p>
                      <a key={`submitTenderFile${_i}`} target="_blank" href={_item.url}>
                        <FileFilled /> {_item.name}
                      </a>
                    </p>
                  ))
                : null}
            </div>
          ),
        },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.numbering' }),
          name: 'code',
          render: (t) => (
            <a
              href={`/procurementAbility/${apiType[0] === 'c' ? 'callForBids' : 'tender'}/callForBidsSearch/detail?id=${
                _data.inviteTender.id
              }`}
              target="_blank"
            >
              {t}
            </a>
          ),
        },
        { title: intl.formatMessage({ id: 'table.purchase.zhaobiaohuiyuan' }), name: 'memberName' },
        {
          title: intl.formatMessage({ id: 'table.purchase.shiyongchengshi' }),
          name: 'inviteTenderAreaList',
          render: (t, r) => {
            const showDataSource = showMore
              ? data['inviteTenderAreaList']
              : [...data['inviteTenderAreaList']].splice(0, 3)
            return (
              <>
                <p>
                  {showDataSource.map((_item, _i) => (
                    <p key={`address${_i}`}>{_item.provinceName + '/' + (_item.cityName || '')}</p>
                  ))}
                </p>
                {data['inviteTenderAreaList']['length'] > 3 ? (
                  <p onClick={toogleMore} style={{ cursor: 'pointer' }} className="commonPickColor">
                    {intl.formatMessage({ id: 'detail.purchase.label26' })}
                    {showMore ? <CaretDownOutlined /> : <CaretUpOutlined />}
                  </p>
                ) : null}
              </>
            )
          },
        },
      ],
    },
  ]

  // 招标要求
  const callForNeedList = [
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.toubiaojiezhishi' }),
          name: 'createTime',
          render: (t, r) =>
            formatTimeString(r['inviteTenderStartTime']) +
            intl.formatMessage({ id: 'table.purchase.zhi' }) +
            formatTimeString(r['inviteTenderEndTime']),
        },
        {
          title: intl.formatMessage({ id: 'table.purchase.openTenderTime' }),
          name: 'openTenderTime',
          render: (text) => formatTimeString(text),
        },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.deliveryTime' }),
          name: 'hopeDate',
          render: (text) => formatTimeString(text, 'YYYY-MM-DD'),
        },
        {
          title: intl.formatMessage({ id: 'detail.purchase.targetPrice' }),
          name: 'targetPrice',
          render: (t) => (t ? `${translate('web.common.currencySymbol')}${t}` : null),
        },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'schma.purchase.inviteTenderRequirement' }),
          name: 'inviteTenderRequirement',
        },
        {
          title: intl.formatMessage({ id: 'detail.purchase.inviteTenderFile' }),
          name: 'inviteTenderFile',
          render: (t, r) => (
            <div>
              {data['inviteTenderFile'].map((_item, _i) => (
                <p>
                  <a key={`inviteTenderFile${_i}`} target="_blank" href={_item.url}>
                    <FileFilled /> {_item.name}
                  </a>
                </p>
              ))}
            </div>
          ),
        },
      ],
    },
  ]

  // 投标要求
  const tenderNeedList = [
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.toubiaojiezhishi' }),
          name: 'createTime',
          render: (t, r) =>
            formatTimeString(r['inviteTenderStartTime']) +
            intl.formatMessage({ id: 'table.purchase.zhi' }) +
            formatTimeString(r['inviteTenderEndTime']),
        },
        {
          title: intl.formatMessage({ id: 'table.purchase.openTenderTime' }),
          name: 'openTenderTime',
          render: (text) => formatTimeString(text),
        },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.deliveryTime' }),
          name: 'hopeDate',
          render: (text) => formatTimeString(text, 'YYYY-MM-DD'),
        },
        {
          title: intl.formatMessage({ id: 'detail.purchase.targetPrice' }),
          name: 'targetPrice',
          render: (t) => (t ? `${translate('web.common.currencySymbol')}${t}` : null),
        },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.toubiaozhaiyao' }),
          name: 'inviteTenderRequirement',
          render: (t) => _data['submitTender']['remark'],
        },
        {
          title: intl.formatMessage({ id: 'table.purchase.toubiaowenjian' }),
          name: 'inviteTenderFile',
          render: (t, r) => (
            <div>
              {_data['submitTender']['file'].map((_item, _i) => (
                <p>
                  <a key={`submitTenderFile${_i}`} target="_blank" href={_item.url}>
                    <FileFilled /> {_item.name}
                  </a>
                </p>
              ))}
            </div>
          ),
        },
      ],
    },
  ]

  // 报名要求
  const registerNeedList = [
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'detail.purchase.startSignUp' }),
          name: 'createTime',
          render: (t, r) =>
            formatTimeString(r['registerStartTime']) +
            intl.formatMessage({ id: 'table.purchase.zhi' }) +
            formatTimeString(r['registerEndTime']),
        },
        { title: intl.formatMessage({ id: 'detail.purchase.signUpLayout' }), name: 'registerRequirement' },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'detail.purchase.demandUrls' }),
          name: 'registerFile',
          render: (t, r) => (
            <div>
              {data['registerFile'].map((_item, _i) => (
                <p>
                  <a key={`registerNeed${_i}`} target="_blank" href={_item.url}>
                    <FileFilled /> {_item.name}
                  </a>
                </p>
              ))}
            </div>
          ),
        },
      ],
    },
  ]

  // 报名信息
  const registerInfoList = [
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.toubiaohuiyuan' }),
          name: 'memberName',
          render: () => _data.memberName,
        },
        {
          title: intl.formatMessage({ id: 'detail.purchase.contacts' }),
          name: 'name',
          render: () => _data?.submitTenderRegister?.name,
        },
        {
          title: intl.formatMessage({ id: 'table.purchase.lianxirendianhua' }),
          name: 'phone',
          render: () => _data?.submitTenderRegister?.phone,
        },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'detail.purchase.email' }),
          name: 'email',
          render: () => _data?.submitTenderRegister?.email,
        },
        {
          title: intl.formatMessage({ id: 'detail.purchase.unitAddress' }),
          name: 'address',
          render: () =>
            _data?.submitTenderRegister
              ? `${_data.submitTenderRegister.provinceName}${_data.submitTenderRegister.cityName}${_data.submitTenderRegister.regionName}${_data.submitTenderRegister.address}`
              : null,
        },
      ],
    },
  ]

  // 报名文件
  const registerFileList = [
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'detail.purchase.signUpFileLayout' }),
          name: 'registerFile',
          render: (t, r) => (
            <div>
              {_data?.submitTenderRegister
                ? _data['submitTenderRegister']['registerFile'].map((_item, _i) => (
                    <p>
                      <a key={`registerFile${_i}`} target="_blank" href={_item.url}>
                        <FileFilled /> {_item.name}
                      </a>
                    </p>
                  ))
                : null}
            </div>
          ),
        },
      ],
    },
  ]

  // 资格预审要求
  const checkNeedList = [
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.zigeyushenshi' }),
          name: 'createTime',
          render: (t, r) =>
            formatTimeString(r['preCheckStartTime']) +
            intl.formatMessage({ id: 'table.purchase.zhi' }) +
            formatTimeString(r['preCheckEndTime']),
        },
        { title: intl.formatMessage({ id: 'table.purchase.zigeyushenyao1' }), name: 'preCheckRequirement' },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.zigeyushenyao' }),
          name: 'preCheckFile',
          render: (t, r) => (
            <div>
              {data['preCheckFile'].map((_item, _i) => (
                <p>
                  <a key={`preCheckFile${_i}`} target="_blank" href={_item.url}>
                    <FileFilled /> {_item.name}
                  </a>
                </p>
              ))}
            </div>
          ),
        },
      ],
    },
  ]

  // 资格证明文件
  const checkQualifyFileList = [
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.zigeyushenyao' }),
          name: 'qualificationsFile',
          render: (t, r) => (
            <div>
              {_data['qualificationsFile'].map((_item, _i) => (
                <p>
                  <a key={`qualificationsFile${_i}`} target="_blank" href={_item.url}>
                    <FileFilled /> {_item.name}
                  </a>
                </p>
              ))}
            </div>
          ),
        },
      ],
    },
  ]

  // 评标要求
  const remarkNeedList = [
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiushi' }),
          name: 'createTime',
          render: (t, r) =>
            formatTimeString(r['evaluationStartTime']) +
            intl.formatMessage({ id: 'table.purchase.zhi' }) +
            formatTimeString(r['evaluationEndTime']),
        },
        { title: intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiu' }), name: 'evaluationRequirement' },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiufu' }),
          name: 'evaluationFile',
          render: (t, r) => (
            <div>
              {data['evaluationFile'].map((_item, _i) => (
                <p>
                  <a key={`evaluationFile${_i}`} target="_blank" href={_item.url}>
                    <FileFilled /> {_item.name}
                  </a>
                </p>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.shifouzaixianping' }),
          name: 'isOnlineEvaluation',
          render: (text) =>
            text ? intl.formatMessage({ id: 'table.purchase.shi' }) : intl.formatMessage({ id: 'table.purchase.fou' }),
        },
        { title: intl.formatMessage({ id: 'table.purchase.pingbiaoxiangmuban' }), name: 'templateName' },
      ],
    },
  ]

  // 其他要求
  const otherNeedList = [
    {
      span: 8,
      fieldList: [
        { title: intl.formatMessage({ id: 'detail.purchase.paymentType' }), name: 'payType' },
        {
          title: intl.formatMessage({ id: 'table.purchase.jiaofudizhi' }),
          name: 'deliverAddress',
          render: (text) => data.deliverAddress,
        },
        { title: intl.formatMessage({ id: 'table.purchase.shuifeiyaoqiu' }), name: 'taxationRequirement' },
      ],
    },
    {
      span: 8,
      fieldList: [
        { title: intl.formatMessage({ id: 'table.purchase.jiaofuyaoqiu' }), name: 'deliverRequirement' },
        { title: intl.formatMessage({ id: 'table.purchase.wuliuyaoqiu' }), name: 'logisticsRequirement' },
      ],
    },
    {
      span: 8,
      fieldList: [
        { title: intl.formatMessage({ id: 'table.purchase.baozhuangyaoqiu' }), name: 'packingRequirement' },
        { title: intl.formatMessage({ id: 'detail.purchase.otherRequireAsk' }), name: 'otherRequirement' },
      ],
    },
  ]

  /** 投标区块 **/
  // @todo 中标结果 根据后端数据控制
  const result = _data.isWin
  // const sumPrice = _data?.submitTender ? _data.submitTender.submitTenderMateriel.reduce((a, b) => a + b.price * b.inviteTenderMateriel.count, 0) : 0
  // const alreadyPay = _data?.submitTender ? _data.submitTender.submitTenderMateriel.reduce((a, b) => a + b.price * b.inviteTenderMateriel.count * b.awardTenderRatio/100, 0) : 0
  const sumPrice = _data?.allWinnerAmount
  const alreadyPay = _data?.winnerAmount

  const bidResultList = [
    {
      span: 8,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.zhongbiaojine' }),
          noTitle: true,
          name: 'createTime',
          render: (text, record) => (
            <Row justify="space-between">
              <Col style={{ margin: '0 16px' }}>
                <CircleChart data={myData} content={myContent} />
              </Col>
              <Col>
                <div>
                  <span className={style['card-list_title']}>
                    {intl.formatMessage({ id: 'detail.purchase.label' })}:
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 18, lineHeight: 2, fontWeight: 'bold' }}>
                    {translate('web.common.currencySymbol')}
                    {Number(alreadyPay)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </span>
                </div>
              </Col>
            </Row>
          ),
        },
        { title: intl.formatMessage({ id: 'detail.purchase.label1' }), name: 'winTenderReason' },
      ],
    },
    {
      span: 8,
      fieldList: [
        { title: intl.formatMessage({ id: 'detail.purchase.awardResults' }), name: 'winTenderAnnounceContent' },
        {
          title: intl.formatMessage({ id: 'table.purchase.zhongbiaogongshifu' }),
          name: 'winTenderAnnounceFile',
          render: (t, r) => (
            <div>
              {data['winTenderAnnounceFile'].map((_item, _i) => (
                <p>
                  <a key={`announce${_i}`} target="_blank" href={_item.url}>
                    <FileFilled /> {_item.name}
                  </a>
                </p>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      span: 8,
      fieldList: [
        { title: intl.formatMessage({ id: 'detail.purchase.bidLayout1' }), name: 'winTenderNoticeContent' },
        {
          title: intl.formatMessage({ id: 'table.purchase.zhongbiaotongzhifu' }),
          name: 'winTenderNoticeFile',
          render: (t, r) => (
            <div>
              {data['winTenderNoticeFile'].map((_item, _i) => (
                <p>
                  <a key={`notice${_i}`} target="_blank" href={_item.url}>
                    <FileFilled /> {_item.name}
                  </a>
                </p>
              ))}
            </div>
          ),
        },
      ],
    },
  ]
  const bidFail = [
    {
      span: 12,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.zhongbiaoshibai' }),
          name: 'createMemberName',
          noTitle: true,
          render: (t, r) => (
            <div>
              <p className={style.resultFail}>
                <ExclamationCircleFilled style={{ fontSize: 24, paddingRight: 8, color: '#909399' }} />
                {intl.formatMessage({ id: 'detail.purchase.message78' })}
              </p>
              <p className={style.resultFailSubtitle}>{intl.formatMessage({ id: 'detail.purchase.message79' })}</p>
            </div>
          ),
        },
      ],
    },
    {
      span: 12,
      fieldList: [
        {
          title: intl.formatMessage({ id: 'table.purchase.zhakanganxiehan' }),
          name: 'createMemberName',
          noTitle: true,
          rowStyle: {
            justifyContent: 'flex-end',
          },
          render: (t, r) => (
            <div>
              <p>
                <a onClick={() => setPreviewThank(true)}>
                  {intl.formatMessage({ id: 'table.purchase.zhakanganxiehan' })}
                </a>
              </p>
            </div>
          ),
        },
      ],
    },
  ]

  /** 通过url字符串和apiType综合判断显示 */
  const showBasicInfo = () => {
    // 待审核报名 待资格预审 待提交资格预审 显示招标信息
    if (pathname.indexOf('readyCheckedRegister') !== -1 || pathname.indexOf('readyQualifityChecked') !== -1) {
      return basicColumnList
    }
    // 招标大类显示招标信息 投标大类显示投标信息
    if (apiType[apiType.length - 1] === 'r') {
      return basicTenderColumnList
    } else {
      return basicColumnList
    }
  }
  /** 类型数据映射 */
  const Type_Data_Map = {
    // 'basicInfo': apiType[apiType.length - 1] === 'r' ? basicTenderColumnList : basicColumnList,
    basicInfo: showBasicInfo(),
    // 投标显示投标要求
    bidNeed: apiType[apiType.length - 1] === 'r' ? tenderNeedList : callForNeedList,
    registerNeed: registerNeedList,
    checkNeed: checkNeedList,
    remarkNeed: remarkNeedList,
    otherNeed: otherNeedList,
    // 投标区块
    bidResult: result ? bidResultList : bidFail,
    checkQualifyFile: checkQualifyFileList,
    registerInfo: registerInfoList,
    registerFile: registerFileList,
  }

  // 圆形环状金额显示
  const alreadyRate: any = (alreadyPay / sumPrice).toFixed(2)
  const discontentRate: any = 1 - alreadyRate
  const myData: any = [
    { type: intl.formatMessage({ id: 'table.purchase.zhongbiaojine' }), percent: Number(alreadyRate) },
    { type: intl.formatMessage({ id: 'table.purchase.weizhongjine' }), percent: Number(discontentRate) },
  ]
  const myContent: any = {
    percent: `${alreadyRate * 100}%`,
  }

  const CircleChart = ({ data = [], content = {}, intervalConfig = {} }: any) => {
    return (
      <Chart placeholder={false} height={100} width={100} style={{ position: 'relative' }} autoFit>
        <Legend visible={false} />
        {/* 绘制图形 */}
        <View
          data={data}
          scale={{
            percent: {
              formatter: (val) => {
                return (val * 100).toFixed(2) + '%'
              },
            },
          }}
        >
          <Coordinate type="theta" innerRadius={0.5} />
          <Interval
            position="percent"
            adjust="stack"
            color={['type', ['#6c9ceb', '#ffc400']]}
            size={16}
            {...intervalConfig}
          />
          <Annotation.Text
            position={['50%', '48%']}
            content={content.percent}
            style={{
              lineHeight: 240,
              fontSize: 14,
              fill: '#000',
              textAlign: 'center',
            }}
          />
        </View>
      </Chart>
    )
  }

  const RenderBasicInfoColumns = ({ infoList = [], dataSource }) => (
    <Row>
      {infoList.map(({ span, fieldList = [] }, index) => (
        <Col key={index} span={span}>
          {fieldList.length
            ? fieldList.map((_v, _i) => (
                <Row key={_v.name} className={style['card-list']} style={_v.rowStyle}>
                  {_v?.noTitle ? null : (
                    <Col span={6} className={style['card-list_title']}>
                      {_v.title}
                    </Col>
                  )}
                  <Col>
                    <p style={{ paddingRight: 20 }}>
                      {_v.render ? _v.render(dataSource[_v.name], dataSource) : dataSource[_v.name]}
                    </p>
                  </Col>
                </Row>
              ))
            : null}
        </Col>
      ))}
    </Row>
  )

  return (
    <MellowCard title={cardTitle} style={{ marginTop: 16 }} bordered={false} fullHeight>
      <RenderBasicInfoColumns infoList={Type_Data_Map[type]} dataSource={data} />
      {type === 'remarkNeed'
        ? _data?.expertExtractList?.expertExtractList[0]?.expertExtractRecordList[0]?.expert.map((item, index) => (
            <div key={item.id} className={style['card-list']}>
              <p className={style['card-list_title']}>
                {intl.formatMessage({ id: 'table.purchase.pingbiaozhuanjialie' })}:
              </p>
              <p style={{ backgroundColor: '#fafbfc' }}>
                <Row>
                  <Col span={1}>{++index}</Col>
                  <Col span={2}>{item.name}</Col>
                  <Col span={4}>{item.phone}</Col>
                  <Col span={4}>{item.userJobTitle}</Col>
                </Row>
              </p>
            </div>
          ))
        : null}
      <Modal
        title={intl.formatMessage({ id: 'detail.purchase.thanks' })}
        visible={previewThank}
        onOk={() => setPreviewThank(false)}
        onCancel={() => setPreviewThank(false)}
        width={660}
        className={style.thankModal}
      >
        <div className={style.thankLetter}>
          <h2>{intl.formatMessage({ id: 'detail.purchase.thanks' })}</h2>
          <h4>THANKS LETTER</h4>
          {_data['isSend'] ? (
            <>
              <p className={style.name}>
                {intl.formatMessage({ id: 'detail.purchase.respect' })}
                {_data.memberName}
              </p>
              {/* <p>贵公司参与了我公司《{data.projectName}》竞标。在我公司综合各投标单位的基本情况，并进行充分技术交流后，经评标委员会综合评定，贵公司未能中标。我公司对贵公司的积极参与和支持深表感谢!希望下次合作成功。</p> */}
              <p>{data?.winTenderThanksContent}</p>
              <p className={style.company}>{data.memberName}</p>
            </>
          ) : (
            <p>{intl.formatMessage({ id: 'table.purchase.guigongsicici' })}</p>
          )}
          <p className={style.time}>{moment().format('YYYY-MM-DD')}</p>
        </div>
      </Modal>
    </MellowCard>
  )
}

DescriptionsInfo.defaultProps = {}

export default DescriptionsInfo
