import { Button, Popconfirm } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import {
  PageHeaderWrapper,
  StandardFormTable,
  StatusAuthButton,
  AuthButton,
  useTableRef,
  EyeAuthButton,
  DetailAuthButton,
} from '@apps/components'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { PlusOutlined } from '@ant-design/icons'
import {
  getLogisticsFreightTemplatePage,
  postLogisticsFreightTemplateEnable,
  postLogisticsFreightTemplateDelete,
} from '@apps/apis'
import { useWebIntl } from '@apps/locales'

const STATUS = {
  /** 有效 */
  VALID: 1,
  /** 无效 */
  INVALID: 0,
}

const FreightTemplate = () => {
  const translate = useWebIntl()

  const tableRef = useTableRef()
  const handleChangeStatus = (id: any, status: any) => {
    let _status = status == 0 ? 1 : 0
    postLogisticsFreightTemplateEnable({ id: id, status: _status })
      .then((res) => {
        if (res.code === 1000) {
          tableRef.current.reload()
        }
      })
      .catch((error) => {
        console.warn(error)
      })
  }
  const handleDelete = (id: number) => {
    postLogisticsFreightTemplateDelete({ id: id })
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
      title: translate('web.resource.logistics.mubanmingcheng'),
      key: 'name',
      dataIndex: 'name',
      render: (text, data) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/logisticsAbility/logisticsAdminister/freightTemplate/detail?id=${data.id}`}
          >
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    {
      title: translate('web.resource.logistics.jijiafangshi'),
      key: 'pricingMode',
      dataIndex: 'pricingMode',
      render: (_text) => translate('web.resource.logistics.anzhongliang'),
    },
    {
      title: translate('web.resource.logistics.yunsongfangshi'),
      key: 'transportMode',
      dataIndex: 'transportMode',
      render: (_text) => translate('web.resource.logistics.kuaidi'),
    },
    {
      title: translate('web.resource.logistics.yunfeishuoming'),
      key: 'explain',
      dataIndex: 'explain',
    },
    {
      title: translate('web.common.status'),
      key: 'status',
      dataIndex: 'status',
      render: (_text: any, data: any) => (
        <StatusAuthButton
          fieldNames="status"
          handleConfirm={() => handleChangeStatus(data.id, data.status)}
          record={data}
        />
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
                onClick={() => history.push(`/logisticsAbility/logisticsAdminister/freightTemplate/edit?id=${data.id}`)}
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
        request={getLogisticsFreightTemplatePage}
        actionRef={tableRef}
        searchButtons={[
          {
            key: 'add',
            children: `${translate('web.resource.logistics.xinjian')}`,
            type: 'primary',
            icon: <PlusOutlined />,
            onClick() {
              history.push(`/logisticsAbility/logisticsAdminister/freightTemplate/add`)
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}
export default FreightTemplate
