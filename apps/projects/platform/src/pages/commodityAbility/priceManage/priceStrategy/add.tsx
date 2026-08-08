import React, { useCallback, useState } from 'react'
import { Button, Card, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import ReturnEle from '@/components/ReturnEle'
import { SaveOutlined } from '@ant-design/icons'
import { createFormActions } from '@apps/formily'
import PriceSetting from './component/priceSetting'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { transformParamsForApi } from '../effect'
import { postProductCommodityUnitPriceStrategySaveOrUpdateUnitPriceStrategy } from '@apps/apis'
import styles from './index.less'

const addSchemaAction = createFormActions()

const SetStrategy: React.FC<{}> = () => {
  const intl = useIntl()
  const { id, preview, pageStatus } = usePageStatus()

  const [btnLoading, setBtnLoading] = useState<boolean>(false)

  // 整体表单提交
  const formSubmit = useCallback(async (values) => {
    setBtnLoading(true)

    // if(!values['commodityMemberList'] && !values['commodityMemberList']?.length) {
    //   message.error('请选择指定适用会员')
    //   setBtnLoading(false)
    // } else {
    const { params } = transformParamsForApi(values, addSchemaAction)

    // 校验价格填写
    if (params.memberUnitPriceList.some((item) => JSON.stringify(item['unitPrice']) === '{}')) {
      setBtnLoading(false)
      return message.error(intl.formatMessage({ id: 'priceManage.priceStrategy.setStrategy.error1' }))
    }

    let _params = {}
    if (id) {
      _params['id'] = Number(id)
    }
    console.log(params)
    let res = await postProductCommodityUnitPriceStrategySaveOrUpdateUnitPriceStrategy({ ...params, ..._params })
    if (res.code === 1000) {
      setTimeout(() => {
        history.goBack()
      }, 1000)
    }
    setBtnLoading(false)
    // }
  }, [])

  return (
    <PageHeaderWrapper
      className={styles['setStrategy']}
      title={
        pageStatus === PageStatus.PREVIEW
          ? intl.formatMessage({ id: 'priceManage.priceStrategy.setStrategy.title1' })
          : pageStatus === PageStatus.ADD
          ? intl.formatMessage({ id: 'priceManage.priceStrategy.setStrategy.title2' })
          : intl.formatMessage({ id: 'priceManage.priceStrategy.setStrategy.title3' })
      }
      extra={
        pageStatus !== PageStatus.PREVIEW ? (
          <Button
            key="1"
            loading={btnLoading}
            onClick={() => addSchemaAction.submit()}
            type="primary"
            icon={<SaveOutlined />}
          >
            {intl.formatMessage({ id: 'priceManage.priceStrategy.setStrategy.extra' })}
          </Button>
        ) : null
      }
    >
      <Card>
        <PriceSetting addSchemaAction={addSchemaAction} formSubmit={formSubmit} />
      </Card>
    </PageHeaderWrapper>
  )
}

export default SetStrategy
