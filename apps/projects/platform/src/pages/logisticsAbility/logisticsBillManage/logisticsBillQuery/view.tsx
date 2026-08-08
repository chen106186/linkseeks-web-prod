import { PageHeaderWrapper, StandardFormTable, EyeAuthButton, DetailAuthButton } from '@apps/components'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import { useWebIntl } from '@apps/locales'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { Tag } from '@linkseeks/ui'
import { getLogisticsOrderConfirmPage } from '@apps/apis'
import { formatTimeString } from '@/utils'
import { EXTERNALSTATE_COLOR } from '../schema'
import { useExternalStatusFetch } from '../../services/hooks/useExternalStatusFetch'

const LogisticsBillQuery = () => {
  const translate = useWebIntl()
  const statusList = useExternalStatusFetch()
  const columns: RecordColumns<any>[] = [
    {
      title: translate('web.resource.logistics.wuliudanhao'),
      key: 'logisticsOrderNo',
      dataIndex: 'logisticsOrderNo',
      searchField: {
        main: true,
      },
      render: (text: any, record: any) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/logisticsAbility/logisticsBillManage/logisticsBillQuery/detail?id=${record.id}`}
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
    },
    {
      title: translate('web.resource.logistics.fahuofang'),
      key: 'shipperMemberName',
      dataIndex: 'shipperMemberName',
      searchField: {
        type: 'Input',
        order: 1,
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
        order: 3,
      },
    },
    {
      title: translate('web.common.waibuzhuangtai'),
      key: 'status',
      dataIndex: 'status',
      render: (text, data) => <Tag color={EXTERNALSTATE_COLOR(text)}>{data.statusName}</Tag>,
      searchField: {
        type: 'Select',
        valueEnum: statusList,
        order: 2,
      },
    },
  ]

  return (
    <PageHeaderWrapper>
      <StandardFormTable columns={columns} rowKey="id" request={getLogisticsOrderConfirmPage} />
    </PageHeaderWrapper>
  )
}

export default LogisticsBillQuery
