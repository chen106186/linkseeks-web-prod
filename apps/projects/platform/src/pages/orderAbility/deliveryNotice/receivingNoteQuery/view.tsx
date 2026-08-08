/**
 * 订单能力 - 送货单 - 收货单查询
 * @author: Gavin
 * @description:
 */
import React, { useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Space, Tag } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table'
import TableOperation from '@/components/TableOperation'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { receivingNoteQuerySchema } from './schema'
import { TagStatusFactory } from '../../utils'
import NoteFactoryService from '../../assets/handles/DeliveryNoteService'
import { history } from '@linkseeks/router-manager'
import { getWebIntl, useWebIntl } from '@apps/locales'

const translate = getWebIntl()
const tagStatus = TagStatusFactory.getInstance()
tagStatus.setStyleToCollection('1', {
  bgColor: '#ebf9f6',
  fontColor: '#00a98f',
  txt: translate('web.common.yitijiao'),
})

tagStatus.setStyleToCollection('1', {
  bgColor: '#ECF2FE',
  fontColor: '#4787F0',
  txt: translate('web.common.yiquerenfahuo'),
})

tagStatus.setStyleToCollection('4', {
  bgColor: '#F4F5F7',
  fontColor: '#5C626A',
  txt: translate('web.resource.order.yishengchengzhijiandan'),
})

tagStatus.setStyleToCollection('3', {
  bgColor: '#f2f4f5',
  fontColor: '#000',
  txt: translate('web.common.yizuofei'),
})

const service = NoteFactoryService.getInstance('receive')

const ReceivingNoteQuery: React.FC = () => {
  const ref = useRef<any>({})
  const formActions = createFormActions()
  const translate = useWebIntl()
  const controllerBtns = <Space></Space>
  const renderOptionButton = (r: any) => {
    const btnAuthOfOperationTextMap = {
      查看: 'detail',
    }
    const buttonGroup = {
      查看: true,
    }
    const operationHandler = {
      查看: () => {
        history.push(`/orderAbility/deliveryNotice/receivingNoteQuery/detail?id=${r.id}`)
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
  const columns: ColumnType<any>[] = [
    {
      title: translate('web.resource.logistics.shouhuodanhao'),
      dataIndex: 'receiveNo',
      key: 'receiveNo',
      width: 160,
      render: (t, r) => (
        <EyeAuthButton url={`/orderAbility/deliveryNotice/receivingNoteQuery/detail?id=${r.id}`}>
          {r.receiveNo}
        </EyeAuthButton>
      ),
    },
    { title: translate('web.resource.logistics.shouhuodanzhaiyao'), dataIndex: 'digest', key: 'digest' },
    { title: translate('web.resource.logistics.shouhuoriqi'), dataIndex: 'receiveTime', key: 'receiveTime' },
    { title: translate('web.resource.logistics.songhuodanhao'), dataIndex: 'deliveryNo', key: 'deliveryNo' },
    { title: translate('web.resource.logistics.songhuoriqi'), dataIndex: 'deliveryTime', key: 'deliveryTime' },
    { title: translate('web.resource.order.caigouhuiyuan'), dataIndex: 'buyerMemberName', key: 'buyerMemberName' },
    { title: translate('web.resource.member.danjushijian'), dataIndex: 'createTime', key: 'createTime' },
    {
      title: translate('web.common.waibuzhuangtai'),
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      render: (text: string, record: any) => {
        const styles = tagStatus.getTagStyle(record.outerStatus)
        return (
          <Tag color={styles.bgColor}>
            <span style={{ color: styles.fontColor }}>{record.outerStatusName}</span>
          </Tag>
        )
      },
    },
  ]

  const fetchData = (params: unknown) => {
    return service.getQuery(params)
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
                useStateFilterSearchLinkageEffect($, actions, 'receiveNo', FORM_FILTER_PATH)
              }}
              schema={receivingNoteQuerySchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default ReceivingNoteQuery
