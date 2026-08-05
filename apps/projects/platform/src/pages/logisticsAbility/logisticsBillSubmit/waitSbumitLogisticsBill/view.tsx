import {
  PageHeaderWrapper,
  StandardFormTable,
  EyeAuthButton,
  AuthButton,
  DetailAuthButton,
  useTableRef,
} from '@apps/components'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import {
  getLogisticsOrderSubmitStatusList,
  getLogisticsOrderWaitSubmitPage,
  postLogisticsOrderWaitSubmitDelete,
  postLogisticsOrderWaitSubmitSubmit,
} from '@apps/apis'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { Tag, Button, Popconfirm } from '@linkseeks/ui'
import { formatTimeString } from '@/utils'
import { PlusOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { useWebIntl } from '@apps/locales'

import { EXTERNALSTATE_COLOR } from '../schema'

import {
  useExternalStatusFetch,
  useLogisticsSelectListMemberCompanyQueryFetch,
} from '../../services/hooks/useExternalStatusFetch'

const LogisticsBillQuery = () => {
  const translate = useWebIntl()
  const tableRef = useTableRef()

  const statusList = useExternalStatusFetch()
  const memberList = useLogisticsSelectListMemberCompanyQueryFetch()

  const handleDelete = (id: number) => {
    postLogisticsOrderWaitSubmitDelete({ id: id })
      .then((res) => {
        tableRef.current.reload()
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  const handleSubmit = (id: number) => {
    postLogisticsOrderWaitSubmitSubmit({ id: id })
      .then((res) => {
        tableRef.current.reload()
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  const columns: RecordColumns<any>[] = [
    {
      title: translate('web.resource.logistics.wuliudanhao'),
      searchField: {
        main: true,
      },
      key: 'logisticsOrderNo',
      dataIndex: 'logisticsOrderNo',
      render: (text: any, record: any) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill/detail?id=${record.id}`}
          >
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    {
      title: translate('web.resource.logistics.duiyingdingdanhao'),
      key: 'relevanceOrderCode',
      dataIndex: 'relevanceOrderCode',
      searchField: 'Input',
    },
    {
      title: translate('web.resource.logistics.wuliufuwushang'),
      key: 'companyName',
      dataIndex: 'companyName',
      searchField: {
        type: 'Select',
        valueEnum: memberList,
      },
    },
    {
      title: translate('web.resource.logistics.shouhuofang'),
      key: 'receiverMemberName',
      dataIndex: 'receiverMemberName',
    },
    {
      title: translate('web.resource.logistics.zongxiangshu'),
      key: 'totalCarton',
      dataIndex: 'totalCarton',
    },
    {
      title: translate('web.resource.logistics.zongzhongliang'),
      key: 'totalWeight',
      dataIndex: 'totalWeight',
    },
    {
      title: translate('web.resource.logistics.zongtiji'),
      key: 'totalVolume',
      dataIndex: 'totalVolume',
    },
    {
      title: translate('web.resource.member.danjushijian'),
      key: 'invoicesTime',
      dataIndex: 'invoicesTime',
      render: (text) => formatTimeString(text),
      searchField: {
        type: 'DateRange',
        name: ['invoicesTimeStart', 'invoicesTimeEnd'],
        placeholder: [translate('web.common.kaishishijian'), translate('web.common.jieshushijian')],
      },
    },
    {
      title: translate('web.common.waibuzhuangtai'),
      key: 'status',
      dataIndex: 'status',
      searchField: {
        type: 'Select',
        valueEnum: statusList,
        order: 2,
      },
      render: (text, data) => <Tag color={EXTERNALSTATE_COLOR(text)}>{data.statusName}</Tag>,
    },
    {
      title: translate('web.common.control'),
      key: 'submitOrUpdateOrDel',
      dataIndex: 'submitOrUpdateOrDel',
      render: (text, data) => (
        <>
          {data.update && (
            <AuthButton type="edit" code="edit">
              <Button
                type="link"
                onClick={() =>
                  history.push(`/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill/edit?id=${data.id}`)
                }
              >
                {translate('web.common.edit')}
              </Button>
            </AuthButton>
          )}
          {data.submit && (
            <AuthButton type="custom" code="submit">
              <Popconfirm
                title={translate('web.resource.logistics.quedingyaotijiaoma')}
                okText={translate('web.common.shi')}
                cancelText={translate('web.common.fou')}
                onConfirm={() => handleSubmit(data.id)}
              >
                <Button type="link">{translate('web.common.submit')}</Button>
              </Popconfirm>
            </AuthButton>
          )}
          {data.delete && (
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
          )}
        </>
      ),
    },
  ]
  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        rowKey="id"
        request={getLogisticsOrderWaitSubmitPage}
        actionRef={tableRef}
        searchButtons={[
          {
            key: 'add',
            children: `${translate('web.resource.logistics.xinjian')}`,
            type: 'primary',
            icon: <PlusOutlined />,
            onClick() {
              history.push(`/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill/add`)
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default LogisticsBillQuery
