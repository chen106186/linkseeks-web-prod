import React, { useEffect, useState } from 'react'
import { Form, Radio, Tooltip, Row, Col, Image, Table, Button, Switch, Typography } from 'antd'
import { GlobalConfig } from '@/global/config'
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import Store from '../modal/store'
import StandardTable from '@/components/StandardTable'
import { ENTERPRISE_CENTER_URL } from '@/constants'
import SelectMenber from '../modal/selectMenber'
import { postPurchasePurchaseInquirySystemMatchingMemberInitializeList } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { getCommodityShopListEnterpriseShopBySite } from '@apps/apis'
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
}

const { Link } = Typography

const Demand: React.FC<Iprops> = (props: any) => {
  const [form] = Form.useForm()
  const { currentRef, fetchdata, onBadge, badgeIndex } = props
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
    // {
    //   title: intl.formatMessage({ id: 'detail.purchase.isSubMember' }),
    //   key: 'membershipOrNot',
    //   dataIndex: 'membershipOrNot',
    //   render: (_text: any, _record: any) => <>
    //     { (value === 3 || (value === 2 && _record.isSubMember === 1)) && <Typography.Text type='success'>是</Typography.Text>}
    //   </>
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
    //   render: (_text: any, _record: any, index: number) => (
    //     <Form.Item
    //       style={{ marginBottom: 0 }}
    //     >
    //       <Switch checked={_text} onChange={(e: any) => handleGetSwitch(e, index)} />
    //     </Form.Item>
    //   )
    // },
    // {
    //   title: intl.formatMessage({ id: 'detail.purchase.option' }),
    //   key: 'operate',
    //   dataIndex: 'operate',
    //   render: (_text: any, _record: any) => (
    //     <Link href={`${ENTERPRISE_CENTER_URL}/shop/${_record.memberId}_${_record.roleId}`} target="_blank">
    //       {intl.formatMessage({ id: 'detail.purchase.entryMall' })}
    //     </Link>
    //   )
    // },
  ]
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
  /** 确认选择商城 */
  const handleStoreIds = (ids) => {
    console.log(ids)
    const filterStore = storeList.filter((item) => ids.indexOf(item.id) !== -1)
    setShopIds(ids)
    setStore([...filterStore])
    setVisible(false)
  }
  /** 系统匹配 */
  const fetchSystemMateData = (params: any) => {
    return new Promise((resolve) => {
      postPurchasePurchaseInquirySystemMatchingMemberInitializeList({ ...params }, { ctlType: 'none' })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    })
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
          roleName: item.roleName,
          levelTag: item.levelTag,
          membershipOrNot: item.membershipOrNot || 1,
          state: item.state || 1,
          type: item.type || 2,
        })
      })
      form.setFieldsValue({ rowCol: data })
      setRowCtl(data)
    }
  }

  useEffect(() => {
    // let shopList = GlobalConfig.web.shopInfo.filter(v => v.type == 6).map(
    //   v => v
    // )
    // setStoreList(shopList)
    getCommodityShopListEnterpriseShopBySite({ siteId: import.meta.env.OUT_SITEID }).then((res) => {
      setStoreList(res.data)
    })
  }, [])

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
                case 3:
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

  useEffect(() => {
    /**编辑回显数据 */
    if (fetchdata) {
      form.setFieldsValue({
        type: fetchdata.type,
      })
      if (fetchdata.type === 1) {
        // let shopList = GlobalConfig.web.shopInfo.filter(v => v.type == 6).map(
        //   v => v
        // )
        // setStoreList(shopList)
        getCommodityShopListEnterpriseShopBySite({ siteId: import.meta.env.OUT_SITEID }).then((res) => {
          let shopList = res.data.map((v) => v)
          setStoreList(shopList)
        })
      }
      setValue(fetchdata.type)
      fetchdata.shopIds && handleStoreIds(fetchdata.shopIds)
      fetchdata.demandMembers && setRowCtl([...fetchdata.demandMembers])
      fetchdata.demandMembers && form.setFieldsValue({ rowCol: fetchdata.demandMembers })
    }
  }, [fetchdata])

  const handleCancel = () => {
    setValue(3)
    setVisible(false)
    form.setFieldsValue({
      type: 3,
    })
  }

  return (
    <>
      <Form {...layout} form={form}>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.purchase.jointType' })}
          name="type"
          rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message40' }) }]}
        >
          <Radio.Group onChange={changeRadio}>
            <Radio value={1}>
              <Tooltip placement="topLeft" title={intl.formatMessage({ id: 'detail.purchase.tips6' })}>
                {intl.formatMessage({ id: 'detail.purchase.modalTitle6' })}
                <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
              </Tooltip>
            </Radio>
            {/* <Radio value={2}>
              <Tooltip
                placement="topLeft"
                title={<>系统通过需求单品类、商品属性、适用地市与平台会员发布的商品品类、商品属性、归属地区进行匹配，推荐满足条件的平台会员</>}
              >
                系统匹配
                <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
              </Tooltip>
            </Radio> */}
            <Radio value={3}>
              <Tooltip placement="topLeft" title={intl.formatMessage({ id: 'detail.purchase.tips7' })}>
                {intl.formatMessage({ id: 'detail.purchase.modalTitle7' })}
                <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
              </Tooltip>
            </Radio>
          </Radio.Group>
        </Form.Item>
        {value === 1 && store.length > 0 && (
          <Form.Item
            label={intl.formatMessage({ id: 'detail.purchase.modalTitle6' })}
            name="shopIds"
            wrapperCol={{ span: 24 }}
          >
            <Row gutter={[16, 16]}>
              {store.map((item) => (
                <Col span={6} key={item.id} style={ColStyle}>
                  {item.logoUrl ? <Image width={32} height={32} src={item.logoUrl} /> : null}
                  <span style={TextStyle}>{item.name}</span>
                </Col>
              ))}
            </Row>
          </Form.Item>
        )}
        {value === 2 && (
          <Form.Item noStyle>
            <StandardTable columns={columns} fetchTableData={(params) => fetchSystemMateData(params)} />
          </Form.Item>
        )}
        {value === 3 && (
          <Form.Item
            wrapperCol={{ span: 24 }}
            name="rowCol"
            rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message41' }) }]}
          >
            <Button type="dashed" block style={{ marginBottom: '24px' }} onClick={() => setMenberVidible(true)}>
              <PlusOutlined />
              {intl.formatMessage({ id: 'detail.purchase.selectMenber' })}
            </Button>
            <Table columns={columns} dataSource={rowCtl} pagination={false} rowKey={'id'} />
          </Form.Item>
        )}
      </Form>
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
  badgeIndex: 3,
}

export default Demand
