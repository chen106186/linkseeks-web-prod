/**
 * 订单能力 - 送货单 - 送货单管理SRM
 * @author: Gavin
 * @description:  与B2B内容大致相同，文件分开方便后续对接以及日后变动修改二开
 */
import React, { useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Space, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table'
import TableOperation from '@/components/TableOperation'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { deliveryNoticeManageSRMSchema } from './schema'
import NoteFactoryService from '../../assets/handles/DeliveryNoteService'
import dayjs from 'dayjs'
import { TagStatus, TagStatusFactory } from '../../utils'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { Button } from '@linkseeks/ui'
import { getWebIntl, useWebIntl } from '@apps/locales'

const translate = getWebIntl()
const tagStatus = TagStatusFactory.getInstance()
tagStatus.setStyleToCollection('1', {
  bgColor: '#ebf9f6',
  fontColor: '#00a98f',
  txt: translate('web.common.yitijiao'),
})

tagStatus.setStyleToCollection('1', {
  bgColor: '#EBF9F6',
  fontColor: '#00A98F',
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

const DeliveryNoticeManageSRM: React.FC = () => {
  const ref = useRef<any>({})
  const { pathname } = useLocation()
  const formActions = createFormActions()
  const service = NoteFactoryService.getInstance()
  const translate = useWebIntl()
  const controllerBtns = (
    <Space>
      <AddAuthButton>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history.push(`/orderAbility/deliveryNotice/manageSRM/add`)}
        >
          {translate('web.common.add')}
        </Button>
      </AddAuthButton>
    </Space>
  )
  const renderOptionButton = (record: any) => {
    const btnAuthOfOperationTextMap = {
      [translate('web.common.edit')]: 'edit',
      // 作废: 'DevTest',
      [translate('web.common.preview')]: 'detail',
    }
    const buttonGroup = {
      [translate('web.common.edit')]: record.outerStatus === 1,
      // 作废: false,
      [translate('web.common.preview')]: true,
    }
    const operationHandler = {
      [translate('web.common.edit')]: () => {
        history.push(`/orderAbility/deliveryNotice/manageSRM/edit?id=${record.id}`)
      },
      [translate('web.common.zuofei')]: () => {
        // /order/delivery/order/invalid
      },
      [translate('web.common.preview')]: () => {
        history.push(`/orderAbility/deliveryNotice/manageSRM/detail?id=${record.id}`)
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
      render: (t, r) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/orderAbility/deliveryNotice/manageSRM/detail?id=${r.id}`}
        >
          {r.deliveryNo}
        </EyeAuthButton>
      ),
    },
    { title: translate('web.resource.logistics.songhuodanzhaiyao'), dataIndex: 'digest', key: 'digest' },
    {
      title: translate('web.resource.logistics.songhuoriqi'),
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
    },
    { title: translate('web.resource.order.caigouhuiyuan'), dataIndex: 'buyerMemberName', key: 'buyerMemberName' },
    {
      title: translate('web.resource.member.danjushijian'),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (t, r) => {
        return dayjs(r.createTime).format('YYYY-MM-DD')
      },
    },
    {
      title: translate('web.common.waibuzhuangtai'),
      dataIndex: 'outerStatus',
      key: 'outerStatus',
      render: (t: string, r: any) => {
        const styles = tagStatus.getTagStyle(r.outerStatus)
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

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          // keepAlive={false}
          currentRef={ref}
          columns={columns}
          tableProps={{ rowKey: 'id' }}
          fetchTableData={(params: unknown) => service.getQuery(params)}
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
              schema={deliveryNoticeManageSRMSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default DeliveryNoticeManageSRM
