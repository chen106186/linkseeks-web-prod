import React, { useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Card, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined } from '@ant-design/icons'
import ReturnEle from '@/components/ReturnEle'
import styles from './index.less'
import { ruleDetailSchema } from './schema'
import { createFormActions } from '@apps/formily'
import { omit } from '@/utils'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import RuleSetting from './components/ruleSetting'
import { postOrderTradeProcessCreate, postOrderTradeProcessUpdate } from '@apps/apis'

const addSchemaAction = createFormActions()

const AddRule: React.FC<{}> = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const intl = useIntl()
  const { pageStatus } = usePageStatus()

  // 整体表单提交
  const formSubmit = async (values) => {
    setIsDisabled(true)
    if (values?.products)
      values.products = values.products.map((item) => ({
        skuId: item.id,
        productId: item.commodityId,
        name: item.name,
        category: item.customerCategoryName,
        priceType: item.priceType,
        brand: item.brandName,
        // 标识渠道商品 1是 0否
        productType: item.productType,
      }))

    const params = omit(values, ['status']) // 移除不需要的字段

    if (params?.hasContract) {
      params.contractTempleId = params.contractTempleId
    } else {
      params.hasContract = false
    }

    if (params?.expireHours) {
      params.expireHours = Number(params.expireHours)
    }

    if (params?.payments && params.payments.length > 0) {
      params.payments = params.payments.map((item) => ({
        ...item,
        nodes: item.nodes.map((_item) => ({ ..._item, payRate: Number(_item.payRate) })),
      }))
      // 百分比校验
      const possess = params.payments.reduce((a, b) => a.concat(b['nodes']), [])
      if (possess.reduce((a, b) => a + b.payRate, 0) !== 100) {
        setIsDisabled(false)
        return message.error(
          intl.formatMessage({ id: 'processRuleSetting.zhifubilizhi', defaultMessage: '支付比例之和100' }),
        )
      }
    }

    addSchemaAction.getFieldState('shopIds', (state) => {
      let dataSource = state.props['x-component-props'].dataSource.filter((item) => params.shopIds[0] === item.id)
      params.shopType = dataSource[0].type
      params.shopId = dataSource[0].id
      params.shopEnvironment = dataSource[0].environment
    })

    const _params = omit(params, ['status', 'shopIds', 'contractId'])
    let res: any = {}
    if (pageStatus === PageStatus.EDIT) {
      res = await postOrderTradeProcessUpdate(_params)
    } else if (pageStatus === PageStatus.ADD) {
      res = await postOrderTradeProcessCreate(_params)
    }
    if (res.code === 1000) {
      history.goBack()
    }
    setIsDisabled(false)
  }

  return (
    <PageHeaderWrapper
      title={
        pageStatus === PageStatus.PREVIEW
          ? intl.formatMessage({ id: 'processRuleSetting.zhakanjiaoyigui', defaultMessage: '查看交易规则' })
          : pageStatus === PageStatus.EDIT
          ? intl.formatMessage({ id: 'processRuleSetting.bianjijiaoyigui', defaultMessage: '编辑交易规则' })
          : intl.formatMessage({ id: 'processRuleSetting.xinzengjiaoyigui', defaultMessage: '新增交易规则' })
      }
      className={styles['addRule']}
      extra={[
        <Button
          key="1"
          onClick={() => addSchemaAction.submit()}
          type="primary"
          icon={<SaveOutlined />}
          disabled={pageStatus === PageStatus.PREVIEW || isDisabled}
        >
          {intl.formatMessage({ id: 'processRuleSetting.baocun', defaultMessage: '保存' })}
        </Button>,
      ]}
    >
      <Card className="">
        <RuleSetting addSchemaAction={addSchemaAction} schema={ruleDetailSchema} formSubmit={formSubmit} />
      </Card>
    </PageHeaderWrapper>
  )
}

export default AddRule
