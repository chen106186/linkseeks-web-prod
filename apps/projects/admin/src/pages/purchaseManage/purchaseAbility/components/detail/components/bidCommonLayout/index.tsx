import React from 'react'
import { Row, Col, Divider, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

import { Card } from '@linkseeks/ui'

import selfStyles from './index.less'

import AreaItem from './areaItem'
import FilesItem from './filesItem'
import MsgItem from './msgItem'
import ResultItem from './resultItem'
import PieItem from './pieItem'

const ICON_STYLE: any = {
  color: '#C0C4CC',
  fontSize: '14px',
  marginLeft: '5px',
}

export interface BidCommonLayoutProps {
  effect?: any
  layoutId: string
  title: string
  layoutType?: string
  extra?: React.ReactNode
  checkDetailFunc?: Function
}

const BidCommonLayout: React.FC<BidCommonLayoutProps> = (props: any) => {
  const { layoutId, title, effect, layoutType, extra, checkDetailFunc } = props
  const _returnItem = (data) => {
    switch (data.type) {
      case 'text':
        return data.extra || '-'
      case 'area':
        return data.extra ? <AreaItem data={data.extra} /> : '-'
      case 'files':
        return data.extra ? <FilesItem files={data.extra} /> : '-'
    }
  }

  const _returnLabel = (child: any) => {
    const _icon = <QuestionCircleOutlined style={ICON_STYLE} />
    if (child.tips) {
      return (
        <Tooltip placement="top" title={child.tips}>
          {child.isMix ? (
            <p>
              {child.isMix[0]}
              {_icon}
              <p>{child.isMix[1]}: </p>
            </p>
          ) : (
            <p>
              {child.label}: {_icon}
            </p>
          )}
        </Tooltip>
      )
    } else {
      if (child.isMix) {
        return (
          <>
            <p>{child.isMix[0]}</p>
            <p>{child.isMix[1]}: </p>
          </>
        )
      } else {
        return `${child.label}: `
      }
    }
  }

  const _returnChild = (child, key) => {
    if (child.type === 'text' || child.type === 'area' || child.type === 'files') {
      return (
        <div className={selfStyles.baseItem} key={key}>
          <h5 className={selfStyles.label}>{_returnLabel(child)}</h5>
          <h5 className={selfStyles.content}>{_returnItem(child)}</h5>
        </div>
      )
    } else if (child.type === 'pie') {
      return (
        <div className={selfStyles.pieItem} key={key}>
          <PieItem />
          <div className={selfStyles.box}>
            <div className={selfStyles.title}>{child.label}: </div>
            <div className={selfStyles.price}>¥114,000.00</div>
          </div>
        </div>
      )
    }
  }
  const _returnWarp = () => {
    if (!layoutType) {
      return (
        <Row gutter={[8, 8]}>
          {effect.map((item, index) => (
            <Col span={8} key={`effect_text_${index}`}>
              {item.col.map((child, key) => _returnChild(child, key))}
            </Col>
          ))}
        </Row>
      )
    } else if (layoutType === 'msg') {
      return (
        <Row gutter={[8, 8]}>
          {effect.map((item, index) => (
            <Col span={5} key={`effect_msg_${index}`}>
              <MsgItem data={item} rank={index} />
            </Col>
          ))}
        </Row>
      )
    } else if (layoutType === 'result') {
      return (
        <Row gutter={[8, 8]}>
          {effect?.list?.map((item, index) => (
            <Col span={5} key={`effect_result_${index}`}>
              <ResultItem detail={item} itemIndex={index} checkDetailFunc={checkDetailFunc} />
            </Col>
          ))}
          <Col span={24}>
            <Divider dashed style={{ color: '#EBECF0' }} />
            <div className={selfStyles.baseItem}>
              <h5 className={selfStyles.label}>授标意见: </h5>
              <h5 className={selfStyles.content}>{effect.signUpIdea}</h5>
            </div>
            <div className={selfStyles.baseItem}>
              <h5 className={selfStyles.label}>附件: </h5>
              <h5 className={selfStyles.content}>
                <FilesItem files={effect.returnUrls} />
              </h5>
            </div>
          </Col>
        </Row>
      )
    }
  }
  return (
    <Card id={layoutId} title={title} extra={extra}>
      {_returnWarp()}
    </Card>
  )
}

export default BidCommonLayout
