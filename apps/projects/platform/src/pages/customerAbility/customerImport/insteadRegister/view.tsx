import React, { useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card, Space, Button, message, Modal } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import {
  getMemberCustomerAbilityMaintenancePlatformPage,
  getMemberCustomerAbilitySubExcelExportTemplate,
  getMemberCustomerAbilitySubPage,
  getMemberCustomerAbilitySubPageitems,
  postMemberCustomerAbilitySubCommit,
  postMemberCustomerAbilitySubDelete,
  postMemberCustomerAbilitySubIntroduce,
} from '@apps/apis'
import type { GetMemberCustomerAbilitySubPageResponseDetail } from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import UploadModal, { DownloadFileResponseType, UploadModalRef } from '@/components/UploadModal'
import TableOperation from '@/components/TableOperation'
import useSpliceArray from '@/hooks/useSpliceArray'
import { importSchema } from '../schema'
import { MEMBER_OUTER_STATUS_TYPE } from '../../constant'
import MemberIntroduceDrewer, {
  MemberIntroduceDrawerSubmitValue,
  MemberIntroduceDrawerProps,
} from '../components/MemberIntroduceDrewer'
import MemberImportRolesModal from '../../components/MemberImportRolesModal'
import { useWebIntl } from '@apps/locales'

const formActions = createFormActions()

const CustomerImportIndex: React.FC<{}> = (props) => {
  const { pathname } = useLocation()

  const [visibleIntroduceDrewer, setVisibleIntroduceDrewer] = useState(false)
  const [visibleUploadModal, setVisibleUploadModal] = useState(false)
  const [visibleUploadMemberModal, setVisibleUploadMemberModal] = useState(false)

  const ref = useRef<any>({})
  const uploadModalRef = useRef<UploadModalRef | null>(null)
  const uploadRoleId = useRef(0)

  const translate = useWebIntl()
  const intl = useIntl()

  const handleDelete = (memberId: number, validateId: number) => {
    const mesInstance = message.loading({
      content: intl.formatMessage({
        id: 'member.management.import.query.delete-deleting',
      }),
      duration: 0,
    })
    postMemberCustomerAbilitySubDelete({
      memberId,
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reload()
      })
      .finally(() => {
        mesInstance()
      })
  }

  const handleCommit = (memberId: number, validateId: number) => {
    const mesInstance = message.loading({
      content: intl.formatMessage({
        id: 'member.management.import.query.commit-committing',
      }),
      duration: 0,
    })
    postMemberCustomerAbilitySubCommit({
      memberId,
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reload()
      })
      .finally(() => {
        mesInstance()
      })
  }

  const handleEdit = (record) => {
    history.push(`${pathname}/edit?id=${record.memberId}&validateId=${record.validateId}`)
  }

  const handleDel = (record) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'common.confirmDelete.title' }),
      icon: <ExclamationCircleOutlined />,
      okText: intl.formatMessage({ id: 'common.button.confirm' }),
      okType: 'danger',
      cancelText: intl.formatMessage({ id: 'common.button.cancel' }),
      onOk() {
        handleDelete(record.memberId, record.validateId)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const renderOptionButton = (record) => {
    // 按钮权限code和操作字符映射
    const btnAuthOfOperationTextMap = {
      [intl.formatMessage({ id: 'supplier.import.buttonGroup.1' })]: 'submit',
      [intl.formatMessage({ id: 'supplier.import.buttonGroup.2' })]: 'edit',
      [intl.formatMessage({ id: 'supplier.import.buttonGroup.3' })]: 'delete',
    }

    const buttonGroup = {
      [intl.formatMessage({ id: 'supplier.import.buttonGroup.1' })]: record.showCommit,
      [intl.formatMessage({ id: 'supplier.import.buttonGroup.2' })]: record.showUpdate,
      [intl.formatMessage({ id: 'supplier.import.buttonGroup.3' })]: record.showDelete,
    }

    const operationHandler = {
      [intl.formatMessage({ id: 'supplier.import.buttonGroup.1' })]: () =>
        handleCommit(record.memberId, record.validateId),
      [intl.formatMessage({ id: 'supplier.import.buttonGroup.2' })]: () => handleEdit(record),
      [intl.formatMessage({ id: 'supplier.import.buttonGroup.3' })]: () => handleDel(record),
    }

    return (
      <TableOperation
        buttonTextFieldMap={buttonGroup}
        operationHandler={operationHandler}
        buttonPermissionsMap={btnAuthOfOperationTextMap}
      />
    )
  }

  const defaultColumns: ColumnType<GetMemberCustomerAbilitySubPageResponseDetail>[] = [
    {
      title: 'ID',
      dataIndex: 'memberId',
    },
    {
      title: translate('web.resource.member.memberName'),
      dataIndex: 'name',
      render: (name, record) => (
        <>
          <EyeAuthButton
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
            class
            url={`${pathname}/detail?id=${record.memberId}&validateId=${record.validateId}`}
          >
            {name}
          </EyeAuthButton>
        </>
      ),
    },
    {
      title: translate('web.resource.member.memberRole'),
      dataIndex: 'roleName',
    },
    {
      title: translate('web.resource.member.zhucezhanghao'),
      dataIndex: 'account',
    },
    {
      title: translate('web.resource.member.zhuceyouxiang'),
      dataIndex: 'email',
    },
    {
      title: intl.formatMessage({
        id: 'supplier.profile.registerTime.sub',
        defaultMessage: '注册时间',
      }),
      dataIndex: 'registerTime',
      sorter: (a, b) => new Date(a.registerTime).getTime() - new Date(b.registerTime).getTime(),
    },
    {
      title: intl.formatMessage({
        id: 'member.management.import.query.outerStatusName',
      }),
      dataIndex: 'outerStatusName',
      render: (text, record) => <StatusTag type={MEMBER_OUTER_STATUS_TYPE[record.outerStatus]} title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      dataIndex: 'option',
      width: 160,
      render: (_, record) => renderOptionButton(record),
    },
  ]
  const [columns] = useSpliceArray<ColumnType<any>>(defaultColumns)

  const handleMenuClick = (e: any) => {
    console.log('menu', e)
  }

  const fetchListData = async (params: any) => {
    const { startDate = null, endDate = null } = params
    const payload = { ...params }

    if (startDate) {
      payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
    }
    if (endDate) {
      payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
    }
    const res = await getMemberCustomerAbilitySubPage(payload)

    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  // 初始化高级筛选选项
  const fetchSelectOptions = async () => {
    const res = await getMemberCustomerAbilitySubPageitems()

    if (res.code === 1000) {
      const { data = {} }: any = res
      const { outerStatus = [] } = data

      return {
        outerStatus: outerStatus.map((item) => ({
          label: item.text,
          value: item.id,
        })),
      }
    }
    return {}
  }

  const handleVisibleIntroduceDrewer = (flag?: boolean) => {
    setVisibleIntroduceDrewer(!!flag)
  }

  const fetchIntroduceMemberList: MemberIntroduceDrawerProps['fetchDataSource'] = async (params) => {
    const res = await getMemberCustomerAbilityMaintenancePlatformPage({
      ...(params as any),
      current: `${params.current}`,
      pageSize: `${params.pageSize}`,
    })
    return res.data
  }

  const handleIntroduceMember = (value: MemberIntroduceDrawerSubmitValue): Promise<void> => {
    return new Promise((resolve, reject) => {
      postMemberCustomerAbilitySubIntroduce({
        list: value.map((item) => ({
          memberType: item.memberType,
          roleId: item.roleId,
          memberId: item.memberId,
          level: item.level,
          countryCodeId: item.countryCodeId,
          phone: item.phone,
          email: item.email,
          upperRelationId: item.upperRelationId,
          detail: item.detail,
          areas: [],
        })),
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve()
            handleVisibleIntroduceDrewer(false)
            ref.current.reload()
          }
          reject()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const handleVisibleUploadModal = (flag?: boolean) => {
    setVisibleUploadModal(!!flag)
  }

  const handleVisibleMemberRolesModal = (flag?: boolean) => {
    setVisibleUploadMemberModal(!!flag)
  }

  const handleMemberRolesConfirm = (roleId: number) => {
    uploadRoleId.current = roleId
    handleVisibleMemberRolesModal(false)
    handleVisibleUploadModal(true)
  }

  const fetchDownloadFile = async () => {
    const ret = await getMemberCustomerAbilitySubExcelExportTemplate(
      {
        roleId: `${uploadRoleId.current}`,
      },
      {
        responseType: 'blob',
        getResponse: true,
      },
    )
    return ret as unknown as DownloadFileResponseType
  }

  const ControllerBtns = () => (
    <>
      <Space size="middle">
        <AddAuthButton>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => history.push(`${pathname}/add`)}>
            {intl.formatMessage({ id: 'member.xinjian' })}
          </Button>
        </AddAuthButton>
        <AuthButton type="custom" code="import">
          <Button onClick={() => handleVisibleMemberRolesModal(true)}>
            {intl.formatMessage({ id: 'supplier.management.import.upload', defaultMessage: '导入' })}
          </Button>
        </AuthButton>
      </Space>
    </>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'validateId',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              components={{
                MemberControllerBtns: ControllerBtns,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                useAsyncInitSelect(['memberType', 'roleId', 'outerStatus'], fetchSelectOptions)
              }}
              schema={importSchema}
            />
          }
        />
        <MemberIntroduceDrewer
          visible={visibleIntroduceDrewer}
          fetchDataSource={fetchIntroduceMemberList}
          onClose={() => handleVisibleIntroduceDrewer(false)}
          onSubmit={handleIntroduceMember}
        />
        {/* 会员导入 - 选择会员 */}
        <MemberImportRolesModal
          visible={visibleUploadMemberModal}
          onClose={() => handleVisibleMemberRolesModal(false)}
          onConfirm={handleMemberRolesConfirm}
        />
        {/* 会员导入 */}
        <UploadModal
          visible={visibleUploadModal}
          onClose={() => handleVisibleUploadModal(false)}
          fileTitle={intl.formatMessage({
            id: 'supplier.management.import.upload.fileTitle',
            defaultMessage: '客户资料',
          })}
          ref={uploadModalRef}
          fetchDownloadFile={fetchDownloadFile}
          modalName={intl.formatMessage({
            id: 'supplier.management.import.upload.modalName',
            defaultMessage: '客户导入',
          })}
          uploadProps={{
            action: '/api/member/ability/sub/excel/importMembers',
            data: {
              subRoleId: `${uploadRoleId.current}`,
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default CustomerImportIndex
