/** 分销员查询 */
import React, { Fragment, useState, useRef, useMemo, useEffect } from 'react'
import { Button, message, Popconfirm, Tag } from 'antd'
import StatusTag from '@/components/StatusTag'
import {
  EyeAuthButton,
  AuthButton,
  PageHeaderWrapper,
  StandardFormTable,
  StatusAuthButton,
  ImageBox,
} from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import {
  getMarketingPlatformCbgTeamLeaderPage,
  postMarketingPlatformCbgTeamLeaderAdd,
  postMarketingPlatformCbgTeamLeaderStatus,
  PostMarketingPlatformCbgTeamLeaderStatusResponse,
} from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'
import moment from 'moment'
import { ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Form, Input, Radio, Modal, Space } from '@linkseeks/ui'
import { Link } from '@linkseeks/router-core'
import AddressSelect from '@/components/AddressSelect/components/AreaSelectFormilyItem'
import { createFormActions, FormButtonGroup, Submit } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'

const { TextArea } = Input
type dateInfoProps = {
  /** id */
  id: number
  /** 标题 */
  title: string
  /** 接口 */
  fieldApi: any
}

const LinkData = [
  { key: '', label: '全部' },
  { key: '1', label: '待审核' },
  { key: '2', label: '审核通过' },
  { key: '3', label: '审核不通过' },
  { key: '4', label: '已禁用' },
]

const CbgTeamLeader: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()
  const [tabLink, setTabLink] = useState<any[]>(LinkData)
  const [activeKey, setActiveKey] = useState<string>('')
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [addTeamLeaderData, setAddTeamLeaderData] = useState<any>({})
  const addressSchemaAction = createFormActions()
  const [formKey, setFormKey] = useState(Date.now())

  const handleStatus = async (record: any) => {
    await postMarketingPlatformCbgTeamLeaderStatus({
      id: record.id,
      isBan: record.status === 2 ? 1 : 0,
    })
    ref.current.reload()
  }

  const useFields = (): any =>
    useMemo(
      () => ({
        AddressSelect,
      }),
      [],
    )

  const onTabChange = (key) => {
    setActiveKey(key)
    ref.current.reload()
  }

  useEffect(() => {
    if (visibleModal) {
      setFormKey(Date.now())
    }
  }, [visibleModal])

  const handleAddSubmit = (value) => {
    const postData = {
      name: value.name,
      phone: value.phone,
      homeProvince: value.homeSelect[0].name,
      homeProvinceCode: value.homeSelect[0].code,
      homeCity: value.homeSelect[1].name,
      homeCityCode: value.homeSelect[1].code,
      homeArea: value.homeSelect[2].name,
      homeAreaCode: value.homeSelect[2].code,
      homeStreet: value.homeSelect[3].name,
      homeStreetCode: value.homeSelect[3].code,
      homeAddress: value.homeAddress,
      pickupPointName: value.pickupPointName,
      pickupPointProvince: value.pickupPointSelect[0].name,
      pickupPointProvinceCode: value.pickupPointSelect[0].code,
      pickupPointCity: value.pickupPointSelect[1].name,
      pickupPointCityCode: value.pickupPointSelect[1].code,
      pickupPointArea: value.pickupPointSelect[2].name,
      pickupPointAreaCode: value.pickupPointSelect[2].code,
      pickupPointStreet: value.pickupPointSelect[3].name,
      pickupPointStreetCode: value.pickupPointSelect[3].code,
      pickupPointAddress: value.pickupPointAddress,
      idPhoto: value.idPhoto,
      idPhotoBack: value.idPhotoBack,
    }
    postMarketingPlatformCbgTeamLeaderAdd(postData).then((res) => {
      if (res.code === 1000) {
        setVisibleModal(false)
        ref.current.reload()
      }
    })
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '会员ID',
      key: 'memberId',
      dataIndex: 'memberId',
      fixed: 'left',
      width: 60,
      searchField: 'Input',
    },
    {
      title: '团长名称',
      key: 'name',
      dataIndex: 'name',
      searchField: {
        main: true,
      },
      render: (_text, record) => (
        <>{<Link to={`/marketingManage/communityGroupBuying/teamLeader/detail?id=${record.id}`}>{record.name}</Link>}</>
      ),
    },
    {
      title: '团长手机号',
      key: 'phone',
      dataIndex: 'phone',
      searchField: 'Input',
    },
    {
      title: '自提点信息',
      key: 'pickupPointName',
      dataIndex: 'pickupPointName',
      render: (_text, record) => (
        <>
          {record.pickupPointName +
            ' ' +
            record.phone +
            ' ' +
            record.pickupPointProvince +
            record.pickupPointCity +
            record.pickupPointArea +
            record.pickupPointStreet +
            record.pickupPointAddress}
        </>
      ),
    },
    {
      title: '服务订单数',
      key: 'orderCount',
      dataIndex: 'orderCount',
      render: (_text, record) => <>{record.orderCount}</>,
    },
    {
      title: '服务订单金额',
      key: 'orderAmount',
      dataIndex: 'orderAmount',
      render: (_text, record) => <>{record.orderAmount}</>,
    },
    {
      title: '预估总佣金',
      key: 'estimatedCommission',
      dataIndex: 'estimatedCommission',
      render: (_text, record) => <>{record.estimatedCommission}</>,
    },
    {
      title: '已入账佣金',
      key: 'commissionCredited',
      dataIndex: 'commissionCredited',
      render: (_text, record) => <>{record.commissionCredited}</>,
    },
    {
      title: '未入账佣金',
      key: 'commissionUncredited',
      dataIndex: 'commissionUncredited',
      render: (_text, record) => <>{record.commissionUncredited}</>,
    },
    {
      title: '加入时间',
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '团长状态',
      key: 'status',
      dataIndex: 'status',
      render: (text: any) => {
        if (text === 1) return '待审核'
        else if (text === 2) return '审核通过'
        else if (text === 3) return '审核不通过'
        else if (text === 4) return '已禁用'
      },
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      fixed: 'right',
      render: (_text, record) => (
        <Space>
          {record.status === 2 || record.status === 4 ? (
            <AuthButton type="custom" code="status">
              <Popconfirm
                title={record.status === 2 ? '确定要禁用吗？' : '确定要启用吗？'}
                okText="是"
                cancelText="否"
                onConfirm={() => handleStatus(record)}
              >
                <a>{record.status === 2 ? '禁用' : '启用'}</a>
              </Popconfirm>
            </AuthButton>
          ) : record.status === 1 ? (
            <Link to={`/marketingManage/communityGroupBuying/teamLeader/detail?id=${record.id}`}>审核</Link>
          ) : (
            ''
          )}
        </Space>
      ),
    },
  ]

  const fetchData = async (params: any) => {
    const { ...arg } = params
    const payload = { ...arg }

    console.log('payload', payload)
    console.log('activeKey', activeKey)

    return new Promise((resolve) => {
      getMarketingPlatformCbgTeamLeaderPage({ ...payload, status: activeKey }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  return (
    <PageHeaderWrapper isTabs items={tabLink} onTabChange={(key) => onTabChange(key)}>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        searchSelectMaps={selectData}
        searchButtons={[
          {
            children: '新增团长',
            type: 'primary',
            onClick() {
              setVisibleModal(true)
            },
            key: 'add',
          },
        ]}
      />

      <Modal title="添加团长" visible={visibleModal} width={800} footer={null} closable={false}>
        <Space direction="vertical" size="middle">
          <Tag icon={<ExclamationCircleOutlined />} color="warning" style={{ width: '100%' }}>
            <p>请准确输入用户手机号，若用户已注册商城账号，点击确定后用户将获得团长身份。</p>
            <p>若用户未注册账号，则系统自动创建商城账号并发放团长身份。</p>
          </Tag>
          <NiceForm
            key={formKey}
            fields={useFields()}
            actions={addressSchemaAction}
            onSubmit={handleAddSubmit}
            initialValues={addTeamLeaderData}
            effects={($, actions) => {
              console.log(actions)
            }}
            schema={{
              type: 'object',
              properties: {
                NO_SUBMIT_LAYOUT_ADDRESS: {
                  type: 'object',
                  'x-component': 'mega-layout',
                  'x-component-props': {
                    labelCol: 4,
                    wrapperCol: 20,
                    labelAlign: 'left',
                  },
                  properties: {
                    phone: {
                      type: 'string',
                      title: '手机号',
                      'x-rules': [
                        {
                          required: true,
                          message: '手机号必填',
                        },
                      ],
                    },
                    name: {
                      type: 'string',
                      title: '团长名称',
                      'x-rules': [
                        {
                          required: true,
                          message: '团长名称必填',
                        },
                      ],
                    },
                    homeSelect: {
                      type: 'string',
                      title: '家庭地址',
                      'x-rules': [
                        {
                          required: true,
                          message: '请选择省/市/区',
                        },
                      ],
                      'x-component': 'AddressSelect',
                    },
                    homeAddress: {
                      type: 'string',
                      'x-component': 'textarea',
                      'x-component-props': {
                        rows: 3,
                        placeholder: '请补充详细地址，具体到门牌号',
                      },
                      title: '详细地址',
                      'x-rules': [
                        {
                          required: true,
                          message: '请填写家庭详细地址',
                        },
                      ],
                    },
                    pickupPointName: {
                      type: 'string',
                      title: '自提点名称',
                      'x-rules': [
                        {
                          required: true,
                          message: '自提点名称必填',
                        },
                      ],
                    },
                    pickupPointSelect: {
                      type: 'string',
                      title: '自提点地址',
                      'x-rules': [
                        {
                          required: true,
                          message: '请选择省/市/区',
                        },
                      ],
                      'x-component': 'AddressSelect',
                    },
                    pickupPointAddress: {
                      type: 'string',
                      'x-component': 'textarea',
                      'x-component-props': {
                        rows: 3,
                        placeholder: '请补充详细地址，具体到门牌号',
                      },
                      title: '详细地址',
                      'x-rules': [
                        {
                          required: true,
                          message: '请填写自提点详细地址',
                        },
                      ],
                    },
                    idPhoto: {
                      type: 'object',
                      title: '身份证正面',
                      name: 'imageUrl',
                      'x-component': 'CustomUpload',
                      'x-component-props': {
                        size: '386X256',
                        fileMaxSize: 300,
                      },
                    },
                    idPhotoBack: {
                      type: 'object',
                      title: '身份证反面',
                      name: 'imageUrl',
                      'x-component': 'CustomUpload',
                      'x-component-props': {
                        size: '386X256',
                        fileMaxSize: 300,
                      },
                    },
                  },
                },
              },
            }}
          >
            <FormButtonGroup offset={4}>
              <Button onClick={() => setVisibleModal(false)}>取消</Button>
              <Submit>确认提交</Submit>
            </FormButtonGroup>
          </NiceForm>
        </Space>
      </Modal>
    </PageHeaderWrapper>
  )
}
export default CbgTeamLeader
