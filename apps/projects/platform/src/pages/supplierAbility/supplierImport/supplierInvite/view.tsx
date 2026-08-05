import React, { useRef, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Card, Button, Modal } from 'antd'
import StandardTable from '@/components/StandardTable'
import moment from 'moment'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { PageHeaderWrapper } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  getMemberSupplierInvitationSendPage,
  postMemberSupplierInvitationAdd,
  postMemberSupplierInvitationUpdate,
  postMemberSupplierInvitationSend,
  postMemberSupplierInvitationDelete,
  getMemberSupplierAbilitySubPageitemsRole,
  getMemberSupplierInvitationStateList,
  GetMemberSupplierInvitationSendPageResponseDetail,
} from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { maintainSchema } from './schema'
import styles from './index.less'
// import { PlusIcon } from '@linkseeks/icons'
import ModalForm from '@/components/ModalForm'
import { PATTERN_MAPS } from '@/constants/regExp'
import CustomCheckbox from '@/components/NiceForm/components/CustomRadio'
import TableOperation from '@/components/TableOperation'
import useSpliceArray from '@/hooks/useSpliceArray'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import StatusTag from '@/components/StatusTag'
import {
  MEMBER_INVITE_CODE_INVALID,
  MEMBER_INVITE_CODE_NO_REGISTER,
  MEMBER_INVITE_CODE_NO_SEND,
  MEMBER_INVITE_CODE_REGISTER,
} from '@/constants/member'
import { getEnv } from '@apps/utils'

const formActions = createFormActions()

type SearchFormValuesType = {
  name: string
  memberType: string
  roleId: number
  level: number
  source: number
  innerStatus: number
  outerStatus: number
  status: number
  startDate: string
  endDate: string
  memberConfigs: { [key: string]: any }
  code: string
  currencyType: number
  categoryId: [string]
}

const fetchData = async (params: any) => {
  const { startDate = null, endDate = null } = params
  const payload = { ...params }

  if (startDate) {
    payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
  }
  if (endDate) {
    payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
  }
  const res = await getMemberSupplierInvitationSendPage(payload, { ctlType: 'none' })

  if (res.code === 1000) {
    return res.data
  }
  return { data: [], totalCount: 0 }
}

//'success' | 'warning' | 'default' | 'danger' | 'primary' | 'nobility';
const CODE_STATE = {
  [MEMBER_INVITE_CODE_NO_SEND]: 'default',
  [MEMBER_INVITE_CODE_NO_REGISTER]: 'warning',
  [MEMBER_INVITE_CODE_REGISTER]: 'success',
  [MEMBER_INVITE_CODE_INVALID]: 'default',
}

const schemaActions = createFormActions()

const MemberMaintain: React.FC<[]> = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const currentRef = useRef<any>({})
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [operateType, setOperateType] = useState<'add' | 'edit'>('add')
  const sendState = useRef<any>(true)
  const REGISTER_URL = `${getEnv('MEMBER_URL')}/user/register`

  const OPERATE_API_MAP = {
    add: postMemberSupplierInvitationAdd,
    edit: postMemberSupplierInvitationUpdate,
  }

  const sendInviteCode = async (info) => {
    if (sendState.current) {
      sendState.current = false
      const emailMsg = `${REGISTER_URL}?invitationCode=${info.invitationCode}`
      try {
        const res = await postMemberSupplierInvitationSend({ id: info.id, emailMsg })
        sendState.current = true
        if (res.code === 1000) {
          ref.current.reload()
        }
      } catch (error) {
        sendState.current = true
      }
    }
  }

  const countInviteDays = (endTime: string) => {
    const nowTime = new Date().getTime()

    const lefttime = new Date(endTime).getTime() - nowTime // 距离结束时间的毫秒数
    if (lefttime > 0) {
      const leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)) + 1 // 计算天数
      if (leftd >= 30) {
        return 30
      } else if (leftd >= 7) {
        return 7
      } else {
        return 3
      }
    }
  }

  const handleEdit = (info) => {
    setOperateType('edit')
    schemaActions.clearErrors()
    schemaActions.reset()
    if (info) {
      Object.keys(info).forEach((key) => {
        if (key !== 'invitationValidityTime') {
          schemaActions.setFieldValue(key, info[key])
        } else {
          schemaActions.setFieldValue(key, countInviteDays(info.invitationValidityTime))
        }
      })
    }
    currentRef.current.setVisible(true)
  }

  const handleDel = (id) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'common.confirmDelete.title' }),
      icon: <ExclamationCircleOutlined />,
      okText: intl.formatMessage({ id: 'common.button.confirm' }),
      okType: 'danger',
      cancelText: intl.formatMessage({ id: 'common.button.cancel' }),
      onOk: async () => {
        const res = await postMemberSupplierInvitationDelete({ id })
        if (res.code === 1000) {
          ref.current.reload()
        }
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const renderOptionButton = (record) => {
    // 按钮权限code和操作字符映射
    const btnAuthOfOperationTextMap = {
      [intl.formatMessage({ id: 'supplier.invite.buttonGroup.1' })]: 'send',
      [intl.formatMessage({ id: 'supplier.invite.buttonGroup.2' })]: 'edit',
      [intl.formatMessage({ id: 'supplier.invite.buttonGroup.3' })]: 'delete',
    }

    const buttonGroup = {
      [intl.formatMessage({ id: 'supplier.invite.buttonGroup.1' })]: record.sendInvitationCode,
      [intl.formatMessage({ id: 'supplier.invite.buttonGroup.2' })]: record.update,
      [intl.formatMessage({ id: 'supplier.invite.buttonGroup.3' })]: record.delete,
    }

    const operationHandler = {
      [intl.formatMessage({ id: 'supplier.invite.buttonGroup.1' })]: () => sendInviteCode(record),
      [intl.formatMessage({ id: 'supplier.invite.buttonGroup.2' })]: () => handleEdit(record),
      [intl.formatMessage({ id: 'supplier.invite.buttonGroup.3' })]: () => handleDel(record.id),
    }

    return (
      <TableOperation
        buttonTextFieldMap={buttonGroup}
        operationHandler={operationHandler}
        buttonPermissionsMap={btnAuthOfOperationTextMap}
      />
    )
  }

  const defaultColumns: ColumnType<GetMemberSupplierInvitationSendPageResponseDetail>[] = [
    {
      title: intl.formatMessage({
        id: 'supplier.management.maintain.query.invitationCode',
        defaultMessage: '邀请码',
      }),
      dataIndex: 'invitationCode',
    },
    {
      title: intl.formatMessage({
        id: 'supplier.management.maintain.query.supplierName',
      }),
      dataIndex: 'memberName',
    },
    {
      title: intl.formatMessage({
        id: 'supplier.management.maintain.query.supplierRole',
      }),
      dataIndex: 'roleName',
    },
    {
      title: intl.formatMessage({
        id: 'supplier.management.maintain.query.sendEmail',
        defaultMessage: '发送邮箱',
      }),
      dataIndex: 'email',
    },
    {
      title: intl.formatMessage({
        id: 'supplier.management.maintain.query.account',
        defaultMessage: '注册账号',
      }),
      dataIndex: 'registerAccount',
    },
    {
      title: intl.formatMessage({
        id: 'supplier.management.maintain.query.inviteValidityTime',
        defaultMessage: '邀请码有效期',
      }),
      dataIndex: 'invitationValidityTime',
      render: (invitationValidityTime) => (
        <>
          <div className={styles.description}>{invitationValidityTime}</div>
        </>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'supplier.management.maintain.query.inviteTime',
        defaultMessage: '邀请时间',
      }),
      dataIndex: 'invitationTime',
      render: (invitationTime) => (
        <>
          <div className={styles.description}>{invitationTime}</div>
        </>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'supplier.management.maintain.query.invitationCodeStateName',
        defaultMessage: '邀请码状态',
      }),
      dataIndex: 'invitationCodeStateName',
      render: (text, record) => <StatusTag type={CODE_STATE[record.invitationCodeState]} title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      dataIndex: 'option',
      width: 150,
      render: (text, record) => renderOptionButton(record),
    },
  ]

  const [columns] = useSpliceArray<ColumnType<any>>(defaultColumns)

  // 初始化高级筛选选项
  const fetchSelectOptions = async () => {
    const res = await getMemberSupplierInvitationStateList()
    const roleRes = await getMemberSupplierAbilitySubPageitemsRole()

    if (res.code === 1000) {
      const { data } = res
      const stateList = data || []

      return {
        invitationCodeState: stateList?.map((item) => ({ label: item.message, value: item.code })),
      }
    }
    return {}
  }

  const handleReloadList = (values: SearchFormValuesType) => {
    ref.current.reload(values)
  }

  const ControllerBtn = () => (
    <AddAuthButton>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ width: 80 }}
        onClick={() => {
          setOperateType('add')
          schemaActions.clearErrors()
          schemaActions.reset()
          currentRef.current.setVisible(true)
        }}
      >
        {intl.formatMessage({ id: 'member.xinjian' })}
      </Button>
    </AddAuthButton>
  )

  const handleConfirm = () => {
    schemaActions.submit()
  }

  const handleSubmit = async (values) => {
    try {
      values.invitationValidityTime = moment()
        .add(Number(values.invitationValidityTime), 'days')
        .format('YYYY-MM-DD HH:mm:ss')
      setConfirmLoading(true)
      const res = await OPERATE_API_MAP[operateType](values)
      setConfirmLoading(false)
      if (res.code === 1000) {
        currentRef.current.setVisible(false)
        ref.current.reload()
      }
    } catch (error) {
      setConfirmLoading(false)
    }
  }

  /**
   * 获取供应商角色
   * @returns roleId
   */
  const getSeleteDataRoles = async () => {
    const res = await getMemberSupplierAbilitySubPageitemsRole()

    if (res.code === 1000) {
      const roleList = res?.data || []
      return {
        roleId: roleList.map((item) => ({
          label: item.roleName,
          value: item.roleId,
          memberType: item.memberType,
        })),
      }
    }
    return {
      roleId: [],
    }
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            scroll: {
              x: 1000,
            },
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={handleReloadList}
              components={{
                ControllerBtn,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'invitationCodeState', FORM_FILTER_PATH)
                useAsyncInitSelect(['invitationCodeState'], fetchSelectOptions)
              }}
              schema={maintainSchema}
            />
          }
        />
        <ModalForm
          modalTitle={
            operateType === 'edit'
              ? intl.formatMessage({ id: 'supplier.import.invite.modal.edit.title', defaultMessage: '编辑供应商邀请' })
              : intl.formatMessage({ id: 'supplier.import.invite.modal.add.title', defaultMessage: '新增供应商邀请' })
          }
          previewPlaceholder=""
          currentRef={currentRef}
          width={600}
          components={{
            CustomCheckbox,
          }}
          schema={{
            type: 'object',
            properties: {
              NO_SUBMIT: {
                type: 'object',
                'x-component': 'mega-layout',
                'x-component-props': {
                  labelAlign: 'top',
                },
                properties: {
                  id: {
                    type: 'string',
                    visible: false,
                  },
                  roleId: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'supplier.import.invite.supplierRole',
                      defaultMessage: '供应商角色',
                    }),
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'supplier.import.invite.supplierRole.required',
                          defaultMessage: '请选择供应商角色',
                        }),
                      },
                    ],
                    enum: [],
                  },
                  memberName: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'supplier.import.invite.supplierName',
                      defaultMessage: '供应商名称',
                    }),
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'supplier.import.invite.supplierName.required',
                          defaultMessage: '请输入供应商名称',
                        }),
                      },
                      {
                        max: 40,
                        message: intl.formatMessage({
                          id: 'supplier.import.invite.supplierName.max',
                          defaultMessage: '最长40个字符或汉字',
                        }),
                      },
                    ],
                  },
                  email: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'supplier.import.invite.supplierEmail',
                      defaultMessage: '发送邮箱',
                    }),
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'supplier.import.invite.supplierEmail.required',
                          defaultMessage: '请输入发送邮箱',
                        }),
                      },
                      {
                        pattern: PATTERN_MAPS.email,
                        message: intl.formatMessage({ id: 'authConfig.correntEmail' }),
                      },
                    ],
                  },
                  invitationValidityTime: {
                    type: 'radio',
                    title: intl.formatMessage({
                      id: 'supplier.import.invite.inviteDate',
                      defaultMessage: '邀请码有效期',
                    }),
                    'x-component-props': {
                      className: styles['inite-radio-group'],
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'supplier.import.invite.inviteDate.required',
                          defaultMessage: '请选择邀请码有效期',
                        }),
                      },
                    ],
                    enum: [
                      {
                        label: intl.formatMessage({
                          id: 'supplier.import.invite.inviteDate.days.3',
                          defaultMessage: '3天',
                        }),
                        value: 3,
                      },
                      {
                        label: intl.formatMessage({
                          id: 'supplier.import.invite.inviteDate.days.7',
                          defaultMessage: '7天',
                        }),
                        value: 7,
                      },
                      {
                        label: intl.formatMessage({
                          id: 'supplier.import.invite.inviteDate.days.30',
                          defaultMessage: '30天',
                        }),
                        value: 30,
                      },
                    ],
                  },
                },
              },
            },
          }}
          actions={schemaActions}
          onSubmit={handleSubmit}
          confirm={handleConfirm}
          modalProps={{
            confirmLoading,
            centered: true,
          }}
          effects={($, actions) => {
            $('onFormInit').subscribe(async () => {})
            useAsyncInitSelect(['roleId'], getSeleteDataRoles)
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MemberMaintain
