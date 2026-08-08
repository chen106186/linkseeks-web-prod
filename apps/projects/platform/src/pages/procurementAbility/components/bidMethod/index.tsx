import React, { useContext } from 'react'
import { Table, Button, Switch, Tooltip, Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import { QuestionCircleOutlined } from '@ant-design/icons'
import style from './index.less'
import { GlobalConfig } from '@/global/config'
import { CALLFORBID_TYPE, INVITE_BID } from '@/constants/procurement'
import { jumpDefaultMall } from '@/constants'
import { getIntl } from '@linkseeks/i18n'
const shopInfo = GlobalConfig.web.shopInfo
const intl = getIntl()

/**
 * 招标方式
 */

export interface BidMethodProps {
  cardTitle?: string
}

const BidMethod: React.FC<BidMethodProps> = ({ cardTitle }) => {
  const bidDetailContext = useContext(BidDetailContext)
  const { data: _data, ctl, apiType } = bidDetailContext

  // 处理和投标有关的数据格式
  const data = apiType === 'callForBid' ? _data : _data.inviteTender

  const columns = [
    {
      title: intl.formatMessage({ id: 'table.purchase.xuhao' }),
      dataIndex: 'id',
      key: 'id',
      render: (t, r, i) => ++i,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.memberName' }),
      dataIndex: 'memberName',
      key: 'memberName',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.memberType' }),
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.role' }),
      dataIndex: 'memberRoleName',
      key: 'memberRoleName',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.isSubMember' }),
      dataIndex: 'isSubMember',
      key: 'isSubMember',
      render: (t, r) =>
        t ? intl.formatMessage({ id: 'table.purchase.shi' }) : intl.formatMessage({ id: 'table.purchase.fou' }),
    },
    {
      title: (
        <>
          {intl.formatMessage({ id: 'table.purchase.zhuangtai' })}
          <Tooltip title={intl.formatMessage({ id: 'table.purchase.dakaikaiguan' })}>
            <span>
              &nbsp;
              <QuestionCircleOutlined />
            </span>
          </Tooltip>
        </>
      ),
      dataIndex: 'isSend',
      key: 'isSend',
      render: (text, record) => <Switch disabled defaultChecked={text} onChange={() => onChange(record)} />,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <Button type="link" target="blank" onClick={() => jumpDefaultMall(`/shop/${record.memberId}_${record.roleId}`)}>
          {intl.formatMessage({ id: 'detail.purchase.entryMall' })}
        </Button>
      ),
    },
  ]

  const onChange = (record) => {
    console.log(record)
  }

  return (
    <MellowCard title={cardTitle} style={{ marginTop: 16 }} bordered={false} fullHeight>
      <div className={style['card-list']}>
        <Row>
          <Col span={2}>
            <p className={style['card-list_title']}>{intl.formatMessage({ id: 'table.purchase.zhaobiaofangshi' })}</p>
          </Col>
          <Col>
            <p>{CALLFORBID_TYPE[data.inviteTenderType]}</p>
          </Col>
        </Row>
      </div>
      {data.inviteTenderType === INVITE_BID ? (
        <Table dataSource={data.memberList} columns={columns} pagination={{ size: 'small' }} />
      ) : (
        <div className={style['card-list']}>
          <Row>
            <Col span={2}>
              <p className={style['card-list_title']}>{intl.formatMessage({ id: 'table.purchase.fabushangcheng' })}</p>
            </Col>
            <Col>
              <p>
                {data.inviteTenderShopList
                  .map((item) => {
                    return shopInfo.find((_item) => _item.type === item.type && _item.id === item.shopId)['name']
                  })
                  .join(' / ')}
              </p>
            </Col>
          </Row>
        </div>
      )}
    </MellowCard>
  )
}

BidMethod.defaultProps = {}

export default BidMethod
