import React, { useState, useRef, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { formatTimeString } from '@/utils'
import { Button, Card, Row, Tabs, Tag, Col } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import ReturnEle from '@/components/ReturnEle'
import styles from '../index.less'
import NiceForm from '@/components/NiceForm'
import { repositInSchema, repositOutSchema, repositTabOneSchema } from '../../schema'
import { createFormActions, FormEffectHooks, FormProvider, FormSpy, createAsyncFormActions } from '@apps/formily'
import { getStepNumber } from '@/utils'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { returnClear, useUnitPreview } from '../../effects'
import PositionSetting from '../../components/positionSetting'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import {
  getProductFreightSpaceAllotFoldLog,
  getProductFreightSpaceDetails,
  getProductFreightSpaceListByProductid,
  postProductFreightSpaceAllotExport,
  postProductFreightSpaceAllotFold,
  postProductFreightSpaceUpdate,
} from '@apps/apis'

const addSchemaAction = createFormActions()
const repositInAction = createAsyncFormActions()
const repositOutAction = createAsyncFormActions()

const AddRepository: React.FC<{}> = (props) => {
  const intl = useIntl()
  const { id, isSync } = usePageStatus()
  // 强制渲染
  const [forceRender, setForceRender] = useState(0)

  // 获取到的所有仓库, 用于选中后获得仓库库存
  // const [reposits, setReposits] = useState<any>([])
  const reposits = useRef<any>([])
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { data: foldValue, loading: foldLoading, run: foldFn } = useHttpRequest(postProductFreightSpaceAllotFold)
  const {
    data: exportValue,
    loading: exportLoading,
    run: exportFn,
  } = useHttpRequest(postProductFreightSpaceAllotExport)

  usePrompt({ when: isEdit as boolean, message: intl.formatMessage({ id: 'repositories.adjustRepository.message' }) })

  const fetchRepositRecord = async (params) => {
    const { data } = await getProductFreightSpaceAllotFoldLog({
      id,
      ...params,
    })
    return data
  }

  const { initialValue } = useInitialValue(getProductFreightSpaceDetails, { id: id })
  const tableRecordRef = useRef<any>({})

  useUnitPreview(initialValue, addSchemaAction)

  useEffect(() => {
    if (initialValue) {
      getProductFreightSpaceListByProductid({
        productId: initialValue.productId,
      }).then(({ data, code }) => {
        if (code === 1000) {
          // setReposits(data)
          reposits.current = data
        }
      })
    }
  }, [initialValue, forceRender])

  const tableRecordColumns: any[] = [
    { dataIndex: 'id', title: 'ID', align: 'center' },
    {
      dataIndex: 'repositInAndOut',
      title: intl.formatMessage({ id: 'repositories.adjustRepository.tableRecordColumns.repositInAndOut' }),
      render: (_, record) => {
        return (
          <div>
            <div style={{ marginBottom: 18 }}>
              <Tag color="gold">
                {intl.formatMessage({ id: 'repositories.adjustRepository.tableRecordColumns.repositInAndOut.tag.1' })}
              </Tag>
              {record.exportFreightSpace}
            </div>
            <div>
              <Tag color="blue">
                {intl.formatMessage({ id: 'repositories.adjustRepository.tableRecordColumns.repositInAndOut.tag.2' })}
              </Tag>
              {record.foldFreightSpace}
            </div>
          </div>
        )
      },
    },
    {
      dataIndex: 'exportProdouct',
      title: intl.formatMessage({ id: 'repositories.adjustRepository.tableRecordColumns.exportProdouct' }),
      align: 'center',
    },
    {
      dataIndex: 'unit',
      title: intl.formatMessage({ id: 'repositories.adjustRepository.tableRecordColumns.unit' }),
      align: 'center',
    },
    {
      dataIndex: 'repositIn',
      title: intl.formatMessage({ id: 'repositories.adjustRepository.tableRecordColumns.repositIn' }),
      align: 'center',
      render: (_, record) => {
        return (
          <div>
            <p>
              <span>{intl.formatMessage({ id: 'repositories.adjustRepository.tableRecordColumns.repositIn.1' })}</span>
              <span>{record.exportInventory}</span>
            </p>
            <p>
              <span>{intl.formatMessage({ id: 'repositories.adjustRepository.tableRecordColumns.repositIn.2' })}</span>
              <span>{record.frontExportInventory}</span>
            </p>
          </div>
        )
      },
    },
    {
      dataIndex: 'repositOut',
      title: intl.formatMessage({ id: 'repositories.adjustRepository.tableRecordColumns.repositOut' }),
      align: 'center',
      render: (_, record) => {
        return (
          <div>
            <p>
              <span>{intl.formatMessage({ id: 'repositories.adjustRepository.tableRecordColumns.repositOut.1' })}</span>
              <span>{record.foldInventory}</span>
            </p>
            <p>
              <span>{intl.formatMessage({ id: 'repositories.adjustRepository.tableRecordColumns.repositOut.2' })}</span>
              <span>{record.foldRearInventory}</span>
            </p>
          </div>
        )
      },
    },
    {
      dataIndex: 'allotTime',
      title: intl.formatMessage({ id: 'repositories.adjustRepository.tableRecordColumns.allotTime' }),
      align: 'center',
      render: (text) => formatTimeString(text),
    },
  ]

  // 库存调入表单提交
  const handleRespotIn = async (values) => {
    const params = {}
    Object.entries(values).forEach(([key, value]) => {
      if (!key.includes('NO_SUBMIT')) {
        params[key] = value
      }
    })
    const { data, code } = await foldFn(params)
    if (code === 1000) {
      const { callInInventory, bringUpTheInventory } = data

      repositInAction.setFieldValue('NO_SUBMIT2', bringUpTheInventory)
      repositInAction.setFieldValue('NO_SUBMIT1', callInInventory)

      repositOutAction.setFieldValue('NO_SUBMIT1', bringUpTheInventory)

      repositInAction.setFieldValue('foldInventory', 0, false)
      repositInAction.setFieldState('foldInventory', (state) => {
        state.props['x-component-props'].max = callInInventory
        state.props['x-component-props'].marks = getStepNumber(callInInventory)
      })
      repositOutAction.setFieldValue('foldFreightSpaceId', '')
      repositOutAction.setFieldValue('NO_SUBMIT2', 0)
      setForceRender(forceRender + 1)
      tableRecordRef.current.reloadCurrent && tableRecordRef.current.reloadCurrent()
    }
  }

  // 库存调出表单提交
  const handleRespotOut = async (values) => {
    const params = {}
    Object.entries(values).forEach(([key, value]) => {
      if (!key.includes('NO_SUBMIT')) {
        params[key] = value
      }
    })
    const { data, code } = await exportFn(params)
    if (code === 1000) {
      const { callInInventory, bringUpTheInventory } = data

      repositOutAction.setFieldValue('NO_SUBMIT1', bringUpTheInventory)
      repositOutAction.setFieldValue('NO_SUBMIT2', callInInventory)

      repositInAction.setFieldValue('freightSpaceId', '')
      repositInAction.setFieldValue('NO_SUBMIT1', 0)
      repositInAction.setFieldValue('NO_SUBMIT2', bringUpTheInventory)

      repositOutAction.setFieldValue('foldInventory', 0, false)
      repositOutAction.setFieldState('foldInventory', (state) => {
        state.props['x-component-props'].max = callInInventory
        state.props['x-component-props'].marks = getStepNumber(callInInventory)
      })

      setForceRender(forceRender + 1)
      tableRecordRef.current.reloadCurrent && tableRecordRef.current.reloadCurrent()
    }
  }

  const transforInBtn = (
    <Row justify="center">
      <Button type="primary" htmlType="submit" loading={foldLoading}>
        {intl.formatMessage({ id: 'repositories.adjustRepository.transforInBtn.button.1' })}
      </Button>
    </Row>
  )
  const transforOutBtn = (
    <Row justify="center">
      <Button type="primary" htmlType="submit" loading={exportLoading}>
        {intl.formatMessage({ id: 'repositories.adjustRepository.transforInBtn.button.2' })}
      </Button>
    </Row>
  )

  const topTableChange = (tabs) => {
    if (tabs === 'tab2') {
      repositInAction.getFieldValue('NO_SUBMIT1').then((data) => {
        console.log(data)
      }) // 调入的数值
    }
  }

  const formSubmit = async (values) => {
    const params = {
      id: values.id,
      name: values.name,
      inventory: values.inventory,
      inventoryDeductWay: values.inventoryDeductWay,
      shopIds: Array.isArray(values.shopIds) ? values.shopIds.filter((item) => item) : [],
      isAllMemberShare: values.isAllMemberShare,
      shopType: values.shopType,
    }
    if (values['applyMember']) {
      params['applyMember'] = values['applyMember']
    }
    setIsEdit(false)
    addSchemaAction.getFieldState('shopIds', (state: any) => {
      params['shopIds'] = state.value.map(
        (item) => state.props['x-component-props'].dataSource.filter((_) => _.id === item)[0],
      )
    })
    setLoading(true)
    postProductFreightSpaceUpdate(params)
      .then((res) => {
        if (res.code === 1000) {
          setTimeout(() => {
            history.goBack()
          }, 1000)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onPublicFieldChange = () => {
    setIsEdit(true)
  }
  return (
    <PageHeaderWrapper
      onBack={() => returnClear()}
      backDom
      className={styles['addRepository']}
      title={intl.formatMessage({ id: 'repositories.adjustRepository.title' })}
    >
      <Card className="">
        <FormProvider>
          <Tabs type="card" defaultActiveKey="tab1" onChange={topTableChange}>
            <Tabs.TabPane key="tab1" tab={intl.formatMessage({ id: 'repositories.adjustRepository.tab.1' })}>
              <PositionSetting
                onFieldChange={onPublicFieldChange}
                addSchemaAction={addSchemaAction}
                schema={repositTabOneSchema}
                formSubmit={formSubmit}
              />
              <Row>
                <Col offset={6} style={{ marginTop: 40 }}>
                  <Button
                    key="1"
                    loading={loading}
                    onClick={() => addSchemaAction.submit()}
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    {intl.formatMessage({ id: 'repositories.adjustRepository.tab.1.button' })}
                  </Button>
                </Col>
              </Row>
            </Tabs.TabPane>
            {isSync === 'false' && (
              <Tabs.TabPane key="tab2" tab={intl.formatMessage({ id: 'repositories.adjustRepository.tab.2' })}>
                <Tabs defaultActiveKey="tab2-1" tabPosition="left">
                  <Tabs.TabPane
                    tab={intl.formatMessage({ id: 'repositories.adjustRepository.tab.2.tab.1' })}
                    key="tab2-1"
                  >
                    {/* 使用formProvider 共享两个表单中的值 */}
                    <FormSpy>
                      {({ form: spyForm }) => {
                        return (
                          <NiceForm
                            schema={repositInSchema}
                            actions={repositInAction}
                            onSubmit={handleRespotIn}
                            effects={async ($, { setFieldState }) => {
                              const utils = useLinkageUtils()
                              // FormEffectHooks.onFormInputChange$().subscribe(() => {
                              //   setIsEdit(true)
                              // })
                              FormEffectHooks.onFormMount$().subscribe(() => {
                                const name = spyForm.getFieldValue('name')
                                const asyncEnums = reposits.current.map((v) => ({
                                  label: v.name,
                                  value: v.id,
                                }))
                                utils.enum('freightSpaceId', asyncEnums)
                                $('onFieldInputChange', 'freightSpaceId').subscribe((state) => {
                                  const repositValue = reposits.current.find((v) => v.id === state.value)
                                  const numberValue = repositValue.inventory || 0
                                  utils.value('NO_SUBMIT1', numberValue)
                                  setFieldState('NO_SUBMIT1', (state) => {
                                    state.props.title = `${intl.formatMessage({
                                      id: 'repositories.adjustRepository.current',
                                    })}（${repositValue.unit}）`
                                  })
                                  setFieldState('foldInventory', (state) => {
                                    state.props['x-component-props'].max = numberValue
                                    state.props['x-component-props'].marks = getStepNumber(numberValue)
                                  })
                                  setForceRender(forceRender + 1)
                                })
                                // 调入仓位信息
                                utils.enum('foldFreightSpaceId', [{ label: name, value: id }])
                                utils.value('foldFreightSpaceId', id)
                                setFieldState('NO_SUBMIT2', (state) => {
                                  state.props.title = `${intl.formatMessage({
                                    id: 'repositories.adjustRepository.current',
                                  })}（${initialValue.unit}）`
                                })

                                utils.value('NO_SUBMIT2', spyForm.getFieldValue('inventory'))
                              })
                            }}
                            expressionScope={{
                              transforInBtn,
                            }}
                          ></NiceForm>
                        )
                      }}
                    </FormSpy>
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    tab={intl.formatMessage({ id: 'repositories.adjustRepository.tab.2.tab.2' })}
                    key="tab2-2"
                  >
                    <FormSpy>
                      {({ form: spyForm }) => {
                        return (
                          <NiceForm
                            schema={repositOutSchema}
                            actions={repositOutAction}
                            onSubmit={handleRespotOut}
                            effects={async ($, { setFieldState }) => {
                              const utils = useLinkageUtils()
                              // FormEffectHooks.onFormInputChange$().subscribe(() => {
                              //   setIsEdit(true)
                              // })
                              FormEffectHooks.onFormMount$().subscribe(() => {
                                const name = spyForm.getFieldValue('name')
                                const inventoryNumber = spyForm.getFieldValue('inventory')
                                const asyncEnums = reposits.current.map((v) => ({
                                  label: v.name,
                                  value: v.id,
                                }))
                                utils.enum('foldFreightSpaceId', asyncEnums)
                                $('onFieldInputChange', 'foldFreightSpaceId').subscribe((state) => {
                                  const repositValue = reposits.current.find((v) => v.id === state.value)
                                  const numberValue = repositValue.inventory || 0
                                  utils.value('NO_SUBMIT2', numberValue)
                                  setFieldState('NO_SUBMIT2', (state) => {
                                    state.props.title = `${intl.formatMessage({
                                      id: 'repositories.adjustRepository.current',
                                    })}（${repositValue.unit}）`
                                  })
                                  setForceRender(forceRender + 1)
                                })
                                setFieldState('foldInventory', (state) => {
                                  state.props['x-component-props'].max = initialValue.inventory
                                  state.props['x-component-props'].marks = getStepNumber(initialValue.inventory)
                                })

                                // 调入仓位信息
                                utils.enum('freightSpaceId', [{ label: name, value: id }])
                                utils.value('freightSpaceId', id)
                                setFieldState('NO_SUBMIT1', (state) => {
                                  state.props.title = `${intl.formatMessage({
                                    id: 'repositories.adjustRepository.current',
                                  })}（${initialValue.unit}）`
                                })
                                utils.value('NO_SUBMIT1', inventoryNumber)
                              })
                            }}
                            expressionScope={{
                              transforOutBtn,
                            }}
                          ></NiceForm>
                        )
                      }}
                    </FormSpy>
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    tab={intl.formatMessage({ id: 'repositories.adjustRepository.tab.2.tab.3' })}
                    key="tab2-3"
                  >
                    <StandardTable
                      fetchTableData={(params) => fetchRepositRecord(params)}
                      currentRef={tableRecordRef}
                      columns={tableRecordColumns}
                    />
                  </Tabs.TabPane>
                </Tabs>
              </Tabs.TabPane>
            )}
          </Tabs>
        </FormProvider>
      </Card>
    </PageHeaderWrapper>
  )
}

export default AddRepository
