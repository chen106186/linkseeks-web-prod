import React, { useCallback, useEffect, useState } from 'react'
import { Row, Col, Form, Input, Button, Select } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { Card } from '@linkseeks/ui'
import TableModal from '@/pages/transaction/components/tableModal'
import style from './index.less'
import { isEmpty } from 'lodash'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getMemberManagePlatformProviderPage, getMemberManageUpperProviderMerchantPage } from '@apps/apis'
import { getCommodityWebShopWebAll } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { getEnableMultiTenancy } from '@/utils/auth'
const intl = getIntl()
interface BasicInfoLayoutProps {
  /** 获取询价会员 */
  getMemberInfo: (e) => void
  /** 会员信息 */
  memb?: number
  /** 是否可修改 */
  isEdit?: boolean
}

const BasicInfoLayout: React.FC<BasicInfoLayoutProps> = (props: any) => {
  const { getMemberInfo, memb, isEdit } = props
  const [visible, setVisible] = useState<boolean>(false)
  const [member, setMember] = useState<any>({})
  const [storeList, setStoreList] = useState<Array<any>>([])
  const enableMultiTenancy = getEnableMultiTenancy()

  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.huiyuanmingcheng' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.huiyuanleixing' }),
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.huiyuanjuese' }),
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.huiyuandengji' }),
      dataIndex: 'levelTag',
      key: 'levelTag',
    },
  ]

  const handleFetchData = useCallback((params: any) => {
    let getMemberApi = enableMultiTenancy
      ? getMemberManageUpperProviderMerchantPage
      : getMemberManagePlatformProviderPage
    return new Promise((resolve) => {
      getMemberApi({ ...params })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          resolve(res.data)
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }, [])

  const toggle = (flag: boolean) => {
    setVisible(flag)
  }

  const getShopListFn = (memberId: number, roleId: number) => {
    getCommodityWebShopWebAll(
      {
        environment: 1,
        isMemberType: true,
        memberId,
        roleId,
      },
      { ctlType: 'none' },
    ).then((res) => {
      if (res.code !== 1000) {
        return
      }
      setStoreList(res.data)
    })
  }

  const handleLogisticOnOk = (selectRowKeys: string[] | number[], selectRowRecord: any) => {
    const target = selectRowRecord[0]
    getShopListFn(target.memberId, target.roleId)
    getMemberInfo(target)
    setMember(target)
    toggle(false)
  }

  useEffect(() => {
    if (!isEmpty(memb)) {
      getShopListFn(memb.memberId, memb.roleId)
      console.log(memb)
      setMember(memb)
    }
  }, [memb])

  return (
    <Card id="basicInfoLayout" title={intl.formatMessage({ id: 'dealAbility.jibenxinxi' })}>
      <Row gutter={[48, 24]}>
        <Col span={12}>
          <Form.Item
            label={intl.formatMessage({ id: 'dealAbility.xunjiadanzhaiyao' })}
            name="details"
            rules={[{ required: true, message: intl.formatMessage({ id: 'dealAbility.qingshuruxunjiadanzhaiyao' }) }]}
          >
            <Input maxLength={30} placeholder={intl.formatMessage({ id: 'dealAbility.zuichang60zifu30gehan' })} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'dealAbility.xunjiashangcheng' })}
            name="shopId"
            rules={[{ required: true, message: intl.formatMessage({ id: 'dealAbility.qingxuanzexunjiashangcheng' }) }]}
          >
            <Select disabled={isEdit}>
              {storeList.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12} className={style.searchColor}>
          <Form.Item
            label={intl.formatMessage({ id: 'dealAbility.beixunjiahuiyuan' })}
            name="memberName"
            rules={[{ required: true, message: intl.formatMessage({ id: 'dealAbility.qingxuanzebeixunjiahuiyuan' }) }]}
          >
            <Input.Search
              onSearch={() => toggle(true)}
              readOnly
              enterButton={
                <Button disabled={isEdit} style={{ height: '31.19px' }} icon={<LinkOutlined />}>
                  {intl.formatMessage({ id: 'dealAbility.xuanze' })}
                </Button>
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <TableModal
        modalType="Drawer"
        visible={visible}
        title={intl.formatMessage({ id: 'dealAbility.xuanzehuiyuan' })}
        mode="radio"
        tableProps={{
          rowKey: 'id',
        }}
        customKey="id"
        fetchData={handleFetchData}
        onClose={() => toggle(false)}
        onOk={handleLogisticOnOk}
        columns={columns}
        effects={($, actions) => {
          actions.reset()
          useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
        }}
        schema={{
          type: 'object',
          properties: {
            megalayout: {
              type: 'object',
              'x-component': 'mega-layout',
              properties: {
                name: {
                  type: 'string',
                  'x-component': 'Search',
                  'x-mega-props': {},
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'dealAbility.huiyuanmingcheng' }),
                    advanced: false,
                    align: 'flex-left',
                  },
                },
              },
            },
            [FORM_FILTER_PATH]: {
              type: 'object',
              'x-component': 'flex-layout',
              'x-component-props': {
                rowStyle: {
                  justifyContent: 'flex-start',
                  flexWrap: 'nowrap',
                },
                colStyle: {
                  //改变间隔
                  marginRight: 20,
                },
              },
            },
          },
        }}
        value={[member]}
      />
    </Card>
  )
}

export default BasicInfoLayout
