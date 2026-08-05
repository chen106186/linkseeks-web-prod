import React, { useRef, useState, useEffect } from 'react'
import Table from '@/components/TableLayout'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Tag, Button, Modal, Form, Select, Typography } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { INQUIRYSEARCHSCHEMA } from './schema'
import { EXTERNALSTATE_COLOR } from '@/constants/stateColor'
import { authService } from '@apps/services'
import { isEmpty } from 'lodash'
import { postMemberLoginSwitchrole } from '@apps/apis'
import { getTradeProductInquiryList, getTradeQuotationtInquiryExternalStateEnum } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { recentVisitLocalStorage } from '@linkseeks/storage'
interface MemberRole {
  memberRoleId: number
  memberRoleName: string
  roleType: number
}
const InquirySearch = () => {
  const reload = useRef<any>({})
  const intl = useIntl()
  const { pathname } = useLocation()
  const [form] = Form.useForm()
  const [role, setRole] = useState<MemberRole[]>([])
  const [isModalVisible, setVisible] = useState<boolean>(false)
  const [orderId, setOrderId] = useState<string>('')
  const [isId, setIsId] = useState<number>()
  const [memberRoleName, setMemberRoleName] = useState<string>('')

  const handleFieldsAPI = (memberRoleId: number, id?) => {
    postMemberLoginSwitchrole({
      memberRoleId,
    })
      .then((res: any) => {
        if (res.code !== 1000) {
          return
        }
        authService.setAuth(res.data)
        recentVisitLocalStorage.removeItem()
        setTimeout(() => {
          history.redirect(`/dealAbility/productInquiry/waitAddInquiry/two?id=${id}`)
        }, 800)
      })
      .catch((err) => {})
  }

  /** 二次询价 */
  const secondInquiry = (id, orderId) => {
    const userInfo: any = authService.getAuth() || {}
    const roles = userInfo.roles.filter((_item) => _item.roleType === 2)
    setRole(roles)
    setMemberRoleName(roles[0].memberRoleName)
    setOrderId(orderId)
    setIsId(id)
    if (!isEmpty(roles)) {
      if (roles.length === 1) {
        handleFieldsAPI(roles[0].memberRoleId, id)
      } else {
        setVisible(true)
      }
    } else {
      Modal.info({
        content: intl.formatMessage({ id: 'dealAbility.dangqiandengluhuiyuanmeiyou' }),
      })
    }
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'dealAbility.xunjiadanhao' }),
      key: 'inquiryListNo',
      dataIndex: 'inquiryListNo',
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/dealAbility/inquiryOffer/inquirySearch/detail?id=${record.id}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.xunjiadanzhaiyao' }),
      key: 'details',
      dataIndex: 'details',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.xunjiahuiyuan' }),
      key: 'inquiryListMemberName',
      dataIndex: 'inquiryListMemberName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.jiaofuriqi' }),
      key: 'deliveryTime',
      dataIndex: 'deliveryTime',
      render: (text: any, record: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiajiezhishijian' }),
      key: 'quotationAsTime',
      dataIndex: 'quotationAsTime',
      render: (text: any, record: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.danjushijian' }),
      key: 'voucherTime',
      dataIndex: 'voucherTime',
      render: (text: any, record: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.waibuzhuangtai' }),
      key: 'externalState',
      dataIndex: 'externalState',
      render: (text: any, record: any) => <Tag color={EXTERNALSTATE_COLOR[text]}>{record.externalStateName}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caozuo' }),
      key: 'options',
      dataIndex: 'options',
      render: (_text: any, record: any) => (
        <>
          {record.isShowQuote && record.isQuoted !== 1 && (
            <Button
              onClick={() => history.push(`/dealAbility/inquiryOffer/waitAddOffer/offer?id=${record.id}`)}
              type="link"
            >
              {intl.formatMessage({ id: 'dealAbility.baojia' })}
            </Button>
          )}
          {record.isShowQuote && record.isQuoted === 1 && (
            <Button
              type="link"
              onClick={() =>
                Modal.info({
                  content: intl.formatMessage({ id: 'dealAbility.dangqianxunjiadanshangpinyi' }),
                })
              }
            >
              {intl.formatMessage({ id: 'dealAbility.baojia' })}
            </Button>
          )}
          {record.isShowSecondInquiry === true && (
            <Button type="link" onClick={() => secondInquiry(record.id, record.inquiryListNo)}>
              {intl.formatMessage({ id: 'dealAbility.ercixunjia' })}
            </Button>
          )}
          {record.isShowSecondInquiry === false && (
            <Button
              type="link"
              onClick={() =>
                Modal.info({
                  content: intl.formatMessage({ id: 'dealAbility.dangqianxunjiadanshangpinzhong' }),
                })
              }
            >
              {intl.formatMessage({ id: 'dealAbility.ercixunjia' })}
            </Button>
          )}
        </>
      ),
    },
  ]

  useEffect(() => {
    if (isModalVisible) {
      form.setFieldsValue({ memberRoleId: role[0].memberRoleId })
    }
  }, [isModalVisible])

  const handleSubmit = () => {
    form.validateFields().then((res) => {
      handleFieldsAPI(res.memberRoleId, isId)
    })
  }

  return (
    <>
      <Table
        schema={INQUIRYSEARCHSCHEMA}
        columns={columns}
        effects="inquiryListNo"
        fetch={getTradeProductInquiryList}
        reload={reload}
        externalStatusFetch={getTradeQuotationtInquiryExternalStateEnum()}
      />
      {!isEmpty(role) && (
        <Modal
          title={intl.formatMessage({ id: 'dealAbility.xuanzehuiyuanjuese' })}
          visible={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => setVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item>
              {intl.formatMessage({ id: 'dealAbility.dangqianxunjiadan' })}
              <Typography.Text type="danger">{orderId}</Typography.Text>
              {intl.formatMessage({ id: 'dealAbility.ercixunjiashengchengdexun' })}：
              <Typography.Text type="danger">{memberRoleName}</Typography.Text>
              {intl.formatMessage({ id: 'dealAbility.jinhangzhakan' })}。
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'dealAbility.huiyuanjuese' })}
              tooltip={intl.formatMessage({ id: 'dealAbility.ercixunjiadehuiyuanjue' })}
              name="memberRoleId"
              rules={[{ required: true, message: intl.formatMessage({ id: 'dealAbility.qingxuanzehuiyuanjuese' }) }]}
            >
              <Select onChange={(_e, option: any) => setMemberRoleName(option.children)}>
                {role.map((_item, _i) => (
                  <Select.Option key={`role${_i}`} value={_item.memberRoleId}>
                    {_item.memberRoleName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  )
}

export default InquirySearch
