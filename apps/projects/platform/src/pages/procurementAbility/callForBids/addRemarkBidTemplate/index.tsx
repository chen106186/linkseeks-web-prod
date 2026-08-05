import React, { useState, useEffect } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { Button, Card, message } from 'antd'
import { createFormActions } from '@apps/formily'
import { SaveOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import styles from './index.less'
import { formSchema } from './schema'
import { ArrayTable } from '@apps/formily'
import { getPurchaseTemplateGetTemplate, postPurchaseTemplateSaveOrUpdateTemplate } from '@apps/apis'
const intl = getIntl()
export interface AddRemarkBidTemplateProps {}

const addSchemaAction = createFormActions()

// 新增评标模板. 包含新增和编辑
const AddRemarkBidTemplate: React.FC<AddRemarkBidTemplateProps> = (props) => {
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [initFormValue, setInitFormValue] = useState<any>({})

  const { pageStatus, id } = usePageStatus()

  useEffect(() => {
    if (id) {
      getPurchaseTemplateGetTemplate({ id }).then((res) => {
        if (res.code === 1000) {
          setInitFormValue(res.data)
        }
      })
    }
  }, [id])

  const handleSubmit = async (value) => {
    setBtnLoading(true)
    if (!value?.templateContentList?.length) {
      setBtnLoading(false)
      return message.error(intl.formatMessage({ id: 'table.purchase.qingtianxiepingbiao' }))
    } else {
      value.templateContentList = value.templateContentList.filter((item) => Object.keys(item).length > 0)
    }
    postPurchaseTemplateSaveOrUpdateTemplate(value)
      .then((res) => {
        if (res.code === 1000) {
          history.goBack()
        }
      })
      .finally(() => setBtnLoading(false))
  }

  const addd = <span>{intl.formatMessage({ id: 'table.purchase.tianjiapingbiaonei' })}</span>

  return (
    <PageHeaderWrapper
      style={{ margin: 0 }}
      title={
        pageStatus === PageStatus.ADD
          ? intl.formatMessage({ id: 'table.purchase.xinjianpingbiaomu' })
          : pageStatus === PageStatus.EDIT
          ? intl.formatMessage({ id: 'table.purchase.bianjipingbiaomu' })
          : intl.formatMessage({ id: 'table.purchase.zhakanpingbiaomu' })
      }
      extra={[
        pageStatus !== PageStatus.PREVIEW && (
          <Button
            key="1"
            onClick={() => addSchemaAction.submit()}
            loading={btnLoading}
            type="primary"
            icon={<SaveOutlined />}
          >
            {intl.formatMessage({ id: 'table.purchase.baocun' })}
          </Button>
        ),
      ]}
    >
      <Card>
        <NiceForm
          loading={formLoading}
          previewPlaceholder=" "
          editable={pageStatus !== PageStatus.PREVIEW}
          value={initFormValue}
          actions={addSchemaAction}
          schema={formSchema}
          onSubmit={handleSubmit}
          components={{
            ArrayTable,
          }}
          effects={($, ctx) => {
            $('onFormMount').subscribe(() => {})
          }}
          expressionScope={{
            addd,
          }}
          className={styles.formContainer}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

AddRemarkBidTemplate.defaultProps = {}

export default AddRemarkBidTemplate
