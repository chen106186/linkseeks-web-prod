import {
  DetailAuthButton,
  EyeAuthButton,
  AuthButton,
  useTableRef,
  PageHeaderWrapper,
  StandardFormTable,
} from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { useWebIntl } from '@apps/locales'
import { EXCHANGE_INNER_STATUS_UNCOMMITTED, EXCHANGE_OUTER_STATUS_FAILED } from '@/constants/afterService'
import { EXCHANGE_OUTER_STATUS_TAG_MAP, EXCHANGE_INNER_STATUS_BADGE_MAP } from '../../constants'
import { Badge, Popconfirm, Button, message } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'

import { dateFormat } from '@apps/utils/src/format'
import {
  getAftersalesReplaceGoodsPageToBeSubmitByConsumer,
  postAftersalesReplaceGoodsSubmit,
  postAftersalesReplaceGoodsDelete,
} from '@apps/apis'

import { PlusOutlined } from '@ant-design/icons'

const ExchangePrSubmit = () => {
  const translate = useWebIntl()
  const tableRef = useTableRef()

  const handleSubmit = (record) => {
    const msg = message.loading({
      content: translate('web.resource.afterAbility.zhengzaitijiao'),
      duration: 0,
    })
    postAftersalesReplaceGoodsSubmit({
      id: record.replaceId,
    })
      .then((res) => {
        if (res.code === 1000) {
          tableRef.current.reload()
        }
      })
      .finally(() => {
        msg()
      })
  }
  const handleDelete = (record) => {
    const msg = message.loading({
      content: translate('web.resource.afterAbility.zhengzaishanchu'),
      duration: 0,
    })
    postAftersalesReplaceGoodsDelete({
      id: record.replaceId,
    })
      .then((res) => {
        if (res.code === 1000) {
          tableRef.current.reload()
        }
      })
      .finally(() => {
        msg()
      })
  }
  const columns: any[] = [
    {
      title: translate('web.resource.member.shenqingdanhao'),
      key: 'applyNo',
      dataIndex: 'applyNo',
      render: (text, record) => {
        return (
          <DetailAuthButton>
            <EyeAuthButton url={`/afterAbility/exchangeApplication/exchangePrSubmit/detail?id=${record.replaceId}`}>
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
        )
      },
      searchField: {
        type: 'Input',
        main: true,
      },
    },
    {
      title: translate('web.resource.afterAbility.shenqingzhaiyao'),
      dataIndex: 'applyAbstract',
      key: 'applyAbstract',
      ellipsis: true,
      searchField: 'Input',
    },
    {
      title: translate('web.resource.afterAbility.supplierName'),
      dataIndex: 'supplierName',
      key: 'supplierName',
      searchField: 'Input',
    },
    {
      title: translate('web.resource.afterAbility.applyTime'),
      dataIndex: 'applyTime',
      key: 'applyTime',
      searchField: {
        type: 'DateSelect',
      },
    },
    {
      title: translate('web.resource.afterAbility.outerStatus'),
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      render: (text, record) => <StatusTag type={EXCHANGE_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={text} />,
    },
    {
      title: translate('web.resource.afterAbility.innerStatus'),
      dataIndex: 'innerStatusName',
      key: 'innerStatusName',
      render: (text, record) => (
        <Badge color={EXCHANGE_INNER_STATUS_BADGE_MAP[record.innerStatus] || '#606266'} text={text} />
      ),
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => (
        <>
          {record.innerStatus === EXCHANGE_INNER_STATUS_UNCOMMITTED && (
            <AuthButton type="custom" code="submit">
              <Button type="link" onClick={() => handleSubmit(record)}>
                {translate('web.common.submit')}
              </Button>
            </AuthButton>
          )}
          {(record.innerStatus === EXCHANGE_INNER_STATUS_UNCOMMITTED ||
            record.outerStatus === EXCHANGE_OUTER_STATUS_FAILED) && (
            <AuthButton type="custom" code="edit">
              <Button
                type="link"
                onClick={() =>
                  history.push(`/afterAbility/exchangeApplication/exchangePrSubmit/edit?id=${record.replaceId}`)
                }
              >
                {translate('web.common.edit')}
              </Button>
            </AuthButton>
          )}
          {record.innerStatus === EXCHANGE_INNER_STATUS_UNCOMMITTED && (
            <AuthButton type="custom" code="del">
              <Popconfirm
                title={translate('web.resource.logistics.quedingyaoshanchu')}
                okText={translate('web.common.shi')}
                cancelText={translate('web.common.fou')}
                onConfirm={() => handleDelete(record)}
              >
                <Button type="link" danger>
                  {translate('web.common.delete')}
                </Button>
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
        rowKey="replaceId"
        searchButtons={[
          {
            key: 'add',
            children: '新建',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick() {
              history.push(`/afterAbility/exchangeApplication/exchangePrSubmit/add`)
            },
          },
        ]}
        request={(params) => {
          const [startTime, endTime] = params?.applyTime?.split(',') || []
          if (startTime) {
            params.startTime = dateFormat(new Date(+startTime), 'YY-MM-DD HH:mm:ss')
          }
          if (endTime) {
            params.endTime = dateFormat(new Date(+endTime), 'YY-MM-DD HH:mm:ss')
          }
          delete params.applyTime
          return getAftersalesReplaceGoodsPageToBeSubmitByConsumer(params)
        }}
        actionRef={tableRef}
      />
    </PageHeaderWrapper>
  )
}

export default ExchangePrSubmit
