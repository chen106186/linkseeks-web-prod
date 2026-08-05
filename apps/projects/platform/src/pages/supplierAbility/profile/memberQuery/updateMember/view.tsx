/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-04 15:37:19
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 17:59:25
 * @Description: 修改会员注册信息
 */
import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Card, Spin, Empty, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { Radio, Checkbox, ArrayTable } from '@apps/formily'
import { usePageStatus } from '@/hooks/usePageStatus'
import ReturnEle from '@/components/ReturnEle'
import NiceForm from '@/components/NiceForm'
import { getMemberSupplierAbilityInfoDetail, postMemberSupplierAbilityInfoDetailUpdate } from '@apps/apis'
import { schema, GroupItem } from '../schema/createRole'
import AreaSelect from '../../../components/AreaSelect'

const formActions = createFormActions()
const { onFormInputChange$ } = FormEffectHooks

const MemberUpdate: React.FC<any> = (props) => {
  const { validateId } = usePageStatus()
  const [memberItems, setMemberItems] = useState<GroupItem[]>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)

  const intl = useIntl()

  usePrompt({ when: unsaved, message: intl.formatMessage({ id: 'common.tip.save.confirm' }) })

  const getDetailedInfo = async () => {
    if (validateId) {
      setInfoLoading(true)
      const infoRes = await getMemberSupplierAbilityInfoDetail({
        validateId,
      })

      setInfoLoading(false)
      if (infoRes.code !== 1000) {
        return
      }
      const { groups = [] } = infoRes.data
      setMemberItems(groups)
    }
  }

  useEffect(() => {
    getDetailedInfo()
  }, [])

  const handleSubmit = (values: any) => {
    if (!validateId) {
      return
    }
    setSubmitLoading(true)
    const msg = message.loading({
      content: intl.formatMessage({ id: 'member.memberQuery.updateMember.save.message' }),
      duration: 0,
    })
    postMemberSupplierAbilityInfoDetailUpdate({
      validateId,
      detail: values,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setUnsaved(false)
        setTimeout(() => {
          history.goBack()
        }, 800)
      })
      .finally(() => {
        msg()
        setSubmitLoading(false)
      })
  }

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        style={{
          padding: 24,
        }}
        title={intl.formatMessage({ id: 'supplier.supplierQuery.updatesupplier.title' })}
        extra={[
          memberItems.length ? (
            <Button
              key="1"
              type="primary"
              icon={<SaveOutlined />}
              loading={submitLoading}
              onClick={() => formActions.submit()}
            >
              {intl.formatMessage({ id: 'member.memberQuery.updateMember.save' })}
            </Button>
          ) : null,
        ]}
      >
        <Card>
          {memberItems.length ? (
            <NiceForm
              onSubmit={handleSubmit}
              actions={formActions}
              components={{
                RadioGroup: Radio.Group,
                CheckboxGroup: Checkbox.Group,
                AreaSelect,
                ArrayTable,
              }}
              effects={() => {
                onFormInputChange$().subscribe(() => {
                  if (!unsaved) {
                    setUnsaved(true)
                  }
                })
              }}
              schema={schema(memberItems, true)}
            />
          ) : (
            <Empty description={intl.formatMessage({ id: 'member.memberQuery.updateMember.nothing' })} />
          )}
        </Card>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default MemberUpdate
