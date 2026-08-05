/**
 * 系统能力 - 生命周期规则配置 - 客户生命周期规则配置
 * @author: Crayon
 */
import React, { useEffect, useState, useRef } from 'react'
import LifecycleSortList from '../components/LifecycleSortList'
import { PageHeaderWrapper } from '@apps/components'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { Button, Col, Row, Select, Form, Input, Spin, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { BaseInfo } from '@/components/BaseInfo'
import usePrompt from '@/hooks/usePrompt'
import { postMemberCustomerLifecycleRuleAdd, postMemberCustomerLifecycleRuleGet } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const LifecycleRuleConfig = () => {
  const intl = useIntl()
  const [form] = Form.useForm()
  const { handleLeave } = usePrompt()

  const [spinning, setSpinning] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const lifecycleRef = useRef<any>()

  const getLifecycleRuleConfig = async () => {
    setSpinning(true)
    const { code, data, message: msg } = await postMemberCustomerLifecycleRuleGet({}, { ctlType: 'none' })
    if (code === 1000 && data) {
      // 整理出前端自用的 lifecycleKey
      // 查询出来的数据直接使用 lifecycleStagesId 来生成 lifecycleKey
      // 前端新增时的生命周期通过当前时间戳来生成当前编辑的临时 lifecycleKey
      const lifecycle =
        data?.lifecycle?.map((item) => {
          return {
            ...item,
            lifecycleKey: item.lifecycleStagesId,
          }
        }) || []
      const afterApprovalLifecycleStagesNum = data.afterApprovalLifecycleStagesNum
      const lifecycleItem = lifecycle?.find((item) => item.lifecycleStagesNum === afterApprovalLifecycleStagesNum)
      const afterApprovalLifecycleStagesId = lifecycleItem?.lifecycleStagesId || undefined
      const lifecycleKey = lifecycleItem?.lifecycleKey
      form.setFieldsValue({
        lifecycle,
        lifecycleKey,
        afterApprovalLifecycleStagesNum,
        afterApprovalLifecycleStagesId,
      })
      lifecycleRef.current?.setPhaseRuleOptions(data.memberLifeCycleRuleConfigDOList || [])
      setSpinning(false)
    } else {
      message.error(msg)
    }
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const params = {
        ...values,
        lifecycle: values.lifecycle?.map(({ isEdit, lifecycleKey, relevance, ...rest }) => rest),
      }
      setLoading(true)
      postMemberCustomerLifecycleRuleAdd(params)
        .then(({ code }) => {
          if (code === 1000) {
            // 刷新配置数据
            lifecycleRef.current?.resetState()
            getLifecycleRuleConfig()
            handleLeave(false)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  useEffect(() => {
    getLifecycleRuleConfig()
  }, [])

  return (
    <>
      <PageHeaderWrapper
        backDom={false}
        title={intl.formatMessage({
          id: 'lifecycle.customerLifecycleRuleConfig',
          defaultMessage: '客户生命周期规则配置',
        })}
        extra={
          <AuthButton type="custom" code="save">
            {!spinning && (
              <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSubmit}>
                {intl.formatMessage({ id: 'common.button.save', defaultMessage: '保存' })}
              </Button>
            )}
          </AuthButton>
        }
      >
        <Spin spinning={spinning}>
          <Form
            form={form}
            onValuesChange={(changedValues: any, values: any) => {
              console.log('changedValues', changedValues)
              handleLeave()
              const changeKey = Object.keys(changedValues)[0]
              switch (changeKey) {
                case 'lifecycleKey':
                  // 操作初始阶段设置时
                  // 保持 afterApprovalLifecycleStagesId / afterApprovalLifecycleStagesNum 与 lifecycleKey 所在生命周期配置里的数据对应
                  const lifecycleItem = values?.lifecycle?.find(
                    (item) => item.lifecycleKey === changedValues.lifecycleKey,
                  )
                  const afterApprovalLifecycleStagesId = lifecycleItem?.lifecycleStagesId || undefined
                  const afterApprovalLifecycleStagesNum = lifecycleItem?.lifecycleStagesNum || undefined
                  form.setFieldsValue({
                    afterApprovalLifecycleStagesId,
                    afterApprovalLifecycleStagesNum,
                  })
                  break
                case 'lifecycle':
                  // 当已选择的 初始阶段 的 lifecycleKey 不在生命周期配置列表里（即可能被删除）
                  // 则清除 初始阶段配置 的相关信息
                  if (!changedValues.lifecycle?.some((item) => item.lifecycleKey === values.lifecycleKey)) {
                    form.setFieldsValue({
                      lifecycleKey: undefined,
                      afterApprovalLifecycleStagesNum: undefined,
                      afterApprovalLifecycleStagesId: undefined,
                    })
                  } else {
                    // 保持 afterApprovalLifecycleStagesNum 与 lifecycleKey 所在生命周期配置里的 lifecycleStagesNum 所对应
                    form.setFieldsValue({
                      afterApprovalLifecycleStagesNum: changedValues.lifecycle?.find(
                        (item) => item.lifecycleKey === values.lifecycleKey,
                      )?.lifecycleStagesNum,
                    })
                  }
                  break
              }
            }}
          >
            <Form.Item name={'lifecycle'} initialValue={[]} style={{ marginBottom: 0 }}>
              <LifecycleSortList ref={lifecycleRef} lifecycleType="CUSTOMER" />
            </Form.Item>
            <BaseInfo
              className="mt-16"
              cols={2}
              title={intl.formatMessage({
                id: 'lifecycle.initialStageSetting',
                defaultMessage: '初始阶段设置',
              })}
            >
              <Row gutter={[0, 16]}>
                <Col span={24} style={{ color: '#91959B' }}>
                  {intl.formatMessage({
                    id: 'lifecycle.customerInitialStageSettingTips',
                    defaultMessage: '客户入库申请审核通过后，客户的生命周期阶段',
                  })}
                </Col>
                <Col span={24}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.lifecycle !== currentValues.lifecycle}
                  >
                    {({ getFieldValue }) => (
                      <Form.Item
                        name={'lifecycleKey'}
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'lifecycle.pleaseSelectInitialStageSetting',
                              defaultMessage: '请选择初始阶段设置',
                            }),
                          },
                        ]}
                      >
                        <Select
                          style={{ width: 256 }}
                          options={getFieldValue('lifecycle')?.flatMap((item) =>
                            item.lifecycleStagesNum === -1
                              ? []
                              : [{ label: item.lifecycleStagesName, value: item.lifecycleKey }],
                          )}
                          placeholder={intl.formatMessage({
                            id: 'lifecycle.pleaseSelectInitialStageSetting',
                            defaultMessage: '请选择初始阶段设置',
                          })}
                        />
                      </Form.Item>
                    )}
                  </Form.Item>
                  <Form.Item hidden name={'afterApprovalLifecycleStagesId'}>
                    <Input />
                  </Form.Item>
                  <Form.Item hidden name={'afterApprovalLifecycleStagesNum'}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </BaseInfo>
          </Form>
        </Spin>
      </PageHeaderWrapper>
    </>
  )
}

export default LifecycleRuleConfig
