import React, { useRef, useCallback, useMemo } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Space, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import TableOperation from '@/components/TableOperation'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { requestSheetQuery } from './schema'
import { requestSheetQueryColumn } from '../columns'
import {
  getProductSampleDeliverBuyerPageBySrmManage,
  postProductSampleDeliverBuyerSubmit,
  postProductSampleDeliverBuyerDelete,
} from '@apps/apis'
import { TagStatusFactory } from '../utils'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton } from '@apps/components'
import { Button } from '@linkseeks/ui'

const tagStatus = TagStatusFactory.getInstance()

const getTableDataList = async (params) => {
  try {
    const res = await getProductSampleDeliverBuyerPageBySrmManage(params)
    if (res.code == 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  } catch (error) {
    return { data: [], totalCount: 0 }
  }
}

const requestSheetQuerySRM: React.FC = () => {
  const ref = useRef<any>({})
  const formActions = createFormActions()
  const { pathname } = useLocation()
  const intl = useIntl()

  const controllerBtns = useMemo(
    () => (
      <Space>
        <AddAuthButton>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => history.push(`/commodityAbility/deliverManagement/requestSheetQuerySrm/add`)}
          >
            {intl.formatMessage({ id: 'commodity.deliverManagement.xinzeng', defaultMessage: '新增' })}
          </Button>
        </AddAuthButton>
      </Space>
    ),
    [history, intl],
  )

  const submitNeedSingle = useCallback(async (record) => {
    try {
      const { code } = await postProductSampleDeliverBuyerSubmit({ id: record.id })
      if (code == 1000) {
        ref.current.reloadCurrent()
      }
    } catch (error) {}
  }, [])

  const deleteNeedSingle = useCallback(async (record) => {
    try {
      const { code } = await postProductSampleDeliverBuyerDelete({ id: record.id })
      if (code == 1000) {
        ref.current.reloadCurrent()
      }
    } catch (error) {}
  }, [])

  const renderOptionButton = useCallback(
    (record: any) => {
      const optionButtonMap = [
        {
          title: intl.formatMessage({ id: 'commodity.deliverManagement.tijiao', defaultMessage: ' 提交' }),
          key: 'submit',
          show: record?.outerStatus == 1, // 【待确认】状态下才显示提交
          handler: () => {
            submitNeedSingle(record)
          },
        },
        {
          title: intl.formatMessage({ id: 'commodity.deliverManagement.xiugai', defaultMessage: '修改' }),
          key: 'update',
          show: record?.outerStatus == 3 || record?.outerStatus == 1, // 状态为已拒绝才可以修改和删除
          handler: () => {
            history.push(`/commodityAbility/deliverManagement/requestSheetQuerySrm/detail?edit=true&id=${record.id}`)
          },
        },
        {
          title: intl.formatMessage({ id: 'commodity.deliverManagement.shanchu', defaultMessage: '删除' }),
          key: 'delete',
          show: record?.outerStatus == 3 || record?.outerStatus == 1, // 状态为已拒绝才可以修改和删除
          handler: () => {
            deleteNeedSingle(record)
          },
        },
      ]
      const tableOperation = {
        buttonTextFieldMap: {},
        operationHandler: {},
        buttonPermissionsMap: {},
      }

      optionButtonMap.forEach((item) => {
        tableOperation.buttonPermissionsMap[item.title] = item.key
        tableOperation.buttonTextFieldMap[item.title] = item.show
        tableOperation.operationHandler[item.title] = item.handler
      })
      return <TableOperation {...tableOperation} />
    },
    [submitNeedSingle, deleteNeedSingle, history, intl],
  )

  const columns = useMemo(() => {
    const renderList = {
      deliveryNo: (t, r) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/commodityAbility/deliverManagement/requestSheetQuery/detail?id=${r.id}`}
        >
          {r.deliveryNo}
        </EyeAuthButton>
      ),
      outerStatus: (t: string, r: any) => {
        const { bgColor, fontColor, txt } = tagStatus.getTagStyle(r.outerStatus)
        return (
          <Tag color={bgColor}>
            <span style={{ color: fontColor }}>{txt}</span>
          </Tag>
        )
      },
      operation: (t, record) => renderOptionButton(record),
    }
    return requestSheetQueryColumn.map((item: any) => {
      const columsItem = { ...item }
      if (renderList[item.dataIndex]) {
        columsItem.render = renderList[item.dataIndex]
      }
      return columsItem
    })
  }, [renderOptionButton])

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          // keepAlive={false}
          currentRef={ref}
          columns={columns}
          tableProps={{ rowKey: 'id' }}
          fetchTableData={getTableDataList}
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
              schema={requestSheetQuery}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default requestSheetQuerySRM
