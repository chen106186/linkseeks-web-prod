import {
  PageHeaderWrapper,
  StandardFormTable,
  StatusAuthButton,
  AuthButton,
  useTableRef,
  EyeAuthButton,
} from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { PlusOutlined } from '@ant-design/icons'
import { getLogisticsCompanyPage, postLogisticsCompanyDelete, postLogisticsCompanyEnable } from '@apps/apis'
import { useWebIntl } from '@apps/locales'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { Button, Popconfirm } from '@linkseeks/ui'

const COOPERATE = {
  /** 平台物流服务商 */
  PLATFORM: 1,
  /** 商户合作物流公司 */
  MERCHANTS: 2,
}

const STATUS = {
  /** 有效 */
  VALID: 1,
  /** 无效 */
  INVALID: 0,
}

const LogisticsCompanyManage = () => {
  const translate = useWebIntl()
  const tableRef = useTableRef()

  const handleChangeStatus = async (id: any, status: any) => {
    let _status = status == 1 ? 0 : 1
    await postLogisticsCompanyEnable({ id: id, status: _status })
    tableRef.current.reload()
  }
  const handleDelete = (id: any) => {
    postLogisticsCompanyDelete({ id: id })
      .then((res) => {
        if (res.code === 1000) {
          tableRef.current.reload()
        }
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: translate('web.resource.logistics.wuliugongsidaima'),
      key: 'code',
      dataIndex: 'code',
      render: (text, data) => (text ? text : data.companyMemberId),
    },
    {
      title: translate('web.resource.logistics.wuliugongsimingcheng'),
      key: 'name',
      dataIndex: 'name',
      render: (text, data) => (
        <EyeAuthButton
          type={AuthUrl('preview') ? 'link' : 'button'}
          url={`/logisticsAbility/logisticsAdminister/logisticsCompanyManage/preview?id=${data.id}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: translate('web.resource.logistics.hezuoleixing'),
      key: 'cooperateType',
      dataIndex: 'cooperateType',
      render: (text) =>
        text === COOPERATE.PLATFORM
          ? translate('web.resource.logistics.pingtaiwuliufuwushang')
          : translate('web.resource.logistics.shanghuhezuowuliugongsi'),
    },
    {
      title: translate('web.common.status'),
      key: 'status',
      dataIndex: 'status',
      render: (_text: any, data: any) => (
        <AuthButton type="custom" code="state">
          <StatusAuthButton
            fieldNames="status"
            handleConfirm={() => handleChangeStatus(data.id, data.status)}
            record={data}
          />
        </AuthButton>
      ),
    },
    {
      title: translate('web.common.control'),
      key: 'operate',
      dataIndex: 'operate',
      render: (_text, data) =>
        data.status === STATUS.INVALID && (
          <>
            <AuthButton type="edit" code="edit">
              <Button
                type="link"
                onClick={() =>
                  history.push(`/logisticsAbility/logisticsAdminister/logisticsCompanyManage/edit?id=${data.id}`)
                }
              >
                {translate('web.common.edit')}
              </Button>
            </AuthButton>

            <AuthButton type="custom" code="del">
              <Popconfirm
                title={translate('web.resource.logistics.quedingyaoshanchu')}
                okText={translate('web.common.shi')}
                cancelText={translate('web.common.fou')}
                onConfirm={() => handleDelete(data.id)}
              >
                <Button type="link">{translate('web.common.delete')}</Button>
              </Popconfirm>
            </AuthButton>
          </>
        ),
    },
  ]

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        rowKey="id"
        request={getLogisticsCompanyPage}
        actionRef={tableRef}
        searchButtons={[
          {
            key: 'add',
            children: `${translate('web.resource.logistics.xinjian')}`,
            type: 'primary',
            icon: <PlusOutlined />,
            onClick() {
              history.push(`/logisticsAbility/logisticsAdminister/logisticsCompanyManage/add`)
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}
export default LogisticsCompanyManage
