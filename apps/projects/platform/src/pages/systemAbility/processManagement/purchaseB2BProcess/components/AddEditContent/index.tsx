/**
 * 系统能力 - 流程引擎 - 采购订单(B2B)流程规则配置 新增/编辑/详情公共组件
 * @author: Crayon
 */
import React, { useEffect, useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import BaseInfo from '@/components/BaseInfo/BaseInfo'
import { Form } from 'antd'
import { commonProgressProps, commonTabLink } from '../../../constants'
import ProcessImage from '../../../components/ProcessImage'
import ProcessRules from '../../../components/ProcessRuleConfig/ProcessRules'
import ContentLayout from '@/components/ContentLayout'
import { PAGE_TYPE } from '@/constants'
import ProcessName from '../../../components/ProcessName'
import ProcessBaseRadio from '../../../components/ProcessBaseRadio'
import ProcessCancelTime from '../../../components/ProcessCancelTime'
import ProcessContract from '../../../components/ProcessContract'
import ProcessPayConfig from '../../../components/ProcessPayConfig'
import {
  getOrderTradeProcessBaseTradeProcessB2B,
  getOrderTradeProcessGetB2B,
  postOrderTradeProcessCreateB2B,
  postOrderTradeProcessSaveDefault,
  postOrderTradeProcessUpdateB2B,
} from '@apps/apis'
import { Select_Content_Type } from '@/components/EngConfigComponent/constant'

type PropsType = {
  pageType: 'add' | 'edit' | 'view'
  id?: string
  btnCode?: string
  title?: string | React.ReactNode
}

const intl = getIntl()

const BaseTabLink = [
  ...commonTabLink.slice(0, 3),
  {
    key: 'processInfo',
    label: intl.formatMessage({
      id: 'processRuleSetting.liuchengxinxi',
      defaultMessage: '流程信息',
    }),
  },
  {
    key: 'payConfig',
    label: intl.formatMessage({ id: 'processRuleSetting.zhifupeizhi', defaultMessage: '支付配置' }),
  },
  {
    key: 'processRule',
    label: intl.formatMessage({
      id: 'processRuleSetting.liuchengguize',
      defaultMessage: '流程规则',
    }),
  },
]

const getTabLink = (processBaseItem: any, isDefault: boolean) => {
  let newBaseTabLink = isDefault ? BaseTabLink.slice(0, 5) : BaseTabLink
  newBaseTabLink = processBaseItem.payTimes > 0 ? newBaseTabLink : newBaseTabLink.filter((i) => i.key !== 'payConfig')
  return processBaseItem.processType === 1 ? newBaseTabLink : newBaseTabLink.filter((i) => i.key !== 'processInfo')
}

const AddEditContent: React.FC<PropsType> = ({ id: processId, btnCode, title, pageType }) => {
  const [form] = Form.useForm()
  const [processBaseList, setProcessBaseList] = useState<any[]>([])
  const [processBaseItem, setProcessBaseItem] = useState<any>({})
  const [isDefault, setIsDefault] = useState<boolean>(false)

  const ref = useRef<any>()
  const processRulesRef = useRef<any>()

  const disabled = pageType === PAGE_TYPE.VIEW

  /** 提交  */
  const handleSubmit = (setLoading: Function, handleLeave: Function) => {
    form.validateFields().then((values) => {
      let params: any = {
        processId,
        ...values,
        hasContract: values.hasContract || false,
      }
      // 基本的流程规则修改或新增
      let requestApi = pageType === PAGE_TYPE.EDIT ? postOrderTradeProcessUpdateB2B : postOrderTradeProcessCreateB2B
      // 修改默认流程规则比较特殊，需要调整参数以及特定的接口
      if (isDefault) {
        params = {
          processId: values.baseProcessId,
          payments: values.payments || undefined,
        }
        requestApi = postOrderTradeProcessSaveDefault
      }
      setLoading?.(true)
      requestApi(params)
        .then(({ code }) => {
          if (code === 1000) {
            handleLeave?.(false)
            history.goBack()
          }
        })
        .finally(() => {
          setLoading?.(false)
        })
    })
  }

  /** 流程选择变化 */
  const onProcessBaseChange = (v, i, lastValue) => {
    setProcessBaseItem(i)

    // 新增的时候每次点击流程选择都重置下支付批次支付比例数据
    // 修改或查看的时候，第一次的时候不重置（即 lastValue 不存在的时候不重置， 因为获取详情的时候已经 set 过数据了）
    if (pageType === PAGE_TYPE.ADD || !!lastValue) {
      // 若支付批次大于 0，则设置支付配置数据
      if (i.payTimes > 0) {
        form.setFieldsValue({
          payments: i.payments,
        })
      }
      // 重置支付比例的数据
      const payRate: any = {}
      Object.keys(form.getFieldsValue())
        ?.filter((item) => item.includes('payRate_'))
        ?.forEach((item) => {
          payRate[item] = ''
        })
      if (!!Object.keys(payRate).length) {
        form.setFieldsValue(payRate)
      }
    }

    // 更改基础流程需要重新获取并设置字段数据
    processRulesRef?.current?.setFieldsType({ engineId: i?.engineId })
    // 由于字段数据变化，流程规则配置需要重置
    // lastValue 表示流程选择的上一个值，lastValue 存在才重置
    if (!!lastValue) {
      processRulesRef?.current?.resetCache()
    }

    const param = {
      [Select_Content_Type.SelectGoods]: {
        priceTypeList: i.processType === 1 ? [1, 2, 4] : i.processType === 6 ? [3] : i.processType === 7 ? [1, 4] : '',
        isCrossBorder: i.processType === 7 ? true : false,
      },
      [Select_Content_Type.SelectSourceMall]: {
        type: i.processType === 6 ? 2 : 1,
      },
    }
    processRulesRef?.current?.setDrawerSelectFetchParams(param)
  }

  /** 获取基础流程数据 */
  const getProcessBaseList = async (params: any = {}) => {
    const { code, data } = await getOrderTradeProcessBaseTradeProcessB2B(params)
    if (code === 1000) {
      setProcessBaseList(data)
    }
  }

  /** 获取详情 */
  const getDetail = async () => {
    if (processId) {
      const { code, data } = await getOrderTradeProcessGetB2B({ processId })
      if (code === 1000) {
        form.setFieldsValue(data)
        // 设置是否为修改默认
        setIsDefault(data.isDefault === 1)
        // 修改默认的情况下获取基础流程数据需要传类型参数
        getProcessBaseList(data.isDefault === 1 ? { processType: data?.processType } : {})
        // 设置信息完整度
        ref?.current?.setProgress()
      }
    } else {
      getProcessBaseList()
    }
  }

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <ContentLayout
      ref={ref}
      form={form}
      title={title}
      pageType={pageType}
      tabLink={getTabLink(processBaseItem, isDefault)}
      btnCode={btnCode}
      onSubmit={handleSubmit}
      onFieldsChange={(_, _all) => {
        processRulesRef?.current?.setFieldsChange(_, _all)
      }}
      progressListFieldsConfig={[
        ...commonProgressProps.progressListFieldsConfig,
        {
          parentField: 'payments',
          valueField: [],
          children: {
            parentField: 'nodes',
            valueField: ['payNode', 'payRate'],
          },
        },
      ]}
    >
      <BaseInfo className="mt-0">
        <ProcessName pageType={pageType} disabled={disabled || isDefault} isDefault={isDefault} />
      </BaseInfo>
      <BaseInfo cols={1}>
        <ProcessBaseRadio
          disabled={disabled}
          dataSource={processBaseList}
          onValueChange={onProcessBaseChange}
          processKey="baseProcessid"
          tagColorConfig={[
            { type: 1, color: 'red' },
            { type: 6, color: 'orange' },
          ]}
        />
      </BaseInfo>
      <BaseInfo cols={1}>
        <ProcessImage processKey="baseProcessid" dataSource={processBaseList} />
      </BaseInfo>
      {
        // 交易订单流程 订单取消时间/合同配置
        processBaseItem.processType === 1 && (
          <BaseInfo gap={8}>
            <ProcessCancelTime disabled={disabled || isDefault} />
            <div>
              <ProcessContract disabled={disabled || isDefault} />
            </div>
          </BaseInfo>
        )
      }
      {
        // 多次支付配置
        // 修改默认的时候符合条件的情况下也可以修改支付配置
        processBaseItem.payTimes > 0 && (
          <BaseInfo cols={1}>
            <ProcessPayConfig disabled={disabled} />
          </BaseInfo>
        )
      }
      {!isDefault && (
        <BaseInfo cols={1}>
          <ProcessRules ref={processRulesRef} form={form} disabled={disabled || isDefault} />
        </BaseInfo>
      )}
    </ContentLayout>
  )
}

export default AddEditContent
