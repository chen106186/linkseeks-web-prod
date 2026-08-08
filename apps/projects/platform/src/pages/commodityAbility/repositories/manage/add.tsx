import React, { useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Card, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined } from '@ant-design/icons'
import ReturnEle from '@/components/ReturnEle'
import styles from './index.less'
import { repositDetailSchema } from '../schema'
import { createFormActions } from '@apps/formily'
import { omit } from '@/utils'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import PositionSetting from '../components/positionSetting'
import { postProductFreightSpaceAdd } from '@apps/apis'
import { returnClear } from '../effects'

// import styled from 'styled-components'
// const WrapperLayout = styled(props => <div {...props} />)`
//   .ant-row .ant-form-item-label > label {
//     font-size: 12px;
//   }
// `

const addSchemaAction = createFormActions()

const AddRepository: React.FC<{}> = (props) => {
  const intl = useIntl()
  const { id, preview, pageStatus } = usePageStatus()

  const [loading, setLoading] = useState<boolean>(false)

  // 整体表单提交
  const formSubmit = async (values) => {
    setLoading(true)
    const params = omit(values, ['NO_SUBMIT3'])
    if (params['applyMember']) {
      params['applyMember'] = params['applyMember']
    }
    if (!params['isAllMemberShare'] && !params['applyMember']?.length) {
      message.error(intl.formatMessage({ id: 'repositories.addRepository.error' }))
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
      let res = await postProductFreightSpaceAdd(params)
      if (res.code === 1000) {
        setTimeout(() => {
          history.goBack()
        }, 1000)
      }
    }
    setLoading(false)
  }

  return (
    <PageHeaderWrapper
      onBack={() => returnClear()}
      className={styles['addRepository']}
      title={
        pageStatus === PageStatus.PREVIEW
          ? intl.formatMessage({ id: 'repositories.addRepository.title.1' })
          : intl.formatMessage({ id: 'repositories.addRepository.title.2' })
      }
      extra={
        pageStatus !== PageStatus.PREVIEW ? (
          <Button
            key="1"
            loading={loading}
            onClick={() => addSchemaAction.submit()}
            type="primary"
            icon={<SaveOutlined />}
          >
            {intl.formatMessage({ id: 'repositories.addRepository.extra' })}
          </Button>
        ) : null
      }
    >
      <Card className="">
        {/* <WrapperLayout> */}
        <PositionSetting addSchemaAction={addSchemaAction} schema={repositDetailSchema} formSubmit={formSubmit} />
        {/* </WrapperLayout> */}
      </Card>
    </PageHeaderWrapper>
  )
}

export default AddRepository
