import React, { useContext } from 'react'
import { Table, Switch, Tooltip, Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import { BidDetailContext } from '../../_public/bid/context'
import { QuestionCircleOutlined } from '@ant-design/icons'
import style from './index.less'
import { CALLFORBID_TYPE, INVITE_BID } from '@/constants'
import { GlobalConfig } from '@/global/config'

const shopInfo = GlobalConfig.web.shopInfo

/**
 * 招标方式
 */

export interface BidMethodProps {
  cardTitle?: string
}

const BidMethod: React.FC<BidMethodProps> = ({ cardTitle }) => {
  const bidDetailContext = useContext(BidDetailContext)
  const { data } = bidDetailContext

  const onChange = (record) => {
    console.log(record)
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (t, r, i) => ++i,
    },
    {
      title: '会员名称',
      dataIndex: 'memberName',
      key: 'memberName',
    },
    {
      title: '会员类型',
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
    },
    {
      title: '会员角色',
      dataIndex: 'memberRoleName',
      key: 'memberRoleName',
    },
    {
      title: '是否归属会员',
      dataIndex: 'isSubMember',
      key: 'isSubMember',
      render: (t) => (t ? '是' : '否'),
    },
    {
      title: (
        <>
          状态
          <Tooltip title="打开开关，审核通过后，将招标发至对应的会员">
            <span>
              &nbsp;
              <QuestionCircleOutlined />
            </span>
          </Tooltip>
        </>
      ),
      dataIndex: 'isSend',
      key: 'isSend',
      render: (text, record) => <Switch disabled checked={text} onChange={() => onChange(record)} />,
    },
    // {
    //   title: '操作',
    //   dataIndex: 'ctl',
    //   key: 'ctl',
    //   render: (text, record) => <Button type="link" target="blank" href={`/shop?shopId=${btoa(JSON.stringify({ roleId: record.roleId, memberId: record.memberId }))}`}>进入店铺</Button>
    // }
  ]

  return (
    <MellowCard title={cardTitle} style={{ marginTop: 24 }} bordered={false} fullHeight>
      <div className={style['card-list']}>
        <Row>
          <Col span={2}>
            <p className={style['card-list_title']}>招标方式</p>
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
              <p className={style['card-list_title']}>发布商城</p>
            </Col>
            <Col>
              <p>
                {data.inviteTenderShopList
                  .map((item) => {
                    return shopInfo.find((_item) => _item.type === item.type && _item.environment === item.environment)[
                      'name'
                    ]
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
