import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import { EyeAuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { RETURN_OUTER_STATUS_TAG_MAP } from '../../constants'

const createColumns: (parentPath: string) => RecordColumns<any>[] = (parentPath) => [
  {
    title: '申请单号',
    key: 'applyNo',
    fixed: 'left',
    searchField: {
      main: true,
    },
    render: (text, record) => (
      <>
        <EyeAuthButton url={`${parentPath}/detail?id=${record.returnId}`}>{text}</EyeAuthButton>
      </>
    ),
  },
  {
    title: '申请单摘要',
    key: 'applyAbstract',
    searchField: 'Input',
  },
  {
    title: '采购会员',
    key: 'consumerName',
    searchField: 'Input',
  },
  {
    title: '供应会员',
    key: 'supplierName',
    searchField: 'Input',
  },
  {
    title: '退款金额',
    key: 'refundAmount',
  },
  {
    title: '单据时间',
    key: 'applyTime',
    searchField: {
      type: 'DateSelect',
      name: 'sourceDate',
      title: '单据时间(全部)',
    },
  },
  {
    title: '外部状态',
    key: 'outerStatusName',
    render: (text, record) => <StatusTag type={RETURN_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={text} />,
  },
]

export default createColumns
