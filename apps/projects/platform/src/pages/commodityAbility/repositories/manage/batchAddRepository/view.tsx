import React, { useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Card, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined } from '@ant-design/icons'
import ReturnEle from '@/components/ReturnEle'
import styles from '../index.less'
import { batchRepositDetailSchema } from '../../schema'
import { createFormActions } from '@apps/formily'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import BatchPositionSetting from '../../components/batchPositionSetting'
import { postProductFreightSpaceAddBatch } from '@apps/apis'
import { returnClear } from '../../effects'

const addSchemaAction = createFormActions()

const BatchAddRepository: React.FC<{}> = () => {
  const intl = useIntl()
  const { pageStatus } = usePageStatus()

  const [loading, setLoading] = useState<boolean>(false)

  // 整体表单提交
  const formSubmit = async (values) => {
    setLoading(true)
    const params = { ...values }
    if (params['applyMember']) {
      params['applyMember'] = params['applyMember']
    }
    if (params['commodityList']) {
      params['commodityList'] = params['commodityList'].map((item) => ({
        productId: item.id,
        productSkuName: item.commodityAttribute,
        productName: item.name,
        category: item.customerCategoryName,
        brand: item.brandName,
        unit: item.unitName,
        materielId: item?.materielId || null,
        itemNo: item?.materielCode || null,
        materielName: item?.materielName || null,
      }))
    }
    if (!params['isAllMemberShare'] && !params['applyMember']?.length) {
      setLoading(false)
      return message.error(intl.formatMessage({ id: 'repositories.batchAddRepository.error' }))
    } else {
      addSchemaAction.getFieldState('warehouseId', (prevState) => {
        if (prevState.value) {
          params['warehouseName'] = prevState.props.enum.filter((item: any) => item.value === prevState.value)[0][
            'label'
          ]
        }
      })
      addSchemaAction.getFieldState('shopIds', (state) => {
        params['shopIds'] = state.value.map(
          (item) => state.props['x-component-props'].dataSource.filter((_) => _.id === item)[0],
        )
      })
      params['inventoryDeductWay'] = 1
      let res = await postProductFreightSpaceAddBatch(params)
      if (res.code === 1000) {
        setTimeout(() => {
          history.goBack()
        }, 1000)
      } else {
        setLoading(true)
      }
    }
    setLoading(false)
  }

  return (
    <PageHeaderWrapper
      backDom
      onBack={() => returnClear()}
      className={styles['addRepository']}
      title={
        pageStatus === PageStatus.PREVIEW
          ? intl.formatMessage({ id: 'repositories.batchAddRepository.title.1' })
          : intl.formatMessage({ id: 'repositories.batchAddRepository.title.2' })
      }
      extra={
        pageStatus !== PageStatus.PREVIEW ? (
          <Button
            key="1"
            onClick={() => addSchemaAction.submit()}
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
          >
            {intl.formatMessage({ id: 'repositories.batchAddRepository.extra' })}
          </Button>
        ) : null
      }
    >
      <Card className="">
        {/* <WrapperLayout> */}
        <BatchPositionSetting
          addSchemaAction={addSchemaAction}
          schema={batchRepositDetailSchema}
          formSubmit={formSubmit}
        />
        {/* </WrapperLayout> */}
      </Card>
    </PageHeaderWrapper>
  )
}

export default BatchAddRepository
