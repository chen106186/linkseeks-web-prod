import React, { useRef, useState } from 'react'
import { Link, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card, Button, Badge, Cascader } from 'antd'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { PageHeaderWrapper } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { useCustomerCategoriesBusinessEffects } from '@/formSchema/effects/useCustomerCategoriesBusinessEffects'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  postMemberCustomerAbilityMaintenancePage,
  getMemberCustomerAbilityMaintenancePageitems,
  PostMemberCustomerAbilityMaintenancePageResponseDetail,
  getMemberCustomerAbilitySubExcelExportTemplate,
  getMemberCustomerAbilitySubPageitemsRole,
} from '@apps/apis'
import useSpliceArray from '@/hooks/useSpliceArray'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import MemberRegisterAreaField from '@/components/MemberRegisterAreaField'
import UploadModal, { DownloadFileResponseType, UploadModalRef } from '@/components/UploadModal'
import { maintainSchema } from './schema'
import { MEMBER_INNER_STATUS_BADGE_COLOR, MEMBER_OUTER_STATUS_TYPE } from '../../constant'
import MemberImportRolesModal from '../../components/MemberImportRolesModal'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

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

const CustomerDepositQuery: React.FC<{}> = (props) => {
  const { pathname } = useLocation()

  const [visibleUploadModal, setVisibleUploadModal] = useState(false)
  const [visibleUploadMemberModal, setVisibleUploadMemberModal] = useState(false)

  const ref = useRef<any>({})
  const uploadModalRef = useRef<UploadModalRef | null>(null)
  const uploadRoleId = useRef(0)

  const intl = useIntl()
  const translate = useWebIntl()
  const defaultColumns: ColumnType<PostMemberCustomerAbilityMaintenancePageResponseDetail>[] = [
    {
      title: intl.formatMessage({
        id: 'customerAbility.management.maintain.query.memberId',
      }),
      dataIndex: 'memberId',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.management.maintain.query.memberName',
      }),
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
      title: intl.formatMessage({
        id: 'customerAbility.management.maintain.query.roleName',
      }),
      dataIndex: 'roleName',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.management.maintain.query.registerTime',
      }),
      dataIndex: 'registerTime',
      sorter: (a, b) => new Date(a.registerTime).getTime() - new Date(b.registerTime).getTime(),
      render: (registerTime) => (
        <>
          <div className={styles.description}>{registerTime}</div>
        </>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.memberQuery.query.defaultColumns.depositTime',
      }),
      dataIndex: 'depositTime',
      sorter: (a, b) => new Date(a.depositTime).getTime() - new Date(b.depositTime).getTime(),
    },
    {
      title: translate('web.resource.member.kehubianma'),
      dataIndex: 'memberCode',
    },
    {
      title: intl.formatMessage({
        id: 'member.management.maintain.query.outerStatusName',
      }),
      dataIndex: 'outerStatusName',
      render: (text, record) => <StatusTag type={MEMBER_OUTER_STATUS_TYPE[record.outerStatus]} title={text} />,
    },
    {
      title: intl.formatMessage({
        id: 'member.management.maintain.query.innerStatusName',
      }),
      dataIndex: 'innerStatusName',
      render: (text, record) => (
        <Badge color={MEMBER_INNER_STATUS_BADGE_COLOR[record.innerStatus] || '#606266'} text={text} />
      ),
    },
  ]

  const [columns, columnsHandle] = useSpliceArray<ColumnType<any>>(defaultColumns)

  const fetchListData = async (params: any) => {
    const { startDate = null, endDate = null } = params
    const payload = { ...params }

    if (startDate) {
      payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
    }
    if (endDate) {
      payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
    }
    const res = await postMemberCustomerAbilityMaintenancePage(payload, { ctlType: 'none' })

    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  // 初始化高级筛选选项
  const fetchSelectOptions = async () => {
    const res = await getMemberCustomerAbilityMaintenancePageitems()

    if (res.code === 1000) {
      const { data } = res
      const { innerStatus, outerStatus } = data || {}

      return {
        innerStatus: innerStatus?.map((item) => ({ label: item.text, value: item.id })),
        outerStatus: outerStatus?.map((item) => ({ label: item.text, value: item.id })),
      }
    }
    return {}
  }

  const handleReloadList = (values: SearchFormValuesType) => {
    ref.current.reload(values)
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

  const ImportBtn = () => (
    <AuthButton type="custom" code="import">
      <Button type="primary" style={{ width: 80 }} onClick={() => handleVisibleMemberRolesModal(true)}>
        {intl.formatMessage({ id: 'customerAbility.management.import.upload', defaultMessage: '导入' })}
      </Button>
    </AuthButton>
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
              components={{
                MemberRegisterAreaField,
                Cascader,
                ImportBtn,
              }}
              onSubmit={handleReloadList}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                useAsyncInitSelect(['innerStatus', 'outerStatus'], fetchSelectOptions)

                // 初始化品类数据
                useCustomerCategoriesBusinessEffects($, actions, {
                  fieldName: 'categoryId',
                })
              }}
              schema={maintainSchema}
            />
          }
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
            id: 'customerAbility.management.import.upload.fileTitle',
            defaultMessage: '客户资料',
          })}
          ref={uploadModalRef}
          fetchDownloadFile={fetchDownloadFile}
          modalName={intl.formatMessage({
            id: 'customerAbility.management.import.upload.modalName',
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

export default CustomerDepositQuery
