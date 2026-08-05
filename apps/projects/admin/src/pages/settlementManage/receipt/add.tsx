/*
 * @Author: Bill
 * @Date: 2020-10-19 15:51:44
 * @Description: 结算规则配置 -> 发票管理 -> 新增发票 / 修改发票
 */

import React, { useState, useEffect } from 'react'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormButtonGroup, Submit } from '@apps/formily'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Button } from 'antd'
import SchemaSwitch from '../platformSettlement/components/SchemaSwitch'
import SchemaRadio from '../platformSettlement/components/SchemaRadio'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import {
  getSettlementPlatformConfigGetPlatformInvoiceDetail,
  postSettlementPlatformConfigAddPlatformInvoice,
  postSettlementPlatformConfigUpdatePlatformInvoice,
} from '@apps/apis'

const formActions = createFormActions()

const schema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        wrapperCol: 8,
        labelAlign: 'left',
      },
      properties: {
        type: {
          type: 'string',
          title: '开具类型',
          'x-component': 'SchemaRadio',
          'x-component-props': {
            default: 1,
            enum: [
              { label: '企业（默认）', value: 1 },
              { label: '个人', value: 2 },
            ],
          },
          'x-rules': [{ required: true, message: '请选择发货人' }],
        },
        kind: {
          type: 'string',
          title: '发票种类',
          'x-component': 'SchemaRadio',
          'x-component-props': {
            default: 1,
            enum: [
              { label: '增值税普通发票（默认）', value: 1 },
              { label: '增值税专用发票', value: 2 },
            ],
          },

          'x-rules': [{ required: true, message: '请选择发票种类' }],
        },
        invoiceTitle: {
          type: 'string',
          title: '发票抬头',
          'x-rules': [
            { required: true, message: '请填写发票抬头' },
            { limitByte: true, maxByte: 40 },
          ],
        },
        taxNo: {
          type: 'string',
          title: '纳税号',
          'x-rules': [
            { required: true, message: '请填写纳税号' },
            { limitByte: true, maxByte: 20, allowChineseTransform: false },
          ],
        },
        bankOfDeposit: {
          type: 'string',
          title: '开户行',
          'x-rules': [{ limitByte: true, maxByte: 40 }],
        },
        account: {
          type: 'string',
          title: '账号',
          'x-rules': [{ pattern: /^[0-9]{8,20}$/, message: '请填写正确的银行账号' }],
        },
        address: {
          type: 'text',
          title: '地址',
          'x-component': 'textarea',
          'x-rules': [{ limitByte: true, maxByte: 80 }],
        },
        tel: {
          type: 'string',
          title: '电话号码',
          'x-rules': [
            { limitByte: true, maxByte: 80 },
            { pattern: /^0\d{2,3}-?\d{7,8}$/, message: '请填写正确的电话号码' },
          ],
        },
        isDefault: {
          type: 'object',
          title: '是否默认',
          'x-component': 'SchemaSwitch',
        },
      },
    },
  },
}

const Info: React.FC = () => {
  const [initialValue, setInitialValue] = useState({})
  const { id, preview } = usePageStatus()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(true)
  const isAdd = !id && !preview

  usePrompt({ when: unsaved, message: '内容未保存，确定要离开？' })

  const handleSubmit = (value) => {
    console.log(value)

    const serviceActions = isAdd
      ? postSettlementPlatformConfigAddPlatformInvoice
      : postSettlementPlatformConfigUpdatePlatformInvoice

    const tempData = { ...value, isDefault: value.isDefault ? 1 : 0 }
    const postData = isAdd ? tempData : { ...tempData, id }
    setSubmitLoading(true)
    setUnsaved(false)
    serviceActions(postData).then((data) => {
      setSubmitLoading(false)
      if (data.code === 1000) {
        history.goBack()
      }
    })
  }

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const { data } = await getSettlementPlatformConfigGetPlatformInvoiceDetail({ id })
        setInitialValue(data)
      }
      fetchData()
    }
  }, [id])

  const handleCancel = () => {
    history.goBack()
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <NiceForm
          components={{ SchemaSwitch, SchemaRadio }}
          actions={formActions}
          initialValues={initialValue}
          expressionScope={{}}
          onSubmit={handleSubmit}
          schema={schema}
        >
          <FormButtonGroup offset={4}>
            <Submit loading={submitLoading}>提交</Submit>
            <Button onClick={handleCancel}>取消</Button>
          </FormButtonGroup>
        </NiceForm>
      </Card>
    </PageHeaderWrapper>
  )
}

export default Info
