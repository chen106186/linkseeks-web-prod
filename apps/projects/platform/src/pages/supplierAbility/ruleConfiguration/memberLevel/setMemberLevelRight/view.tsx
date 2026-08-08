/**
 * @Description 会员角色规则配置 - 编辑
 */
import React, { useState, useEffect } from 'react'
import { Spin, message, Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMemberSupplierAbilityRightDetail,
  getMemberSupplierAbilityRightFind,
  postMemberSupplierAbilityRightParameterUpdate,
  postMemberSupplierAbilityRightStatus,
  postMemberSupplierAbilityRightUpdate,
} from '@apps/apis'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { anchorsArr } from './config'
import BasicInfoVirtualFieldItem from './comonents/BasicInfoVirtualFieldItem'
import MemberRightSetttingFormField, {
  MemberRightSetttingValue,
  MemberRightFormFieldProps,
} from './comonents/MemberRightFormFieldPro'
import schema from './schema'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

const formActions = createFormActions()
const { onFormInit$, onFormInputChange$ } = FormEffectHooks

type SubmitValueType = {
  /**
   * 会员等级
   */
  level: number
  /**
   * 会员等级标签
   */
  levelTag: string
  /**
   * 会员等级标签
   */
  levelTypeName: string
  /**
   * 升级分值标签
   */
  scoreTag: string
  /**
   * 会员等级说明
   */
  remark: string
  /**
   * 会员角色名称
   */
  roleName: string
  /**
   * 角色类型
   */
  roleTypeName: string
  /**
   * 会员类型
   */
  memberTypeName: string
  /**
   * 升级阀值
   */
  point: string
  /**
   * 会员权益
   */
  memberRights: MemberRightSetttingValue
}

const SetMemberLevelRight: React.FC<{}> = (props) => {
  const [rightDetails, setRightDetails] = useState<SubmitValueType | undefined>(undefined)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  const intl = useIntl()
  const translate = useWebIntl()

  const { id } = usePageStatus()

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  const fetchMemberLevelRightDetails = () => {
    setDetailsLoading(true)
    getMemberSupplierAbilityRightDetail({
      levelId: id,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { rights, point, ...rest } = res.data
          setRightDetails({
            ...rest,
            point: `${point}`,
            memberRights: rights,
          })
        }
      })
      .finally(() => {
        setDetailsLoading(false)
      })
  }

  useEffect(() => {
    fetchMemberLevelRightDetails()
  }, [])

  const fetchMemberRightsList = (): MemberRightFormFieldProps['fetchDataSource'] => async (params) => {
    const res = await getMemberSupplierAbilityRightFind()
    if (res.code === 1000) {
      return {
        totalCount: res.data.length,
        data: res.data,
      }
    }
    return { totalCount: 0, data: [] }
  }

  const handleSubmit = (values: SubmitValueType) => {
    const msg = message.loading({
      content: '正在修改，请稍候...',
      duration: 0,
    })
    const { point, memberRights, ...rest } = values
    setSubmitLoading(true)
    postMemberSupplierAbilityRightUpdate({
      levelId: +id,
      point: +point,
      rights: memberRights.map((item) => ({
        rightType: item.rightType,
        parameter: +item.parameter!,
      })),
    })
      .then((res) => {
        if (res.code === 1000) {
          setUnsaved(false)
          setTimeout(() => {
            history.goBack()
          }, 800)
        } else {
        }
      })
      .finally(() => {
        msg()
        setSubmitLoading(false)
      })
  }

  const handleRightStatusChange = (index: number): Promise<void> =>
    new Promise((resolve, reject) => {
      const rightsValue: MemberRightSetttingValue = formActions.getFieldValue('memberRights')
      const record = rightsValue[index]
      postMemberSupplierAbilityRightStatus({
        rightId: record.rightId,
        status: record.status === 1 ? 0 : 1,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve()
            fetchMemberLevelRightDetails()
          } else {
            reject()
          }
        })
        .catch((err) => {
          reject(err)
        })
    })

  const handleRightChangeParameter = (index: number): Promise<void> =>
    new Promise((resolve, reject) => {
      const rightsValue: MemberRightSetttingValue = formActions.getFieldValue('memberRights')
      const record = rightsValue[index]
      postMemberSupplierAbilityRightParameterUpdate({
        rightId: record.rightId,
        parameter: +record.parameter,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve()
          } else {
            reject()
          }
        })
        .catch((err) => {
          reject(err)
        })
    })

  return (
    <Spin spinning={detailsLoading}>
      <div className={styles['role-rule-config-form']}>
        <PageHeaderWrapper
          backDom
          title={translate('web.resource.member.pingtaihuiyuanquanyishezhi')}
          items={anchorsArr}
          extra={[
            <Button
              key="1"
              type="primary"
              icon={<SaveOutlined />}
              loading={submitLoading}
              onClick={() => formActions.submit()}
            >
              {translate('web.common.save')}
            </Button>,
          ]}
        >
          <NiceForm
            previewPlaceholder=" "
            onSubmit={handleSubmit}
            actions={formActions}
            value={rightDetails}
            components={{
              BasicInfoVirtualFieldItem,
              MemberRightSettting: MemberRightSetttingFormField,
            }}
            expressionScope={{
              handleRightStatusChange,
              handleRightChangeParameter,
            }}
            effects={($, actions) => {
              const { setFieldState } = actions

              onFormInit$().subscribe(() => {
                // 初始会员权益列表请求接口方法
                setFieldState('memberRights', (state) => {
                  state.props['x-component-props'] = state.props['x-component-props'] || {}
                  state.props['x-component-props'].fetchDataSource = fetchMemberRightsList()
                })
              })

              onFormInputChange$().subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })
            }}
            schema={schema}
          />
        </PageHeaderWrapper>
      </div>
    </Spin>
  )
}

export default SetMemberLevelRight
