import React, { useRef, useState, useEffect, forwardRef } from 'react'
import { Button, Input, Select, DatePicker, Form, Drawer, message } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import moment from 'moment'
import { purchaseSchema, userchema } from '../../schema'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { column, columnsList, columnsGetList, supplierColumns } from '../Table'
import { clearModalParams } from '@/utils'
import style from '../../../constants/styles.less'
import {
  getContractManageGetContractNo,
  getContractPurchaseInquiryPageToBeCreate,
  getContractPurchaseInviteBidPageToBeCreate,
  getContractPurchaseViePricePageToBeCreate,
  getContractSelectCurrencyList,
} from '@apps/apis'
import { postMemberManageLowerProviderPage } from '@apps/apis'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { useLocation } from '@linkseeks/router-core'
const { Option } = Select
const { RangePicker } = DatePicker
const { Search } = Input

const intl = getIntl()
export interface IProps {
  fetchdata: any
  currentRef: any
  Row: any
}

const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

const Information = (props: any) => {
  const { currentRef, Row, getrow, getmemberId, sourceType, getsourceType, getbasicsVO, getroleId, getcurrency } = props
  const { state } = useLocation()
  const _state: any = state
  const refs = useRef({})
  /**
   * @param {{visible}} 显示选择合同弹出
   * @param {{rowSelection}} 单选的值
   */
  const [visible, setvisible] = useState<boolean>(false)
  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'id', type: 'radio' })
  /**
   * @param {{basicsVO}} 表单数据集合
   * */
  const [basicsVO, setbasicsVO] = useState<any>({})
  /**
   * @param {{startTime,endTime}} 开始结束时间
   * */
  const [startTime, setstartTime] = useState('')
  const [endTime, setendTime] = useState('')
  const [attrValueForm] = Form.useForm()
  const [currencyList, setCurrencyList] = useState<any>([])
  /*标记是不是手工单子*/
  const [Change, sethandleChange] = useState('1')

  /* 是否是手工单 */
  /* 控制是否禁用单据按钮 */
  const [falg, setfalg] = useState<boolean>(false)
  // const [manual, setmanual] = useState<boolean>(false)

  /* 显示弹出 */
  const Choose = (sourceTypes?) => {
    clearModalParams()
    console.log('choose type', sourceTypes)
    if (sourceTypes) {
      const Data = basicsVO
      Data.sourceType = sourceTypes
      console.log(currentRef)
      setbasicsVO(Data)
    }
    setvisible(!visible)
  }
  /* 选中的下拉框的值 */
  const handleChange = (e) => {
    basicsVO.sourceType = e
    sethandleChange(e)
    getsourceType(e)

    // 切换类型时清空 单据 供应商  金额等
    basicsVO.totalAmount = ''
    basicsVO.sourceId = ''
    basicsVO.partyBName = ''
    basicsVO.partyBMemberId = ''
    basicsVO.sourceNo = ''
    basicsVO.partyBRoleId = ''
    setbasicsVO(basicsVO)
    setfalg(false)
    // setmanual(true)
    attrValueForm.setFieldsValue({
      partyBName: '',
      sourceNo: '',
    })
    getmemberId('')
    getrow({})
    getroleId('')
    getbasicsVO({
      ...basicsVO,
      id: basicsVO?.contractId,
      startTime: startTime,
      endTime: endTime,
      contractAbstract: attrValueForm.getFieldsValue().contractAbstract,
      oldContractId: basicsVO?.contractId,
    })
  }
  /* 选中的下拉框币别的值 */
  const handleChangeCurrency = (w, e) => {
    getcurrency({ currencyType: e?.value, currencyName: e?.children })
  }
  /* 时间选中 */
  const onChange = (value: any) => {
    console.log(value)
    const startTimes = moment(Number(value[0])).format('YYYY-MM-DD HH:mm:ss')
    const endTimes = moment(Number(value[1])).format('YYYY-MM-DD HH:mm:ss')

    getbasicsVO({
      ...basicsVO,
      startTime: startTimes,
      endTime: endTimes,
    })
    setstartTime(startTimes)
    setendTime(endTimes)
  }

  /* 根据 sourceType 设置搜索内容 */
  const ctx = () => {
    if (basicsVO.sourceType == 1) {
      const data = {
        ctx: {
          inline: false,
          schema: purchaseSchema,
          effects: ($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'demandNO', FORM_FILTER_PATH)
          },
          components: {
            DateRangePickerUnix,
            Submit,
          },
        },
      }
      return data
    } else {
      const data = {
        ctx: {
          inline: false,
          schema: userchema,
          components: {
            DateRangePickerUnix,
            Submit,
          },
        },
      }
      return data
    }
  }

  /* 获取合同编号 */
  useEffect(() => {
    getContractManageGetContractNo().then((res) => {
      console.log(res.data)
      const basics: any = {}
      if (res.code === 1000) {
        basics.contractNo = res.data
        //需求池转入
        if (_state?.demandPoolData) {
          basics.partyBName = _state?.demandPoolData?.vendorMemberName
          basics.partyBMemberId = _state?.demandPoolData?.vendorMemberId
          basics.partyBRoleId = _state?.demandPoolData?.vendorRoleId
          basics.sourceType = '4'
          // handleChange('4')
        }
        console.log(basics)
        setbasicsVO(basics)
      }
    })
  }, [])

  /* 获取币别列表 */
  useEffect(() => {
    getContractSelectCurrencyList().then((res) => {
      if (res.code === 1000) {
        setCurrencyList(res.data)
      }
    })
  }, [])
  /* 获取传入组建的值 */
  useEffect(() => {
    console.log(Row.sourceId)
    basicsVO.contractNo = basicsVO.contractNo ? basicsVO.contractNo : ''
    basicsVO.contractId = Row.contractId ? Row.contractId : 0
    basicsVO.sourceNo = Row.sourceNo ? Row.sourceNo : ''
    basicsVO.sourceId = Row.sourceId ? Row.sourceId : ''
    basicsVO.totalAmount = Row.totalAmount ? Number(Row.totalAmount).toFixed(2) : ''

    if (!_state?.demandPoolData) {
      basicsVO.sourceType = Row.sourceType ? Row.sourceType + '' : '1'
      basicsVO.partyBName = Row.partyBName ? Row.partyBName : ''
      basicsVO.partyBMemberId = sourceType === '1' ? (Row.awardRoleId ? Row.awardMemberId : '') : Row.partyBMemberId
      basicsVO.partyBRoleId = sourceType === '1' ? (Row.awardRoleId ? Row.awardRoleId : '') : Row.partyBRoleId
    }

    console.log(Row, basicsVO)
    setbasicsVO(basicsVO)

    getbasicsVO({
      ...basicsVO,
      id: basicsVO?.contractId,
      oldContractId: basicsVO?.contractId,
    })

    attrValueForm.setFieldsValue(basicsVO)
    setfalg(Row.sourceNo ? true : false)
    // setmanual(Row.partyBName ? true : false)

    sethandleChange(basicsVO.sourceType)
  }, [basicsVO])

  /**
   * @function fetchData 容需求发布
   **/
  const fetchData = (params: any) => {
    ctx()
    let fn
    switch (basicsVO.sourceType) {
      case '1':
        fn = getContractPurchaseInquiryPageToBeCreate
        params.lifeCycleStageRuleId = 2
        break
      case '2':
        fn = getContractPurchaseInviteBidPageToBeCreate
        params.lifeCycleStageRuleId = 2
        break
      case '3':
        fn = getContractPurchaseViePricePageToBeCreate
        params.lifeCycleStageRuleId = 2
        break
      case '6':
        fn = postMemberManageLowerProviderPage
        params.lifeCycleStageRuleId = 2
        break
      default:
        break
    }
    return new Promise((resolve) => {
      fn({ ...params }, { ctlType: 'none' })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }
  /* 确认选中 */
  const Confirm = () => {
    console.log('change member confirm:', Change)
    if (basicsVO.sourceType == '6') {
      setfalg(!falg)
      basicsVO.partyBName = RowCtl.selectRow[0].name
      basicsVO.partyBMemberId = RowCtl.selectRow[0].memberId
      basicsVO.partyBRoleId = RowCtl.selectRow[0].roleId
      basicsVO.sourceType = Change
      setfalg(true)
      attrValueForm.setFieldsValue(basicsVO)
      getmemberId(basicsVO.partyBMemberId)
      getroleId(basicsVO.partyBRoleId)
      getbasicsVO({
        ...basicsVO,
        id: basicsVO?.contractId,
        startTime: startTime,
        endTime: endTime,
        contractAbstract: attrValueForm.getFieldsValue().contractAbstract,
        oldContractId: basicsVO?.contractId,
      })
    } else {
      let totalAmount, sourceId, partyBName, partyBMemberId, sourceNo, partyBRoleId
      const selectRow = RowCtl.selectRow[0]
      console.log(selectRow, '111')
      switch (basicsVO.sourceType) {
        case '1':
          totalAmount = selectRow.awardAmount
          sourceId = selectRow.demandId
          sourceNo = selectRow.demandNO
          partyBName = selectRow.awardName
          partyBMemberId = selectRow.awardMemberId
          partyBRoleId = selectRow.awardRoleId
          break
        case '2':
          totalAmount = selectRow.bidWinnerAmount
          sourceId = selectRow.bidId
          partyBName = selectRow.bidWinnerName
          sourceNo = selectRow.inviteBidNO
          partyBMemberId = selectRow.bidWinnerMemberId
          partyBRoleId = selectRow.bidWinnerRoleId
          break
        case '3':
          totalAmount = selectRow.awardAmount
          sourceId = selectRow.viePriceId
          partyBName = selectRow.awardName
          partyBMemberId = selectRow.awardMemberId
          partyBRoleId = selectRow.awardRoleId
          sourceNo = selectRow.viePriceNO

          break
        default:
          break
      }
      basicsVO.totalAmount = Number(totalAmount).toFixed(2)
      basicsVO.sourceId = sourceId
      basicsVO.partyBName = partyBName
      basicsVO.partyBMemberId = partyBMemberId
      basicsVO.sourceNo = sourceNo
      basicsVO.partyBRoleId = partyBRoleId
      setbasicsVO(basicsVO)
      // setmanual(true)
      attrValueForm.setFieldsValue(basicsVO)
      selectRow.partyBMemberId = selectRow.awardMemberId
      selectRow.partyBRoleId = selectRow.awardRoleId
      getmemberId(partyBMemberId)
      getrow(selectRow)
      getroleId(basicsVO.partyBRoleId)
      getbasicsVO({
        ...basicsVO,
        id: basicsVO?.contractId,
        startTime: startTime,
        endTime: endTime,
        contractAbstract: attrValueForm.getFieldsValue().contractAbstract,
        oldContractId: basicsVO?.contractId,
      })
    }
    Choose()
  }
  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          attrValueForm
            .validateFields()
            .then((res) => {
              resolve({
                state: true,
                name: 'basic',
                data: Object.assign(res, {
                  id: 0,
                  partyBRoleId: basicsVO.partyBRoleId,
                  startTime,
                  endTime,
                  sourceId: basicsVO.sourceId,
                  totalAmount: basicsVO.totalAmount,
                  partyBMemberId: basicsVO.partyBMemberId,
                  partyBName: basicsVO.partyBName,
                  oldContractId: 0,
                }),
              })
            })
            .catch((error) => {
              if (error && error.errorFields) {
                message.info(intl.formatMessage({ id: 'contract.qingshurujibenziliaobi' }))
              }
            })
        }),
    }
  })

  const rangeConfig = {
    rules: [
      {
        type: 'array' as const,
        required: true,
        message: intl.formatMessage({ id: 'contract.qingxuanzekaishihuozhejie' }),
      },
    ],
  }

  return (
    <div className={style.revise_info}>
      <Form
        form={attrValueForm}
        name="edit_infomation"
        layout="horizontal"
        labelAlign="left"
        colon={false}
        autoComplete="off"
        {...layout}
      >
        <Form.Item
          label={intl.formatMessage({ id: 'contract.hetongbianhao' })}
          labelAlign="left"
          name="contractNo"
          initialValue={basicsVO.contractNo}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'contract.qingshuruhetongbianhao' }),
            },
          ]}
        >
          <Input disabled placeholder={intl.formatMessage({ id: 'contract.qingshuruhetongbianhao' })} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'contract.hetongzhaiyao' })}
          labelAlign="left"
          name="contractAbstract"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'contract.qingshuruhetongzhaiyao' }),
            },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'contract.qingshuruhetongzhaiyao' })} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'contract.xunyuanleixing' })}
          labelAlign="left"
          name="sourceType"
          initialValue={basicsVO.sourceType}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'contract.qingxuanzexunyuanleixing' }),
            },
          ]}
        >
          <Select onChange={handleChange} disabled={sourceType ? true : false}>
            <Option value="1">{intl.formatMessage({ id: 'contract.caigouxunjia' })}</Option>
            <Option value="2">{intl.formatMessage({ id: 'contract.caigouzhaobiao' })}</Option>
            <Option value="3">{intl.formatMessage({ id: 'contract.caigoujingjia' })}</Option>
            <Option value="4">{intl.formatMessage({ id: 'contract.purchase.title' })}</Option>
            <Option value="5">{intl.formatMessage({ id: 'contract.framework.title' })}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'contract.hetongyouxiaoqi' })}
          labelAlign="left"
          name="range-picker"
          {...rangeConfig}
        >
          <RangePicker style={{ width: '100%' }} onChange={(e) => onChange(e)} />
        </Form.Item>

        {basicsVO.sourceType == 1 || basicsVO.sourceType == 2 || basicsVO.sourceType == 3 ? (
          <Form.Item
            label={intl.formatMessage({ id: 'contract.duiyingdanju' })}
            labelAlign="left"
            name="sourceNo"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'stockSellStorage.qingxuanzeduiyingdanju' }),
              },
            ]}
            initialValue={basicsVO.sourceNo ? basicsVO.sourceNo : ''}
          >
            {falg ? (
              <Input placeholder={intl.formatMessage({ id: 'contract.zuichang60gezifu30ge' })} disabled />
            ) : (
              <Search
                placeholder={intl.formatMessage({ id: 'contract.zuichang60gezifu30ge' })}
                readOnly
                enterButton={
                  <div onClick={() => Choose(basicsVO.sourceType == '4' ? Change : basicsVO.sourceType)}>
                    <LinkOutlined /> {intl.formatMessage({ id: 'contract.xuanze' })}
                  </div>
                }
              />
            )}
          </Form.Item>
        ) : null}

        <Form.Item
          label={intl.formatMessage({ id: 'contract.supplier' })}
          labelAlign="left"
          name="partyBName"
          initialValue={basicsVO.partyBName ? basicsVO.partyBName : ''}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'supplier.management.import.query.introduceDrewer.required',
              }),
            },
          ]}
        >
          {basicsVO.sourceType == 1 || basicsVO.sourceType == 2 || basicsVO.sourceType == 3 ? (
            <Input placeholder={intl.formatMessage({ id: 'contract.zuichang60gezifu30ge' })} disabled />
          ) : (
            <Search
              placeholder={intl.formatMessage({ id: 'contract.zuichang60gezifu30ge' })}
              readOnly
              enterButton={
                <div onClick={() => Choose('6')}>
                  <LinkOutlined /> {intl.formatMessage({ id: 'contract.xuanze' })}
                </div>
              }
            />
          )}
        </Form.Item>

        {/* 币别 */}
        <Form.Item
          label={intl.formatMessage({ id: 'contract.currency' })}
          labelAlign="left"
          name="currencyType"
          initialValue={basicsVO.currency ? basicsVO.currency : ''}
        >
          <Select onChange={handleChangeCurrency} placeholder={intl.formatMessage({ id: 'contract.currency.tip' })}>
            {currencyList?.length ? currencyList.map((item) => <Option value={item.id}>{item.text}</Option>) : null}
          </Select>
        </Form.Item>

        <Form.Item label={intl.formatMessage({ id: 'contract.contractAmount' })} labelAlign="left">
          <p>{basicsVO.totalAmount ? `${intl.formatMessage({ id: 'common.money' })}${basicsVO.totalAmount}` : ''}</p>
        </Form.Item>
      </Form>

      {/* 选择弹出内容 */}
      <Drawer
        visible={visible}
        onClose={() => setvisible(!visible)}
        title={
          basicsVO.sourceType == '1'
            ? intl.formatMessage({ id: 'contract.xuanzecaigouxuqiudan' })
            : basicsVO.sourceType == '2'
            ? intl.formatMessage({ id: 'contract.xuanzezhaobiaoxuqiudan' })
            : basicsVO.sourceType == '3'
            ? intl.formatMessage({ id: 'contract.xuanzejingjiaxuqiudan' })
            : intl.formatMessage({ id: 'contract.xuanzehuiyuan' })
        }
        width={900}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => setvisible(!visible)} style={{ marginRight: 8 }}>
              {intl.formatMessage({ id: 'contract.quxiao' })}
            </Button>
            <Button type="primary" onClick={() => Confirm()}>
              {intl.formatMessage({ id: 'contract.queding' })}
            </Button>
          </div>
        }
        destroyOnClose
      >
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={
            basicsVO.sourceType == '1'
              ? column
              : basicsVO.sourceType == '2'
              ? columnsList
              : basicsVO.sourceType == '3'
              ? columnsGetList
              : supplierColumns
          }
          currentRef={refs}
          rowSelection={rowSelection}
          fetchTableData={(params: any) => fetchData(params)}
          formilyProps={ctx()}
        />
      </Drawer>
    </div>
  )
}

export default forwardRef(Information)
