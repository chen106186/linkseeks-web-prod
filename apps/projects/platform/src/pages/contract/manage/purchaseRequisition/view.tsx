import React, { useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Card, message, Modal, Space } from 'antd'
import statuStyle from '../../common/colorTag'
import type { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { PurchaseContractListSchema } from '../schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import moment from 'moment'
import { getContractPurchaseRequisitionPageToBeCreate } from '@apps/apis'
import { AuthButton } from '@apps/components'
import { InfoCircleFilled, PlusCircleOutlined } from '@ant-design/icons'
// import { postMemberFeignLifecycleStageRuleCheckNotAstrict } from '@apps/apis'
import { authService } from '@apps/services'
import { getWebIntl } from '@apps/locales'
// import { postMemberFeignLifecycleStageRuleBatchCheckPleasePurchase } from '@apps/apis'
const intl = getIntl()
const translate = getWebIntl()

const BiddingList = () => {
  const ref = useRef<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectRow, setSelectRow] = useState<any[]>([]) // 模态框选择的行数据

  const Like = (record) => {
    const userInfo = authService.getAuth()
    const param = {
      memberId: userInfo.memberId,
      roleId: userInfo.memberRoleId,
      subMemberId: record.vendorMemberId,
      subRoleId: record.vendorRoleId,
      lifeCycleStageRuleId: 2,
    }
    sessionStorage.setItem('recordList', JSON.stringify([record]))
    record.sourceId = record.sourceId
    record.sourceNo = record.sourceNo
    record.requisitionNo = record.requisitionNo

    record.totalAmount = ''
    record.partyBMemberId = record.vendorMemberId
    record.partyBRoleId = record.vendorRoleId
    record.partyBName = record.vendorMemberName
    record.sourceType = '4'
    sessionStorage.setItem('record', JSON.stringify(record))
    history.push(`/contract/manage/addList/add?contractId=${record.prpId}&sourceWay=purchase&sourceType=4`)

    // postMemberFeignLifecycleStageRuleCheckNotAstrict(param, { ctlType: 'none' }).then((res) => {
    //   if (res.data) {
    //     sessionStorage.setItem('recordList', JSON.stringify([record]))
    //     record.sourceId = record.sourceId
    //     record.sourceNo = record.sourceNo
    //     record.requisitionNo = record.requisitionNo

    //     record.totalAmount = ''
    //     record.partyBMemberId = record.vendorMemberId
    //     record.partyBRoleId = record.vendorRoleId
    //     record.partyBName = record.vendorMemberName
    //     record.sourceType = '4'
    //     sessionStorage.setItem('record', JSON.stringify(record))
    //     // return
    //     history.push(`/contract/manage/addList/add?contractId=${record.prpId}&sourceWay=purchase&sourceType=4`)
    //   } else {
    //     message.error(intl.formatMessage({ id: 'contract.creat.purchaseRequisition.tip' }))
    //   }
    // })
  }

  //表头
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'contract.purchase.number' }),
      dataIndex: 'requisitionNo',
      align: 'left',
      render: (text, record) => (
        <div>
          <EyeAuthButton
            url={`/procurementAbility/purchaseRequisition/purchaseRequisitionList/preview?id=${record.requisitionId}`}
            // type=""
          >
            {text}
          </EyeAuthButton>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.purchase.digest' }),
      dataIndex: 'digest',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.purchase.member' }),
      dataIndex: 'vendorMemberName',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.purchase.department' }),
      dataIndex: 'department',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.purchase.people' }),
      dataIndex: 'requisitioner',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.purchase.time' }),
      dataIndex: 'advanceDeliveryDate',
      align: 'left',
      sorter: (a, b) => moment(a.finishTime).valueOf() - moment(b.finishTime).valueOf(),
    },
    {
      title: intl.formatMessage({ id: 'contract.purchase.type' }),
      dataIndex: 'deliveryMethodName',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.purchase.address' }),
      dataIndex: 'deliveryAddress',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.purchase.materialNumber' }),
      dataIndex: 'productNo',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.purchase.materialName' }),
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.purchase.quantity' }),
      dataIndex: 'quantity',
      align: 'left',
      sorter: {
        compare: (a, b) => a.quantity - b.quantity,
        multiple: 1,
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.purchase.surplusQuantity' }),
      dataIndex: 'surplusQuantity',
      align: 'left',
      sorter: {
        compare: (a, b) => a.surplusQuantity - b.surplusQuantity,
        multiple: 1,
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.purchase.internalState' }),
      dataIndex: 'buyerInnerStatusName',
      align: 'left',
      render: (text) => {
        return (
          <div>
            <span style={statuStyle.point}> </span>
            <span>{text}</span>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuo' }),
      dataIndex: 'state',
      align: 'left',
      render: (_, record) => {
        return (
          <AuthButton type="custom" code="add">
            <div>
              <span style={{ color: '#00A98F', cursor: 'pointer', marginRight: 10 }} onClick={() => Like(record)}>
                {intl.formatMessage({ id: 'contract.purchase.operation.add' })}
              </span>
            </div>
          </AuthButton>
        )
      },
    },
  ]

  // const getdate = (time) => {
  //   return new Date(Date.parse(time.replace(/-/g, "/"))).getTime() / 1000;
  // }

  // 列表数据
  const fetchData = (params?: any) => {
    return new Promise((resolve) => {
      getContractPurchaseRequisitionPageToBeCreate({
        ...params,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }
  const rowSelection: any = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKey: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKey)
      setSelectRow(selectedRows)
    },
  }

  //检查是否供应商都一样
  const isAllEqual = (array) => {
    if (array.length > 0) {
      return !array.some(function (value) {
        return value.vendorMemberName !== array[0].vendorMemberName
      })
    } else {
      return true
    }
  }

  const handlePurchaseData = () => {
    const userInfo = authService.getAuth()
    const data = selectRow

    const param = []

    data.map((i) => {
      param.push({
        memberId: userInfo.memberId,
        roleId: userInfo.memberRoleId,
        subMemberId: i.vendorMemberId,
        subRoleId: i.vendorRoleId,
        lifeCycleStageRuleId: 2,
        requisitionNo: i.requisitionNo,
      })
    })
    const record = data[0]

    record.totalAmount = ''
    record.partyBMemberId = isAllEqual(selectRow) ? record.vendorMemberId : null
    record.partyBRoleId = isAllEqual(selectRow) ? record.vendorRoleId : null
    record.partyBName = isAllEqual(selectRow) ? record.vendorMemberName : null
    record.sourceType = '4'
    sessionStorage.setItem('record', JSON.stringify(data[0]))

    sessionStorage.setItem('recordList', JSON.stringify(data))
    history.push(`/contract/manage/addList/add?sourceWay=purchase&sourceType=4`)

    // postMemberFeignLifecycleStageRuleBatchCheckPleasePurchase(
    //   { memberLifeCycleStagesRuleCheckFeignVOList: param },
    //   { ctlType: 'none' },
    // ).then((res) => {
    //   if (res.message == '操作成功') {
    //     const record = data[0]

    //     record.totalAmount = ''
    //     record.partyBMemberId = isAllEqual(selectRow) ? record.vendorMemberId : null
    //     record.partyBRoleId = isAllEqual(selectRow) ? record.vendorRoleId : null
    //     record.partyBName = isAllEqual(selectRow) ? record.vendorMemberName : null
    //     record.sourceType = '4'
    //     sessionStorage.setItem('record', JSON.stringify(data[0]))

    //     sessionStorage.setItem('recordList', JSON.stringify(data))
    //     history.push(`/contract/manage/addList/add?sourceWay=purchase&sourceType=4`)
    //   } else {
    //     message.info('以下请购单号不允许创建请购单合同: ' + res.data)
    //   }
    // })
  }

  const handleBatchAdd = () => {
    if (!selectedRowKeys || !selectedRowKeys?.length) {
      message.destroy()
      message.info(translate('web.resource.contract.qingxuanzeqinggoudan'))
      return
    }

    if (isAllEqual(selectRow)) {
      console.log('供应商一致，无需弹窗提醒')
      handlePurchaseData()
    } else {
      Modal.confirm({
        width: 600,
        title: intl.formatMessage({
          id: 'material.pendingAdd.list.submit.tips',
          defaultMessage: '提交提醒',
        }),
        icon: <InfoCircleFilled rotate={180} />,
        content: (
          <div>
            <div style={{ fontSize: 14 }}>{intl.formatMessage({ id: 'contract.purchase.add.tip.title' })}</div>
            <span style={{ fontSize: 12, marginTop: 9 }}>
              {intl.formatMessage({ id: 'contract.purchase.add.tip.continue' })}
            </span>
          </div>
        ),
        okText: intl.formatMessage({ id: 'contract.purchase.continue' }),
        cancelText: intl.formatMessage({ id: 'contract.quxiao' }),
        onOk() {
          handlePurchaseData()
        },
      })
    }
  }
  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'prpId',
          }}
          columns={columns}
          currentRef={ref}
          rowSelection={rowSelection}
          fetchTableData={(params: any) => fetchData(params)}
          formilyProps={{
            ctx: {
              inline: false,
              schema: PurchaseContractListSchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'requisitionNo', FORM_FILTER_PATH)
              },
              components: {
                Submit,
              },
            },
            layouts: {
              order: 2,
              span: 20,
            },
          }}
          formilyLayouts={{
            justify: 'space-between',
          }}
          formilyChilds={{
            children: (
              <Space>
                <AuthButton type="custom" code="batch">
                  <Button icon={<PlusCircleOutlined />} type="primary" onClick={() => handleBatchAdd()}>
                    {intl.formatMessage({ id: 'contract.purchase.operation.add.batch' })}
                  </Button>
                </AuthButton>
              </Space>
            ),
            layouts: {
              span: 4,
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default BiddingList
