import React, { useEffect, useState } from 'react'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { EyeAuthButton } from '@apps/components'
import { findItemAndDelete, formatTimeString } from '@/utils'
import { ISchemaFormActions, ISchema, FormEffectHooks } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import NiceForm from '@/components/NiceForm'
import ModalTable from '@/components/ModalTable'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import Search from '@/components/NiceForm/components/Search'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import SelectProcesss from './selectProcesss'
import { getContractManagePageCompleteList } from '@apps/apis'
import { getOrderPurchaseProcessContractPage, getOrderPurchaseProcessGet } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

export interface RuleSettingProps {
  addSchemaAction: ISchemaFormActions
  schema: ISchema
  onFieldChange?()
  formSubmit?(values)
}

const RuleSetting: React.FC<RuleSettingProps> = (props) => {
  const { addSchemaAction, schema, formSubmit, onFieldChange = () => {} } = props
  const [visibleChannelRroduct, setVisibleChannelRroduct] = useState(false)
  const [productRowSelection, productRowCtl] = useRowSelectionTable({ customKey: 'id' })
  const [productsLength, setProductsLength] = useState(0)
  const [initValue, setInitialValue] = useState({})

  const intl = useIntl()

  const { id, preview, pageStatus } = usePageStatus()

  const fetchContractList = (params: any) => {
    if (!params?.name) delete params.name
    return new Promise((resolve, reject) => {
      getContractManagePageCompleteList(params).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  // table删除合同
  const handleDeleteTable = (id) => {
    const value = addSchemaAction.getFieldValue('contracts')
    addSchemaAction.setFieldValue('contracts', findItemAndDelete(value, id, 'contractId'))
  }

  const handleAddBtn = () => {
    const checkBoxs = addSchemaAction.getFieldValue('contracts')
    productRowCtl.setSelectedRowKeys(checkBoxs.map((v) => v.contractId))
    productRowCtl.setSelectRow(processFields(checkBoxs, true))
    setVisibleChannelRroduct(true)
  }

  // 新增合同
  const tableAddButton = (
    <Button
      style={{ marginBottom: 16 }}
      block
      icon={<PlusOutlined />}
      disabled={pageStatus === PageStatus.PREVIEW}
      onClick={handleAddBtn}
      type="dashed"
    >
      {intl.formatMessage({ id: 'components.xuanzezhidinghetong' })}
    </Button>
  )

  const tableColumns = [
    {
      dataIndex: 'contractId',
      title: 'ID',
      key: 'contractId',
      className: 'commonHide',
    },
    {
      dataIndex: 'contractNo',
      title: intl.formatMessage({ id: 'processRuleSetting.hetongbianhao', defaultMessage: '合同编号' }),
      key: 'contractNo',
      render: (_, record) => (
        <EyeAuthButton url={`/contract/manage/QueryList/QueryListdetails?contractId=${record.contractId}`}>
          {_}
        </EyeAuthButton>
      ),
    },
    {
      dataIndex: 'digest',
      title: intl.formatMessage({ id: 'processRuleSetting.hetongzhaiyao', defaultMessage: '合同摘要' }),
      key: 'digest',
    },
    {
      dataIndex: 'effectTime',
      title: intl.formatMessage({ id: 'processRuleSetting.hetongshengxiao', defaultMessage: '合同生效/失效时间' }),
      key: 'startTime',
      render: (t, r) => (
        <>
          <div>{t}</div>
          <div>{r.expireTime}</div>
        </>
      ),
    },
    {
      dataIndex: 'partyB',
      title: intl.formatMessage({ id: 'processRuleSetting.hetongyifang', defaultMessage: '合同乙方' }),
      key: 'partyB',
    },
    {
      dataIndex: 'receiptNo',
      title: intl.formatMessage({ id: 'processRuleSetting.duiyingdanju', defaultMessage: '对应单据' }),
      key: 'receiptNo',
    },
    {
      dataIndex: 'contractType',
      title: intl.formatMessage({ id: 'processRuleSetting.xunyuanleixing', defaultMessage: '寻源类型' }),
      key: 'contractType',
      render: (text: any, reocrd: any) => {
        if (text === 1) return intl.formatMessage({ id: 'processRuleSetting.caigouxunjia', defaultMessage: '采购询价' })
        else if (text === 2)
          return intl.formatMessage({ id: 'processRuleSetting.caigouzhaobiao', defaultMessage: '采购招标' })
        else if (text === 3)
          return intl.formatMessage({ id: 'processRuleSetting.caigoujingjia', defaultMessage: '采购竞价' })
      },
    },
    {
      dataIndex: 'ctl',
      title: intl.formatMessage({ id: 'processRuleSetting.caozuo', defaultMessage: '操作' }),
      render: (_, record) => (
        <Button
          type="link"
          disabled={pageStatus === PageStatus.PREVIEW}
          onClick={() => handleDeleteTable(record.contractId)}
        >
          {intl.formatMessage({ id: 'processRuleSetting.shanchu', defaultMessage: '删除' })}
        </Button>
      ),
    },
  ]

  // 规则设置表单提交
  const handleSubmit = async (values) => {
    formSubmit && formSubmit(values)
  }

  const processFields = (contractLists, render) => {
    return render
      ? contractLists.map((item) => ({
          id: item['contractId'],
          contractNo: item['contractNo'],
          contractAbstract: item['digest'],
          startTime: item['effectTime'],
          endTime: item['expireTime'],
          partyBName: item['partyB'],
          totalAmount: item['amount'],
          sourceType: item['contractType'],
          sourceNo: item['receiptNo'],
        }))
      : contractLists.map((item) => ({
          contractId: item['id'],
          contractNo: item['contractNo'],
          digest: item['contractAbstract'],
          effectTime: item['startTime'],
          expireTime: item['endTime'],
          partyB: item['partyBName'],
          amount: item['totalAmount'],
          contractType: item['sourceType'],
          receiptNo: item['sourceNo'],
        }))
  }

  const handleOkAdd = async () => {
    setVisibleChannelRroduct(false)
    setProductsLength(productRowCtl.selectRow.length)
    addSchemaAction.setFieldValue('contracts', processFields(productRowCtl.selectRow, false))
    clearModalParams()
  }

  const handleCancelAdd = () => {
    setVisibleChannelRroduct(false)
    clearModalParams()
  }

  const clearModalParams = () => {
    let currentState = JSON.parse(sessionStorage.getItem('currentState'))
    let result = { ...currentState, queryParams: {}, current: 1 }
    sessionStorage.setItem('currentState', JSON.stringify(result))
  }

  const columnsSetContract: any[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      key: 'id',
      className: 'commonHide',
    },
    {
      dataIndex: 'contractNo',
      title: intl.formatMessage({ id: 'processRuleSetting.hetongbianhao', defaultMessage: '合同编号' }),
      key: 'contractNo',
    },
    {
      dataIndex: 'digest',
      title: intl.formatMessage({ id: 'processRuleSetting.hetongzhaiyao', defaultMessage: '合同摘要' }),
      key: 'digest',
    },
    {
      dataIndex: 'startTime',
      title: intl.formatMessage({ id: 'processRuleSetting.hetongshengxiao', defaultMessage: '合同生效/失效时间' }),
      key: 'startTime',
      render: (t, r) => (
        <>
          <div>{formatTimeString(t)}</div>
          <div>{formatTimeString(r.endTime)}</div>
        </>
      ),
    },
    {
      dataIndex: 'partyBName',
      title: intl.formatMessage({ id: 'processRuleSetting.hetongyifang', defaultMessage: '合同乙方' }),
      key: 'partyBName',
    },
    {
      dataIndex: 'sourceNo',
      title: intl.formatMessage({ id: 'processRuleSetting.duiyingdanju', defaultMessage: '对应单据' }),
      key: 'sourceNo',
    },
    {
      dataIndex: 'sourceType',
      title: intl.formatMessage({ id: 'processRuleSetting.xunyuanleixing', defaultMessage: '寻源类型' }),
      key: 'sourceType',
      render: (text: any, reocrd: any) => {
        if (text === 1) return intl.formatMessage({ id: 'processRuleSetting.caigouxunjia', defaultMessage: '采购询价' })
        else if (text === 2)
          return intl.formatMessage({ id: 'processRuleSetting.caigouzhaobiao', defaultMessage: '采购招标' })
        else if (text === 3)
          return intl.formatMessage({ id: 'processRuleSetting.caigoujingjia', defaultMessage: '采购竞价' })
      },
    },
  ]

  // 合同列表弹框高级筛选
  const formContract: ISchema = {
    type: 'object',
    properties: {
      contractNo: {
        type: 'string',
        'x-component': 'ModalSearch',
        'x-component-props': {
          placeholder: intl.formatMessage({ id: 'processRuleSetting.hetongbianhao', defaultMessage: '合同编号' }),
          align: 'flex-left',
        },
      },
      [FORM_FILTER_PATH]: {
        type: 'object',
        'x-component': 'flex-layout',
        'x-component-props': {
          rowStyle: {
            flexWrap: 'nowrap',
            style: {
              marginRight: 0,
            },
          },
          colStyle: {
            marginTop: 20,
          },
        },
        properties: {
          contractAbstract: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'processRuleSetting.hetongzhaiyao', defaultMessage: '合同摘要' }),
            },
          },
          partyBName: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'processRuleSetting.hetongyifang', defaultMessage: '合同乙方' }),
            },
          },
          '[startTime,endTime]': {
            type: 'array',
            'x-component': 'DateRangePickerUnix',
            'x-component-props': {
              placeholder: [
                intl.formatMessage({ id: 'processRuleSetting.hetongshengxiaoshi', defaultMessage: '合同生效时间' }),
                intl.formatMessage({ id: 'processRuleSetting.hetongshixiaoshi', defaultMessage: '合同失效时间' }),
              ],
            },
          },
          submit: {
            'x-component': 'Submit',
            'x-mega-props': {
              span: 1,
            },
            'x-component-props': {
              children: intl.formatMessage({ id: 'processRuleSetting.chaxun', defaultMessage: '查询' }),
            },
          },
        },
      },
    },
  }

  useEffect(() => {
    async function getInitValue() {
      const { data } = await getOrderPurchaseProcessGet({ processId: id })
      if (!data.allContracts) {
        const res = await getBindingContracts({ id: id.toString(), current: '1', pageSize: '1000', digest: '' })
        addSchemaAction.setFieldState('contracts', (state) => {
          state.value = res.data
        })
        setProductsLength(res.totalCount)
      }
      addSchemaAction.setFieldValue('allContracts', data.allContracts)
      setInitialValue(data)
    }
    if (id != '') {
      getInitValue()
    }
  }, [id])

  // 拿到绑定的合同
  const getBindingContracts = async ({ id = '1', current = '1', pageSize = '10', digest = '' }) => {
    const res = await getOrderPurchaseProcessContractPage({ processId: id, current, pageSize, digest })
    return res.data
  }

  const paginationChange = async (page: number, size: number) => {
    if (id !== '') {
      const result = await getBindingContracts({ id, current: page.toString(), pageSize: size.toString() })
      addSchemaAction.setFieldValue('contracts', result.data)
    }
  }

  return (
    <>
      <NiceForm
        previewPlaceholder=" "
        editable={pageStatus !== PageStatus.PREVIEW}
        initialValues={initValue}
        expressionScope={{
          tableColumns,
          tableAddButton,
          paginationChange,
          productsLength,
        }}
        components={{
          SelectProcesss,
        }}
        effects={($, { setFieldState }) => {
          FormEffectHooks.onFormInputChange$().subscribe(() => {
            onFieldChange()
          })
        }}
        onSubmit={handleSubmit}
        actions={addSchemaAction}
        schema={schema}
      />

      {/* 选择适用合同 */}
      <ModalTable
        modalTitle={intl.formatMessage({ id: 'processRuleSetting.xuanzeshiyonghe', defaultMessage: '选择适用合同' })}
        confirm={handleOkAdd}
        cancel={handleCancelAdd}
        visible={visibleChannelRroduct}
        columns={columnsSetContract}
        rowSelection={productRowSelection}
        resetModal={{ destroyOnClose: true }}
        fetchTableData={(params) => fetchContractList(params)}
        formilyProps={{
          ctx: {
            schema: formContract,
            components: {
              ModalSearch: Search,
              SearchSelect,
              Submit,
            },
            effects: ($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'contractNo', FORM_FILTER_PATH)
            },
          },
        }}
        tableProps={{
          rowKey: 'id',
        }}
      />
    </>
  )
}

RuleSetting.defaultProps = {}

export default RuleSetting
