/**
 * 采购能力 - 送样管理 - 送样需求单查询
 * @author: hemin
 * @description:
 */
import React, { useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Card, DatePicker, Form, Input, Modal, Space, Tag } from 'antd'
import StandardTable from '@/components/StandardTable'
import TableOperation from '@/components/TableOperation'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { requestSheetQuerySchema } from './schema'
import { TagStatusFactory } from '../utils'
import NoteFactoryService from '../../commodity/assets/handles/DeliveryNoteService'

import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { PlusOutlined } from '@ant-design/icons'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton } from '@apps/components'
import { postProductSampleDeliverBuyerCancel } from '@apps/apis'
import moment from 'moment'
import { formatTimeString } from '@/utils'
import type { ColumnType } from 'antd/lib/table'
export const tagStatus = TagStatusFactory.getInstance()

const RequestSheetQuery: React.FC = (props: any) => {
  const { site = '' } = props
  const intl = useIntl()
  const service = NoteFactoryService.getInstance(site || 'receive')
  const ref = useRef<any>({})
  const formActions = createFormActions()
  const [visible, setVisible] = useState<boolean>()
  const [id, setId] = useState()
  const [form] = Form.useForm()

  const controllerBtns = (
    <Space>
      <AddAuthButton>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history.push(`/commodityAbility/deliverManagement/requestSheetQuerySRM/add`)}
        >
          {intl.formatMessage({ id: 'balance.businessRequestFunds.admin.handleAdd' })}
        </Button>
      </AddAuthButton>
    </Space>
  )
  const renderOptionButton = (record) => {
    const btnAuthOfOperationTextMap = {
      退样: 'withdraw',
      样品质检: 'quality',
      查看质检单: 'viewQuality',
      查看: 'detail',
      取消: 'cancel',
      收样: 'sampling',
    }
    const buttonGroup = {
      退样: !site && record.outerStatus === 6,
      样品质检: !site && record.showQuality,
      查看质检单: !site && record.showCheckQuality,
      // 查看: true,
      取消: !site && record.showCancel,
      收样: site === 'Sampling',
    }
    const operationHandler = {
      退样: () => {
        history.push(`/commodityAbility/deliverManagement/requestSheetQuery/detail?id=${record.id}&isEdit=${true}`)
      },
      样品质检: () => {
        history.push(`/qualityAbility/qualityManage/${record.scenes === 1 ? 'b2b' : 'srm'}/send?id=${record.id}`)
      },
      查看质检单: () => {
        history.open(`/qualityAbility/qualityManage/search/detail?id=${record.qualityId}`)
      },
      查看: () => {
        history.push(`/commodityAbility/deliverManagement/requestSheetQuery/detail?id=${record.id}`)
      },
      取消: () => {
        setId(record.id)
        setVisible(true)
      },
      收样: () => {
        history.push(`/commodityAbility/deliverManagement/receivingSheet/detail?id=${record.id}`)
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
      title: intl.formatMessage({
        id: 'customerAbility.songyang.title_1',
        defaultMessage: '送样需求单号',
      }),
      dataIndex: 'deliveryNo',
      key: 'deliveryNo',
      width: 160,
      render: (t, r) => (
        <EyeAuthButton url={`/commodityAbility/deliverManagement/requestSheetQuery/detail?id=${r.id}`}>
          {r.deliveryNo}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.songyang.title_2',
        defaultMessage: '送样需求单摘要',
      }),
      dataIndex: 'summary',
      key: 'summary',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.songyang.title_3',
        defaultMessage: '需求日期',
      }),
      dataIndex: 'demandDate',
      key: 'demandDate',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.songyang.title_4',
        defaultMessage: '送样类型',
      }),
      dataIndex: 'typeName',
      key: 'typeName',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.songyang.title_5',
        defaultMessage: '紧急程度',
      }),
      dataIndex: 'emergencyLevelName',
      key: 'emergencyLevelName',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.songyang.title_6',
        defaultMessage: '接收部门',
      }),
      dataIndex: 'receiveDepartment',
      key: 'receiveDepartment',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.songyang.title_7',
        defaultMessage: '供应商',
      }),
      dataIndex: 'vendorMemberName',
      key: 'vendorMemberName',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.songyang.title_8',
        defaultMessage: '单据时间',
      }),
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.songyang.title_9',
        defaultMessage: '外部状态',
      }),
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
    {
      title: intl.formatMessage({ id: 'customerAbility.songyang.title_0', defaultMessage: '操作' }),
      dataIndex: '',
      key: 'x',
      align: 'center',
      render: (record) => renderOptionButton(record),
    },
  ]

  const fetchData = (params: unknown) => {
    return service.getQuery(params)
  }

  // 初始化高级筛选选项
  const fetchSearchItems = async () => {
    if (!!site) {
      return {}
    }
    const res = await service.getOuterStatus()

    if (res.code === 1000) {
      const { data } = res

      return {
        outerStatus: data.map((item) => ({ label: item.text, value: item.id })).filter((item) => item.value),
      }
    }
    return {}
  }

  const cancel_ = () => {
    setId(null)
    form.resetFields()
    setVisible(false)
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
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useStateFilterSearchLinkageEffect($, actions, 'deliveryNo', FORM_FILTER_PATH)
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useAsyncInitSelect(['outerStatus'], fetchSearchItems)
              }}
              schema={requestSheetQuerySchema(site)}
            />
          }
        />
      </Card>

      <Modal
        title={intl.formatMessage({ id: 'components.quxiao', defaultMessage: '取消' })}
        visible={visible}
        onCancel={cancel_}
        // width={width}
        onOk={async () => {
          form.validateFields().then((val) => {
            postProductSampleDeliverBuyerCancel({
              id,
              ...val,
              cancelTime: formatTimeString(val.cancelTime),
            }).then((res) => {
              if (res.code === 1000) {
                cancel_()
              }
            })
          })
        }}
      >
        <Form form={form}>
          <Form.Item
            name={'cancelTime'}
            label={intl.formatMessage({ id: 'eightD.quxiaoshijian', defaultMessage: '取消时间' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'member.memberEvaluate.schema.add.plzChooseTime',
                }),
              },
            ]}
            initialValue={moment(new Date(), 'YYYY-MM-DD')}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabled />
          </Form.Item>
          <Form.Item
            name={'cancelReason'}
            label={intl.formatMessage({
              id: 'saleOrder.quxiaoyuanyin',
              defaultMessage: '取消原因',
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'saleOrder.qingshuruquxiao',
                  defaultMessage: '请输入取消原因',
                }),
              },
            ]}
          >
            <Input.TextArea maxLength={100} />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default RequestSheetQuery
