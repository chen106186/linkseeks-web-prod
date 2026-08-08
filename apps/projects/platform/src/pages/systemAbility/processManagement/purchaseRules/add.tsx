import React, { useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Card } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined } from '@ant-design/icons'
import ReturnEle from '@/components/ReturnEle'
import styles from './index.less'
import { ruleDetailSchema } from './schema'
import { createFormActions } from '@apps/formily'
import { omit } from '@/utils'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import RuleSetting from './components/ruleSetting'
import { postOrderPurchaseProcessCreate, postOrderPurchaseProcessUpdate } from '@apps/apis'

const addSchemaAction = createFormActions()

const AddRule: React.FC<{}> = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const intl = useIntl()
  const { id, preview, pageStatus } = usePageStatus()

  // 整体表单提交
  const formSubmit = async (values) => {
    setIsDisabled(true)

    const params = omit(values, ['status']) // 移除不需要的字段

    let res: any = {}
    if (pageStatus === PageStatus.EDIT) {
      res = await postOrderPurchaseProcessUpdate(params)
    } else if (pageStatus === PageStatus.ADD) {
      res = await postOrderPurchaseProcessCreate(params)
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
          ? intl.formatMessage({ id: 'processRuleSetting.zhakancaigouliu', defaultMessage: '查看采购流程规则' })
          : pageStatus === PageStatus.EDIT
          ? intl.formatMessage({ id: 'processRuleSetting.bianjicaigouliu', defaultMessage: '编辑采购流程规则' })
          : intl.formatMessage({ id: 'processRuleSetting.xinzengcaigouliu', defaultMessage: '新增采购流程规则' })
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
