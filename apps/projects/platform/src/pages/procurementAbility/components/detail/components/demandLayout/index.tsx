import React, { useContext } from 'react'
import { Row, Col, Image, Table, Tooltip, Switch, Typography } from 'antd'
import Card from '../../../card'
import { Context } from '../context'
import style from './index.less'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const TYPE = {
  1: intl.formatMessage({ id: 'detail.purchase.modalTitle6' }),
  2: intl.formatMessage({ id: 'detail.purchase.modalTitle23' }),
  3: intl.formatMessage({ id: 'detail.purchase.modalTitle24' }),
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
  title?: string
}

const DemandLayout: React.FC<DemandLayoutIProps> = (props: any) => {
  const { storeList, title } = props
  console.log(title)
  const context = useContext(Context)

  const columns = [
    {
      title: intl.formatMessage({ id: 'table.purchase.id' }),
      key: 'number',
      dataIndex: 'number',
      render: (text: any, record: any, index: number) => <>{index + 1}</>,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.memberName' }),
      key: 'memberName',
      dataIndex: 'memberName',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.memberType' }),
      key: 'memberTypeName',
      dataIndex: 'memberTypeName',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.role' }),
      key: 'roleName',
      dataIndex: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.leveTag' }),
      key: 'levelTag',
      dataIndex: 'levelTag',
    },
    // {
    //   title: intl.formatMessage({ id: 'detail.purchase.isSubMember' }),
    //   key: 'membershipOrNot',
    //   dataIndex: 'membershipOrNot',
    //   render: (text: any) => (
    //     <>
    //       {Number(text) === 1 && <Typography.Text type='success'>{intl.formatMessage({ id: 'detail.purchase.okText' })}</Typography.Text>}
    //       {Number(text) === 0 && <Typography.Text type='warning'>{intl.formatMessage({ id: 'detail.purchase.cancelText' })}</Typography.Text>}
    //     </>
    //   )
    // },
    // {
    //   title: (
    //     <>
    //       <span>{intl.formatMessage({ id: 'detail.purchase.demendSend' })}</span>
    //       <Tooltip placement="top" title={intl.formatMessage({ id: 'detail.purchase.tips5' })}>
    //         <QuestionCircleOutlined
    //           style={{
    //             marginLeft: '5px',
    //             fontSize: '14px',
    //             color: '#909399'
    //           }}
    //         />
    //       </Tooltip>
    //     </>
    //   ),
    //   key: 'state',
    //   dataIndex: 'state',
    //   render: (text: any) => (
    //     <Switch checked={text} disabled={true} />
    //   )
    // },
    // {
    //   title: intl.formatMessage({ id: 'table.purchase.operate' }),
    //   key: 'operate',
    //   dataIndex: 'operate',
    //   render: (_text: any, _record: any) => (
    //     <Typography.Link href={`${ENTERPRISE_CENTER_URL}/shop/${_record.memberId}_${_record.roleId}`} target="_blank">
    //       {intl.formatMessage({ id: 'detail.purchase.entryMall' })}
    //     </Typography.Link>
    //   )
    // },
  ]

  return (
    <Card id="demandLayout" title={intl.formatMessage({ id: 'detail.purchase.demandLayout' })}>
      <div className={style.list}>
        <div className={style.listLable} style={{ flex: '0 0 100px' }}>
          {title}：
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

DemandLayout.defaultProps = {
  title: intl.formatMessage({ id: 'detail.purchase.releaseMode' }),
}

export default DemandLayout
