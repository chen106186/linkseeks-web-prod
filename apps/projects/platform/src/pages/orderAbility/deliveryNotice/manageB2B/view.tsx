/**
 * 订单能力 - 送货单 - 送货单管理B2B
 * @author: Gavin
 * @description:  与SRM内容大致相同，文件分开方便后续对接以及日后变动修改二开
 */
import React, { useRef, useState } from 'react'
import { useLocation } from '@linkseeks/router-core'
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
import { deliveryNoticeManageB2BSchema } from './schema'
import { TagStatusFactory } from '../../utils'
import dayjs from 'dayjs'
import NoteFactoryService from '../../assets/handles/DeliveryNoteService'
import { history } from '@linkseeks/router-manager'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { Button } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'

const tagStatus = TagStatusFactory.getInstance()
tagStatus.setStyleToCollection('1', {
  bgColor: '#ebf9f6',
  fontColor: '#00a98f',
  txt: '已提交',
})

tagStatus.setStyleToCollection('1', {
  bgColor: '#EBF9F6',
  fontColor: '#00A98F',
  txt: '已确认发货',
})

tagStatus.setStyleToCollection('2', {
  bgColor: '#ECF2FE',
  fontColor: '#4787F0',
  txt: '已确认收货',
})

tagStatus.setStyleToCollection('3', {
  bgColor: '#f2f4f5',
  fontColor: '#000',
  txt: '已作废',
})
const service = NoteFactoryService.getInstance('b2b')

const DeliveryNoticeManageB2B: React.FC = () => {
  const { pathname } = useLocation()
  const ref = useRef<any>({})
  const formActions = createFormActions()
  const translate = useWebIntl()
  const controllerBtns = (
    <Space>
      <AddAuthButton>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history.push(`/orderAbility/deliveryNotice/manageB2B/add`)}
        >
          {translate('web.common.add')}
        </Button>
      </AddAuthButton>
    </Space>
  )

  const renderOptionButton = (record: any) => {
    const btnAuthOfOperationTextMap = {
      编辑: 'edit',
      // '作废': 'DevTest',
      查看: 'detail',
    }
    const buttonGroup = {
      编辑: record.outerStatus === 1,
      // '作废': false,
      查看: true,
    }
    const operationHandler = {
      编辑: () => {
        history.push(`/orderAbility/deliveryNotice/manageB2B/edit?id=${record.id}`)
      },
      // '作废': () => { console.log('作废 :>> ',) },
      查看: () => {
        history.push(`/orderAbility/deliveryNotice/manageB2B/detail?id=${record.id}`)
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
      render: (text, r) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/orderAbility/deliveryNotice/manageB2B/detail?id=${r.id}`}
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
      render: (t, r: any) => {
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
              schema={deliveryNoticeManageB2BSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default DeliveryNoticeManageB2B
