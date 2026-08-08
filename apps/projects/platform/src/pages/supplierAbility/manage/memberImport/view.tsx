import React, { useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card, Space, Button, Menu, Popconfirm, message } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import {
  getMemberSupplierAbilityMaintenancePlatformPage,
  getMemberSupplierAbilitySubExcelExportTemplate,
  getMemberSupplierAbilitySubPage,
  getMemberSupplierAbilitySubPageitems,
  postMemberSupplierAbilitySubCommit,
  postMemberSupplierAbilitySubDelete,
  postMemberSupplierAbilitySubIntroduce,
} from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import UploadModal, { DownloadFileResponseType, UploadModalRef } from '@/components/UploadModal'
import { importSchema } from './schema'
import { MEMBER_OUTER_STATUS_TYPE } from '../../constant'
import MemberIntroduceDrewer, {
  MemberIntroduceDrawerSubmitValue,
  MemberIntroduceDrawerProps,
} from './components/MemberIntroduceDrewer'
import MemberImportRolesModal from '../../components/MemberImportRolesModal'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'
import { encryptedByAES } from '@linkseeks/crypto'

const formActions = createFormActions()

const fetchListData = async (params: any) => {
  const { startDate = null, endDate = null } = params
  const payload = { ...params }

  if (startDate) {
    payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
  }
  if (endDate) {
    payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
  }
  const res = await getMemberSupplierAbilitySubPage(payload)

  if (res.code === 1000) {
    return res.data
  }
  return { data: [], totalCount: 0 }
}

const MemberMaintain: React.FC<[]> = () => {
  const ref = useRef<any>({})
  const { pathname } = useLocation()
  const [visibleIntroduceDrewer, setVisibleIntroduceDrewer] = useState(false)
  const [visibleUploadModal, setVisibleUploadModal] = useState(false)
  const [visibleUploadMemberModal, setVisibleUploadMemberModal] = useState(false)

  const uploadModalRef = useRef<UploadModalRef | null>(null)
  const uploadRoleId = useRef(0)

  const intl = useIntl()

  const translate = useWebIntl()
  const handleDelete = (memberId: number, validateId: number) => {
    const mesInstance = message.loading({
      content: intl.formatMessage({
        id: 'member.management.import.query.delete-deleting',
      }),
      duration: 0,
    })
    postMemberSupplierAbilitySubDelete({
      memberId,
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reloadCurrent()
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
    postMemberSupplierAbilitySubCommit({
      memberId,
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reloadCurrent()
      })
      .finally(() => {
        mesInstance()
      })
  }

  const defaultColumns: ColumnType<any>[] = [
    {
      title: `${intl.formatMessage({
        id: 'supplier.management.import.query.supplierId',
      })}/${intl.formatMessage({
        id: 'supplier.management.import.query.supplierName',
      })}`,
      dataIndex: 'memberId',
      render: (text, record) => (
        <>
          <div>{text}</div>
          <EyeAuthButton
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
            url={`/supplierAbility/manage/memberImport/detail?id=${record.memberId}&validateId=${record.validateId}`}
          >
            {record.name}
          </EyeAuthButton>
        </>
      ),
    },
    // {
    //   title: intl.formatMessage({ id: 'member.management.import.query.memberTypeName' }),
    //   dataIndex: 'memberTypeName',
    //   render: (text: any, record: any) => <>{text}</>,
    // },
    // {
    //   title: intl.formatMessage({ id: 'member.management.import.query.roleName' }),
    //   dataIndex: 'roleName',
    //   render: (text: any, record: any) => <>{text}</>,
    // },
    {
      title: intl.formatMessage({
        id: 'member.management.import.query.sourceName',
      }),
      dataIndex: 'sourceName',
    },
    {
      title: intl.formatMessage({
        id: 'member.management.import.query.registerTime',
      }),
      dataIndex: 'registerTime',
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
      width: '20%',
      render: (text: any, record: any) => (
        <>
          {/* 外部审核状态等于 待提交 可进行提交操作 */}
          {record.showCommit && (
            <>
              <AuthButton type="custom" code="commit">
                <Button type="link" onClick={() => handleCommit(record.memberId, record.validateId)}>
                  {intl.formatMessage({
                    id: 'member.management.import.query.commit',
                  })}
                </Button>
              </AuthButton>
            </>
          )}
          {/* 外部审核状态等于 待提交 或者 审核失败 可进行编辑操作 */}
          {record.showUpdate && (
            <>
              <EditAuthButton>
                <Button
                  type="link"
                  onClick={() =>
                    history.push(
                      `/supplierAbility/manage/memberImport/edit?id=${record.memberId}&validateId=${record.validateId}`,
                    )
                  }
                >
                  {intl.formatMessage({
                    id: 'member.management.import.query.edit',
                  })}
                </Button>
              </EditAuthButton>
            </>
          )}
          {/* 外部审核状态不等于 审核通过 可进行删除操作 */}
          {record.showDelete && (
            <AuthButton type="custom" code="delete">
              <Popconfirm
                title={intl.formatMessage({
                  id: 'member.management.import.query.delete-description',
                })}
                okText={intl.formatMessage({ id: 'common.button.yes' })}
                cancelText={intl.formatMessage({ id: 'common.button.no' })}
                onConfirm={() => handleDelete(record.memberId, record.validateId)}
              >
                <Button type="link" danger>
                  {intl.formatMessage({
                    id: 'member.management.import.query.delete',
                  })}
                </Button>
              </Popconfirm>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  const menu = (
    <Menu onClick={(e) => handleMenuClick(e)}>
      <Menu.Item key="1" icon={<DeleteOutlined />}>
        {translate('web.resource.member.shanchudaorupici')}
      </Menu.Item>
    </Menu>
  )

  const [columns, setColumns] = useState<any[]>(defaultColumns)

  const handleMenuClick = (e: any) => {
    console.log('menu', e)
  }

  // 初始化高级筛选选项
  const fetchSelectOptions = async () => {
    const res = await getMemberSupplierAbilitySubPageitems()

    if (res.code === 1000) {
      const { data = {} }: any = res
      const { outerStatus = [], memberTypes = [], memberRoles = [], status = [] } = data

      return {
        outerStatus: outerStatus.map((item) => ({
          label: item.text,
          value: item.id,
        })),
        memberType: memberTypes.map((item) => ({
          label: item.memberTypeName,
          value: item.memberType,
        })),
        roleId: memberRoles.map((item) => ({
          label: item.roleName,
          value: item.roleId,
        })),
      }
    }
    return {}
  }

  const handleVisibleIntroduceDrewer = (flag?: boolean) => {
    setVisibleIntroduceDrewer(!!flag)
  }

  const fetchIntroduceMemberList: MemberIntroduceDrawerProps['fetchDataSource'] = async (params) => {
    const res = await getMemberSupplierAbilityMaintenancePlatformPage({
      ...(params as any),
      current: `${params.current}`,
      pageSize: `${params.pageSize}`,
    })
    return res.data
  }

  const handleIntroduceMember = (value: MemberIntroduceDrawerSubmitValue): Promise<void> => {
    return new Promise((resolve, reject) => {
      postMemberSupplierAbilitySubIntroduce({
        list: value.map((item) => ({
          memberType: item.memberType as any,
          roleId: item.roleId,
          memberId: item.memberId,
          level: item.level,
          countryCodeId: item.countryCodeId,
          phone: encryptedByAES(item.phone),
          email: encryptedByAES(item.email, false),
          upperRelationId: item.upperRelationId,
          detail: item.detail,
          telCode: item.telCode,
          areas: [],
        })),
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve()
            handleVisibleIntroduceDrewer(false)
            ref.current.reloadCurrent()
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
    const ret = await getMemberSupplierAbilitySubExcelExportTemplate(
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
      {/* {(userInfo && userInfo.memberRoleType === MEMBER_ROLE_TYPE_SERVICE_PROVIDER) && (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() =>
              history.push(`/supplierAbility/manage/memberImport/add`)
            }
          >
            <PlusOutlined />
            新建
          </Button>
          <Button onClick={() => setVisibleModal(true)}>导入</Button>
          <Dropdown.Button
            overlay={menu}
            trigger={['click']}
            icon={<DownOutlined />}
          >
            更多
          </Dropdown.Button>
        </Space>
      )} */}
      <Space size="middle">
        <AddAuthButton>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => history.push(`/supplierAbility/manage/memberImport/add`)}
          >
            {intl.formatMessage({ id: 'member.xinjian' })}
          </Button>
        </AddAuthButton>
        <AuthButton type="custom" code="import">
          <Button onClick={() => handleVisibleMemberRolesModal(true)}>
            {intl.formatMessage({ id: 'supplier.management.import.upload', defaultMessage: '导入' })}
          </Button>
        </AuthButton>
        {/* <Dropdown.Button
          overlay={menu}
          trigger={['click']}
          icon={<DownOutlined />}
        >
          更多
        </Dropdown.Button> */}
        <AuthButton type="custom" code="introduce">
          <Button onClick={() => handleVisibleIntroduceDrewer(true)}>
            {intl.formatMessage({
              id: 'supplier.management.import.query.introduceDrewer.title',
              defaultMessage: '供应商引入',
            })}
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
            defaultMessage: '供应商资料',
          })}
          ref={uploadModalRef}
          fetchDownloadFile={fetchDownloadFile}
          modalName={intl.formatMessage({
            id: 'supplier.management.import.upload.modalName',
            defaultMessage: '供应商导入',
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

export default MemberMaintain
