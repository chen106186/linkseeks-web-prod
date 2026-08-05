/**
 * 订单能力 - 送货通知单管理 - 待提交送货通知单B2B
 * @author: Gavin
 * @description: 与SRM内容大致相同，文件分开方便后续对接以及日后变动修改二开
 */
import React, { useRef } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Card, Space, Tag } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table'
import TableOperation from '@/components/TableOperation'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { deliveryNoticeManagementB2BSchema } from './schema'
import { getOrderDeliveryNoticeOrderVendorPage } from '@apps/apis'
import { ORDER_TYPE, TAG_STATUS_COLOR, STATUS_NAME, STATUS } from '../../constants/deliveryNotice'
import { history } from '@linkseeks/router-manager'
import { PlusOutlined } from '@ant-design/icons'
import { useWebIntl } from '@apps/locales'

const DeliveryNoticeManagementAwaitB2B: React.FC = () => {
  const ref = useRef<any>({})
  const formActions = createFormActions()
  const translate = useWebIntl()
  const controllerBtns = (
    <Space>
      <AddAuthButton>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history.push(`/orderAbility/deliveryNoticeManagement/awaitB2B/add`)}
        >
          {translate('web.common.add')}
        </Button>
      </AddAuthButton>
    </Space>
  )

  const renderOptionButton = (record: any) => {
    const btnAuthOfOperationTextMap = {
      编辑: 'edit',
      查看: 'detail',
    }
    const buttonGroup = {
      编辑: [STATUS.WAIT_REVISE, STATUS.HAD_CONFIRM].includes(record.status),
      查看: true,
    }
    const operationHandler = {
      编辑: () => {
        history.push(`/orderAbility/deliveryNoticeManagement/awaitB2B/edit?id=${record.id}`)
      },
      查看: () => {
        history.push(`/orderAbility/deliveryNoticeManagement/awaitB2B/detail?id=${record.id}`)
      },
    }
    return (
      <TableOperation
        buttonTextFieldMap={buttonGroup}
        operationHandler={operationHandler}
        buttonPermissionsMap={btnAuthOfOperationTextMap}
      />
    )
  }

  const columns: ColumnType<unknown>[] = [
    {
      title: translate('web.resource.order.tongzhidanhao'),
      dataIndex: 'noticeNo',
      key: 'noticeNo',
      width: 160,
      ellipsis: true,
      render: (text: unknown, record: any) => (
        <EyeAuthButton url={`/orderAbility/deliveryNoticeManagement/awaitB2B/detail?id=${record.id}`}>
          {text}
        </EyeAuthButton>
      ),
    },
    { title: translate('web.resource.order.tongzhidanzhaiyao'), dataIndex: 'digest', key: 'digest' },
    { title: translate('web.resource.logistics.songhuoriqi'), dataIndex: 'deliveryTime', key: 'deliveryTime' },
    { title: translate('web.resource.order.caigouhuiyuan'), dataIndex: 'memberName', key: 'memberName' },
    { title: translate('web.resource.member.danjushijian'), dataIndex: 'createTime', key: 'createTime' },
    {
      title: translate('web.common.waibuzhuangtai'),
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: any) => (
        <Tag color={TAG_STATUS_COLOR[text]?.color}>
          <span style={{ color: TAG_STATUS_COLOR[text]?.fontColor }}>{STATUS_NAME[text]}</span>
        </Tag>
      ),
    },
    {
      title: translate('web.common.control'),
      dataIndex: '',
      key: 'x',
      align: 'center',
      render: (record) => renderOptionButton(record),
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getOrderDeliveryNoticeOrderVendorPage({
        ...params,
        orderType: ORDER_TYPE.B2B,
        status: STATUS.WAIT_REVISE,
      }).then(({ code, data }) => {
        if (code === 1000) {
          resolve(data)
        }
      })
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          // keepAlive={false}
          currentRef={ref}
          columns={columns}
          tableProps={{ rowKey: 'id' }}
          fetchTableData={(params: unknown) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              expressionScope={{
                controllerBtns,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'noticeNo', FORM_FILTER_PATH)
              }}
              schema={deliveryNoticeManagementB2BSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default DeliveryNoticeManagementAwaitB2B
