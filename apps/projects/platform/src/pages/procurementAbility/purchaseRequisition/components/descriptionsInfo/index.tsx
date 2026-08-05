import React, { useContext } from 'react'
import { Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import style from './index.less'
import { BillDetailContext } from '../../_public/bill/effects/context'
import { useWebIntl } from '@apps/locales'

/**
 * 描述信息列表
 */

export interface BasicInfoProps {
  /**
   * title标题
   */
  cardTitle?: string
  /** 显示信息类型
   * 'basicInfo' 基本信息
   */
  type?: 'basicInfo'
  styles?: React.CSSProperties
}

const DescriptionsInfo: React.FC<BasicInfoProps> = ({ cardTitle, type, styles }) => {
  const bidDetailContext = useContext(BillDetailContext)
  const { data: _data } = bidDetailContext
  const translate = useWebIntl()

  // 基本信息——请购单

  const basicColumnList = [
    {
      span: 8,
      fieldList: [
        {
          title: translate('web.resource.order.qinggoudanhao'),
          name: 'requisitionNo',
        },
        {
          title: translate('web.resource.order.qinggoudanzhaiyao'),
          name: 'digest',
        },
        {
          title: translate('web.resource.order.qinggoubumen'),
          name: 'department',
        },
        {
          title: translate('web.resource.order.qinggouren'),
          name: 'requisitioner',
        },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: translate('web.resource.order.qinggouyongtu'),
          name: 'purpose',
        },
        {
          title: translate('web.resource.member.gongyinghuiyuan'),
          name: 'vendorMemberName',
        },
        {
          title: translate('web.resource.order.chuangjianren'),
          name: 'creator',
        },
        {
          title: translate('web.resource.member.danjushijian'),
          name: 'createTime',
        },
      ],
    },
    {
      span: 8,
      fieldList: [
        {
          title: translate('web.resource.order.xiadancangku'),
          name: 'warehouseName',
        },
      ],
    },
  ]

  /** 类型数据映射 */
  const Type_Data_Map = {
    basicInfo: basicColumnList,
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
    <MellowCard title={cardTitle} style={{ marginTop: 24, ...styles }} bordered={false} fullHeight>
      <RenderBasicInfoColumns infoList={Type_Data_Map[type]} dataSource={_data} />
    </MellowCard>
  )
}

DescriptionsInfo.defaultProps = {}

export default DescriptionsInfo
