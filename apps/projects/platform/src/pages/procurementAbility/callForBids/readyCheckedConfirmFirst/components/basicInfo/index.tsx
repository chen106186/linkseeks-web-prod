import React, { useContext, useState } from 'react'
import { Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import { ReadyConfirmBidContext } from '@/pages/procurement/_public/bid/context'
import { formatTimeString } from '@/utils'
import style from './index.less'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { BidInStateTexts, BidOutStateTexts, PURCHASE_TYPE } from '@/constants/procurement'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
/**
 * 基本信息
 */

interface IBasicInfo {
  title?: string
}

const BasicInfo: React.FC<IBasicInfo> = ({ title }) => {
  const bidDetailContext = useContext(ReadyConfirmBidContext)
  const { data, ctl } = bidDetailContext
  const [showMore, setShowMore] = useState<boolean>(false)

  const toogleMore = () => {
    setShowMore(!showMore)
  }

  // 基本信息
  const basicColumnList = [
    {
      span: 8,
      fieldList: [
        { title: intl.formatMessage({ id: 'table.purchase.numbering' }), name: 'code' },
        { title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }), name: 'inviteTenderOutStatusValue' },
        { title: intl.formatMessage({ id: 'table.purchase.innerStatus' }), name: 'inviteTenderInStatusValue' },
        {
          title: intl.formatMessage({ id: 'table.purchase.bidCreateTime' }),
          name: 'createTime',
          render: (text) => formatTimeString(text),
        },
      ],
    },
    {
      span: 8,
      fieldList: [
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
      ],
    },
    {
      span: 8,
      fieldList: [
        { title: intl.formatMessage({ id: 'table.purchase.zhaobiaozhaiyao' }), name: 'remark' },
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
                {data.length > 3 && (
                  <p onClick={toogleMore} style={{ cursor: 'pointer' }} className="commonPickColor">
                    {intl.formatMessage({ id: 'detail.purchase.label26' })}
                    {showMore ? <CaretDownOutlined /> : <CaretUpOutlined />}
                  </p>
                )}
              </>
            )
          },
        },
      ],
    },
  ]

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
                  <Col>{_v.render ? _v.render(dataSource[_v.name], dataSource) : dataSource[_v.name]}</Col>
                </Row>
              ))
            : null}
        </Col>
      ))}
    </Row>
  )

  return (
    <MellowCard title={title} style={{ marginTop: 24 }} bordered={false} fullHeight>
      <RenderBasicInfoColumns infoList={basicColumnList} dataSource={data} />
    </MellowCard>
  )
}

BasicInfo.defaultProps = {}

export default BasicInfo
