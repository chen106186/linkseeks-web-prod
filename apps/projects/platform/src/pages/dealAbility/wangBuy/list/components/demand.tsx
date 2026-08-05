import React, { useEffect, useState } from 'react'
import { Form, Radio, Tooltip, Row, Col, Image, Table, Button, Switch, Typography } from 'antd'
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import Store from '../modal/store'
import SelectMenber from '../modal/selectMenber'
import { getCommodityShopShopBList } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { ENTERPRISE_CENTER_URL } from '@/constants'

const intl = getIntl()
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
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

interface Iprops {
  currentRef: any
  fetchdata: { [key: string]: any }
  onBadge?: Function
  badgeIndex?: number
  needOperate?: boolean
  isShop?: boolean
  shopList?: any
  form?: any
  askPurchaseMemberResponses?: any
}

const { Link } = Typography

const Demand: React.FC<Iprops> = (props: any) => {
  // const [form] = Form.useForm()
  const {
    currentRef,
    fetchdata,
    onBadge,
    badgeIndex,
    needOperate = true,
    isShop = false,
    form,
    shopList,
    askPurchaseMemberResponses = [],
  } = props
  const [value, setValue] = useState<number>(0)
  const [store, setStore] = useState<Array<any>>([])
  const [shopIds, setShopIds] = useState<Array<number>>([])
  const [storeList, setStoreList] = useState<Array<any>>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [menberVisible, setMenberVidible] = useState<boolean>(false)
  const [rowCtl, setRowCtl] = useState<any>([])

  const handleGetSwitch = (e: any, index: number) => {
    const state = e ? 1 : 0
    const params = [...rowCtl]
    params[index].state = state
    setRowCtl([...params])
  }

  /** 表头 */
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.id' }),
      key: 'memberId',
      dataIndex: 'memberId',
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
  ]

  const columnsRemix = () => {
    if (needOperate) {
      return columns.concat([
        {
          title: intl.formatMessage({ id: 'detail.purchase.isSubMember' }),
          key: 'membershipOrNot',
          dataIndex: 'membershipOrNot',
          render: (_text: any, _record: any) => (
            <>
              {value === 2 && _record.isSubMember === 1 && (
                <Typography.Text type="success">
                  {intl.formatMessage({ id: 'transaction_components.shi', defaultMessage: '是' })}
                </Typography.Text>
              )}
            </>
          ),
        },
        {
          title: (
            <>
              <span>{intl.formatMessage({ id: 'detail.purchase.demendSend' })}</span>
              <Tooltip placement="top" title={intl.formatMessage({ id: 'detail.purchase.tips5' })}>
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
          render: (_text: any, _record: any, index: number) => (
            <Form.Item style={{ marginBottom: 0 }}>
              <Switch checked={_text} onChange={(e: any) => handleGetSwitch(e, index)} />
            </Form.Item>
          ),
        },
        {
          title: intl.formatMessage({ id: 'detail.purchase.option' }),
          key: 'operate',
          dataIndex: 'operate',
          render: (_text: any, _record: any) => (
            <Link href={`${ENTERPRISE_CENTER_URL}/shop/${_record.memberId}_${_record.roleId}`} target="_blank">
              {intl.formatMessage({ id: 'detail.purchase.entryMall' })}
            </Link>
          ),
        },
      ])
    }
    return columns
  }
  /** 切换需求模式 */
  const changeRadio = (e: any) => {
    const { value } = e.target
    if (value === 1) {
      setVisible(true)
    }
    setStore([])
    setRowCtl([])
    setValue(value)
  }
  const fnGetAskPurchaseShopRequests = (ids) => {
    const obj: { shopId: number; shopName: string }[] = []
    ids.map((id: number) => {
      storeList.forEach((item: any) => {
        if (item.id === id) {
          const desc = {
            shopId: item.id,
            shopName: item.name,
            shopLogo: item.logoUrl,
          }
          obj.push(desc)
        }
      })
    })
    return obj
  }
  /** 确认选择商城 */
  const handleStoreIds = (ids) => {
    const filterStore = storeList.filter((item) => ids.indexOf(item.id) !== -1)
    setShopIds(ids)
    setStore([...filterStore])
    setVisible(false)
    form.setFieldsValue({ shopIds: fnGetAskPurchaseShopRequests(ids) })
  }
  /** 获取会员列表 */
  const handleMenberList = (e: any) => {
    const RowCtl = e.selectRow
    if (RowCtl.length > 0) {
      setMenberVidible(false)
      const data: any = []
      RowCtl.forEach((item) => {
        data.push({
          id: item.id,
          isSubMember: item.isSubMember || 1,
          memberId: item.memberId,
          memberName: item.name || item.memberName,
          memberTypeName: item.memberTypeName,
          roleId: item.roleId,
          name: item.name,
          roleName: item.roleName,
          levelTag: item.levelTag,
          membershipOrNot: item.membershipOrNot || 1,
          state: item.state || 1,
          type: item.type || 2,
        })
      })
      // form.setFieldsValue({ rowCol: data })
      setRowCtl(data)
    }
  }
  // 重置字段
  const fnResetMemberRequests = (rowCol) => {
    const mapList = rowCol.map((item) => {
      return {
        ...item,
        memberId: item.memberId,
        roleId: item.memberRoleId,
        name: item.memberName,
        memberTypeName: item.memberType,
        roleName: item.memberRoleName,
        levelTag: item.memberGrade,
      }
    })
    return mapList
  }

  let theFirst = true
  useEffect(() => {
    // setValue(1)
    // const obj = {}
    // fectchShopLists(obj).then((res) => {
    //   console.log('商城',res);
    //   setStoreList(res)
    // })
    getCommodityShopShopBList().then((res) => {
      if (res.code === 1000) {
        setStoreList(res.data)
      }
    })
  }, [])
  useEffect(() => {
    if (askPurchaseMemberResponses?.length > 0) {
      setValue(2)
      const obj = fnResetMemberRequests(askPurchaseMemberResponses)
      setRowCtl(obj)
    }
  }, [askPurchaseMemberResponses])
  useEffect(() => {
    form.setFieldsValue({ rowCol: rowCtl })
    if (shopList?.length > 0 && theFirst) {
      const descArr = []
      shopList.map((item: any) => {
        storeList.forEach((second: any) => {
          if (item.shopId === second.id) {
            descArr.push(second)
          }
        })
      })
      setValue(1)
      setStore(descArr)
      theFirst = false // 用来控制只重置一次
    }
  }, [rowCtl, shopList])

  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          form
            .validateFields()
            .then((res) => {
              const params: any = {}
              switch (Number(value)) {
                case 1:
                  params.shopIds = shopIds
                  break
                case 2:
                  params.demandMembers = rowCtl
                  break
              }
              resolve({
                state: true,
                name: 'demand',
                data: {
                  type: res.type,
                  ...params,
                },
              })
              onBadge(0, badgeIndex)
            })
            .catch((error) => {
              if (error && error.errorFields) {
                onBadge(error.errorFields.length, badgeIndex)
              }
            })
        }),
    }
  }, [rowCtl, value, shopIds])

  const handleCancel = () => {
    setValue(2)
    setVisible(false)
    form.setFieldsValue({
      type: 2,
    })
  }

  return (
    <>
      <Form.Item
        label={intl.formatMessage({ id: 'detail.purchase.jointType' })}
        name="type"
        rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message40' }) }]}
      >
        <Radio.Group onChange={changeRadio}>
          <Radio value={1}>
            <Tooltip
              placement="topLeft"
              title={intl.formatMessage({
                id: 'transaction_components.jiangqiugouxuqiufabuzhi',
                defaultMessage: '将求购需求发布至商城，登录商城的供应商都能向您报价',
              })}
            >
              {intl.formatMessage({
                id: 'transaction_components.fabuzhishangcheng',
                defaultMessage: '发布至商城',
              })}
              <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
            </Tooltip>
          </Radio>
          <Radio value={2}>
            <Tooltip placement="topLeft" title={intl.formatMessage({ id: 'detail.purchase.tips7' })}>
              {intl.formatMessage({ id: 'detail.purchase.modalTitle7' })}
              <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
            </Tooltip>
          </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item shouldUpdate={(prevValues, currValues) => prevValues.type !== currValues.type} noStyle>
        {({ getFieldValue }) => {
          const type = getFieldValue('type')
          if (type === 1 && store.length > 0) {
            return (
              <Form.Item
                label={intl.formatMessage({ id: 'detail.purchase.modalTitle6' })}
                name="shopIds"
                wrapperCol={{ span: 24 }}
              >
                <Row gutter={[16, 16]}>
                  {store.map((item) => (
                    <Col span={6} key={item.id} style={ColStyle}>
                      <Image width={32} height={32} src={item.logoUrl} />
                      <span style={TextStyle}>{item.name || item.shopName}</span>
                    </Col>
                  ))}
                </Row>
              </Form.Item>
            )
          }
          if (type === 2) {
            return (
              <Form.Item
                wrapperCol={{ span: 24 }}
                name="rowCol"
                rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message41' }) }]}
              >
                <Button type="dashed" block style={{ marginBottom: '24px' }} onClick={() => setMenberVidible(true)}>
                  <PlusOutlined />
                  {intl.formatMessage({ id: 'detail.purchase.selectMenber' })}
                </Button>
                <Table columns={columnsRemix()} dataSource={rowCtl} pagination={false} rowKey={'id'} />
              </Form.Item>
            )
          }
        }}
      </Form.Item>
      {/* </Form> */}
      <Store visible={visible} storeList={storeList} onCancel={() => handleCancel()} getStroeList={handleStoreIds} />
      <SelectMenber
        visible={menberVisible}
        rowCtl={rowCtl}
        onclose={() => setMenberVidible(false)}
        confirm={(e) => handleMenberList(e)}
      />
    </>
  )
}

Demand.defaultProps = {
  badgeIndex: 2,
}

export default Demand
