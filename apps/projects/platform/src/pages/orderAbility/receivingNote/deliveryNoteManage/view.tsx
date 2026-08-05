/**
 * 订单能力 - 收货单 - 收货单管理
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
import { deliveryNoteManageSchema } from './schema'
import ReceiveNoteFacotry from '../../assets/handles/ReceiveNotePage'
import { TagStatusFactory } from '../../utils'
import { history } from '@linkseeks/router-manager'
import { useWebIntl } from '@apps/locales'

const tagService = TagStatusFactory.getInstance()
const tagStatus = TagStatusFactory.getInstance()

const DeliveryNoteManage: React.FC = () => {
  const ref = useRef<any>({})
  const formActions = createFormActions()

  const service = ReceiveNoteFacotry.getInstance()

  const controllerBtns = <Space></Space>
  const translate = useWebIntl()

  tagStatus.setStyleToCollection('1', {
    bgColor: '#ebf9f6',
    fontColor: '#00a98f',
    txt: translate('web.common.yitijiao'),
  })

  tagStatus.setStyleToCollection('1', {
    bgColor: '#ECF2FE',
    fontColor: '#4787F0',
    txt: translate('web.common.yiquerenshouhuo'),
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
  const renderOptionButton = (r: any) => {
    const btnAuthOfOperationTextMap = {
      // 作废: 'generateQualityTesting',
      [translate('web.common.preview')]: 'detail',
      // edit: 'update',
      [translate('web.resource.order.shengchengzhijiandan')]: 'generateQuality',
    }
    const buttonGroup = {
      // 作废: false,
      [translate('web.common.preview')]: true,
      // edit: true,
      [translate('web.resource.order.shengchengzhijiandan')]: r.outerStatus == 4 ? false : true,
    }
    const operationHandler = {
      // 作废: () => { console.log('作废 :>> ',) },
      // edit: () => {
      //   history.push(`/orderAbility/receivingNote/deliveryNoteManage/edit?id=${r.id}`)
      // },
      [translate('web.common.preview')]: () => {
        history.push(`/orderAbility/receivingNote/deliveryNoteManage/detail?id=${r.id}`)
      },
      [translate('web.resource.order.shengchengzhijiandan')]: () => {
        r.type === 1
          ? history.push(`/qualityAbility/qualityManage/b2b/formed?id=${r.id}`)
          : history.push(`/qualityAbility/qualityManage/srm/formed?id=${r.id}`)
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
      dataIndex: 'id',
      key: 'id',
      render: (t, r) => (
        <EyeAuthButton url={`/orderAbility/receivingNote/deliveryNoteManage/detail?id=${r.id}`}>
          {r.receiveNo}
        </EyeAuthButton>
      ),
    },
    { title: translate('web.resource.logistics.shouhuodanzhaiyao'), dataIndex: 'digest', key: 'digest' },
    { title: translate('web.resource.logistics.shouhuoriqi'), dataIndex: 'receiveTime', key: 'receiveTime' },
    { title: translate('web.resource.logistics.songhuodanhao'), dataIndex: 'deliveryNo', key: 'deliveryNo' },
    { title: translate('web.resource.logistics.songhuoriqi'), dataIndex: 'deliveryTime', key: 'deliveryTime' },
    { title: translate('web.resource.member.gongyinghuiyuan'), dataIndex: 'vendorMemberName', key: 'vendorMemberName' },
    { title: translate('web.resource.member.danjushijian'), dataIndex: 'createTime', key: 'createTime' },
    {
      title: translate('web.common.waibuzhuangtai'),
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      render: (text, record) => {
        const styles = tagStatus.getTagStyle(record.outerStatus)
        return (
          <Tag color={styles.bgColor}>
            <span style={{ color: styles.fontColor }}>{text}</span>
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
                useStateFilterSearchLinkageEffect($, actions, 'receiveNo', FORM_FILTER_PATH)
              }}
              schema={deliveryNoteManageSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default DeliveryNoteManage
