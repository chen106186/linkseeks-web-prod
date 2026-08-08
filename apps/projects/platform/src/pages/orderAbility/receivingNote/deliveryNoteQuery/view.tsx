/**
 * 订单能力 - 收货单 - 送货单查询
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
import { deliveryNoteQuerySchema } from './schema'
import ReceiveNoteFacotry from '../../assets/handles/ReceiveNotePage'
import { TagStatusFactory } from '../../utils'
import { history } from '@linkseeks/router-manager'
import { useWebIntl } from '@apps/locales'

const service = ReceiveNoteFacotry.getInstance('Query')
const tagStatus = TagStatusFactory.getInstance()

const DeliveryNoteQuery: React.FC = () => {
  const ref = useRef<any>({})
  const formActions = createFormActions()
  const translate = useWebIntl()
  const controllerBtns = <Space></Space>

  tagStatus.setStyleToCollection('1', {
    bgColor: '#ebf9f6',
    fontColor: '#00a98f',
    txt: translate('web.common.yiquerenfahuo'),
  })

  tagStatus.setStyleToCollection('1', {
    bgColor: '#ebf9f6',
    fontColor: '#00a98f',
    txt: translate('web.common.yiquerenfahuo'),
  })

  tagStatus.setStyleToCollection('2', {
    bgColor: '#ECF2FE',
    fontColor: '#4787F0',
    txt: translate('web.common.yiquerenshouhuo'),
  })

  tagStatus.setStyleToCollection('3', {
    bgColor: '#f2f4f5',
    fontColor: '#000',
    txt: translate('web.common.yizuofei'),
  })

  const renderOptionButton = (r: any) => {
    const btnAuthOfOperationTextMap = {
      [translate('web.resource.order.shengchengshouhuodan')]: 'generateReceivingNote',
      [translate('web.common.preview')]: 'detail',
    }
    const buttonGroup = {
      [translate('web.resource.order.shengchengshouhuodan')]: r.outerStatus < 2,
      [translate('web.common.preview')]: true,
    }
    const operationHandler = {
      [translate('web.resource.order.shengchengshouhuodan')]: () => {
        history.push(`/orderAbility/receivingNote/deliveryNoteManage/add?id=${r.id}`)
      },
      [translate('web.common.edit')]: () => {
        history.push(`/orderAbility/receivingNote/deliveryNoteQuery/edit?id=${r.id}`)
      },
      [translate('web.common.preview')]: () => {
        history.push(`/orderAbility/receivingNote/deliveryNoteQuery/detail?id=${r.id}`)
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
      title: translate('web.resource.logistics.songhuodanhao'),
      dataIndex: 'id',
      key: 'id',
      width: 160,
      render: (t: any, r: any) => (
        <EyeAuthButton url={`/orderAbility/receivingNote/deliveryNoteQuery/detail?id=${r.id}`}>
          {r.deliveryNo}
        </EyeAuthButton>
      ),
    },
    { title: translate('web.resource.logistics.songhuodanzhaiyao'), dataIndex: 'digest', key: 'digest' },
    { title: translate('web.resource.logistics.songhuoriqi'), dataIndex: 'deliveryTime', key: 'deliveryTime' },
    { title: translate('web.resource.member.gongyinghuiyuan'), dataIndex: 'vendorMemberName', key: 'vendorMemberName' },
    { title: translate('web.resource.member.danjushijian'), dataIndex: 'createTime', key: 'createTime' },
    {
      title: translate('web.common.waibuzhuangtai'),
      dataIndex: 'orderStatusName',
      key: 'orderStatusName',
      render: (text: string, record: any) => {
        const styles = tagStatus.getTagStyle(record.outerStatus)
        return (
          <Tag color={styles.bgColor}>
            <span style={{ color: styles.fontColor }}>{styles.txt}</span>
          </Tag>
        )
      },
    },
    {
      title: translate('web.common.control'),
      dataIndex: '',
      key: 'x',
      align: 'center',
      render: (record) => renderOptionButton(record),
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
                useStateFilterSearchLinkageEffect($, actions, 'deliveryNo', FORM_FILTER_PATH)
              }}
              schema={deliveryNoteQuerySchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default DeliveryNoteQuery
