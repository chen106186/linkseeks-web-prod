import React, { useContext, useState } from 'react'
import { Row, Col, Modal } from 'antd'
import MellowCard from '@/components/MellowCard'
import { BidDetailContext } from '@/pages/purchaseManage/procurement/_public/bid/context'
import { formatTimeString } from '@/utils'
import style from './index.less'
import { CaretDownOutlined, CaretUpOutlined, ExclamationCircleFilled, FileFilled } from '@ant-design/icons'
import { Chart, Interval, Coordinate, Legend, View, Annotation } from 'bizcharts'

import moment from 'moment'
import { PURCHASE_TYPE } from '@/constants'

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

  // 处理和投标有关的数据格式
  const data = apiType === 'callForBid' ? _data : _data.inviteTender
  // console.log(data, _data)
  const toogleMore = () => {
    setShowMore(!showMore)
  }

  // 基本信息——招标
  const basicColumnList = [
    {
      span: 8,
      fieldList: [
        { title: '招标编号:', name: 'code' },
        {
          title: '外部状态:',
          name: 'inviteTenderOutStatusValue',
          render: () =>
            apiType === 'callForBid' ? data['inviteTenderOutStatusValue'] : _data['submitTenderOutStatusValue'],
        },
        {
          title: '内部状态:',
          name: 'inviteTenderInStatusValue',
          render: () =>
            apiType === 'callForBid' ? data['inviteTenderInStatusValue'] : _data['submitTenderInStatusValue'],
        },
        { title: '发布时间:', name: 'createTime', render: (text) => formatTimeString(text) },
      ],
    },
    {
      span: 8,
      fieldList: [
        { title: '招标项目:', name: 'projectName' },
        { title: '项目预算:', name: 'budget', render: (t) => (t ? `￥${t}` : null) },
        { title: '采购类型:', name: 'purchaseType', render: (text) => PURCHASE_TYPE[text] },
        { title: '招标会员:', name: 'memberName' },
        { title: '招标摘要:', name: 'remark' },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: '适用地址:',
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
                    展开{showMore ? <CaretDownOutlined /> : <CaretUpOutlined />}
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
        { title: '投标编号:', name: 'code', render: () => _data['code'] },
        { title: '投标项目:', name: 'projectName' },
        { title: '外部状态:', name: 'submitTenderOutStatusValue', render: () => _data['submitTenderOutStatusValue'] },
        { title: '内部状态:', name: 'submitTenderInStatusValue', render: () => _data['submitTenderInStatusValue'] },
      ],
    },
    {
      span: 8,
      fieldList: [
        { title: '投标摘要:', name: 'remark', render: () => _data?.submitTender?.remark },
        {
          title: '投标文件:',
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
          title: '招标编号:',
          name: 'code',
          render: (t) => (
            <a
              href={`/purchaseManage/procurement/callForBidsSearch/detail?id=${_data.inviteTender.id}`}
              target="_blank"
            >
              {t}
            </a>
          ),
        },
        { title: '招标会员:', name: 'memberName' },
        {
          title: '适用城市:',
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
                    展开{showMore ? <CaretDownOutlined /> : <CaretUpOutlined />}
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
          title: '投标截止时间:',
          name: 'createTime',
          render: (t, r) =>
            formatTimeString(r['inviteTenderStartTime']) + '至' + formatTimeString(r['inviteTenderEndTime']),
        },
        { title: '开标时间:', name: 'openTenderTime', render: (text) => formatTimeString(text) },
      ],
    },
    {
      span: 8,
      fieldList: [
        { title: '交付日期:', name: 'hopeDate', render: (text) => formatTimeString(text, 'YYYY-MM-DD') },
        { title: '目标价:', name: 'targetPrice', render: (t) => (t ? `￥${t}` : null) },
      ],
    },
    {
      span: 8,
      fieldList: [
        { title: '招标要求:', name: 'inviteTenderRequirement' },
        {
          title: '招标文件:',
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

  // 报名要求
  const registerNeedList = [
    {
      span: 8,
      fieldList: [
        {
          title: '报名要求时间:',
          name: 'createTime',
          render: (t, r) => formatTimeString(r['registerStartTime']) + '至' + formatTimeString(r['registerEndTime']),
        },
        { title: '报名要求:', name: 'registerRequirement' },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: '报名要求附件:',
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
        { title: '投标会员:', name: 'memberName', render: () => _data.memberName },
        { title: '联系人姓名:', name: 'name', render: () => _data?.submitTenderRegister?.name },
        { title: '联系人电话:', name: 'phone', render: () => _data?.submitTenderRegister?.phone },
      ],
    },
    {
      span: 8,
      fieldList: [
        { title: '电子邮箱:', name: 'email', render: () => _data?.submitTenderRegister?.email },
        {
          title: '单位地址:',
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
          title: '报名文件:',
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
          title: '资格预审时间:',
          name: 'createTime',
          render: (t, r) => formatTimeString(r['preCheckStartTime']) + '至' + formatTimeString(r['preCheckEndTime']),
        },
        { title: '资格预审要求:', name: 'preCheckRequirement' },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: '资格预审要求附件:',
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
          title: '资格证明文件:',
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
          title: '评标要求时间:',
          name: 'createTime',
          render: (t, r) =>
            formatTimeString(r['evaluationStartTime']) + '至' + formatTimeString(r['evaluationEndTime']),
        },
        { title: '评标要求:', name: 'evaluationRequirement' },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: '评标要求附件:',
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
        { title: '是否在线评标:', name: 'isOnlineEvaluation', render: (text) => (text ? '是' : '否') },
        { title: '评标项模板:', name: 'templateName' },
      ],
    },
  ]

  // 其他要求
  const otherNeedList = [
    {
      span: 8,
      fieldList: [
        { title: '付款方式:', name: 'payType' },
        { title: '交付地址:', name: 'deliverAddress', render: (text) => data.deliverAddress },
        { title: '税费要求:', name: 'taxationRequirement' },
      ],
    },
    {
      span: 8,
      fieldList: [
        { title: '交付要求:', name: 'deliverRequirement' },
        { title: '物流要求:', name: 'logisticsRequirement' },
      ],
    },
    {
      span: 8,
      fieldList: [
        { title: '包装要求:', name: 'packingRequirement' },
        { title: '其他要求:', name: 'otherRequirement' },
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
          title: '中标金额:',
          noTitle: true,
          name: 'createTime',
          render: (text, record) => (
            <Row justify="space-between">
              <Col style={{ margin: '0 16px' }}>
                <CircleChart data={myData} content={myContent} />
              </Col>
              <Col>
                <div>
                  <span className={style['card-list_title']}>中标金额(含税):</span>
                </div>
                <div>
                  <span style={{ fontSize: 18, lineHeight: 2, fontWeight: 'bold' }}>￥{alreadyPay}</span>
                </div>
              </Col>
            </Row>
          ),
        },
        { title: '中标理由:', name: 'winTenderReason' },
      ],
    },
    {
      span: 8,
      fieldList: [
        { title: '中标公示:', name: 'winTenderAnnounceContent' },
        {
          title: '中标公示附件:',
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
        { title: '中标通知:', name: 'winTenderNoticeContent' },
        {
          title: '中标通知附件:',
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
          title: '中标失败',
          name: 'createMemberName',
          noTitle: true,
          render: (t, r) => (
            <div>
              <p className={style.resultFail}>
                <ExclamationCircleFilled style={{ fontSize: 24, paddingRight: 8, color: '#909399' }} />
                贵公司此次未中标！
              </p>
              <p className={style.resultFailSubtitle}>非常感谢贵公司的积极参与，希望下次合作成功！</p>
            </div>
          ),
        },
      ],
    },
    {
      span: 12,
      fieldList: [
        {
          title: '查看感谢',
          name: 'createMemberName',
          noTitle: true,
          rowStyle: {
            justifyContent: 'flex-end',
          },
          render: (t, r) => (
            <div>
              <p>
                <a onClick={() => setPreviewThank(true)}>查看感谢函</a>
              </p>
            </div>
          ),
        },
      ],
    },
  ]

  /** 类型数据映射 */
  const Type_Data_Map = {
    // 招标大类显示招标信息 投标大类显示投标信息
    basicInfo: apiType[0] === 'c' || apiType === 'tenderInCallForBid' ? basicColumnList : basicTenderColumnList,
    bidNeed: callForNeedList,
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
    { type: '中标金额', percent: Number(alreadyRate) },
    { type: '未中金额', percent: Number(discontentRate) },
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
            ? fieldList.map((_v: any, _i) => (
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
    <MellowCard title={cardTitle} style={{ marginTop: 24 }} bordered={false} fullHeight>
      <RenderBasicInfoColumns infoList={Type_Data_Map[type]} dataSource={data} />
      {type === 'remarkNeed'
        ? _data?.expertExtractList?.expertExtractList[0]?.expertExtractRecordList[0]?.expert.map((item, index) => (
            <div key={item.id} className={style['card-list']}>
              <p className={style['card-list_title']}>评标专家列表:</p>
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
        title="感谢函"
        visible={previewThank}
        onOk={() => setPreviewThank(false)}
        onCancel={() => setPreviewThank(false)}
        width={660}
        className={style.thankModal}
      >
        <div className={style.thankLetter}>
          <h2>感谢函</h2>
          <h4>THANKS LETTER</h4>
          {_data['isSend'] ? (
            <>
              <p className={style.name}>尊敬的{_data.memberName}</p>
              <p>
                贵公司参与了我公司《{data.projectName}
                》竞标。在我公司综合各投标单位的基本情况，并进行充分技术交流后，经评标委员会综合评定，贵公司未能中标。我公司对贵公司的积极参与和支持深表感谢!希望下次合作成功。
              </p>
              <p className={style.company}>{data.memberName}</p>
            </>
          ) : (
            <p>贵公司此次未中标！非常感谢贵公司的积极参与，希望下次合作成功！</p>
          )}
          <p className={style.time}>{moment().format('YYYY-MM-DD')}</p>
        </div>
      </Modal>
    </MellowCard>
  )
}

DescriptionsInfo.defaultProps = {}

export default DescriptionsInfo
