import React, { useContext } from 'react'
import { Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import style from './index.less'
import { BillDetailContext } from '../../_public/bill/effects/context'
import { getWebIntl } from '@apps/locales'

/**
 * 描述信息列表
 */

export interface BasicInfoProps {
  /**
   * title标题
   */
  cardTitle?: string
  /** 显示信息类型
   * 'BillDelivery' 送货时间
   */
  type?: 'BillDelivery'
  styles?: React.CSSProperties
}

const BillDelivery: React.FC<BasicInfoProps> = ({ cardTitle, type, styles }) => {
  const bidDetailContext = useContext(BillDetailContext)
  const { data: _data } = bidDetailContext
  const translate = getWebIntl()

  // 送货时间
  const basicColumnList = [
    {
      span: 12,
      fieldList: [
        { title: translate('web.resource.order.yujiaoriqi'), name: 'advanceDeliveryDate' },
        { title: translate('web.resource.order.zhisongkehukehuziti'), name: 'deliveryTypeName' },
      ],
    },
    {
      span: 12,
      fieldList: [
        { title: translate('web.resource.logistics.peisongfangshi'), name: 'deliveryMethodName' },
        {
          title: translate('web.resource.order.songhuodizhi'),
          name: _data.deliveryMethod == 2 ? 'deliveryAddress' : 'receiverAddressResp',
        },
      ],
    },
  ]

  /** 类型数据映射 */
  const Type_Data_Map = {
    BillDelivery: basicColumnList,
  }

  const deliveryFullAddresss = ['provinceName', 'cityName', 'districtName', 'streetName', 'address']
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
                  {_data.deliveryMethod === 1 && _v.name === 'receiverAddressResp' ? (
                    <Col span={18}>
                      <p style={{ paddingRight: 20 }}>{_data.deliveryAddress}</p>
                    </Col>
                  ) : (
                    <Col>
                      <p style={{ paddingRight: 20 }}>
                        {_v.render ? _v.render(dataSource[_v.name], dataSource) : dataSource[_v.name]}
                      </p>
                    </Col>
                  )}
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

BillDelivery.defaultProps = {}

export default BillDelivery
