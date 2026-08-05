import React, { useContext } from 'react'
import { Row, Col, Image, Table, Tooltip, Switch, Typography } from 'antd'
import { Card } from '@linkseeks/ui'
import { Context } from '../context'
import style from './index.less'
import { QuestionCircleOutlined } from '@ant-design/icons'

const TYPE = {
  1: '发布至平台',
  2: '系统匹配',
  3: '指定会员',
}
const ColStyle = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #1fbf87',
  paddingTop: ' 6px',
  paddingBottom: '6px',
  margin: '5px',
  borderRadius: '4px',
}
const TextStyle = {
  color: '#1fbf87',
  marginLeft: '10px',
}

export interface DemandLayoutIProps {
  storeList?: any
}

const DemandLayout: React.FC<DemandLayoutIProps> = (props: any) => {
  const { storeList } = props
  const context = useContext(Context)

  const columns = [
    {
      title: '序号',
      key: 'number',
      dataIndex: 'number',
      render: (text: any, record: any, index: number) => <>{index + 1}</>,
    },
    {
      title: '会员名称',
      key: 'memberName',
      dataIndex: 'memberName',
    },
    {
      title: '会员类型',
      key: 'memberTypeName',
      dataIndex: 'memberTypeName',
    },
    {
      title: '会员角色',
      key: 'roleName',
      dataIndex: 'roleName',
    },
    {
      title: '会员等级',
      key: 'levelTag',
      dataIndex: 'levelTag',
    },
    {
      title: '是否归属会员',
      key: 'membershipOrNot',
      dataIndex: 'membershipOrNot',
      render: (text: any) => (
        <>
          {Number(text) === 1 && <Typography.Text type="success">是</Typography.Text>}
          {Number(text) === 0 && <Typography.Text type="warning">否</Typography.Text>}
        </>
      ),
    },
    {
      title: (
        <>
          <span>需求发送</span>
          <Tooltip placement="top" title="打开开关，审核通过后，将发送需求至选择的归属会员">
            <QuestionCircleOutlined
              style={{
                marginLeft: '5px',
                fontSize: '14px',
                color: '#909399',
              }}
            />
          </Tooltip>
        </>
      ),
      key: 'state',
      dataIndex: 'state',
      render: (text: any) => <Switch checked={text} disabled={true} />,
    },
    // {
    //   title: '操作',
    //   key: 'operate',
    //   dataIndex: 'operate',
    //   render: (_text: any, _record: any) => (
    //     <Typography.Link href={`/shop?shopId=${btoa(JSON.stringify({ roleId: _record.roleId, memberId: _record.memberId }))}`} target="_blank">
    //       进入店铺
    //     </Typography.Link>
    //   )
    // },
  ]

  return (
    <Card id="demandLayout" title="需求对接">
      <div className={style.list}>
        <div className={style.listLable} style={{ flex: '0 0 100px' }}>
          发布方式：
        </div>
        <div className={style.listContent}>{TYPE[context.type]}</div>
      </div>
      {context.type === 1 && (
        <Row gutter={[16, 16]}>
          {storeList.map((item) => (
            <Col span={6} key={item.id} style={ColStyle}>
              <Image width={32} height={32} src={item.logoUrl} />
              <span style={TextStyle}>{item.name}</span>
            </Col>
          ))}
        </Row>
      )}
      {context.type !== 1 && <Table dataSource={context.demandMembers} columns={columns} rowKey="id" />}
    </Card>
  )
}
export default DemandLayout
